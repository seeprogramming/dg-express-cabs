"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import InclusionExclusion from "./InclusionExclusion";
import { formatINR } from "@/lib/packages";
import { generateWhatsAppBookingUrl, getQrCodeImageUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export default function CabDetails() {
  const searchParams = useSearchParams();

  const vehicle = searchParams.get("vehicle") || "Sedan";
  const model = searchParams.get("model") || "Dzire / Aura";
  const from = searchParams.get("from") || "Pune";
  const to = searchParams.get("to") || "Mumbai";
  const seats = searchParams.get("seats") || "4";
  const bags = searchParams.get("bags") || "2";
  const initialDate = searchParams.get("date") || "";
  const priceParam = searchParams.get("price") || "";

  const [travelDate, setTravelDate] = useState(initialDate);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState("");
  const [notes, setNotes] = useState("");

  const formattedFare = priceParam ? formatINR(Number(priceParam)) : "On request";

  const waLink = generateWhatsAppBookingUrl({
    vehicle,
    model,
    from,
    to,
    date: travelDate,
    name,
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
              backgroundImage: `url('${siteConfig.stockImages.car}')`,
            }}
          >
            <span className="badge" id="photoBadge">
              {vehicle} · {model}
            </span>
          </div>

          <h1 className="cabTitle" id="cabTitle">
            {vehicle} — {model}
          </h1>
          <div className="tripline" id="tripline">
            {from} → {to}
          </div>

          <p id="cabCopy">
            A comfortable private cab for your outstation journey. Final vehicle allocation may be
            the selected model or a similar vehicle in the same category.
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
              <b>Private cab</b>
            </div>
            <div className="spec">
              <small>ESTIMATED FARE</small>
              <b id="selectedFare">{formattedFare}</b>
            </div>
          </div>

          <InclusionExclusion />
        </section>

        <aside className="bookingCard">
          <div className="ey">BOOK YOUR RIDE</div>
          <h2>Send booking request</h2>

          <form id="cabForm" onSubmit={handleSubmit}>
            <label htmlFor="vehicleField">Selected cab</label>
            <input id="vehicleField" readOnly value={`${vehicle} — ${model}`} />

            <label htmlFor="routeField">Route</label>
            <input id="routeField" readOnly value={`${from} → ${to}`} />

            <label htmlFor="travelDateField">Travel date</label>
            <input
              id="travelDateField"
              type="date"
              required
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />

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

          <p className="disclaimer">
            Demo website: replace the WhatsApp number with the business number before publishing.
            Inclusions/exclusions shown here are website defaults and can be updated to your actual terms.
          </p>
        </aside>
      </div>
    </main>
  );
}
