import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import CabSearch from "@/components/CabSearch";
import InclusionExclusion from "@/components/InclusionExclusion";
import RoutePricingTable from "@/components/RoutePricingTable";
import Breadcrumb from "@/components/Breadcrumb";
import RouteFAQ, { buildFaqJsonLd } from "@/components/RouteFAQ";
import { getRoutes, getVehicles, findRoute, parseRouteSlug, routeSlug } from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import websiteRates from "@/data/website-rates.json";
import type { WebsiteRateRoute } from "@/lib/routes";

interface Props {
  params: Promise<{ route: string }>;
}

export async function generateStaticParams() {
  const routes = getRoutes();
  return routes.map((r) => ({
    route: `${r.from.toLowerCase().replace(/\s+/g, "-")}-to-${r.to.toLowerCase().replace(/\s+/g, "-")}`,
  }));
}

/** Package categories that naturally connect to verified route destinations */
const DESTINATION_PACKAGE_MAP: Record<string, { slug: string; label: string }> = {
  mahabaleshwar: { slug: "mahabaleshwar", label: "Mahabaleshwar Tour Packages" },
};

/** Check if a city name relates to a package category */
function getRelatedPackage(
  city: string
): { slug: string; label: string } | null {
  const norm = city.trim().toLowerCase();
  for (const [key, val] of Object.entries(DESTINATION_PACKAGE_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }
  return null;
}

/** Look up factual fares for a route */
function getRouteFares(
  from: string,
  to: string
): Record<string, number> | null {
  const norm = (v: string) => v.trim().toLowerCase();
  const routes = websiteRates.one_way as WebsiteRateRoute[];
  const match = routes.find(
    (r) => norm(r.from) === norm(from) && norm(r.to) === norm(to)
  );
  return match ? (match.fares as Record<string, number>) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { route } = await params;
  const parsed = parseRouteSlug(route);
  if (!parsed) {
    return {
      title: "Cab Route | D&G Express Cabs",
      robots: { index: false, follow: true },
    };
  }

  const { from, to } = parsed;
  const routeData = findRoute(from, to);
  const startingFare = routeData
    ? ` Starting from ${formatINR(routeData.fare)}.`
    : "";
  const canonicalPath = `/cabs/${route.toLowerCase()}`;

  return {
    title: `${from} to ${to} Cab | One Way Cab Booking`,
    description: `Book a private ${from} to ${to} cab with D&G Express Cabs.${startingFare} Choose Hatchback, Sedan, SUV, or Innova with professional drivers and doorstep pickup.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      url: `${siteConfig.url}${canonicalPath}`,
      title: `${from} to ${to} Cab | D&G Express Cabs`,
      description: `Book a reliable one-way cab from ${from} to ${to}. Transparent pricing, private AC cabs, and WhatsApp booking support.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${from} to ${to} Cab | D&G Express Cabs`,
      description: `Book a reliable one-way cab from ${from} to ${to}. Transparent pricing and WhatsApp booking.`,
    },
  };
}

export default async function RoutePage({ params }: Props) {
  const { route } = await params;
  const parsed = parseRouteSlug(route);
  if (!parsed) {
    notFound();
  }

  const { from, to } = parsed;
  const routeData = findRoute(from, to);
  const vehicles = getVehicles();
  const allRoutes = getRoutes();

  // Get factual fares for this route
  const fares = getRouteFares(from, to);
  const hasPricing = !!fares;

  // Vehicle names and lowest fare for FAQ
  const vehicleOrder = ["hatchback", "sedan", "suv", "innova_kia_carens", "innova_crysta"] as const;
  const vehicleLabels = websiteRates.vehicle_labels as Record<string, string>;
  const vehicleNames = fares
    ? vehicleOrder
        .filter((k) => fares[k] != null)
        .map((k) => vehicleLabels[k] || k)
    : [];
  const lowestFare = fares
    ? Math.min(...Object.values(fares).filter((v) => v > 0))
    : 0;

  // Check if reverse route exists in data
  const reverseSlug = routeSlug(to, from);
  const reverseRouteExists = allRoutes.some(
    (r) =>
      r.from.toLowerCase() === to.toLowerCase() &&
      r.to.toLowerCase() === from.toLowerCase()
  );

  // Package internal link
  const relatedPackage = getRelatedPackage(to) || getRelatedPackage(from);

  // Service structured data (JSON-LD)
  const serviceJsonLd = hasPricing
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${from} to ${to} Cab Service`,
        provider: {
          "@type": "AutoRental",
          name: "D&G Express Cabs",
          url: siteConfig.url,
          telephone: "+917030813082",
        },
        serviceType: "Cab / Taxi",
        areaServed: [from, to],
        url: `${siteConfig.url}/cabs/${route.toLowerCase()}`,
        offers: vehicleOrder
          .filter((k) => fares![k] != null)
          .map((k) => ({
            "@type": "Offer",
            name: vehicleLabels[k] || k,
            price: fares![k],
            priceCurrency: "INR",
          })),
      }
    : null;

  // BreadcrumbList JSON-LD
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
        name: "Cabs",
        item: `${siteConfig.url}/cabs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${from} to ${to} Cab`,
        item: `${siteConfig.url}/cabs/${route.toLowerCase()}`,
      },
    ],
  };

  // FAQ JSON-LD (only when pricing exists)
  const faqJsonLd =
    hasPricing && lowestFare > 0
      ? buildFaqJsonLd(from, to, vehicleNames, lowestFare)
      : null;

  return (
    <main>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {serviceJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Hero */}
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Cabs", href: "/cabs" },
                  { label: `${from} to ${to} Cab` },
                ]}
              />
              <div className="ey">OUTSTATION CAB</div>
              <h1>
                {from} to {to} Cab
              </h1>
              <p>
                {routeData
                  ? `Private AC cabs starting from ${formatINR(
                      routeData.fare
                    )}. Doorstep pickup and drop with professional drivers.`
                  : `Book private AC cabs with instant pricing and WhatsApp booking.`}
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <a className="btn green" href="#pricing">
                  View Cab Fares
                </a>
                <a className="btn outline" href="#booking">
                  Book a Cab
                </a>
              </div>
            </div>
            <div className="heroEmoji">🚖</div>
          </div>
        </div>
      </section>

      {/* Server-rendered Pricing Table */}
      <RoutePricingTable from={from} to={to} />

      {/* Pre-filled Cab Search */}
      <section id="booking">
        <CabSearch
          vehicles={vehicles}
          initialFrom={from}
          initialTo={to}
        />
      </section>

      {/* Route Information */}
      <section className="section white">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="head">
            <div>
              <div className="ey">ABOUT THIS ROUTE</div>
              <h2>
                Cab Options for {from} to {to}
              </h2>
            </div>
          </div>
          <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "24px" }}>
            D&G Express Cabs offers private chauffeur-driven cabs from {from} to{" "}
            {to}. Whether you are travelling for work or leisure, choose from a
            range of well-maintained air-conditioned vehicles with clear, transparent pricing.
          </p>
          <InclusionExclusion />

          {/* Reverse Route Link */}
          {reverseRouteExists && (
            <div
              className="panel"
              style={{ marginTop: "24px", padding: "18px 22px" }}
            >
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
                <strong style={{ color: "var(--g)" }}>Travelling back?</strong>{" "}
                See our{" "}
                <Link
                  href={`/cabs/${reverseSlug}`}
                  style={{ color: "var(--g)", fontWeight: 700 }}
                >
                  {to} to {from} cab
                </Link>{" "}
                options and fares.
              </p>
            </div>
          )}

          {/* Package Link */}
          {relatedPackage && (
            <div
              className="panel"
              style={{ marginTop: "16px", padding: "18px 22px" }}
            >
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
                <strong style={{ color: "var(--g)" }}>Planning a trip?</strong>{" "}
                Explore our{" "}
                <Link
                  href={`/packages/${relatedPackage.slug}`}
                  style={{ color: "var(--g)", fontWeight: 700 }}
                >
                  {relatedPackage.label}
                </Link>{" "}
                with complete day-wise itineraries and vehicle pricing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {hasPricing && lowestFare > 0 && (
        <RouteFAQ
          from={from}
          to={to}
          vehicleNames={vehicleNames}
          lowestFare={lowestFare}
          hasData={true}
        />
      )}
    </main>
  );
}
