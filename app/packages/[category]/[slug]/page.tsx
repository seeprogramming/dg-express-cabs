import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PackageHero from "@/components/PackageHero";
import PackageItinerary from "@/components/PackageItinerary";
import PackagePricing from "@/components/PackagePricing";
import { getCategoryBySlug } from "@/lib/packages";
import {
  getAllPackages,
  getPackageBySlugAndCategory,
  formatINR,
  priceAmount,
  getPackageDestination,
} from "@/lib/packages";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/* Map category slug → stock hero image */
const categoryHeroImage: Record<string, string> = {
  mahabaleshwar: siteConfig.stockImages.maha,
  goa: siteConfig.stockImages.road,
  konkan: siteConfig.stockImages.highway,
  ashtavinayak: siteConfig.stockImages.lonavala,
  jyotirlinga: siteConfig.stockImages.city,
};

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
    return {
      title: "Tour Package | D&G Express Cabs",
      robots: { index: false, follow: true },
    };
  }

  const dest = getPackageDestination(pkg);
  const durationStr = pkg.duration.label;
  const intro = pkg.description || pkg.best_for || "Tour package";
  const title = `${pkg.route.from} to ${dest} Cab Package - ${durationStr}`;
  const description = `Book ${pkg.title} (${durationStr}) from ${pkg.route.from}. ${intro} Starting at ${formatINR(
    priceAmount(pkg.prices.sedan)
  )} for Sedan. Ertiga and Crysta available.`;

  const heroImg = categoryHeroImage[category] || siteConfig.stockImages.road;
  const canonicalPath = `/packages/${category.toLowerCase()}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      url: `${siteConfig.url}${canonicalPath}`,
      title: `${pkg.title} | D&G Express Cabs`,
      description,
      images: [
        {
          url: heroImg,
          width: 1200,
          height: 630,
          alt: pkg.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.title} | D&G Express Cabs`,
      description,
      images: [heroImg],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const pkg = getPackageBySlugAndCategory(category, slug);
  if (!pkg) {
    notFound();
  }

  const dest = getPackageDestination(pkg);
  const intro = pkg.description || pkg.best_for || pkg.route_sequence || `${dest} cab package`;
  const heroImage = pkg.image || categoryHeroImage[category] || siteConfig.stockImages.road;
  const canonicalPath = `/packages/${category.toLowerCase()}/${slug}`;
  const cat = getCategoryBySlug(category);
  const catLabel = cat?.category || category;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Tour Packages", item: `${siteConfig.url}/packages` },
      { "@type": "ListItem", position: 3, name: catLabel, item: `${siteConfig.url}/packages/${category.toLowerCase()}` },
      { "@type": "ListItem", position: 4, name: pkg.title, item: `${siteConfig.url}${canonicalPath}` },
    ],
  };

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
        "price": priceAmount(pkg.prices.sedan),
        "priceCurrency": "INR",
      },
      {
        "@type": "Offer",
        "name": "SUV (Ertiga / Rumion)",
        "price": priceAmount(pkg.prices.ertiga),
        "priceCurrency": "INR",
      },
      {
        "@type": "Offer",
        "name": "Premium (Innova Crysta)",
        "price": priceAmount(pkg.prices.crysta),
        "priceCurrency": "INR",
      },
    ],
    ...(pkg.itinerary && pkg.itinerary.length > 0
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: pkg.itinerary.length,
            itemListElement: pkg.itinerary.map((d, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `Day ${d.day}: ${d.title || "Travel"}`,
              description: d.activities.join("; "),
            })),
          },
        }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tour Packages", href: "/packages" },
          { label: catLabel, href: `/packages/${category.toLowerCase()}` },
          { label: pkg.title },
        ]}
        from={pkg.route.from}
        destination={dest}
        durationLabel={pkg.duration.label}
        title={pkg.title}
        intro={intro}
        heroImage={heroImage}
      />

      <section className="section">
        <div className="container packageLayout">
          <div>
            {pkg.itinerary && pkg.itinerary.length > 0 ? (
              <PackageItinerary itinerary={pkg.itinerary} heroImage={heroImage} />
            ) : (
              /* For packages without full itinerary (e.g. one-day darshan), show route sequence */
              <div className="panel">
                <div
                  style={{
                    height: "220px",
                    borderRadius: "14px",
                    marginBottom: "22px",
                    background: `url('${heroImage}') center/cover no-repeat`,
                  }}
                />
                <div className="ey">ROUTE</div>
                <h2>{pkg.title}{pkg.variant ? ` — ${pkg.variant}` : ""}</h2>
                {pkg.route_sequence && (
                  <div className="mt-4 p-4 bg-[#f7faf4] rounded-xl border border-[#dce5da]">
                    <div className="text-xs font-extrabold text-[#718079] tracking-wider mb-2">
                      ROUTE SEQUENCE
                    </div>
                    <p className="text-lg font-bold text-[#123f38]">{pkg.route_sequence}</p>
                  </div>
                )}
                {pkg.route.stops && pkg.route.stops.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-extrabold text-[#718079] tracking-wider mb-2">
                      STOPS
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.route.stops.map((stop, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-[#edf5e7] text-[#123f38] text-sm font-bold rounded-lg border border-[#d2e6c8]"
                        >
                          {i + 1}. {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-4 text-[#718079] text-sm leading-relaxed">{intro}</p>
              </div>
            )}
          </div>
          <PackagePricing pkg={pkg} categorySlug={category} />
        </div>
      </section>
    </main>
  );
}
