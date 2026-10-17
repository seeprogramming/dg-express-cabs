import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CabSearch from "@/components/CabSearch";
import { getLocalRentals, getVehicles } from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Local Cab Rentals with Driver — Hourly Packages",
  description:
    "Book chauffeur-driven local cab rentals with D&G Express Cabs. Transparent hourly packages for Sedan, SUV, and Innova Crysta: 4 hr / 40 km, 8 hr / 80 km, and 12 hr / 120 km.",
  alternates: {
    canonical: "/rentals",
  },
  openGraph: {
    url: `${siteConfig.url}/rentals`,
    title: "Local Cab Rentals with Driver | D&G Express Cabs",
    description:
      "Chauffeur-driven local hourly cab rentals. 4 hr / 40 km, 8 hr / 80 km, and 12 hr / 120 km packages for Sedan, SUV, and Crysta.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Cab Rentals with Driver | D&G Express Cabs",
    description:
      "Chauffeur-driven local hourly cab rentals. 4 hr, 8 hr, and 12 hr packages with transparent pricing.",
  },
};

export default function LocalRentalsPage() {
  const localRentals = getLocalRentals();
  const vehicles = getVehicles();

  const faqs = [
    {
      q: "What local cab rental packages are available?",
      a: "We offer three standard duration and kilometre packages: 4 hours / 40 km, 8 hours / 80 km, and 12 hours / 120 km.",
    },
    {
      q: "Which vehicles are available for local rental?",
      a: "Local cab rentals are available for Sedan (Dzire / Aura or similar), SUV (Ertiga / Rumion or similar), and Crysta (Innova Crysta).",
    },
    {
      q: "How much does a local cab rental cost?",
      a: "According to our verified rate schedule: Sedan packages are ₹1,575 (4 hr / 40 km), ₹2,100 (8 hr / 80 km), and ₹3,675 (12 hr / 120 km). SUV packages are ₹2,100 (4 hr / 40 km), ₹3,255 (8 hr / 80 km), and ₹4,725 (12 hr / 120 km). Crysta packages are ₹2,625 (4 hr / 40 km), ₹4,725 (8 hr / 80 km), and ₹6,300 (12 hr / 120 km).",
    },
    {
      q: "How can I book a local cab with D&G Express Cabs?",
      a: `You can use the booking form on this page, call us directly at ${siteConfig.phonePrimary}, or message us on WhatsApp at ${siteConfig.whatsappFormatted} to reserve your local rental cab.`,
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
        name: "Local Cab Rentals",
        item: `${siteConfig.url}/rentals`,
      },
    ],
  };

  // Compile offers directly from website-rates data
  const offersList = localRentals.flatMap((v) =>
    v.plans.map((p) => ({
      "@type": "Offer",
      name: `${v.vehicle} Local Rental (${p.hours} hr / ${p.km} km)`,
      priceCurrency: "INR",
      price: p.fare,
      description: `${v.vehicle} local rental package for ${p.hours} hours and ${p.km} km`,
    }))
  );

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Local Cab Rentals with Driver",
    serviceType: "Chauffeur-Driven Hourly Cab Rental",
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phonePrimary,
      url: siteConfig.url,
      address: siteConfig.address,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Local Cab Rental Packages",
      itemListElement: offersList,
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

      {/* Hero Section */}
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Local Cab Rentals" },
                ]}
              />
              <div className="ey">HOURLY CAB PACKAGES</div>
              <h1>Local Cab Rentals with Driver</h1>
              <p>
                Chauffeur-driven hourly cab rental packages for city travel,
                meetings, and local errands. Clear duration and kilometre packages
                with fixed fares.
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
                <a className="btn green" href="#pricing">
                  View Rental Fares
                </a>
                <a className="btn outline" href="#booking">
                  Book Local Cab
                </a>
                <Link className="btn outline" href="/cabs">
                  Outstation Rides
                </Link>
              </div>
            </div>
            <div className="heroEmoji">🚗</div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Cards / Table */}
      <section id="pricing" className="section white" aria-label="Local cab rental pricing">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="head">
            <div>
              <div className="ey">VERIFIED RATE SCHEDULE</div>
              <h2>Local Cab Rental Packages &amp; Fares</h2>
            </div>
            <p>
              Fixed fares based on duration and kilometres. All packages include a
              private AC vehicle and driver.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "20px",
              marginTop: "28px",
            }}
          >
            {localRentals.map((item) => (
              <div
                key={item.vehicle}
                className="panel"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  border: "1px solid var(--line, #e2e8df)",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    borderBottom: "2px solid #edf5e7",
                    paddingBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "var(--d, #082f2c)",
                      margin: 0,
                    }}
                  >
                    {item.vehicle}
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      background: "#edf5e7",
                      color: "var(--g, #1e7e34)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    Chauffeur-Driven
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  {item.plans.map((plan) => (
                    <div
                      key={plan.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 14px",
                        background: "#fafcf9",
                        borderRadius: "10px",
                        border: "1px solid #edf2eb",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--d, #082f2c)" }}>
                          {plan.hours} Hours / {plan.km} km
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--muted, #718079)" }}>
                          Package {plan.label}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: "18px", color: "var(--g, #1e7e34)" }}>
                          {formatINR(plan.fare)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "20px" }}>
                  <a
                    href="#booking"
                    className="btn green"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "10px 16px",
                      fontSize: "13px",
                      fontWeight: 700,
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    Book {item.vehicle}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Overview Table for accessibility and clarity */}
          <div style={{ marginTop: "36px", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f7f2", borderBottom: "2px solid #dde5db" }}>
                  <th style={{ padding: "12px 16px", color: "var(--d)" }}>Vehicle</th>
                  <th style={{ padding: "12px 16px", color: "var(--d)" }}>Duration</th>
                  <th style={{ padding: "12px 16px", color: "var(--d)" }}>Included Kilometres</th>
                  <th style={{ padding: "12px 16px", color: "var(--d)" }}>Fare</th>
                  <th style={{ padding: "12px 16px", color: "var(--d)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {localRentals.flatMap((v) =>
                  v.plans.map((p) => (
                    <tr
                      key={`${v.vehicle}-${p.label}`}
                      style={{ borderBottom: "1px solid #edf2eb" }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--d)" }}>
                        {v.vehicle}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                        {p.hours} hours
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                        {p.km} km
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--g)" }}>
                        {formatINR(p.fare)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <a
                          href="#booking"
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "var(--g)",
                            textDecoration: "none",
                          }}
                        >
                          Book →
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verified Vehicle Options */}
      <section className="section soft" aria-label="Available vehicle models">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="head">
            <div>
              <div className="ey">RENTAL VEHICLES</div>
              <h2>Vehicle Fleet for Local Rentals</h2>
            </div>
            <p>Comfortable AC vehicles driven by courteous, experienced chauffeurs.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {vehicles
              .filter((v) => ["Sedan", "SUV", "Innova Crysta"].includes(v.category))
              .map((v) => (
                <div key={v.category} className="panel" style={{ padding: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "30px" }}>{v.icon}</span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        background: "#edf5e7",
                        color: "var(--g)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {v.seats} Seats
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--d)",
                      margin: "12px 0 4px",
                    }}
                  >
                    {v.category}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 10px" }}>
                    Typical models: {v.model}
                  </p>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                    Luggage capacity: Up to {v.bags} standard bags
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Interactive Booking Section */}
      <section id="booking" aria-label="Book local rental cab">
        <CabSearch vehicles={vehicles} initialMode="local" />
      </section>

      {/* Internal Cross-Linking Section */}
      <section className="section white" aria-label="Other services">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="head">
            <div>
              <div className="ey">EXPLORE MORE SERVICES</div>
              <h2>Looking for Other Cab Services?</h2>
            </div>
            <p>D&amp;G Express Cabs also provides one-way intercity cabs, round-trips, and airport transfers.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <Link
              href="/cabs"
              className="panel"
              style={{
                padding: "20px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🚖</span>
              <strong style={{ fontSize: "16px", color: "var(--d)" }}>Outstation Cab Routes</strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Intercity one-way and round-trip routes between Pune, Mumbai, Nashik, and beyond.
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--g)", marginTop: "6px" }}>
                View all cab routes →
              </span>
            </Link>

            <Link
              href="/airports"
              className="panel"
              style={{
                padding: "20px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "20px" }}>✈️</span>
              <strong style={{ fontSize: "16px", color: "var(--d)" }}>Airport Cab Transfers</strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Pre-book doorstep pickup and drop for Pune (PNQ), Mumbai (BOM), and Nashik (ISK) airports.
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--g)", marginTop: "6px" }}>
                View airport transfers →
              </span>
            </Link>

            <Link
              href="/packages"
              className="panel"
              style={{
                padding: "20px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🏞️</span>
              <strong style={{ fontSize: "16px", color: "var(--d)" }}>Tour Packages</strong>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                Curated multi-day holiday packages for Mahabaleshwar, Shirdi, Jyotirlinga, and more.
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--g)", marginTop: "6px" }}>
                Explore tour packages →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Visible FAQ */}
      <section className="section soft" aria-label="Frequently Asked Questions">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="head">
            <div>
              <div className="ey">FREQUENTLY ASKED QUESTIONS</div>
              <h2>Local Cab Rental FAQs</h2>
            </div>
            <p>Clear answers to common questions about our hourly cab rental service.</p>
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
              <div key={idx} className="panel" style={{ padding: "20px 24px" }}>
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
