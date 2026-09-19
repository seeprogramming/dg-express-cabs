import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer>
      <div className="container foot">
        <div>
          <Link className="logo" style={{ color: "white" }} href="/">
            D&amp;G <b>Express Cabs</b>
          </Link>
          <p>{siteConfig.description}</p>
          <div className="mt-3 text-xs text-[#8aa39b] leading-relaxed">
            <p className="flex items-start gap-1.5 mb-1">
              <span className="text-[#62c33a] shrink-0">📍</span>
              <span>{siteConfig.address}</span>
            </p>
          </div>
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
          <strong>CONTACT &amp; SUPPORT</strong>
          <p className="mb-1">
            <a href="tel:+917030813082" className="text-white font-bold hover:text-[#62c33a] transition-colors flex items-center gap-1.5">
              <span>📞</span> 70308 13082
            </a>
          </p>
          <p className="mb-2">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#62c33a] font-bold hover:underline flex items-center gap-1.5"
            >
              <span>💬</span> 70308 08151 (WhatsApp)
            </a>
          </p>
          <p className="text-xs text-[#8aa39b]">{siteConfig.supportHours}</p>
        </div>
      </div>
    </footer>
  );
}
