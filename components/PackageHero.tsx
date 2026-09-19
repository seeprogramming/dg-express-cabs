import Link from "next/link";

interface PackageHeroProps {
  from: string;
  destination: string;
  durationLabel: string;
  title: string;
  intro: string;
}

export default function PackageHero({
  from,
  destination,
  durationLabel,
  title,
  intro,
}: PackageHeroProps) {
  return (
    <section className="pageHero">
      <div className="container">
        <div className="wrap">
          <div>
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
          <div className="heroEmoji">🏞️</div>
        </div>
      </div>
    </section>
  );
}
