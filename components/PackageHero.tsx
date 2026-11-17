import Link from "next/link";
import FallbackImage from "@/components/FallbackImage";
import Breadcrumb from "@/components/Breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PackageHeroProps {
  from: string;
  destination: string;
  durationLabel: string;
  title: string;
  intro: string;
  heroImage?: string;
  fallbackImage?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PackageHero({
  from,
  destination,
  durationLabel,
  title,
  intro,
  heroImage,
  fallbackImage,
  breadcrumbs,
}: PackageHeroProps) {
  return (
    <section className="pageHero">
      <div className="container">
        <div className="wrap relative overflow-hidden bg-[#0a3731] !bg-none">
          <FallbackImage
            src={heroImage || fallbackImage || "https://images.pexels.com/photos/9420512/pexels-photo-9420512.jpeg?auto=compress&cs=tinysrgb&w=1400"}
            fallbackSrc={fallbackImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a3731f5] to-[#0a373194] z-10" />

          <div className="relative z-20">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} />
            )}
            <div className="ey">
              {from.toUpperCase()} → {destination.toUpperCase()} · {durationLabel}
            </div>
            <h1>{title}</h1>
            <p>{intro}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
              <a className="btn green" href="#book">
                Book this package
              </a>
              <Link className="btn outline" href="/packages">
                All packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
