import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getRoutes } from "@/lib/routes";

export default function Footer() {
  const routes = getRoutes();
  const popularRides = routes.slice(0, 5); // Get top 5 routes

  return (
    <footer className="bg-[#082f2c] text-[#a1b5ae] py-16 border-t border-[#123f38]">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        
        {/* Section 1: Brand & Text */}
        <div>
          <Link
            className="inline-flex items-center mb-5 group"
            href="/"
            aria-label="D&G Express Cabs Home"
          >
            <div className="bg-[#f7f5eb] rounded-xl px-3.5 py-2 inline-flex items-center shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
              <Image
                src="/dgxcabs.png"
                alt="D&G Express Cabs"
                width={160}
                height={80}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
          </Link>
          <p className="text-[13px] leading-[1.8] mb-6 pr-4">
            {siteConfig.description}
          </p>
          <div className="text-[11px] text-[#718079]">
            © {new Date().getFullYear()} D&amp;G Express Cabs. All rights reserved.
          </div>
        </div>

        {/* Section 2: Services */}
        <div>
          <strong className="text-white text-[13px] tracking-wider mb-4 block">SERVICES</strong>
          <ul className="space-y-3 text-[13px]">
            <li><Link href="/#rides" className="hover:text-white transition-colors">Outstation Rides</Link></li>
            <li><Link href="/rentals" className="hover:text-white transition-colors">Local Rentals</Link></li>
            <li><Link href="/airports" className="hover:text-white transition-colors">Airport Transfers</Link></li>
            <li><Link href="/packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
            <li><Link href="/cabs" className="hover:text-white transition-colors">Round Trips</Link></li>
          </ul>
        </div>

        {/* Section 3: Popular Rides */}
        <div>
          <strong className="text-white text-[13px] tracking-wider mb-4 block">POPULAR RIDES</strong>
          <ul className="space-y-3 text-[13px]">
            {popularRides.map((route, idx) => (
              <li key={idx}>
                <Link href={`/cabs/${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#62c33a] text-[10px]">▶</span> {route.from} to {route.to}
                </Link>
              </li>
            ))}
            <li>
               <Link href="/cabs" className="text-[#62c33a] hover:text-white transition-colors font-bold mt-2 inline-block">
                 View all routes →
               </Link>
            </li>
          </ul>
        </div>

        {/* Section 4: Contact, Address & Email */}
        <div>
          <strong className="text-white text-[13px] tracking-wider mb-4 block">CONTACT US</strong>
          <ul className="space-y-4 text-[13px]">
            <li className="flex items-start gap-2.5">
              <span className="text-[#62c33a] shrink-0 mt-0.5">📍</span>
              <span className="leading-relaxed">{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#62c33a] shrink-0">📞</span>
              <a href={siteConfig.phoneCallUrl} className="text-white font-bold hover:text-[#62c33a] transition-colors">
                {siteConfig.phonePrimary}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#62c33a] shrink-0">💬</span>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#62c33a] font-bold hover:underline"
              >
                {siteConfig.whatsappFormatted} (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-[#62c33a] shrink-0">✉️</span>
              <a href="mailto:support@dgexpresscabs.com" className="hover:text-white transition-colors">
                support@dgexpresscabs.com
              </a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Branding */}
      <div className="border-t border-[#123f38] mt-12 pt-8 text-center text-[12px]">
        Made with ❤️ by <a href="https://sagarshelke-77.firebaseapp.com/" target="_blank" rel="noopener noreferrer" className="text-[#62c33a] hover:underline font-bold">seeprogramming</a>
      </div>
    </footer>
  );
}
