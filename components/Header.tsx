import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Header() {
  return (
    <header>
      <nav className="container">
        <Link className="logo" href="/">
          Relax<b>Cabs</b>
        </Link>
        {siteConfig.nav.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link className="navcta" href="/#booking">
          Book a Ride
        </Link>
      </nav>
    </header>
  );
}
