"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getFareForMode, getLocalRentalPlans, findRoute } from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import type { VehicleInfo } from "@/types";

interface CabSearchProps {
  vehicles: VehicleInfo[];
  initialFrom?: string;
  initialTo?: string;
  initialMode?: TripMode;
  initialCategory?: string;
  initialSearched?: boolean;
}

export type TripMode = "one" | "round" | "airport" | "local" | "ev";

function CabSearchForm({
  vehicles,
  initialFrom = "Pune",
  initialTo = "Mumbai",
  initialMode = "one",
  initialCategory,
  initialSearched = false,
}: CabSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read mode from searchParams if present (e.g. /cabs/pune-to-mumbai?mode=round)
  const urlModeParam = searchParams.get("mode");
  const effectiveInitialMode: TripMode =
    urlModeParam === "round" || urlModeParam === "round_trip"
      ? "round"
      : urlModeParam === "local" || urlModeParam === "local_rentals"
      ? "local"
      : urlModeParam === "ev"
      ? "ev"
      : initialMode === "airport"
      ? "one"
      : initialMode;

  const [mode, setMode] = useState<TripMode>(effectiveInitialMode);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || (effectiveInitialMode === "ev" ? "EV" : "all")
  );
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [travelTime, setTravelTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [returnTime, setReturnTime] = useState("18:00");
  const [hasSearched, setHasSearched] = useState(initialSearched);

  const handleModeSelect = (newMode: TripMode) => {
    setMode(newMode);
    if (newMode === "ev") {
      setSelectedCategory("EV");
    } else {
      setSelectedCategory("all");
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cab-trip-mode-change", { detail: { mode: newMode } })
      );
    }
  };

  // Sync mode if query params change
  useEffect(() => {
    const qMode = searchParams.get("mode");
    if (qMode === "round" || qMode === "round_trip") {
      setMode("round");
    } else if (qMode === "local" || qMode === "local_rentals") {
      setMode("local");
    } else if (qMode === "ev") {
      setMode("ev");
      setSelectedCategory("EV");
    } else if (qMode === "one" || qMode === "one_way") {
      setMode("one");
    }
  }, [searchParams]);

  // Broadcast search state for dynamic FAQ and Inclusions/Exclusions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const validFares: number[] = [];
    const availableVehicleNames: string[] = [];

    if (mode === "local") {
      for (const v of vehicles) {
        const plans = getLocalRentalPlans(v.category);
        if (plans && plans.length > 0) {
          availableVehicleNames.push(v.model || v.category);
          for (const p of plans) {
            if (p.fare > 0) validFares.push(p.fare);
          }
        }
      }
    } else {
      for (const v of vehicles) {
        if (selectedCategory !== "all" && v.category !== selectedCategory) continue;
        const price = getFareForMode(fromLocation, toLocation, v.category, mode, v.model, v.rateKey);
        if (price !== null && price > 0) {
          validFares.push(price);
          availableVehicleNames.push(v.model || v.category);
        }
      }
    }

    const lowestFare = validFares.length > 0 ? Math.min(...validFares) : null;

    window.dispatchEvent(
      new CustomEvent("cab-search-update", {
        detail: {
          mode,
          from: fromLocation.trim(),
          to: mode === "local" ? "Local" : toLocation.trim(),
          lowestFare,
          vehicleNames: availableVehicleNames,
        },
      })
    );

    window.dispatchEvent(
      new CustomEvent("cab-trip-mode-change", { detail: { mode } })
    );
  }, [mode, fromLocation, toLocation, selectedCategory, vehicles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== "local" && (!fromLocation.trim() || !toLocation.trim())) {
      alert("Please enter both From and To locations.");
      return;
    }
    if (mode === "local" && !fromLocation.trim()) {
      alert("Please enter a pickup city.");
      return;
    }
    setHasSearched(true);
    setTimeout(() => {
      const resultsEl = document.getElementById("resSec");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleSelectCab = (vehicle: VehicleInfo, price: number, planLabel?: string) => {
    const tripType =
      mode === "round"
        ? "Round Trip"
        : mode === "local"
        ? (planLabel ? `Local Rental (${planLabel})` : "Local Rentals")
        : mode === "ev" || selectedCategory === "EV" || vehicle.category === "EV"
        ? "EV Cabs"
        : "One Way";

    const params = new URLSearchParams({
      vehicle: vehicle.category,
      model: vehicle.model,
      seats: String(vehicle.seats),
      bags: String(vehicle.bags),
      from: fromLocation.trim(),
      to: mode === "local" ? "Local" : toLocation.trim(),
      date: travelDate,
      time: travelTime,
      price: String(price),
      tripType: tripType,
      mode: mode,
    });
    if (mode === "round") {
      params.append("returnDate", returnDate);
      params.append("returnTime", returnTime);
    }
    if (planLabel) {
      params.append("plan", planLabel);
    }
    router.push(`/cabs/details?${params.toString()}`);
  };

  const modeLabel =
    mode === "round"
      ? "Round Trip"
      : mode === "ev" || selectedCategory === "EV"
      ? "EV Cabs"
      : mode === "local"
      ? "Local Rentals"
      : "One Way";

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Determine if there are any valid fares for standard modes to decide if we show "No fixed fare found"
  let hasValidFare = false;
  if (mode !== "local") {
    for (const v of vehicles) {
      if (selectedCategory !== "all" && v.category !== selectedCategory) continue;
      if (getFareForMode(fromLocation, toLocation, v.category, mode, v.model, v.rateKey) !== null) {
        hasValidFare = true;
        break;
      }
    }
  }

  return (
    <>
      <div className="search max-w-5xl mx-auto rounded-2xl shadow-xl border border-[#dce5da] bg-white p-5 sm:p-6 transition-all" id="booking">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 mb-5 border-b border-[#eef2eb]">
          <button
            type="button"
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === "one" && selectedCategory !== "EV"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => handleModeSelect("one")}
          >
            <span>→</span> One Way
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === "round"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => handleModeSelect("round")}
          >
            <span>⇄</span> Round Trip
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === "ev" || selectedCategory === "EV"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => handleModeSelect("ev")}
          >
            <span>⚡</span> EV Cabs
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === "local"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => handleModeSelect("local")}
          >
            <span>⏱</span> Local Rentals
          </button>
        </div>

        {/* Compact, Modern Form */}
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          {mode === "round" ? (
            /* Round Trip: 2-Row Spacious Layout */
            <div className="space-y-3">
              {/* Row 1: From/To Location & Category */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* From & To with Swap Button */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center bg-[#fafbf7] p-2.5 rounded-xl border border-[#e2e8df]">
                  <div className="w-full">
                    <label htmlFor="from" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                      FROM
                    </label>
                    <input
                      id="from"
                      list="routeCities"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      placeholder="Pickup City"
                      className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="hidden sm:flex self-end mb-1 w-8 h-8 rounded-full bg-white border border-[#dce5da] hover:bg-[#edf5e7] hover:border-[#3d9646] items-center justify-center text-[#123f38] text-xs font-bold transition shadow-sm"
                    title="Swap Locations"
                    aria-label="Swap pickup and drop locations"
                  >
                    ⇄
                  </button>

                  <div className="w-full">
                    <label htmlFor="to" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                      TO
                    </label>
                    <input
                      id="to"
                      list="routeCities"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      placeholder="Drop City"
                      className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="md:col-span-4 bg-[#fafbf7] p-2.5 rounded-xl border border-[#e2e8df]">
                  <label htmlFor="cabCategory" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                    CAB CATEGORY
                  </label>
                  <select
                    id="cabCategory"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                    className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition cursor-pointer"
                  >
                    <option value="all">All Cabs</option>
                    <option value="EV">⚡ EV Cabs</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Innova / Kia Carens">Innova / Carens</option>
                    <option value="Innova Crysta">Innova Crysta</option>
                    <option value="Toyota Hycross">Toyota Hycross</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Pickup Timing, Return Timing & Search Button */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Departure Schedule */}
                <div className="md:col-span-5 bg-[#fafbf7] p-2.5 rounded-xl border border-[#e2e8df]">
                  <div className="text-[11px] font-extrabold text-[#123f38] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>🗓️</span>
                    <span>Departure Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="date" className="block text-[10px] font-bold text-[#718079] tracking-wider mb-0.5">
                        PICKUP DATE
                      </label>
                      <input
                        id="date"
                        type="date"
                        value={travelDate}
                        onChange={(e) => {
                          setTravelDate(e.target.value);
                          if (e.target.value > returnDate) {
                            const nextDay = new Date(e.target.value);
                            nextDay.setDate(nextDay.getDate() + 1);
                            setReturnDate(nextDay.toISOString().slice(0, 10));
                          }
                        }}
                        className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-[10px] font-bold text-[#718079] tracking-wider mb-0.5">
                        PICKUP TIME
                      </label>
                      <input
                        id="time"
                        type="time"
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Return Schedule */}
                <div className="md:col-span-5 bg-[#f3f9ef] p-2.5 rounded-xl border border-[#cde2c6]">
                  <div className="text-[11px] font-extrabold text-[#2d7335] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>🔄</span>
                    <span>Return Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="returnDate" className="block text-[10px] font-bold text-[#2d7335] tracking-wider mb-0.5">
                        RETURN DATE
                      </label>
                      <input
                        id="returnDate"
                        type="date"
                        value={returnDate}
                        min={travelDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-white border border-[#c2deb9] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="returnTime" className="block text-[10px] font-bold text-[#2d7335] tracking-wider mb-0.5">
                        RETURN TIME
                      </label>
                      <input
                        id="returnTime"
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full bg-white border border-[#c2deb9] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#62c33a] hover:bg-[#52ad2e] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 h-[58px]"
                  >
                    <span>Search</span>
                    <span className="text-base">→</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standard 1-Row Grid for One Way, EV, Local */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* From & To with Swap Button */}
              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center bg-[#fafbf7] p-2 rounded-xl border border-[#e2e8df]">
                <div className="w-full">
                  <label htmlFor="from" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                    FROM
                  </label>
                  <input
                    id="from"
                    list="routeCities"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Pickup City"
                    className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                    required
                  />
                </div>

                {mode !== "local" && (
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="hidden sm:flex self-end mb-1 w-8 h-8 rounded-full bg-white border border-[#dce5da] hover:bg-[#edf5e7] hover:border-[#3d9646] items-center justify-center text-[#123f38] text-xs font-bold transition shadow-sm"
                    title="Swap Locations"
                    aria-label="Swap pickup and drop locations"
                  >
                    ⇄
                  </button>
                )}

                <div className="w-full">
                  <label htmlFor="to" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                    {mode === "local" ? "TO (Optional)" : "TO"}
                  </label>
                  <input
                    id="to"
                    list="routeCities"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder={mode === "local" ? "Local" : "Drop City"}
                    className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={mode === "local"}
                    required={mode !== "local"}
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="md:col-span-3 grid grid-cols-2 gap-2 bg-[#fafbf7] p-2 rounded-xl border border-[#e2e8df]">
                <div>
                  <label htmlFor="date" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                    DATE
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                    TIME
                  </label>
                  <input
                    id="time"
                    type="time"
                    value={travelTime}
                    onChange={(e) => setTravelTime(e.target.value)}
                    className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-3 py-2 text-sm font-semibold text-[#123f38] outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-2 bg-[#fafbf7] p-2 rounded-xl border border-[#e2e8df]">
                <label htmlFor="cabCategory" className="block text-[11px] font-extrabold text-[#718079] tracking-wider mb-1">
                  CATEGORY
                </label>
                <select
                  id="cabCategory"
                  value={selectedCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCategory(val);
                    if (val === "EV") {
                      if (mode !== "local") setMode("ev");
                    } else if (mode === "ev") {
                      setMode("one");
                    }
                  }}
                  className="w-full bg-white border border-[#dce5da] focus:border-[#3d9646] rounded-lg px-2.5 py-2 text-sm font-semibold text-[#123f38] outline-none transition cursor-pointer"
                >
                  <option value="all">All Cabs</option>
                  <option value="EV">⚡ EV Cabs</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Innova / Kia Carens">Innova / Carens</option>
                  <option value="Innova Crysta">Innova Crysta</option>
                  <option value="Toyota Hycross">Toyota Hycross</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#62c33a] hover:bg-[#52ad2e] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 h-[54px]"
                >
                  <span>Search rides</span>
                  <span className="text-base">→</span>
                </button>
              </div>
            </div>
          )}
        </form>

        <datalist id="routeCities">
          <option value="Pune" />
          <option value="Mumbai" />
          <option value="Mahabaleshwar" />
          <option value="Nashik" />
          <option value="Lonavala" />
        </datalist>
      </div>

      {hasSearched && (
        <section className="section white" id="resSec">
          <div className="container">
            <div className="head">
              <div>
                <div className="ey">AVAILABLE RIDES</div>
                <h2 id="route">
                  {mode === "local" ? `${fromLocation} Local` : `${fromLocation} → ${toLocation}`}
                </h2>
              </div>
              <p id="meta">
                {modeLabel}
                {mode !== "local" && findRoute(fromLocation, toLocation)?.distance_km && (
                  <span className="font-bold text-[#2d7335]">
                    {" "}· {mode === "round"
                      ? `${findRoute(fromLocation, toLocation)!.distance_km! * 2} km round-trip`
                      : `${findRoute(fromLocation, toLocation)!.distance_km} km`}
                  </span>
                )}
                {" "}· {travelDate} {travelTime ? `at ${travelTime}` : ""}
                {mode === "round" && ` — Return: ${returnDate} ${returnTime ? `at ${returnTime}` : ""}`}
              </p>
            </div>

            {/* Cancellation & Refund Policy */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-2xl bg-[#edf5e7] border border-[#d5e8ca]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-base">✓</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Free Cancellation</span>
                  <span className="text-[11px] text-[#718079] ml-1">up to 1 hr before pickup</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-6 bg-[#c5d6be]" />
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-base">💰</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Full Refund</span>
                  <span className="text-[11px] text-[#718079] ml-1">if cancelled within policy</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-6 bg-[#c5d6be]" />
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-base">🔒</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Transparent Billing</span>
                  <span className="text-[11px] text-[#718079] ml-1">itemized GST breakdown</span>
                </div>
              </div>
            </div>

            {!hasValidFare && mode !== "local" ? (
              <div className="panel p-6 border rounded-xl bg-gray-50 border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-2">No fixed fare found</h2>
                <p className="text-gray-600">
                  {mode === "ev" || selectedCategory === "EV" ? (
                    <>
                      We don&apos;t have a fixed fare for{" "}
                      <b>
                        {fromLocation} → {toLocation}
                      </b>{" "}
                      in EV Cabs mode. EV cabs are currently available on Pune ⇄ Mumbai and Pune ⇄ Nashik routes.
                    </>
                  ) : (
                    <>
                      We don&apos;t have a fixed fare for{" "}
                      <b>
                        {fromLocation} → {toLocation}
                      </b>{" "}
                      in {modeLabel} mode. Try Pune → Mumbai, Pune → Mahabaleshwar, Mumbai → Nashik or Pune → Lonavala.
                    </>
                  )}
                </p>
              </div>
            ) : mode === "local" ? (
              <div className="results" id="results">
                {vehicles.map((v) => {
                  const plans = getLocalRentalPlans(v.category);
                  if (!plans || plans.length === 0) return null;
                  return (
                    <div className="result" key={v.category}>
                      <div className="rart">
                        {v.image ? (
                          <Image
                            src={v.image}
                            alt={v.category}
                            width={360}
                            height={240}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 320px, 180px"
                            quality={85}
                            className="w-full h-full object-contain p-2 mix-blend-multiply"
                          />
                        ) : (
                          v.icon
                        )}
                      </div>
                      <div>
                        <h3>
                          {v.category} · {v.model}
                        </h3>
                        <p>Comfortable air-conditioned cab for local travel</p>
                        <div className="chips">
                          <span>👤 {v.seats} seats</span>
                          <span>🧳 {v.bags} bags</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full justify-center mt-3 pt-3 border-t border-[#eef2eb]" style={{ gridColumn: "1 / -1" }}>
                        {plans.map((plan) => (
                          <div key={plan.label} className="flex items-center justify-between gap-2 border border-[#dce5da] p-3 rounded-xl hover:border-[#62c33a] transition-all bg-white hover:shadow-md group">
                            <div className="flex items-center gap-3">
                              <div className="bg-[#f0f7ec] border border-[#dce5da] group-hover:border-[#62c33a]/30 rounded-lg px-2.5 py-1.5 flex flex-col items-center justify-center transition-colors">
                                <span className="text-xs font-extrabold text-[#123f38] leading-none">{plan.label}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-extrabold text-[#123f38]">
                                  {plan.km} km &amp; {plan.hours} hrs
                                </span>
                                <span className="text-[11px] text-[#a5b3ac] font-medium mt-0.5">
                                  City Limit
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-extrabold text-[#123f38]">{formatINR(plan.fare)}</span>
                              <button
                                type="button"
                                className="btn green !min-h-[36px] px-4 py-1.5 text-xs shadow-sm"
                                onClick={() => handleSelectCab(v, plan.fare, plan.label)}
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                {/* Category Filter Pills in Results */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-extrabold text-[#718079] mr-1">FILTER:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      if (mode === "ev") setMode("one");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "all"
                        ? "bg-[#123f38] text-white shadow-sm"
                        : "bg-[#f4f7f4] text-[#5e6d66] hover:bg-[#e4eae3]"
                    }`}
                  >
                    All Cabs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("EV");
                      setMode("ev");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedCategory === "EV"
                        ? "bg-[#2d7335] text-white shadow-sm"
                        : "bg-[#edf5e7] text-[#2d7335] hover:bg-[#ddead8] border border-[#c2e2be]"
                    }`}
                  >
                    <span>⚡</span> EV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Sedan");
                      if (mode === "ev") setMode("one");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "Sedan"
                        ? "bg-[#123f38] text-white shadow-sm"
                        : "bg-[#f4f7f4] text-[#5e6d66] hover:bg-[#e4eae3]"
                    }`}
                  >
                    Sedan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("SUV");
                      if (mode === "ev") setMode("one");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "SUV"
                        ? "bg-[#123f38] text-white shadow-sm"
                        : "bg-[#f4f7f4] text-[#5e6d66] hover:bg-[#e4eae3]"
                    }`}
                  >
                    SUV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Hatchback");
                      if (mode === "ev") setMode("one");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "Hatchback"
                        ? "bg-[#123f38] text-white shadow-sm"
                        : "bg-[#f4f7f4] text-[#5e6d66] hover:bg-[#e4eae3]"
                    }`}
                  >
                    Hatchback
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Toyota Hycross");
                      if (mode === "ev") setMode("one");
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "Toyota Hycross"
                        ? "bg-[#123f38] text-white shadow-sm"
                        : "bg-[#f4f7f4] text-[#5e6d66] hover:bg-[#e4eae3]"
                    }`}
                  >
                    Toyota Hycross
                  </button>
                </div>

                <div className="results" id="results">
                  {vehicles.map((v) => {
                    if (selectedCategory !== "all" && v.category !== selectedCategory) return null;
                    const price = getFareForMode(fromLocation, toLocation, v.category, mode, v.model, v.rateKey);
                    if (price === null) return null; // hide vehicle if no fare available

                    const isEV = v.category === "EV";

                    return (
                      <div className="result" key={`${v.category}-${v.model}`}>
                        <div className="rart">
                          {v.image ? (
                            <Image
                              src={v.image}
                              alt={v.model || v.category}
                              width={360}
                              height={240}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 320px, 180px"
                              quality={85}
                              className="w-full h-full object-contain p-2 mix-blend-multiply"
                            />
                          ) : (
                            v.icon
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3>
                              {v.category === "EV" || v.category === v.model
                                ? v.model
                                : `${v.category} · ${v.model}`}
                            </h3>
                            {isEV && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#edf5e7] text-[#2d7335] border border-[#c2e2be]">
                                ⚡ 100% Electric
                              </span>
                            )}
                          </div>
                          <p>{isEV ? "Zero-emission, silent and comfortable electric ride" : "Comfortable air-conditioned cab"}</p>
                          <div className="chips">
                            <span>👤 {v.seats} seats</span>
                            <span>🧳 {v.bags} bags</span>
                            {isEV ? (
                              <span>⚡ Eco-Friendly</span>
                            ) : (
                              <span>✓ Clean cab</span>
                            )}
                          </div>
                        </div>
                        <div className="rp">
                          <b>{formatINR(price)}</b>
                          <small>route fare</small>
                          <br />
                          <button
                            type="button"
                            className="btn green"
                            onClick={() => handleSelectCab(v, price)}
                          >
                            Select cab
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default function CabSearch(props: CabSearchProps) {
  return (
    <Suspense fallback={null}>
      <CabSearchForm {...props} />
    </Suspense>
  );
}
