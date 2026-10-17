import websiteRates from "@/data/website-rates.json";
import vehiclesData from "@/data/vehicles.json";
import airportsData from "@/data/airports.json";
import type { RouteInfo, VehicleInfo, AirportInfo } from "@/types";

export interface WebsiteRateRoute {
  from: string;
  to: string;
  fares: Record<string, number>;
}

export interface LocalRentalPlan {
  hours: number;
  km: number;
  label: string;
  fare: number;
}

export interface LocalRentalVehicle {
  vehicle: string;
  plans: LocalRentalPlan[];
}

export function getRoutes(): RouteInfo[] {
  // Convert one_way routes to RouteInfo format (using lowest fare, usually hatchback)
  const oneWayRoutes = websiteRates.one_way as WebsiteRateRoute[];
  return oneWayRoutes.map((r) => {
    // Find the minimum fare to use as starting fare
    const startingFare = Math.min(...Object.values(r.fares));
    return {
      from: r.from,
      to: r.to,
      fare: startingFare,
    };
  });
}

export function findRoute(from: string, to: string): RouteInfo | null {
  const norm = (v: string) => v.trim().toLowerCase();
  const routes = getRoutes();
  return routes.find((r) => norm(r.from) === norm(from) && norm(r.to) === norm(to)) || null;
}

export function getRoutesFromCity(city: string): RouteInfo[] {
  const norm = (v: string) => v.trim().toLowerCase();
  return getRoutes().filter((r) => norm(r.from) === norm(city));
}

export function getVehicles(): VehicleInfo[] {
  return vehiclesData as VehicleInfo[];
}

export function getAirports(): AirportInfo[] {
  return airportsData as AirportInfo[];
}

export function airportSlug(city: string): string {
  return `${city.toLowerCase()}-airport`;
}

export function findAirportBySlug(slug: string): AirportInfo | null {
  const airports = getAirports();
  return (
    airports.find(
      (a) => `${a.city.toLowerCase()}-airport` === slug.toLowerCase()
    ) || null
  );
}

// Map the vehicle info category to the key used in website-rates.json
export function getVehicleRateKey(category: string): string {
  const mapping: Record<string, string> = {
    "Hatchback": "hatchback",
    "Sedan": "sedan",
    "SUV": "suv",
    "Innova / Kia Carens": "innova_kia_carens",
    "Innova Crysta": "innova_crysta"
  };
  return mapping[category] || category.toLowerCase();
}

export function getLocalRentalVehicleKey(category: string): string {
  const mapping: Record<string, string> = {
    "Hatchback": "",
    "Sedan": "Sedan",
    "SUV": "SUV",
    "Innova / Kia Carens": "",
    "Innova Crysta": "Crysta",
    "Crysta": "Crysta",
  };
  return mapping[category] ?? "";
}

export function getFareForMode(
  from: string,
  to: string,
  category: string,
  mode: "one" | "round" | "airport" | "local"
): number | null {
  const norm = (v: string) => v.trim().toLowerCase();
  const rateKey = getVehicleRateKey(category);

  if (mode === "one" || mode === "airport") {
    const route = (websiteRates.one_way as WebsiteRateRoute[]).find(
      (r) => norm(r.from) === norm(from) && norm(r.to) === norm(to)
    );
    if (route && route.fares[rateKey]) {
      return route.fares[rateKey];
    }
  } else if (mode === "round") {
    const route = (websiteRates.round_trip as WebsiteRateRoute[]).find(
      (r) => norm(r.from) === norm(from) && norm(r.to) === norm(to)
    );
    if (route && route.fares[rateKey]) {
      return route.fares[rateKey];
    }
  }
  return null;
}

export function getLocalRentalPlans(category: string): LocalRentalPlan[] | null {
  const localVehicleKey = getLocalRentalVehicleKey(category);
  const rentals = websiteRates.local_rentals as LocalRentalVehicle[];
  const match = rentals.find((r) => r.vehicle === localVehicleKey);
  return match ? match.plans : null;
}

export function getRoundTripRoutes(): RouteInfo[] {
  const roundTrip = websiteRates.round_trip as WebsiteRateRoute[];
  return roundTrip.map((r) => {
    const startingFare = Math.min(...Object.values(r.fares));
    return {
      from: r.from,
      to: r.to,
      fare: startingFare,
    };
  });
}

export function getLocalRentals(): LocalRentalVehicle[] {
  return websiteRates.local_rentals as LocalRentalVehicle[];
}

export function routeSlug(from: string, to: string): string {
  return `${from.toLowerCase().replace(/\s+/g, "-")}-to-${to.toLowerCase().replace(/\s+/g, "-")}`;
}

export function parseRouteSlug(slug: string): { from: string; to: string } | null {
  const parts = slug.split("-to-");
  if (parts.length !== 2) return null;

  // Try to match against actual route data first (handles multi-word cities like 'Navi Mumbai')
  const allRoutes = (websiteRates.one_way as WebsiteRateRoute[]);
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
  const match = allRoutes.find(
    (r) => normalize(r.from) === parts[0] && normalize(r.to) === parts[1]
  );
  if (match) {
    return { from: match.from, to: match.to };
  }

  // Fallback: capitalize first letter of each part
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    from: capitalize(parts[0]),
    to: capitalize(parts[1]),
  };
}
