import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CabSearch from "@/components/CabSearch";
import {
  getAirports,
  findAirportBySlug,
  airportSlug,
  getVehicles,
  getRoutesFromCity,
  routeSlug,
} from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";

interface AirportPageProps {
  params: Promise<{ airport: string }>;
}

export async function generateStaticParams() {
  const airports = getAirports();
  return airports.map((a) => ({
    airport: airportSlug(a.city),
  }));
}

export async function generateMetadata({
  params,
}: AirportPageProps): Promise<Metadata> {
  const { airport: slug } = await params;
  const airport = findAirportBySlug(slug);

  if (!airport) {
    return {
      title: "Airport Transfers | D&G Express Cabs",
    };
  }

  const title = `${airport.city} Airport Cab Transfers (${airport.code}) — Booking & Fares`;
  const description = `Book ${airport.city} Airport (${airport.code}) cab transfers with D&G Express Cabs. Pre-booked airport pickup or drop starting from ${formatINR(airport.fare)} with comfortable, luggage-friendly cab options.`;
  const canonicalUrl = `${siteConfig.url}/airports/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AirportDetailPage({ params }: AirportPageProps) {
  const { airport: slug } = await params;
  const airport = findAirportBySlug(slug);

  if (!airport) {
    notFound();
  }

  const vehicles = getVehicles();
  const connectedRoutes = getRoutesFromCity(airport.city);

  const faqs = [
    {
      q: `Can I book a cab for ${airport.city} Airport (${airport.code})?`,
      a: `Yes, D&G Express Cabs provides pre-booked cab transfers for ${airport.city} Airport (${airport.code}) for airport pickups and drops.`,
    },
    {
      q: `What is the starting fare for ${airport.city} Airport cab service?`,
      a: `The verified starting fare for ${airport.city} Airport cab transfers begins from ${formatINR(airport.fare)} as listed in our verified airport rate schedule. This fare applies to airport transfers; outstation intercity journeys are priced separately based on route rates.`,
    },
    {
      q: "How can I book an airport cab with D&G Express Cabs?",
      a: `You can use the booking search form on this page, call us at ${siteConfig.phonePrimary}, or message us on WhatsApp at ${siteConfig.whatsappFormatted} to reserve your airport cab.`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Airport Transfers",
        item: `${siteConfig.url}/airports`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${airport.city} Airport (${airport.code})`,
        item: `${siteConfig.url}/airports/${slug}`,
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${airport.city} Airport Cab Transfers`,
    serviceType: "Airport Cab Transfer",
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phonePrimary,
      url: siteConfig.url,
      address: siteConfig.address,
    },
    areaServed: {
      "@type": "City",
      name: airport.city,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: airport.fare,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Page Hero */}
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Airport Transfers", href: "/airports" },
                  { label: `${airport.city} Airport (${airport.code})` },
                ]}
              />
              <div className="ey">
                AIRPORT CAB SERVICE · {airport.code}
              </div>
              <h1>{airport.city} Airport Cab Transfers</h1>
              <p>
                {airport.description ||
                  `Pre-booked pickup or drop for ${airport.city} Airport (${airport.code}) with luggage-friendly cab options and transparent pricing.`}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "18px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <a className="btn green" href="#booking">
                  Book Airport Cab
                </a>
                <Link className="btn outline" href="/airports">
                  All Airports
                </Link>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--g)",
                    background: "#edf5e7",
                    padding: "8px 14px",
                    borderRadius: "8px",
                  }}
                >
                  Starting from {formatINR(airport.fare)}
                </span>
              </div>
            </div>
            <div className="heroEmoji">✈️</div>
          </div>
        </div>
      </section>

      {/* Service & Fare Overview */}
      <section className="section white" aria-label="Airport details">
        <div className="container" style={{ maxWidth: "960px" }}>
          <div className="head">
            <div>
              <div className="ey">TRANSFER OVERVIEW</div>
              <h2>{airport.city} Airport Cab Transfer Details</h2>
            </div>
            <p>
              Pre-book airport rides to or from {airport.city} Airport ({airport.code}).
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <div className="panel" style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                Airport Name
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--d)", marginTop: "4px" }}>
                {airport.city} Airport
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                IATA Code: <strong>{airport.code}</strong>
              </div>
            </div>

            <div className="panel" style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                City Served
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--d)", marginTop: "4px" }}>
                {airport.city}
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Pickups &amp; drops across {airport.city}
              </div>
            </div>

            <div className="panel" style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                Airport Starting Fare
              </div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--g)", marginTop: "4px" }}>
                {formatINR(airport.fare)}
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Verified fare for {airport.city} Airport transfers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Airport Transfer Features */}
      <section className="section soft" aria-label="Airport cab service features">
        <div className="container" style={{ maxWidth: "960px" }}>
          <div className="head">
            <div>
              <div className="ey">AIRPORT CAB SERVICE</div>
              <h2>Comfortable &amp; Luggage-Friendly Airport Cabs</h2>
            </div>
            <p>
              Pre-booked pickup or drop with comfortable, luggage-friendly cab options for {airport.city} Airport ({airport.code}).
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <div className="panel" style={{ padding: "20px 22px" }}>
              <span style={{ fontSize: "28px" }}>🧳</span>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--d)", margin: "12px 0 4px" }}>
                Luggage-Friendly Cabs
              </h3>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
                Pre-book dedicated private cabs with boot space suited for your airport luggage and travel party.
              </p>
            </div>

            <div className="panel" style={{ padding: "20px 22px" }}>
              <span style={{ fontSize: "28px" }}>✈️</span>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--d)", margin: "12px 0 4px" }}>
                Direct Airport Pickup &amp; Drop
              </h3>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
                Chauffeur-driven point-to-point airport transfers between {airport.city} Airport and your destination.
              </p>
            </div>

            <div className="panel" style={{ padding: "20px 22px" }}>
              <span style={{ fontSize: "28px" }}>🏷️</span>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--d)", margin: "12px 0 4px" }}>
                Transparent Pricing
              </h3>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
                Verified starting fare from {formatINR(airport.fare)} for {airport.city} Airport transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Outstation Routes from the City */}
      {connectedRoutes.length > 0 && (
        <section className="section white" aria-label="Intercity connections">
          <div className="container" style={{ maxWidth: "960px" }}>
            <div className="head">
              <div>
                <div className="ey">OUTSTATION ROUTES FROM {airport.city.toUpperCase()}</div>
                <h2>Popular Outstation Cab Routes from {airport.city}</h2>
              </div>
              <p>
                Looking for intercity travel beyond {airport.city}? Explore verified outstation cab routes originating from {airport.city} city. Note that outstation fares shown below are city-to-city route rates.
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
              {connectedRoutes.map((r) => (
                <Link
                  key={`${r.from}-${r.to}`}
                  href={`/cabs/${routeSlug(r.from, r.to)}`}
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
                </Link>
              ))}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Link
                href="/cabs"
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--g)",
                  textDecoration: "none",
                }}
              >
                View all intercity cab routes →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section id="booking" aria-label="Book cab">
        <CabSearch
          vehicles={vehicles}
          initialFrom={airport.city}
          initialTo={`${airport.city} Airport (${airport.code})`}
        />
      </section>

      {/* Visible FAQ */}
      <section className="section soft" aria-label="Frequently Asked Questions">
        <div className="container" style={{ maxWidth: "960px" }}>
          <div className="head">
            <div>
              <div className="ey">FREQUENTLY ASKED QUESTIONS</div>
              <h2>{airport.city} Airport Cab FAQs</h2>
            </div>
            <p>Common questions about booking cabs for {airport.city} Airport.</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="panel"
                style={{ padding: "20px 24px" }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--d)",
                    marginBottom: "8px",
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--muted)",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
