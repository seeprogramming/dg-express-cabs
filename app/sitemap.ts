import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getRoutes } from "@/lib/routes";
import { getAllCategories, getAllPackages } from "@/lib/packages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Base routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/airports`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cabs/details`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Route pages
  const routes = getRoutes();
  const routeUrls: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${baseUrl}/cabs/${r.from.toLowerCase()}-to-${r.to.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Package category pages
  const categories = getAllCategories();
  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/packages/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Individual package pages
  const packages = getAllPackages();
  const packageUrls: MetadataRoute.Sitemap = packages.map((p) => ({
    url: `${baseUrl}/packages/${p.categorySlug}/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...routeUrls, ...categoryUrls, ...packageUrls];
}
