import type { TourPackage } from "@/types";
import mahabaleshwarData from "@/data/packages/mahabaleshwar.json";

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
    description: "Complete Pune and Mumbai packages with the full day-wise itinerary and vehicle-specific pricing.",
    packages: mahabaleshwarData.packages as TourPackage[],
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

export function getPackageById(id: string): (TourPackage & { categorySlug: string }) | null {
  const all = getAllPackages();
  return all.find((p) => p.id === id) || null;
}

export function getPackageBySlugAndCategory(categorySlug: string, packageSlug: string): TourPackage | null {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return null;
  return cat.packages.find((p) => p.id === packageSlug) || null;
}

export function formatINR(amount: number): string {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}
