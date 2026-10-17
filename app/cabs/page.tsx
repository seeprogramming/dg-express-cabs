import type { Metadata } from "next";
import Link from "next/link";
import AllRoutesClient from "@/components/AllRoutesClient";
import { getRoutes, getRoundTripRoutes, getLocalRentals } from "@/lib/routes";
import { formatINR } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Outstation Cab Routes — One Way, Round Trip & Local Rentals",
  description:
    "Explore all available one-way intercity cab routes, round-trip connections, and local hourly rental plans from Pune, Mumbai, and Nashik with transparent pricing.",
  alternates: {
    canonical: "/cabs",
  },
  openGraph: {
    url: "https://dgexpresscabs.com/cabs",
    title: "Outstation Cab Routes — One Way, Round Trip & Local Rentals | D&G Express Cabs",
    description:
      "Explore all one-way intercity routes, round-trip connections, and local hourly rental plans with transparent pricing.",
  },
};

export default function AllRoutesPage() {
  const oneWayRoutes = getRoutes();
  const roundTripRoutes = getRoundTripRoutes();
  const localRentals = getLocalRentals();

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">ALL CAB ROUTES</div>
              <h1>Outstation Cab Routes, One-Way Cabs &amp; Local Rentals</h1>
              <p>
                One-way, round-trip &amp; local rentals — find the right ride at the
                right price.
              </p>
            </div>
            <div className="heroEmoji">🚖</div>
          </div>
        </div>
      </section>

      {/* Interactive tabs and search (client component) */}
      <AllRoutesClient
        oneWayRoutes={oneWayRoutes}
        roundTripRoutes={roundTripRoutes}
        localRentals={localRentals}
      />

      {/* 
        Server-rendered SEO content section.
        This ensures crawlable factual data exists in the initial HTML
        even though the interactive tabs are client-side rendered.
      */}
      <section className="section white" aria-label="Route overview">
        <div className="container" style={{ maxWidth: "960px" }}>

          {/* One-Way Routes summary */}
          <div style={{ marginBottom: "48px" }}>
            <div className="head">
              <div>
                <div className="ey">ONE-WAY CABS</div>
                <h2>One-Way Cab Routes</h2>
              </div>
              <p>
                {oneWayRoutes.length} intercity routes available. Private AC cabs with
                doorstep pickup.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              {oneWayRoutes.map((r) => (
                <a
                  key={`${r.from}-${r.to}`}
                  href={`/cabs/${r.from.toLowerCase()}-to-${r.to.toLowerCase()}`}
                  className="panel"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "14px 18px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--g)" }}>
                    {r.from} → {r.to}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                    From {formatINR(r.fare)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Round-Trip Routes summary */}
          {roundTripRoutes.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <div className="head">
                <div>
                  <div className="ey">ROUND TRIPS</div>
                  <h2>Round-Trip Cab Routes</h2>
                </div>
                <p>
                  Round-trip options available for select popular routes. Fixed pricing
                  for outbound and return travel.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                {roundTripRoutes.map((r) => (
                  <div
                    key={`rt-${r.from}-${r.to}`}
                    className="panel"
                    style={{ padding: "14px 18px" }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "var(--g)",
                        display: "block",
                      }}
                    >
                      {r.from} ⇄ {r.to}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      From {formatINR(r.fare)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Local Rentals summary */}
          {localRentals.length > 0 && (
            <div>
              <div className="head">
                <div>
                  <div className="ey">LOCAL RENTALS</div>
                  <h2>Local Hourly Cab Rentals</h2>
                </div>
                <p>
                  Hourly cab rental plans for local city travel. Pay for the time and
                  kilometres you use.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                  marginTop: "20px",
                }}
              >
                {localRentals.map((vehicle) => (
                  <div key={vehicle.vehicle} className="panel" style={{ padding: "20px 22px" }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "var(--g)",
                        marginBottom: "12px",
                      }}
                    >
                      {vehicle.vehicle}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {vehicle.plans.map((plan) => (
                        <div
                          key={plan.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "14px",
                            borderBottom: "1px solid #e2e8df",
                            paddingBottom: "6px",
                          }}
                        >
                          <span style={{ color: "var(--muted)" }}>
                            {plan.hours} hrs / {plan.km} km
                          </span>
                          <span style={{ fontWeight: 700, color: "var(--g)" }}>
                            {formatINR(plan.fare)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <Link
                  href="/rentals"
                  className="btn green"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  View Full Local Rental Packages &amp; Fares →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
