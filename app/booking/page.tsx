import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Cab Booking | D&G Express Cabs",
  description: "Book comfortable outstation cabs and airport transfers online with D&G Express Cabs.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookingPage() {
  redirect("/cabs/details");
}

