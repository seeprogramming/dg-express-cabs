import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";

interface PackageHeroProps {
  from: string;
  destination: string;
  durationLabel: string;
  title: string;
  intro: string;
  heroImage?: string;
}

export default function PackageHero({
  from,
  destination,
  durationLabel,
  title,
  intro,
  heroImage,
}: PackageHeroProps) {
  return (
    <section className="pageHero">
      <div className="container">
        <div className="wrap relative overflow-hidden bg-[#0a3731] !bg-none">
          {heroImage && (
            <ImageWithFallback 
              src={heroImage} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover z-0"
              fallback="https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1400&q=82"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a3731f5] to-[#0a373194] z-10" />
          
          <div className="relative z-20">
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
