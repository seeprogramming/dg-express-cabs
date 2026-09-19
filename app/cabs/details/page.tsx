import { Suspense } from "react";
import type { Metadata } from "next";
import CabDetails from "@/components/CabDetails";

export const metadata: Metadata = {
  title: "Cab Details & Booking",
  description:
    "View selected cab specifications, inclusions, transparent fare breakdown and request booking directly via WhatsApp.",
};

export default function CabDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2>Loading cab details...</h2>
        </div>
      }
    >
      <CabDetails />
    </Suspense>
  );
}
