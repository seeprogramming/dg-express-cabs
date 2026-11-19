"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import InclusionExclusion from "./InclusionExclusion";
import { formatINR } from "@/lib/packages";
import { generateWhatsAppBookingUrl, getQrCodeImageUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";
import vehicles from "@/data/vehicles.json";
import { findRoute } from "@/lib/routes";

/* Map vehicle category → image path from vehicles.json */
const vehicleImageMap: Record<string, string> = Object.fromEntries(
  vehicles.map((v) => [v.category, v.image])
);

export default function CabDetails() {
  const searchParams = useSearchParams();

  const vehicle = searchParams.get("vehicle") || "Sedan";
  const model = searchParams.get("model") || "Dzire / Aura";
  const from = searchParams.get("from") || "Pune";
  const to = searchParams.get("to") || "Mumbai";
  const seats = searchParams.get("seats") || "4";
  const bags = searchParams.get("bags") || "2";
  const initialDate = searchParams.get("date") || "";
  const initialTime = searchParams.get("time") || "";
  const priceParam = searchParams.get("price") || "";
  const tripTypeParam = searchParams.get("tripType") || searchParams.get("mode") || "";
  const planParam = searchParams.get("plan") || "";
  const initialReturnDate = searchParams.get("returnDate") || "";
  const initialReturnTime = searchParams.get("returnTime") || "";

  /* Resolve the trip type / category (One Way, Round Trip, Local Rentals, EV Cabs) */
  const resolveTripType = (): string => {
    const raw = tripTypeParam.trim().toLowerCase();
    if (raw === "round" || raw.includes("round")) {
      return "Round Trip";
    }
    if (raw === "local" || raw.includes("local") || to.toLowerCase() === "local" || planParam) {
      return planParam ? `Local Rental (${planParam})` : "Local Rentals";
    }
    if (raw === "ev" || raw.includes("ev") || vehicle.toLowerCase() === "ev") {
      return "EV Cabs";
    }
    if (raw === "one" || raw.includes("one")) {
      return "One Way";
    }
    if (tripTypeParam) {
      return tripTypeParam;
    }
    if (to.toLowerCase() === "local" || planParam) {
      return planParam ? `Local Rental (${planParam})` : "Local Rentals";
    }
    return "One Way";
  };

  const tripType = resolveTripType();
  const isRoundTrip =
    tripType.toLowerCase().includes("round") ||
    searchParams.get("mode") === "round" ||
    Boolean(searchParams.get("returnDate"));
  const isLocalRental = tripType.toLowerCase().includes("local") || to.toLowerCase() === "local";

  const routeDisplay = isRoundTrip
    ? `${from} ⇄ ${to}`
    : isLocalRental
    ? `${from} (Local Rental)`
    : `${from} → ${to}`;

  /* Look up route distance */
  const matchedRoute = findRoute(from, to);
  const oneWayKm = matchedRoute?.distance_km;
  const displayDistance = isLocalRental
    ? planParam || null
    : oneWayKm
    ? isRoundTrip
      ? `${oneWayKm * 2} km (Round Trip)`
      : `${oneWayKm} km`
    : null;

  /* Resolve the correct vehicle image */
  const vehicleImage =
    vehicles.find((v) => v.model.toLowerCase().includes(model.toLowerCase()) || model.toLowerCase().includes(v.model.toLowerCase()))?.image ||
    vehicleImageMap[vehicle] ||             // exact match (e.g. "Sedan", "SUV")
    siteConfig.stockImages.car;             // fallback

  const [travelDate, setTravelDate] = useState(initialDate);
  const [travelTime, setTravelTime] = useState(initialTime);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [returnTime, setReturnTime] = useState(initialReturnTime);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState("");
  const [notes, setNotes] = useState("");

  const formattedFare = priceParam ? formatINR(Number(priceParam)) : "On request";

  const dateDisplay = isRoundTrip && returnDate
    ? `${travelDate}${travelTime ? ` at ${travelTime}` : ""} — Return: ${returnDate}${returnTime ? ` at ${returnTime}` : ""}`
    : `${travelDate}${travelTime ? ` at ${travelTime}` : ""}`;

  const waLink = generateWhatsAppBookingUrl({
    vehicle,
    model,
    from,
    to,
    date: travelDate,
    time: travelTime,
    returnDate: isRoundTrip ? returnDate : undefined,
    returnTime: isRoundTrip ? returnTime : undefined,
    name,
    tripType,
  });

  const qrImageUrl = getQrCodeImageUrl(waLink, 220);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(waLink, "_blank");
  };

  return (
    <main className="cabDetailHero">
      <div className="container cabLayout">
        <section>
          <div
            className="cabPhoto"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(145deg, #f7faf5 0%, #edf5e8 100%)",
              border: "1px solid #dce8d8",
            }}
          >
            <Image
              src={vehicleImage}
              alt={`${vehicle} - ${model}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="p-4 sm:p-6 md:p-8 object-contain"
            />
            <span
              className="badge"
              id="photoBadge"
              style={{
                position: "absolute",
                left: "18px",
                bottom: "18px",
                zIndex: 10,
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                border: "1px solid #dbe6d6",
              }}
            >
              {vehicle} · {model}
            </span>
          </div>

          <h1 className="cabTitle" id="cabTitle">
            {vehicle} — {model}
          </h1>
          <div className="tripline" id="tripline">
            <span>{routeDisplay}</span>
            {displayDistance && (
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#3d9646", background: "#edf5e7", padding: "2px 10px", borderRadius: "12px", border: "1px solid #cde2c6", marginLeft: "10px", verticalAlign: "middle" }}>
                📍 {displayDistance}
              </span>
            )}
          </div>

          <p id="cabCopy">
            {isLocalRental
              ? `A comfortable chauffeur-driven cab for your local city travel in and around ${from}. Flexible hourly packages for city commutes, shopping, or business meetings.`
              : tripType === "EV Cabs"
              ? "A 100% electric, zero-emission cab for your outstation journey. Whisper-quiet cabin, zero engine vibration, and eco-friendly comfort."
              : isRoundTrip
              ? `A reliable cab for your complete round-trip journey (${from} ⇄ ${to}). Same vehicle and verified driver dedicated for your round trip.`
              : "A comfortable cab for your outstation journey. Final vehicle allocation may be the selected model or a similar vehicle in the same category."}
          </p>

          <div className="specs">
            <div className="spec">
              <small>PASSENGERS</small>
              <b id="seats">{seats} passengers</b>
            </div>
            <div className="spec">
              <small>LUGGAGE</small>
              <b id="bags">{bags} bags</b>
            </div>
            <div className="spec">
              <small>TRIP TYPE</small>
              <b id="tripType">{tripType}</b>
            </div>
            {displayDistance && (
              <div className="spec">
                <small>DISTANCE</small>
                <b id="distance">{displayDistance}</b>
              </div>
            )}
            <div className="spec">
              <small>ESTIMATED FARE</small>
              <b id="selectedFare">{formattedFare}</b>
            </div>
          </div>

          {/* Cancellation & Refund Policy */}
          <div className="mt-6 p-4 rounded-2xl bg-[#edf5e7] border border-[#d5e8ca]">
            <h3 className="text-[13px] font-extrabold text-[#123f38] uppercase tracking-wide mb-3">Cancellation & Refund Policy</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-sm shrink-0 mt-0.5">✓</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Free Cancellation</span>
                  <span className="text-[12px] text-[#718079] block">Cancel your ride for free up to 1 hour before your scheduled pickup time.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-sm shrink-0 mt-0.5">💰</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Full Refund</span>
                  <span className="text-[12px] text-[#718079] block">100% refund is processed if cancelled within the free cancellation window.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#62c33a]/20 text-[#3d7c3a] flex items-center justify-center text-sm shrink-0 mt-0.5">⚠️</span>
                <div>
                  <span className="text-[13px] font-extrabold text-[#123f38]">Late Cancellation</span>
                  <span className="text-[12px] text-[#718079] block">Cancellations made less than 1 hour before pickup may attract a partial charge.</span>
                </div>
              </div>
            </div>
          </div>

          <InclusionExclusion
            distanceKm={oneWayKm ? (isRoundTrip ? oneWayKm * 2 : oneWayKm) : null}
            isRoundTrip={isRoundTrip}
          />
        </section>

        <aside className="bookingCard">
          <div className="ey">BOOK YOUR RIDE</div>
          <h2>Send booking request</h2>

          <form id="cabForm" onSubmit={handleSubmit}>
            <label htmlFor="vehicleField">Selected cab</label>
            <input id="vehicleField" readOnly value={`${vehicle} — ${model}`} />

            <label htmlFor="tripTypeField">Trip type</label>
            <input id="tripTypeField" readOnly value={tripType} />

            <label htmlFor="routeField">Route</label>
            <input id="routeField" readOnly value={routeDisplay} />

            {isRoundTrip ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "6px 0 10px" }}>
                {/* Departure Group */}
                <div style={{ background: "#fafbf7", border: "1px solid #e2e8df", borderRadius: "10px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#123f38", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>🗓️</span>
                    <span>Departure</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label htmlFor="travelDateField" style={{ fontSize: "10px", fontWeight: 700, color: "#718079", marginBottom: "3px", display: "block" }}>
                        PICKUP DATE
                      </label>
                      <input
                        id="travelDateField"
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => {
                          setTravelDate(e.target.value);
                          if (e.target.value > returnDate) {
                            const nextDay = new Date(e.target.value);
                            nextDay.setDate(nextDay.getDate() + 1);
                            setReturnDate(nextDay.toISOString().slice(0, 10));
                          }
                        }}
                        style={{ margin: 0, padding: "8px 10px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="travelTimeField" style={{ fontSize: "10px", fontWeight: 700, color: "#718079", marginBottom: "3px", display: "block" }}>
                        PICKUP TIME
                      </label>
                      <input
                        id="travelTimeField"
                        type="time"
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        style={{ margin: 0, padding: "8px 10px", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Return Group */}
                <div style={{ background: "#f3f9ef", border: "1px solid #cde2c6", borderRadius: "10px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#2d7335", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>🔄</span>
                    <span>Return</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label htmlFor="returnDateField" style={{ fontSize: "10px", fontWeight: 700, color: "#2d7335", marginBottom: "3px", display: "block" }}>
                        RETURN DATE
                      </label>
                      <input
                        id="returnDateField"
                        type="date"
                        required
                        min={travelDate}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        style={{ margin: 0, padding: "8px 10px", fontSize: "13px", borderColor: "#c2deb9" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="returnTimeField" style={{ fontSize: "10px", fontWeight: 700, color: "#2d7335", marginBottom: "3px", display: "block" }}>
                        RETURN TIME
                      </label>
                      <input
                        id="returnTimeField"
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        style={{ margin: 0, padding: "8px 10px", fontSize: "13px", borderColor: "#c2deb9" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <label htmlFor="travelDateField">Travel date</label>
                <input
                  id="travelDateField"
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />

                <label htmlFor="travelTimeField">Preferred time</label>
                <input
                  id="travelTimeField"
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                />
              </>
            )}

            <label htmlFor="nameField">Your name</label>
            <input
              id="nameField"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="mobileField">Mobile number</label>
            <input
              id="mobileField"
              required
              placeholder="+91"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <label htmlFor="pickupField">Pickup address</label>
            <input
              id="pickupField"
              required
              placeholder="Enter pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />

            <label htmlFor="notesField">Notes</label>
            <textarea
              id="notesField"
              rows={3}
              placeholder="Pickup time, luggage or other request"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="submit"
              className="btn green"
              style={{ width: "100%", marginTop: "14px" }}
            >
              Request booking
            </button>
          </form>

          <div className="qrBox">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id="qr"
              src={qrImageUrl}
              alt="Scan QR to open booking in WhatsApp"
              width={165}
              height={165}
            />
            <h3>Scan to continue on WhatsApp</h3>
            <p>The QR opens a pre-filled message for this cab and route.</p>

            <a
              className="btn whatsapp"
              id="wa"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp
            </a>
          </div>

          {/* <p className="disclaimer">
            Demo website: replace the WhatsApp number with the business number before publishing.
            Inclusions/exclusions shown here are website defaults and can be updated to your actual terms.
          </p> */}
        </aside>
      </div>
    </main>
  );
}
