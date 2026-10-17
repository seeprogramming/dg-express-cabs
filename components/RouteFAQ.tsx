interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  from: string;
  to: string;
  vehicleNames: string[];
  lowestFare: number;
  hasData: boolean;
}

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function RouteFAQ({
  from,
  to,
  vehicleNames,
  lowestFare,
  hasData,
}: Props) {
  if (!hasData) return null;

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

  return (
    <section className="section white" id="faq">
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="head">
          <div>
            <div className="ey">FAQS</div>
            <h2>Frequently Asked Questions</h2>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="panel"
              style={{ padding: "20px 24px" }}
              itemScope
              itemType="https://schema.org/Question"
            >
              <h3
                itemProp="name"
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--g, #123f38)",
                  marginBottom: "8px",
                }}
              >
                {faq.q}
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  style={{
                    color: "var(--muted, #718079)",
                    lineHeight: 1.7,
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
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
