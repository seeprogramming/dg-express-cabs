import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import type { AirportInfo } from "@/types";

interface AirportTransfersProps {
  airports: AirportInfo[];
}

export default function AirportTransfers({ airports }: AirportTransfersProps) {
  return (
    <section className="section soft" id="airports">
      <div className="container">
        <div className="head">
          <div>
            <div className="ey">AIRPORT TRANSFERS</div>
            <h2>Flights are stressful. Your ride shouldn&apos;t be.</h2>
          </div>
          <p>Pre-book pickup or drop with luggage-friendly vehicle options.</p>
        </div>
        <div className="airgrid" id="airGrid">
          {airports.map((a) => (
            <div className="airport" key={a.code}>
              <div
                className="art"
                style={{
                  height: "130px",
                  margin: "-22px -22px 16px",
                  backgroundImage: `url(${a.image || siteConfig.stockImages.airport})`,
                }}
              />
              <span className="code">{a.code}</span>
              <div className="ey">{a.city.toUpperCase()}</div>
              <h3>{a.city} Airport Transfer</h3>
              <p>
                {a.description ||
                  "Pre-booked pickup or drop with comfortable, luggage-friendly cab options."}
              </p>
              <div className="price">
                <small>Dummy fare from</small>
                <b>{formatINR(a.fare)}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
