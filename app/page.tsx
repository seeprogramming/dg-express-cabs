import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "D&G Express Cabs — Rides, Airports & Tours",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: siteConfig.url,
    title: "D&G Express Cabs — Rides, Airports & Tours",
    description: siteConfig.description,
  },
};
import CabSearch from "@/components/CabSearch";
import PopularRides from "@/components/PopularRides";
import PackageSection from "@/components/PackageSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import RouteRibbon from "@/components/RouteRibbon";
import TravelGallery from "@/components/TravelGallery";
import MumbaiOutstationPoster from "@/components/MumbaiOutstationPoster";
import { getRoutes, getVehicles } from "@/lib/routes";
import { getFeaturedPackages } from "@/lib/packages";

export default function HomePage() {
  const routes = getRoutes();
  const vehicles = getVehicles();
  const packages = getFeaturedPackages();

  return (
    <main>
      <Hero />
      <CabSearch vehicles={vehicles} initialFrom="Pune" initialTo="Mumbai" />
      <WhyChooseUs />
      <MumbaiOutstationPoster />
      <PopularRides rides={routes.slice(0, 4)} showViewAll={true} />
      <PackageSection packages={packages} />
      <RouteRibbon />
      <TravelGallery />
    </main>
  );
}
