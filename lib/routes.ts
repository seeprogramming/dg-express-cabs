import routesData from "@/data/routes.json";
import vehiclesData from "@/data/vehicles.json";
import airportsData from "@/data/airports.json";
import type { RouteInfo, VehicleInfo, AirportInfo } from "@/types";

export function getRoutes(): RouteInfo[] {
  return routesData as RouteInfo[];
}

export function getVehicles(): VehicleInfo[] {
  return vehiclesData as VehicleInfo[];
}

export function getAirports(): AirportInfo[] {
  return airportsData as AirportInfo[];
}

export function findRoute(from: string, to: string): RouteInfo | undefined {
  const norm = (v: string) => v.trim().toLowerCase();
  return (routesData as RouteInfo[]).find(
    (r) => norm(r.from) === norm(from) && norm(r.to) === norm(to)
  );
}

export function calculateFare(
  baseFare: number,
  multiplier: number,
  mode: "one" | "round" | "airport" | "local"
): number {
  const modeFactor =
    mode === "round" ? 1.55 : mode === "airport" ? 0.55 : mode === "local" ? 0.72 : 1.0;
  return Math.round(baseFare * multiplier * modeFactor);
}

export function routeSlug(from: string, to: string): string {
  return `${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

export function parseRouteSlug(slug: string): { from: string; to: string } | null {
  const parts = slug.split("-to-");
  if (parts.length !== 2) return null;
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    from: capitalize(parts[0]),
    to: capitalize(parts[1]),
  };
}
