import Hero from "@/components/Hero";
import CabSearch from "@/components/CabSearch";
import PopularRides from "@/components/PopularRides";
import AirportTransfers from "@/components/AirportTransfers";
import PackageSection from "@/components/PackageSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import RouteRibbon from "@/components/RouteRibbon";
import TravelGallery from "@/components/TravelGallery";
import MumbaiOutstationPoster from "@/components/MumbaiOutstationPoster";
import { getRoutes, getVehicles, getAirports } from "@/lib/routes";
import { getFeaturedPackages } from "@/lib/packages";

export default function HomePage() {
  const routes = getRoutes();
  const vehicles = getVehicles();
  const airports = getAirports();
  const packages = getFeaturedPackages();

  return (
    <main>
      <Hero />
      <CabSearch vehicles={vehicles} initialFrom="Pune" initialTo="Mumbai" />
      <WhyChooseUs />
      <MumbaiOutstationPoster />
      <PopularRides rides={routes.slice(0, 4)} showViewAll={true} />
      <AirportTransfers airports={airports} />
      <PackageSection packages={packages} />
      <RouteRibbon />
      <TravelGallery />
    </main>
  );
}
