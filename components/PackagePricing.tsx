"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR, priceAmount, getPackageDestination } from "@/lib/packages";
import { generateWhatsAppBookingUrl } from "@/lib/whatsapp";
import type { TourPackage, PriceValue } from "@/types";
import vehicles from "@/data/vehicles.json";
import Image from "next/image";
import { sendPackageBookingEmail } from "@/lib/emailjs";

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
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupLocation, setPickupLocation] = useState(pkg.route.from);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error" | "skipped">("idle");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus("loading");

    const newBookingId = "PK" + Math.floor(100000 + Math.random() * 900000);
    setBookingId(newBookingId);

    const priceObj =
      selectedVehicle === "Ertiga"
        ? pkg.prices.ertiga
        : selectedVehicle === "Crysta"
        ? pkg.prices.crysta
        : pkg.prices.sedan;

    try {
      const res = await sendPackageBookingEmail({
        bookingId: newBookingId,
        packageTitle: pkg.title,
        vehicle: selectedVehicle,
        vehicleModel: currentVehicle.model,
        travelDate,
        price: formatINR(priceAmount(priceObj)),
        name,
        mobile,
        email: customerEmail,
        pickupLocation: pickupLocation || pkg.route.from,
        notes,
      });

      if (res.success) {
        setEmailStatus("success");
      } else if (res.skipped) {
        setEmailStatus("skipped");
      } else {
        setEmailStatus("error");
      }
    } catch (err) {
      console.error("[EmailJS] Package booking error:", err);
      setEmailStatus("error");
    } finally {
      setIsSubmitted(true);
    }
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

          <label htmlFor="packageEmailInput">
            Email address (optional)
            <input
              id="packageEmailInput"
              type="email"
              placeholder="name@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
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

          {/* Button 1: Submit Form (Email) */}
          <button
            type="submit"
            disabled={emailStatus === "loading"}
            className="btn green"
            style={{
              width: "100%",
              marginTop: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 700,
              opacity: emailStatus === "loading" ? 0.75 : 1,
            }}
          >
            {emailStatus === "loading" ? (
              <>⏳ Submitting Form...</>
            ) : (
              <><span>📨</span> Submit Form</>
            )}
          </button>

          {/* Button 2: Submit through WhatsApp */}
          <a
            className="btn wa"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink}
            style={{
              width: "100%",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#25D366",
              color: "#ffffff",
              fontWeight: 700,
              borderRadius: "10px",
              padding: "12px",
              textDecoration: "none",
              fontSize: "14px",
              border: "none",
            }}
          >
            <span>💬</span> Submit through WhatsApp
          </a>
        </form>
      ) : (
        <div className="success" id="success">
          <h3 style={{ color: "var(--d)", marginBottom: "8px" }}>✓ Request received</h3>
          <p style={{ color: "var(--muted)", margin: "0 0 12px" }}>
            Enquiry ID: <b id="bookingId" style={{ color: "var(--d)" }}>{bookingId}</b>
          </p>

          {emailStatus === "success" && (
            <p style={{ color: "#2d7335", fontSize: "13px", margin: "0 0 14px", fontWeight: 600 }}>
              ✓ Details sent to our email team. We will contact you shortly!
            </p>
          )}

          {emailStatus === "skipped" && (
            <p style={{ color: "#718079", fontSize: "11px", margin: "0 0 14px" }}>
              Enquiry saved. (Add your EmailJS keys in <code>.env.local</code> to deliver emails to inbox).
            </p>
          )}

          {emailStatus === "error" && (
            <p style={{ color: "#b91c1c", fontSize: "12px", margin: "0 0 14px" }}>
              Email delivery was not completed, but your Enquiry ID is saved. Please confirm via WhatsApp below.
            </p>
          )}

          <a
            className="btn wa"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink}
            style={{
              width: "100%",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#25D366",
              color: "#ffffff",
              fontWeight: 700,
              borderRadius: "10px",
              padding: "12px",
              textDecoration: "none",
              fontSize: "14px",
              border: "none",
            }}
          >
            <span>💬</span> Confirm on WhatsApp
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
