import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PackageCard } from "@/components/PackageSection";
import { getCategoryBySlug, getAllCategories } from "@/lib/packages";

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
    return { title: "Packages | RelaxCabs" };
  }

  return {
    title: `${cat.category} — Cab Tour Packages`,
    description: `Browse curated ${cat.category} from Pune & Mumbai. Check complete day-wise itineraries and guaranteed transparent fares for Sedan, Ertiga, and Crysta.`,
    openGraph: {
      title: `${cat.category} | RelaxCabs`,
      description: `Complete ${cat.category} with verified day-by-day itineraries and transparent vehicle pricing.`,
    },
  };
}

export default async function PackageCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) {
    notFound();
  }

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">{cat.category.toUpperCase()}</div>
              <h1>
                Pick your hill
                <br />
                escape.
              </h1>
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
              <div className="ey">{cat.packages.length} COMPLETE OPTIONS</div>
              <h2>Explore {cat.category}.</h2>
            </div>
            <p>Choose a package and see every day, activity and cab price before booking.</p>
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
