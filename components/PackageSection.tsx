import Link from "next/link";
import { formatINR, priceAmount, getPackageDestination } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import type { TourPackage } from "@/types";
import Image from "next/image";

/* Category → stock image map */
const categoryImageMap: Record<string, string> = {
  mahabaleshwar: siteConfig.stockImages.maha,
  goa: siteConfig.stockImages.road,
  konkan: siteConfig.stockImages.highway,
  ashtavinayak: siteConfig.stockImages.lonavala,
  jyotirlinga: siteConfig.stockImages.city,
};

/* Category → emoji for fallback display */
const categoryEmojiMap: Record<string, string> = {
  mahabaleshwar: "🏔️",
  goa: "🏖️",
  konkan: "🌊",
  ashtavinayak: "🙏",
  jyotirlinga: "🕉️",
};

interface PackageCardProps {
  pkg: TourPackage & { categorySlug?: string };
}

export function PackageCard({ pkg }: PackageCardProps) {
  const start = Math.min(
    priceAmount(pkg.prices.sedan),
    priceAmount(pkg.prices.ertiga),
    priceAmount(pkg.prices.crysta)
  );
  const copy = pkg.description || pkg.best_for;
  const categorySlug = pkg.categorySlug || "mahabaleshwar";
  const bgImage = pkg.image || categoryImageMap[categorySlug] || siteConfig.stockImages.road;
  const destination = getPackageDestination(pkg);
  const emoji = categoryEmojiMap[categorySlug] || "📦";

  return (
    <div className="card">
      <div className="art relative overflow-hidden bg-[#e5ede8]">
        {bgImage && (
          <Image
            src={bgImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover"
          />
        )}
      </div>
      <div className="body">
        <div className="ey">
          {pkg.route.from.toUpperCase()} → {destination.toUpperCase()}
        </div>
        <h3>{pkg.title}{pkg.variant ? ` — ${pkg.variant}` : ""}</h3>
        <p>
          <strong>{pkg.duration.label}</strong>{copy ? ` · ${copy}` : ""}
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
            <PackageCard key={`${p.categorySlug}-${p.id}`} pkg={p} />
          ))}
        </div>
        {packages.length > 8 && (
          <div className="text-center mt-8">
            <Link className="btn dark" href="/packages">
              View all packages →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
