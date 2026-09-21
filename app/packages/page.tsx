import type { Metadata } from "next";
import Link from "next/link";
import { PackageCard } from "@/components/PackageSection";
import { getAllPackages, getAllCategories } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Curated Tour Packages & Weekend Getaways",
  description:
    "Explore complete outstation tour packages from Pune and Mumbai — Goa, Konkan, Mahabaleshwar, Ashtavinayak darshan, Jyotirlinga yatra and more. Sedan, Ertiga, and Crysta options with complete itineraries.",
};

/* Category emoji + color map */
const categoryMeta: Record<string, { emoji: string; color: string }> = {
  mahabaleshwar: { emoji: "🏔️", color: "#3d9646" },
  goa: { emoji: "🏖️", color: "#e5903c" },
  konkan: { emoji: "🌊", color: "#3a7cc3" },
  ashtavinayak: { emoji: "🙏", color: "#d4544b" },
  jyotirlinga: { emoji: "🕉️", color: "#8e5dc3" },
};

export default function PackagesDirectoryPage() {
  const categories = getAllCategories();

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">CURATED GETAWAYS</div>
              <h1>
                Pick your
                <br />
                escape.
              </h1>
              <p>
                Complete Pune and Mumbai packages with full day-wise itineraries and
                vehicle-specific pricing for Sedan, Ertiga, and Crysta.
              </p>
            </div>
            <div className="heroEmoji">🏞️</div>
          </div>
        </div>
      </section>

      {/* Category filter pills */}
      <section className="py-4 bg-white border-b border-[#e2e8df] sticky top-[78px] z-20">
        <div className="container flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const meta = categoryMeta[cat.slug] || { emoji: "📦", color: "#123f38" };
            return (
              <a
                key={cat.slug}
                href={`#cat-${cat.slug}`}
                className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full border border-[#dce5da] bg-[#fafbf7] text-sm font-bold text-[#123f38] hover:bg-[#123f38] hover:text-white hover:border-[#123f38] transition-all"
              >
                <span>{meta.emoji}</span>
                {cat.category.replace(" Packages", "")}
                <span className="text-[10px] bg-[#edf5e7] text-[#3d9646] px-1.5 py-0.5 rounded-full font-extrabold">
                  {cat.packages.length}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Packages by category */}
      {categories.map((cat) => {
        const meta = categoryMeta[cat.slug] || { emoji: "📦", color: "#123f38" };
        return (
          <section
            key={cat.slug}
            id={`cat-${cat.slug}`}
            className="section white scroll-mt-[140px]"
          >
            <div className="container">
              <div className="head">
                <div>
                  <div className="ey">
                    {meta.emoji} {cat.category.toUpperCase()}
                  </div>
                  <h2>{cat.category}</h2>
                </div>
                <p>{cat.description}</p>
              </div>
              <div className="grid4">
                {cat.packages.map((pkg) => (
                  <PackageCard
                    key={`${cat.slug}-${pkg.id}`}
                    pkg={{ ...pkg, categorySlug: cat.slug }}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
