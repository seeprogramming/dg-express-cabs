import type { Metadata } from "next";
import AllRoutesClient from "@/components/AllRoutesClient";
import { getRoutes, getRoundTripRoutes, getLocalRentals } from "@/lib/routes";

export const metadata: Metadata = {
  title: "All Cab Routes — One Way, Round Trip & Local Rentals",
  description:
    "Explore all our available one-way intercity routes, round-trip connections, and local hourly rental plans with transparent pricing.",
};

export default function AllRoutesPage() {
  const oneWayRoutes = getRoutes();
  const roundTripRoutes = getRoundTripRoutes();
  const localRentals = getLocalRentals();

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">ALL ROUTES</div>
              <h1>
                Every route,
                <br />
                one place.
              </h1>
              <p>
                One-way, round-trip & local rentals — find the right ride at the
                right price.
              </p>
            </div>
            <div className="heroEmoji">🚖</div>
          </div>
        </div>
      </section>

      <AllRoutesClient
        oneWayRoutes={oneWayRoutes}
        roundTripRoutes={roundTripRoutes}
        localRentals={localRentals}
      />
    </main>
  );
}
