"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR, priceAmount, getPackageDestination } from "@/lib/packages";
import { generateWhatsAppBookingUrl } from "@/lib/whatsapp";
import type { TourPackage, PriceValue } from "@/types";
import vehicles from "@/data/vehicles.json";
import Image from "next/image";

interface PackagePricingProps {
  pkg: TourPackage;
  categorySlug?: string;
}

/** Map selection label → vehicles.json entry */
const vehicleMap: Record<string, { image: string; model: string; seats: number; bags: number }> = {
  Sedan: {
    image: vehicles.find((v) => v.category === "Sedan")?.image || "/images/dzire.webp",
    model: vehicles.find((v) => v.category === "Sedan")?.model || "Dzire / Aura",
    seats: vehicles.find((v) => v.category === "Sedan")?.seats || 4,
    bags: vehicles.find((v) => v.category === "Sedan")?.bags || 2,
  },
  Ertiga: {
    image: vehicles.find((v) => v.category === "SUV")?.image || "/images/ertiga.avif",
    model: vehicles.find((v) => v.category === "SUV")?.model || "Ertiga / Rumion",
    seats: vehicles.find((v) => v.category === "SUV")?.seats || 6,
    bags: vehicles.find((v) => v.category === "SUV")?.bags || 3,
  },
  Crysta: {
    image: vehicles.find((v) => v.category === "Innova Crysta")?.image || "/images/innova.webp",
    model: vehicles.find((v) => v.category === "Innova Crysta")?.model || "Innova Crysta",
    seats: vehicles.find((v) => v.category === "Innova Crysta")?.seats || 6,
    bags: vehicles.find((v) => v.category === "Innova Crysta")?.bags || 4,
  },
};

/** Get pax info if available */
function getPaxLabel(price: PriceValue): string | null {
  if (typeof price === "object" && price.pax) {
    return `for ${price.pax} pax`;
  }
  return null;
}

export default function PackagePricing({ pkg, categorySlug }: PackagePricingProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("Sedan");
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pickupLocation, setPickupLocation] = useState(pkg.route.from);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const selectedPrice =
    selectedVehicle === "Crysta"
      ? pkg.prices.crysta
      : selectedVehicle === "Ertiga"
      ? pkg.prices.ertiga
      : pkg.prices.sedan;

  const selectedFare = priceAmount(selectedPrice);
  const dest = getPackageDestination(pkg);
  const currentVehicle = vehicleMap[selectedVehicle] || vehicleMap.Sedan;

  const whatsappLink = generateWhatsAppBookingUrl({
    vehicle: selectedVehicle,
    model: currentVehicle.model,
    from: pickupLocation || pkg.route.from,
    to: dest,
    date: travelDate,
    name: name,
    packageTitle: pkg.title,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingId("PK" + Math.floor(100000 + Math.random() * 900000));
    setIsSubmitted(true);
  };

  const sedanPax = getPaxLabel(pkg.prices.sedan);
  const ertigaPax = getPaxLabel(pkg.prices.ertiga);
  const crystaPax = getPaxLabel(pkg.prices.crysta);

  return (
    <aside className="panel sticky" id="book">
      <div className="ey">CHOOSE YOUR CAB</div>
      <h2>{pkg.title}</h2>

      {/* Selected vehicle image */}
      <div style={{
        background: "linear-gradient(135deg, #f0f7ec 0%, #e8f5e1 100%)",
        borderRadius: "14px",
        padding: "16px",
        marginBottom: "16px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <Image
          src={currentVehicle.image}
          alt={currentVehicle.model}
          width={280}
          height={160}
          style={{
            objectFit: "contain",
            margin: "0 auto",
            display: "block",
            transition: "transform 0.3s ease",
          }}
        />
        <div style={{ marginTop: "10px" }}>
          <strong style={{ fontSize: "15px", color: "var(--d, #123f38)" }}>{currentVehicle.model}</strong>
          <div style={{ fontSize: "12px", color: "#718079", marginTop: "4px", display: "flex", justifyContent: "center", gap: "12px" }}>
            <span>👤 {currentVehicle.seats} seats</span>
            <span>🧳 {currentVehicle.bags} bags</span>
          </div>
        </div>
      </div>

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
          <b>{formatINR(priceAmount(pkg.prices.sedan))}</b>
          {sedanPax && <span className="text-[10px] text-[#718079] block">{sedanPax}</span>}
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
          <b>{formatINR(priceAmount(pkg.prices.ertiga))}</b>
          {ertigaPax && <span className="text-[10px] text-[#718079] block">{ertigaPax}</span>}
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
          <b>{formatINR(priceAmount(pkg.prices.crysta))}</b>
          {crystaPax && <span className="text-[10px] text-[#718079] block">{crystaPax}</span>}
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
              <option value="Sedan">Sedan — {formatINR(priceAmount(pkg.prices.sedan))}</option>
              <option value="Ertiga">Ertiga — {formatINR(priceAmount(pkg.prices.ertiga))}</option>
              <option value="Crysta">Crysta — {formatINR(priceAmount(pkg.prices.crysta))}</option>
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
             enquiry ID: <b id="bookingId" style={{ color: "var(--d)" }}>{bookingId}</b>
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
        Selected Fare: <b>{formatINR(selectedFare)}</b> · All inclusive quote.
      </p>
    </aside>
  );
}
