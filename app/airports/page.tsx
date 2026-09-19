import type { Metadata } from "next";
import Link from "next/link";
import AirportTransfers from "@/components/AirportTransfers";
import CabSearch from "@/components/CabSearch";
import { getAirports, getVehicles } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Airport Cabs & Transfers — Pune (PNQ), Mumbai (BOM), Nashik (ISK)",
  description:
    "Pre-book on-time airport transfers with flight tracking and transparent pricing. Hatchback, Sedan, and SUV options with dedicated luggage space.",
};

export default function AirportsPage() {
  const airports = getAirports();
  const vehicles = getVehicles();

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">AIRPORT TRANSFERS</div>
              <h1>
                Flights are stressful.
                <br />
                Your ride shouldn&apos;t be.
              </h1>
              <p>
                Pre-book guaranteed airport pickup or drop for Pune (PNQ), Mumbai (BOM), and Nashik
                (ISK) with luggage-friendly cab options.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <a className="btn green" href="#booking">
                  Book Airport Cab
                </a>
                <Link className="btn outline" href="/#rides">
                  Outstation Rides
                </Link>
              </div>
            </div>
            <div className="heroEmoji">✈️</div>
          </div>
        </div>
      </section>

      <AirportTransfers airports={airports} />

      <CabSearch vehicles={vehicles} initialFrom="Pune" initialTo="Pune Airport (PNQ)" />
    </main>
  );
}
