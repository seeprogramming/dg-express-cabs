import Link from "next/link";

export default function RouteRibbon() {
  return (
    <section className="routeRibbon">
      <div className="container">
        <Link className="routePill" href="/cabs/pune-to-mumbai">
          Pune → Mumbai
        </Link>
        <Link className="routePill" href="/packages/mahabaleshwar">
          Pune → Mahabaleshwar
        </Link>
        <Link className="routePill" href="/cabs/mumbai-to-nashik">
          Mumbai → Nashik
        </Link>
        <Link className="routePill" href="/cabs/pune-to-lonavala">
          Pune → Lonavala
        </Link>
        <Link className="routePill" href="/airports">
          Airport Transfers
        </Link>
        <Link className="routePill" href="/rentals">
          Local Rentals
        </Link>
      </div>
    </section>
  );
}
