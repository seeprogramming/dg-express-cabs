import Hero from "@/components/Hero";
import CabSearch from "@/components/CabSearch";
import PopularRides from "@/components/PopularRides";
import AirportTransfers from "@/components/AirportTransfers";
import PackageSection from "@/components/PackageSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import RouteRibbon from "@/components/RouteRibbon";
import TravelGallery from "@/components/TravelGallery";
import { getRoutes, getVehicles, getAirports } from "@/lib/routes";
import { getAllPackages } from "@/lib/packages";

export default function HomePage() {
  const routes = getRoutes();
  const vehicles = getVehicles();
  const airports = getAirports();
  const packages = getAllPackages();

  return (
    <main>
      <Hero />
      <CabSearch vehicles={vehicles} initialFrom="Pune" initialTo="Mumbai" />
      <WhyChooseUs />
      <PopularRides rides={routes} />
      <AirportTransfers airports={airports} />
      <PackageSection packages={packages} />
      <RouteRibbon />
      <TravelGallery />
    </main>
  );
}
