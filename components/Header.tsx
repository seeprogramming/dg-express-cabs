import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Header() {
  return (
    <>
      {/* Top Utility Contact Bar */}
      <div className="bg-[#0e332d] text-[#c4d6ce] text-xs py-1.5 border-b border-[#1b4d44] hidden sm:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#62c33a]">📍</span>
            <span className="truncate">{siteConfig.address}</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#62c33a] transition-colors"
            >
              <span>💬 WhatsApp:</span>
              <strong className="text-white">{siteConfig.whatsappFormatted}</strong>
            </a>
            <span className="text-[#2b5950]">|</span>
            <a
              href={siteConfig.phoneCallUrl}
              className="flex items-center gap-1 hover:text-[#62c33a] transition-colors"
            >
              <span>📞 Call:</span>
              <strong className="text-white">{siteConfig.phonePrimary}</strong>
            </a>
          </div>
        </div>
      </div>

      <header>
        <nav className="container">
          <Link className="logo flex items-center shrink-0" href="/" aria-label="D&G Express Cabs">
            <Image
              src="/dgxcabs.png"
              alt="D&G Express Cabs"
              width={170}
              height={85}
              priority
              className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
            />
          </Link>
          {siteConfig.nav.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
          
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Quick Call Button */}
            <a
              href={siteConfig.phoneCallUrl}
              aria-label={`Call ${siteConfig.phonePrimary}`}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#cbd8cc] text-xs font-extrabold text-[#123f38] hover:bg-[#edf5e7] transition-all"
            >
              <span>📞</span>
              <span>70308 13082</span>
            </a>

            {/* Quick WhatsApp Button */}
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi D&G Express Cabs, I'd like to enquire about a cab booking.")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with D&G Express Cabs on WhatsApp"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-[#083d20] text-xs font-extrabold hover:bg-[#20ba5a] transition-all shadow-sm"
              title="Chat on WhatsApp"
            >
              <span>💬</span>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <Link className="navcta" href="/#booking">
              Book a Ride
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
