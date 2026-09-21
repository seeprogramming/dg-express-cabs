import type { TourPackage, PriceValue } from "@/types";
import mahabaleshwarData from "@/data/packages/mahabaleshwar.json";
import goaData from "@/data/packages/goa.json";
import konkanData from "@/data/packages/konkan.json";
import ashtavinayakData from "@/data/packages/ashtavinayak.json";
import jyotirlingaData from "@/data/packages/jyotirlinga.json";

export interface PackageCategory {
  category: string;
  slug: string;
  description?: string;
  packages: TourPackage[];
}

const packageCategories: Record<string, PackageCategory> = {
  mahabaleshwar: {
    category: mahabaleshwarData.category,
    slug: "mahabaleshwar",
    description:
      "Complete Pune and Mumbai packages with the full day-wise itinerary and vehicle-specific pricing.",
    packages: mahabaleshwarData.packages as TourPackage[],
  },
  goa: {
    category: goaData.category,
    slug: "goa",
    description:
      "North Goa, South Goa and combined packages from Pune and Mumbai with beaches, forts and heritage.",
    packages: goaData.packages as TourPackage[],
  },
  konkan: {
    category: (konkanData as { category: string }).category,
    slug: "konkan",
    description:
      "Coastal Konkan getaways — Diveagar, Tarkarli, Ganpatipule and the stunning Sindhudurg coast.",
    packages: (konkanData as { packages: TourPackage[] }).packages,
  },
  ashtavinayak: {
    category: ashtavinayakData.category,
    slug: "ashtavinayak",
    description:
      "Sacred Ashtavinayak darshan circuits covering all eight Ganesh temples in Maharashtra.",
    packages: ashtavinayakData.packages as TourPackage[],
  },
  jyotirlinga: {
    category: jyotirlingaData.category,
    slug: "jyotirlinga",
    description:
      "Jyotirlinga pilgrimage packages — Bhimashankar, Trimbakeshwar, Ghrishneshwar and extended yatras.",
    packages: jyotirlingaData.packages as TourPackage[],
  },
};

export function getAllCategories(): PackageCategory[] {
  return Object.values(packageCategories);
}

export function getCategoryBySlug(slug: string): PackageCategory | null {
  return packageCategories[slug.toLowerCase()] || null;
}

export function getAllPackages(): (TourPackage & { categorySlug: string })[] {
  const all: (TourPackage & { categorySlug: string })[] = [];
  for (const cat of Object.values(packageCategories)) {
    for (const pkg of cat.packages) {
      all.push({ ...pkg, categorySlug: cat.slug });
    }
  }
  return all;
}

export function getFeaturedPackages(): (TourPackage & { categorySlug: string })[] {
  const featured: (TourPackage & { categorySlug: string })[] = [];
  for (const cat of Object.values(packageCategories)) {
    // Get 2 packages from each category
    for (const pkg of cat.packages.slice(0, 2)) {
      featured.push({ ...pkg, categorySlug: cat.slug });
    }
  }
  return featured;
}

export function getPackageById(
  id: string
): (TourPackage & { categorySlug: string }) | null {
  const all = getAllPackages();
  return all.find((p) => p.id === id) || null;
}

export function getPackageBySlugAndCategory(
  categorySlug: string,
  packageSlug: string
): TourPackage | null {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return null;
  return cat.packages.find((p) => p.id === packageSlug) || null;
}

/** Extract numeric amount from a PriceValue (handles both flat numbers and {amount} objects) */
export function priceAmount(v: PriceValue): number {
  return typeof v === "number" ? v : v.amount;
}

export function formatINR(amount: number): string {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

/** Get the destination label for a package (handles to, stops, and route_sequence) */
export function getPackageDestination(pkg: TourPackage): string {
  if (pkg.route.to) return pkg.route.to;
  if (pkg.route_sequence) return pkg.route_sequence.split("→")[0]?.trim() || "Pilgrimage";
  if (pkg.route.stops && pkg.route.stops.length > 0) return pkg.route.stops.join(", ");
  return "Tour";
}
