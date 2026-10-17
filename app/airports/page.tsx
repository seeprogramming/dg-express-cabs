import type { Metadata } from "next";
import Link from "next/link";
import AirportTransfers from "@/components/AirportTransfers";
import CabSearch from "@/components/CabSearch";
import Breadcrumb from "@/components/Breadcrumb";
import { getAirports, getVehicles } from "@/lib/routes";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Airport Cab Transfers — Pune (PNQ), Mumbai (BOM), Nashik (ISK)",
  description:
    "Pre-book reliable airport cab transfers for Pune (PNQ), Mumbai (BOM), and Nashik (ISK). Luggage-friendly cabs, transparent pricing, and professional drivers.",
  alternates: {
    canonical: "/airports",
  },
  openGraph: {
    url: "https://dgexpresscabs.com/airports",
    title: "Airport Cab Transfers | D&G Express Cabs",
    description:
      "Pre-book airport pickup or drop for Pune (PNQ), Mumbai (BOM), and Nashik (ISK) with luggage-friendly cab options.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Airport Cab Transfers | D&G Express Cabs",
    description:
      "Pre-book airport pickup or drop for Pune, Mumbai, and Nashik airports with transparent pricing.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Airport Transfers",
      item: `${siteConfig.url}/airports`,
    },
  ],
};

export default function AirportsPage() {
  const airports = getAirports();
  const vehicles = getVehicles();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Airport Transfers" },
                ]}
              />
              <div className="ey">AIRPORT TRANSFERS</div>
              <h1>Airport Cab Transfers</h1>
              <p>
                Pre-book airport pickup or drop for Pune (PNQ), Mumbai
                (BOM), and Nashik (ISK) with luggage-friendly cab options.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <a className="btn green" href="#booking">
                  Book Airport Cab
                </a>
                <Link className="btn outline" href="/cabs">
                  Outstation Rides
                </Link>
              </div>
            </div>
            <div className="heroEmoji">✈️</div>
          </div>
        </div>
      </section>

      <AirportTransfers airports={airports} />

      <section id="booking">
        <CabSearch vehicles={vehicles} initialFrom="Pune" initialTo="Pune Airport (PNQ)" />
      </section>
    </main>
  );
}
