import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <main>
      <section className="pageHero" style={{ minHeight: "65vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">404 — PAGE NOT FOUND</div>
              <h1>
                Lost your way?
                <br />
                <span>We&apos;ll get you back on track.</span>
              </h1>
              <p>
                The page you are looking for doesn&apos;t exist or has been moved. Explore our popular outstation routes, airport transfers, or tour packages below.
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px" }}>
                <Link className="btn green" href="/">
                  Home
                </Link>
                <Link className="btn outline" href="/cabs">
                  All Cab Routes
                </Link>
                <Link className="btn outline" href="/airports">
                  Airport Transfers
                </Link>
                <Link className="btn outline" href="/packages">
                  Tour Packages
                </Link>
              </div>

              <div style={{ marginTop: "28px", fontSize: "14px", color: "var(--muted)" }}>
                Need instant assistance? Call{" "}
                <a href={siteConfig.phoneCallUrl} style={{ color: "var(--g)", fontWeight: 700 }}>
                  {siteConfig.phonePrimary}
                </a>{" "}
                or{" "}
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                    "Hi D&G Express Cabs, I need help finding a cab ride."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--g)", fontWeight: 700 }}
                >
                  chat on WhatsApp
                </a>.
              </div>
            </div>
            <div className="heroEmoji">🧭</div>
          </div>
        </div>
      </section>
    </main>
  );
}
