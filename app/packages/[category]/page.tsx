import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PackageCard } from "@/components/PackageSection";
import Breadcrumb from "@/components/Breadcrumb";
import { getCategoryBySlug, getAllCategories } from "@/lib/packages";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) {
    return {
      title: "Packages | D&G Express Cabs",
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/packages/${category.toLowerCase()}`;

  return {
    title: `${cat.category} — Cab Tour Packages from Pune & Mumbai`,
    description: `Browse curated ${cat.category} from Pune & Mumbai. Complete day-wise itineraries and transparent fares for Sedan, Ertiga, and Crysta.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      url: `https://dgexpresscabs.com${canonicalPath}`,
      title: `${cat.category} | D&G Express Cabs`,
      description: `Complete ${cat.category} with verified day-by-day itineraries and transparent vehicle pricing.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.category} | D&G Express Cabs`,
      description: `Complete ${cat.category} with verified day-by-day itineraries and vehicle pricing.`,
    },
  };
}

export default async function PackageCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) {
    notFound();
  }

  const canonicalPath = `/packages/${category.toLowerCase()}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tour Packages",
        item: `${siteConfig.url}/packages`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.category,
        item: `${siteConfig.url}${canonicalPath}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Tour Packages", href: "/packages" },
                  { label: cat.category },
                ]}
              />
              <div className="ey">{cat.category.toUpperCase()}</div>
              <h1>{cat.category}</h1>
              <p>
                {cat.description ||
                  "Complete Pune and Mumbai packages with the full day-wise itinerary and vehicle-specific pricing."}
              </p>
            </div>
            <div className="heroEmoji">🏞️</div>
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="head">
            <div>
              <div className="ey">{cat.packages.length} PACKAGES</div>
              {/* h2 is distinct from h1 to avoid duplication */}
              <h2>Choose a {cat.category} Package</h2>
            </div>
            <p>See every day, activity, and cab price before booking.</p>
          </div>

          <div className="grid4">
            {cat.packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={{ ...pkg, categorySlug: cat.slug }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
