import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer>
      <div className="container foot">
        <div>
          <Link className="logo" style={{ color: "white" }} href="/">
            Relax<b>Cabs</b>
          </Link>
          <p>{siteConfig.description}</p>
        </div>
        <div>
          <strong>SERVICES</strong>
          <p>
            <Link href="/#rides">Outstation Rides</Link>
          </p>
          <p>
            <Link href="/airports">Airport Transfers</Link>
          </p>
          <p>
            <Link href="/packages">Tour Packages</Link>
          </p>
        </div>
        <div>
          <strong>SUPPORT</strong>
          <p>{siteConfig.phoneFormatted}</p>
          <p>{siteConfig.supportHours}</p>
        </div>
      </div>
    </footer>
  );
}
