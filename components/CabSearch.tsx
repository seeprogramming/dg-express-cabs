"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getFareForMode, getLocalRentalPlans } from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import type { VehicleInfo } from "@/types";

interface CabSearchProps {
  vehicles: VehicleInfo[];
  initialFrom?: string;
  initialTo?: string;
  initialMode?: TripMode;
}

export type TripMode = "one" | "round" | "airport" | "local";

export default function CabSearch({
  vehicles,
  initialFrom = "Pune",
  initialTo = "Mumbai",
  initialMode = "one",
}: CabSearchProps) {
  const router = useRouter();
  const [mode, setMode] = useState<TripMode>(initialMode);
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [travelTime, setTravelTime] = useState("09:00");
  const [hasSearched, setHasSearched] = useState(false);

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
    const params = new URLSearchParams({
      vehicle: vehicle.category,
      model: vehicle.model,
      seats: String(vehicle.seats),
      bags: String(vehicle.bags),
      from: fromLocation.trim(),
      to: mode === "local" ? "Local" : toLocation.trim(),
      date: travelDate,
      price: String(price),
    });
    if (planLabel) {
      params.append("plan", planLabel);
    }
    router.push(`/cabs/details?${params.toString()}`);
  };

  const modeLabel =
    mode === "round"
      ? "Round Trip"
      : mode === "airport"
      ? "Airport Transfer"
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
      if (getFareForMode(fromLocation, toLocation, v.category, mode) !== null) {
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
              mode === "one"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => setMode("one")}
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
            onClick={() => setMode("round")}
          >
            <span>⇄</span> Round Trip
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === "airport"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => setMode("airport")}
          >
            <span>✈</span> Airport
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === "local"
                ? "bg-[#123f38] text-white shadow-sm"
                : "text-[#5e6d66] hover:text-[#123f38] hover:bg-[#edf5e7]"
            }`}
            onClick={() => setMode("local")}
          >
            <span>⏱</span> Local Rentals
          </button>
        </div>

        {/* Compact, Modern Grid Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* From & To with Swap Button */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center bg-[#fafbf7] p-2 rounded-xl border border-[#e2e8df]">
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
          <div className="md:col-span-4 grid grid-cols-2 gap-2 bg-[#fafbf7] p-2 rounded-xl border border-[#e2e8df]">
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
                {modeLabel} · {travelDate} {travelTime ? `at ${travelTime}` : ""}
              </p>
            </div>

            {/* Cancellation & Refund Policy */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-2xl bg-[#edf5e7] border border-[#d5e8ca]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-base">✓</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Free Cancellation</span>
                  <span className="text-[11px] text-[#718079] ml-1">up to 2 hrs before pickup</span>
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
                  We don't have a fixed fare for{" "}
                  <b>
                    {fromLocation} → {toLocation}
                  </b>{" "}
                  in {modeLabel} mode. Try Pune → Mumbai, Pune → Mahabaleshwar, Mumbai → Nashik or Pune → Lonavala.
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
                          <Image src={v.image} alt={v.category} width={120} height={80} className="w-full h-full object-contain p-2 mix-blend-multiply" />
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
              <div className="results" id="results">
                {vehicles.map((v) => {
                  const price = getFareForMode(fromLocation, toLocation, v.category, mode);
                  if (price === null) return null; // hide vehicle if no fare available
                  
                  return (
                    <div className="result" key={v.category}>
                      <div className="rart">
                        {v.image ? (
                          <Image src={v.image} alt={v.category} width={120} height={80} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                        ) : (
                          v.icon
                        )}
                      </div>
                      <div>
                        <h3>
                          {v.category} · {v.model}
                        </h3>
                        <p>Comfortable air-conditioned cab</p>
                        <div className="chips">
                          <span>👤 {v.seats} seats</span>
                          <span>🧳 {v.bags} bags</span>
                          <span>✓ Clean cab</span>
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
            )}
          </div>
        </section>
      )}
    </>
  );
}
