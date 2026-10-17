import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import type { AirportInfo } from "@/types";

interface AirportTransfersProps {
  airports: AirportInfo[];
}

export default function AirportTransfers({ airports }: AirportTransfersProps) {
  return (
    <section className="section soft" id="airports">
      <div className="container">
        <div className="head">
          <div>
            <div className="ey">AIRPORT TRANSFERS</div>
            <h2>Airport Cab Transfers</h2>
          </div>
          <p>Pre-book pickup or drop with luggage-friendly vehicle options.</p>
        </div>
        <div className="airgrid" id="airGrid">
          {airports.map((a) => (
            <Link
              href={`/airports/${a.city.toLowerCase()}-airport`}
              className="airport"
              key={a.code}
              style={{
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                className="art"
                style={{
                  height: "130px",
                  margin: "-22px -22px 16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={a.image || siteConfig.stockImages.airport}
                  alt={`${a.city} Airport cab transfer`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="code">{a.code}</span>
              <div className="ey">{a.city.toUpperCase()}</div>
              <h3>{a.city} Airport Transfer</h3>
              <p style={{ flex: 1 }}>
                {a.description ||
                  "Pre-booked pickup or drop with comfortable, luggage-friendly cab options."}
              </p>
              <div className="price" style={{ marginBottom: "12px" }}>
                <small>Starting from</small>
                <b>{formatINR(a.fare)}</b>
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--g)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                View airport cab options →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
