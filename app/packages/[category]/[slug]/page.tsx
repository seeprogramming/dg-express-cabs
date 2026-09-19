import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PackageHero from "@/components/PackageHero";
import PackageItinerary from "@/components/PackageItinerary";
import PackagePricing from "@/components/PackagePricing";
import {
  getAllPackages,
  getPackageBySlugAndCategory,
  formatINR,
} from "@/lib/packages";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const all = getAllPackages();
  return all.map((p) => ({
    category: p.categorySlug,
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const pkg = getPackageBySlugAndCategory(category, slug);
  if (!pkg) {
    return { title: "Tour Package | RelaxCabs" };
  }

  const durationStr = pkg.duration.label;
  const intro = pkg.description || pkg.best_for || "Tour package";
  const title = `${pkg.route.from} to ${pkg.route.to} Cab Package - ${durationStr}`;
  const description = `Book ${pkg.title} (${durationStr}) from ${pkg.route.from}. ${intro} Starting at ${formatINR(
    pkg.prices.sedan
  )} for Sedan. Ertiga and Crysta available.`;

  return {
    title,
    description,
    openGraph: {
      title: `${pkg.title} | RelaxCabs`,
      description,
      images: [
        {
          url: pkg.id.includes("fort")
            ? siteConfig.stockImages.road
            : siteConfig.stockImages.maha,
          width: 1200,
          height: 630,
          alt: pkg.title,
        },
      ],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const pkg = getPackageBySlugAndCategory(category, slug);
  if (!pkg) {
    notFound();
  }

  const intro = pkg.description || pkg.best_for || "Mahabaleshwar cab package";
  const heroImage = pkg.id.includes("fort")
    ? siteConfig.stockImages.road
    : siteConfig.stockImages.maha;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": pkg.title,
    "description": intro,
    "touristType": pkg.best_for || "Families, couples, and tourists",
    "offers": [
      {
        "@type": "Offer",
        "name": "Sedan (Dzire / Aura)",
        "price": pkg.prices.sedan,
        "priceCurrency": "INR",
      },
      {
        "@type": "Offer",
        "name": "SUV (Ertiga / Rumion)",
        "price": pkg.prices.ertiga,
        "priceCurrency": "INR",
      },
      {
        "@type": "Offer",
        "name": "Premium (Innova Crysta)",
        "price": pkg.prices.crysta,
        "priceCurrency": "INR",
      },
    ],
    "itinerary": {
      "@type": "ItemList",
      "numberOfItems": pkg.itinerary.length,
      "itemListElement": pkg.itinerary.map((d, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `Day ${d.day}: ${d.title}`,
        "description": d.activities.join("; "),
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageHero
        from={pkg.route.from}
        destination={pkg.route.to}
        durationLabel={pkg.duration.label}
        title={pkg.title}
        intro={intro}
      />

      <section className="section">
        <div className="container packageLayout">
          <div>
            <PackageItinerary itinerary={pkg.itinerary} heroImage={heroImage} />
          </div>
          <PackagePricing pkg={pkg} />
        </div>
      </section>
    </main>
  );
}
