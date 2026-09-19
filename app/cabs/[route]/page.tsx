import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import CabSearch from "@/components/CabSearch";
import InclusionExclusion from "@/components/InclusionExclusion";
import { getRoutes, getVehicles, findRoute, parseRouteSlug } from "@/lib/routes";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ route: string }>;
}

export async function generateStaticParams() {
  const routes = getRoutes();
  return routes.map((r) => ({
    route: `${r.from.toLowerCase()}-to-${r.to.toLowerCase()}`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { route } = await params;
  const parsed = parseRouteSlug(route);
  if (!parsed) {
    return { title: "Cab Route | RelaxCabs" };
  }
  const routeData = findRoute(parsed.from, parsed.to);
  const startingFare = routeData ? ` Starting from ${formatINR(routeData.fare)}.` : "";

  return {
    title: `${parsed.from} to ${parsed.to} Cab Service`,
    description: `Book reliable private AC cabs from ${parsed.from} to ${parsed.to}.${startingFare} Choose Sedan, Ertiga, or Crysta with professional drivers and doorstep pickup.`,
    openGraph: {
      title: `${parsed.from} to ${parsed.to} Cab | RelaxCabs`,
      description: `Book comfortable outstation cabs for ${parsed.from} to ${parsed.to}. Transparent pricing and 24x7 support.`,
    },
  };
}

export default async function RoutePage({ params }: Props) {
  const { route } = await params;
  const parsed = parseRouteSlug(route);
  if (!parsed) {
    notFound();
  }

  const routeData = findRoute(parsed.from, parsed.to);
  const vehicles = getVehicles();

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">OUTSTATION CAB ROUTE</div>
              <h1>
                {parsed.from} to {parsed.to}
                <br />
                cab service.
              </h1>
              <p>
                {routeData
                  ? `Comfortable, sanitized private cabs starting from ${formatINR(
                      routeData.fare
                    )} for Sedan. Doorstep pickup and drop.`
                  : `Book premium private cabs with instant pricing and WhatsApp booking.`}
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <a className="btn green" href="#booking">
                  Check available cabs
                </a>
                <Link className="btn outline" href="/#rides">
                  All popular rides
                </Link>
              </div>
            </div>
            <div className="heroEmoji">🚖</div>
          </div>
        </div>
      </section>

      {/* Pre-filled Cab Search */}
      <CabSearch
        vehicles={vehicles}
        initialFrom={parsed.from}
        initialTo={parsed.to}
      />

      {/* Route Information & Inclusions */}
      <section className="section white">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="head">
            <div>
              <div className="ey">TRAVEL INFORMATION</div>
              <h2>Why book {parsed.from} to {parsed.to} with RelaxCabs?</h2>
            </div>
          </div>
          <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "24px" }}>
            Whether traveling for business, family vacation, or leisure, RelaxCabs provides
            well-maintained air-conditioned vehicles driven by experienced chauffeurs. Enjoy fixed,
            transparent fares with no hidden surcharges.
          </p>
          <InclusionExclusion />
        </div>
      </section>
    </main>
  );
}
