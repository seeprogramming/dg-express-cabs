"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findRoute, calculateFare } from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import type { VehicleInfo } from "@/types";

interface CabSearchProps {
  vehicles: VehicleInfo[];
  initialFrom?: string;
  initialTo?: string;
}

export type TripMode = "one" | "round" | "airport" | "local";

export default function CabSearch({
  vehicles,
  initialFrom = "Pune",
  initialTo = "Mumbai",
}: CabSearchProps) {
  const router = useRouter();
  const [mode, setMode] = useState<TripMode>("one");
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [travelTime, setTravelTime] = useState("09:00");
  const [hasSearched, setHasSearched] = useState(false);

  const matchedRoute = findRoute(fromLocation, toLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromLocation.trim() || !toLocation.trim()) {
      alert("Please enter both From and To locations.");
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

  const handleSelectCab = (vehicle: VehicleInfo, price: number) => {
    const params = new URLSearchParams({
      vehicle: vehicle.category,
      model: vehicle.model,
      seats: String(vehicle.seats),
      bags: String(vehicle.bags),
      from: fromLocation.trim(),
      to: toLocation.trim(),
      date: travelDate,
      price: String(price),
    });
    router.push(`/cabs/details?${params.toString()}`);
  };

  const modeLabel =
    mode === "round"
      ? "Round Trip"
      : mode === "airport"
      ? "Airport Transfer"
      : mode === "local"
      ? "Hourly Rental"
      : "One Way";

  const baseFare = matchedRoute ? matchedRoute.fare : 2800;

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

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
            <span>⏱</span> Hourly Rental
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

            <button
              type="button"
              onClick={handleSwapLocations}
              className="hidden sm:flex self-end mb-1 w-8 h-8 rounded-full bg-white border border-[#dce5da] hover:bg-[#edf5e7] hover:border-[#3d9646] items-center justify-center text-[#123f38] text-xs font-bold transition shadow-sm"
              title="Swap Locations"
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
                  {fromLocation} → {toLocation}
                </h2>
              </div>
              <p id="meta">
                {modeLabel} · {travelDate} {travelTime ? `at ${travelTime}` : ""}
              </p>
            </div>

            {!matchedRoute && mode === "one" ? (
              <div className="panel">
                <h2>No fixed fare found</h2>
                <p>
                  We don't have a demo fixed fare for{" "}
                  <b>
                    {fromLocation} → {toLocation}
                  </b>{" "}
                  yet. Try Pune → Mumbai, Pune → Mahabaleshwar, Mumbai → Nashik or Pune → Lonavala.
                </p>
              </div>
            ) : (
              <div className="results" id="results">
                {vehicles.map((v) => {
                  const price = calculateFare(baseFare, v.multiplier, mode);
                  return (
                    <div className="result" key={v.category}>
                      <div className="rart">{v.icon}</div>
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
                        <small>{matchedRoute ? "route fare" : "demo estimate"}</small>
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
