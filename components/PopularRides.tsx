import Link from "next/link";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import type { RouteInfo } from "@/types";

interface PopularRidesProps {
  rides: RouteInfo[];
}

function getRouteImage(route: RouteInfo): string {
  const t = (route.to || "").toLowerCase();
  if (t.includes("lonavala")) return siteConfig.stockImages.lonavala;
  if (t.includes("mahabaleshwar")) return siteConfig.stockImages.maha;
  if (t.includes("mumbai")) return siteConfig.stockImages.city;
  return siteConfig.stockImages.highway;
}

export default function PopularRides({ rides }: PopularRidesProps) {
  return (
    <section className="section white" id="rides">
      <div className="container">
        <div className="head">
          <div>
            <div className="ey">POPULAR RIDES</div>
            <h2>Routes people love.</h2>
          </div>
          <p>Useful intercity connections with simple starting fares.</p>
        </div>
        <div className="grid4" id="ridesGrid">
          {rides.map((r) => {
            const slug = `${r.from.toLowerCase()}-to-${r.to.toLowerCase()}`;
            return (
              <div className="card" key={`${r.from}-${r.to}`}>
                <div
                  className="art"
                  style={{ backgroundImage: `url(${getRouteImage(r)})` }}
                />
                <div className="body">
                  <h3>
                    {r.from} → {r.to}
                  </h3>
                  <p>One-way · Sedan starting fare</p>
                  <div className="bottom">
                    <div className="price">
                      <small>Starting at</small>
                      <b>{formatINR(r.fare)}</b>
                    </div>
                    <Link className="btn green" href={`/cabs/${slug}`}>
                      View cabs
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
