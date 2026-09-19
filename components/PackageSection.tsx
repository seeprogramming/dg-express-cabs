import Link from "next/link";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import type { TourPackage } from "@/types";

interface PackageCardProps {
  pkg: TourPackage & { categorySlug?: string };
}

export function PackageCard({ pkg }: PackageCardProps) {
  const start = Math.min(pkg.prices.sedan, pkg.prices.ertiga, pkg.prices.crysta);
  const copy = pkg.description || pkg.best_for || "Mahabaleshwar tour package";
  const bgImage = pkg.id.includes("fort")
    ? siteConfig.stockImages.road
    : siteConfig.stockImages.maha;
  const categorySlug = pkg.categorySlug || "mahabaleshwar";

  return (
    <div className="card">
      <div className="art" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="body">
        <div className="ey">
          {pkg.route.from.toUpperCase()} → MAHABALESHWAR
        </div>
        <h3>{pkg.title}</h3>
        <p>
          {pkg.duration.label} · {copy}
        </p>
        <div className="bottom">
          <div className="price">
            <small>Package from</small>
            <b>{formatINR(start)}</b>
          </div>
          <Link
            className="btn green"
            href={`/packages/${categorySlug}/${pkg.id}`}
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

interface PackageSectionProps {
  packages: (TourPackage & { categorySlug?: string })[];
  title?: string;
  subtitle?: string;
}

export default function PackageSection({
  packages,
  title = "Turn the ride into a trip.",
  subtitle = "Each package opens a dedicated details page with itinerary, inclusions, booking and WhatsApp actions.",
}: PackageSectionProps) {
  return (
    <section className="section white" id="packages">
      <div className="container">
        <div className="head">
          <div>
            <div className="ey">CURATED GETAWAYS</div>
            <h2>{title}</h2>
          </div>
          <p>{subtitle}</p>
        </div>
        <div className="grid4" id="pkgGrid">
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
