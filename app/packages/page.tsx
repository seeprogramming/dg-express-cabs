import type { Metadata } from "next";
import Link from "next/link";
import { PackageCard } from "@/components/PackageSection";
import { getAllPackages, getAllCategories } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Curated Tour Packages & Weekend Getaways",
  description:
    "Explore complete outstation tour packages from Pune and Mumbai to Mahabaleshwar, Panchgani, Tapola and beyond. Sedan, Ertiga, and Crysta options with complete itineraries.",
};

export default function PackagesDirectoryPage() {
  const packages = getAllPackages();
  const categories = getAllCategories();

  return (
    <main>
      <section className="pageHero">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="ey">CURATED GETAWAYS</div>
              <h1>
                Pick your hill
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

      <section className="section white">
        <div className="container">
          <div className="head">
            <div>
              <div className="ey">{packages.length} COMPLETE PACKAGES</div>
              <h2>Explore holiday packages.</h2>
            </div>
            <p>Choose a package and see every day, activity, and cab price before booking.</p>
          </div>

          <div className="grid4">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
