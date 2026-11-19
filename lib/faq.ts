interface FaqItem {
  q: string;
  a: string;
}

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Generates the FAQPage JSON-LD structured data matching the visible FAQs */
export function buildFaqJsonLd(
  from: string,
  to: string,
  vehicleNames: string[],
  lowestFare: number
): object {
  const vehicleList =
    vehicleNames.length > 0
      ? vehicleNames.join(", ")
      : "Sedan, SUV, and Innova Crysta";

  const faqs: FaqItem[] = [
    {
      q: `What cab options are available from ${from} to ${to}?`,
      a: `D&G Express Cabs offers ${vehicleList} for ${from} to ${to} travel. You can choose the vehicle that best suits your group size and budget.`,
    },
    {
      q: `What is the cab fare from ${from} to ${to}?`,
      a: `The cab fare from ${from} to ${to} starts from ${formatINR(lowestFare)} for a one-way trip. The exact fare depends on the vehicle you select. You can see all vehicle-wise fares in the pricing table above.`,
    },
    {
      q: `Can I book a one-way cab from ${from} to ${to}?`,
      a: `Yes. D&G Express Cabs offers one-way cab bookings from ${from} to ${to}. You only pay for the journey you need.`,
    },
    {
      q: `How can I book a cab from ${from} to ${to} with D&G Express Cabs?`,
      a: `You can book your ${from} to ${to} cab by using the search form on this page or by reaching us on WhatsApp. Our team will confirm your cab and pickup details promptly.`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
