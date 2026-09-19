import type { Metadata } from "next";
import CabDetails from "@/components/CabDetails";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Online Cab Booking",
  description: "Book comfortable outstation cabs and airport transfers online with RelaxCabs.",
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2>Loading booking details...</h2>
        </div>
      }
    >
      <CabDetails />
    </Suspense>
  );
}
