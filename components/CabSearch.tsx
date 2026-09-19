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

  return (
    <>
      <div className="search" id="booking">
        <div className="tabs">
          <button
            type="button"
            className={`tab ${mode === "one" ? "on" : ""}`}
            onClick={() => setMode("one")}
          >
            One Way
          </button>
          <button
            type="button"
            className={`tab ${mode === "round" ? "on" : ""}`}
            onClick={() => setMode("round")}
          >
            Round Trip
          </button>
          <button
            type="button"
            className={`tab ${mode === "airport" ? "on" : ""}`}
            onClick={() => setMode("airport")}
          >
            Airport
          </button>
          <button
            type="button"
            className={`tab ${mode === "local" ? "on" : ""}`}
            onClick={() => setMode("local")}
          >
            Hourly Rental
          </button>
        </div>

        <form className="form" id="search" onSubmit={handleSearch}>
          <div className="field">
            <label htmlFor="from">FROM</label>
            <input
              id="from"
              list="routeCities"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="e.g. Pune"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="to">TO</label>
            <input
              id="to"
              list="routeCities"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="e.g. Mumbai"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="date">DATE</label>
            <input
              id="date"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="time">TIME</label>
            <input
              id="time"
              type="time"
              value={travelTime}
              onChange={(e) => setTravelTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn green">
            Search rides →
          </button>
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
