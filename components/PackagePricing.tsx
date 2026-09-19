"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/packages";
import { generateWhatsAppBookingUrl } from "@/lib/whatsapp";
import type { TourPackage } from "@/types";

interface PackagePricingProps {
  pkg: TourPackage;
}

export default function PackagePricing({ pkg }: PackagePricingProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("Sedan");
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickupLocation, setPickupLocation] = useState(pkg.route.from);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const selectedFare =
    selectedVehicle === "Crysta"
      ? pkg.prices.crysta
      : selectedVehicle === "Ertiga"
      ? pkg.prices.ertiga
      : pkg.prices.sedan;

  const whatsappLink = generateWhatsAppBookingUrl({
    vehicle: selectedVehicle,
    model: selectedVehicle === "Crysta" ? "Innova Crysta" : selectedVehicle === "Ertiga" ? "Ertiga / Rumion" : "Dzire / Aura",
    from: pickupLocation || pkg.route.from,
    to: pkg.route.to,
    date: travelDate,
    name: name,
    packageTitle: pkg.title,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingId("PK" + Math.floor(100000 + Math.random() * 900000));
    setIsSubmitted(true);
  };

  return (
    <aside className="panel sticky" id="book">
      <div className="ey">CHOOSE YOUR CAB</div>
      <h2>{pkg.title}</h2>

      <div className="vehiclePrices">
        <div
          className="vehiclePrice"
          style={{
            cursor: "pointer",
            border: selectedVehicle === "Sedan" ? "2px solid var(--g2)" : undefined,
          }}
          onClick={() => setSelectedVehicle("Sedan")}
        >
          <small>SEDAN</small>
          <b>{formatINR(pkg.prices.sedan)}</b>
        </div>
        <div
          className="vehiclePrice"
          style={{
            cursor: "pointer",
            border: selectedVehicle === "Ertiga" ? "2px solid var(--g2)" : undefined,
          }}
          onClick={() => setSelectedVehicle("Ertiga")}
        >
          <small>ERTIGA</small>
          <b>{formatINR(pkg.prices.ertiga)}</b>
        </div>
        <div
          className="vehiclePrice"
          style={{
            cursor: "pointer",
            border: selectedVehicle === "Crysta" ? "2px solid var(--g2)" : undefined,
          }}
          onClick={() => setSelectedVehicle("Crysta")}
        >
          <small>CRYSTA</small>
          <b>{formatINR(pkg.prices.crysta)}</b>
        </div>
      </div>

      {!isSubmitted ? (
        <form className="booking" id="bookingForm" onSubmit={handleSubmit}>
          <label htmlFor="vehicleSelect">
            Vehicle
            <select
              id="vehicleSelect"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="Sedan">Sedan — {formatINR(pkg.prices.sedan)}</option>
              <option value="Ertiga">Ertiga — {formatINR(pkg.prices.ertiga)}</option>
              <option value="Crysta">Crysta — {formatINR(pkg.prices.crysta)}</option>
            </select>
          </label>

          <label htmlFor="travelDateInput">
            Travel date
            <input
              id="travelDateInput"
              type="date"
              required
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </label>

          <label htmlFor="nameInput">
            Name
            <input
              id="nameInput"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label htmlFor="mobileInput">
            Mobile
            <input
              id="mobileInput"
              required
              placeholder="+91"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </label>

          <label htmlFor="pickupInput">
            Pickup location
            <input
              id="pickupInput"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </label>

          <label htmlFor="notesInput">
            Notes
            <textarea
              id="notesInput"
              rows={3}
              placeholder="Special request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <button type="submit" className="btn green" style={{ width: "100%" }}>
            Request booking
          </button>

          <a
            className="btn wa"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink}
            style={{ width: "100%", textAlign: "center" }}
          >
            WhatsApp this package
          </a>
        </form>
      ) : (
        <div className="success" id="success">
          <h3 style={{ color: "var(--d)", marginBottom: "8px" }}>✓ Request received</h3>
          <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>
            Demo enquiry ID: <b id="bookingId" style={{ color: "var(--d)" }}>{bookingId}</b>
          </p>
          <a
            className="btn wa"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            Confirm on WhatsApp
          </a>
          <Link className="btn dark" href="/packages" style={{ width: "100%" }}>
            Explore other packages
          </Link>
        </div>
      )}

      <p className="note" style={{ marginTop: "14px" }}>
        Selected Fare: <b>{formatINR(selectedFare)}</b> · All inclusive demo quote.
      </p>
    </aside>
  );
}
