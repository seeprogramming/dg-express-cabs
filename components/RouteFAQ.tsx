"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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

function RouteFAQContent({
  from: initialFrom,
  to: initialTo,
  vehicleNames: initialVehicleNames,
  lowestFare: initialLowestFare,
}: Props) {
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [vehicleNames, setVehicleNames] = useState(initialVehicleNames);
  const [lowestFare, setLowestFare] = useState(initialLowestFare);
  const [mode, setMode] = useState<string>(() => {
    const qMode = searchParams.get("mode") || searchParams.get("tripType") || "";
    if (qMode.toLowerCase().includes("round")) return "round";
    if (qMode.toLowerCase().includes("ev")) return "ev";
    if (qMode.toLowerCase().includes("local")) return "local";
    return "one";
  });

  // Sync mode if query params change on navigation
  useEffect(() => {
    const qMode = searchParams.get("mode") || searchParams.get("tripType") || "";
    if (qMode.toLowerCase().includes("round") || searchParams.has("returnDate")) {
      setMode("round");
    } else if (qMode.toLowerCase().includes("ev")) {
      setMode("ev");
    } else if (qMode.toLowerCase().includes("local")) {
      setMode("local");
    } else if (qMode.toLowerCase().includes("one")) {
      setMode("one");
    }
  }, [searchParams]);

  // Listen for live search updates from CabSearch
  useEffect(() => {
    const handleSearchUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{
        mode?: string;
        from?: string;
        to?: string;
        lowestFare?: number | null;
        vehicleNames?: string[];
      }>;
      const detail = customEvent.detail;
      if (!detail) return;

      if (detail.mode) setMode(detail.mode);
      if (detail.from) setFrom(detail.from);
      if (detail.to) setTo(detail.to);
      if (typeof detail.lowestFare === "number" && detail.lowestFare > 0) {
        setLowestFare(detail.lowestFare);
      }
      if (detail.vehicleNames && detail.vehicleNames.length > 0) {
        setVehicleNames(detail.vehicleNames);
      }
    };

    window.addEventListener("cab-search-update", handleSearchUpdate);
    return () => {
      window.removeEventListener("cab-search-update", handleSearchUpdate);
    };
  }, []);

  const vehicleList =
    vehicleNames.length > 0
      ? vehicleNames.slice(0, 5).join(", ")
      : "Sedan, SUV, and Innova Crysta";

  const effectiveFare = lowestFare > 0 ? formatINR(lowestFare) : "affordable rates";

  let faqs: FaqItem[] = [];

  if (mode === "round") {
    faqs = [
      {
        q: `What cab options are available for a round trip from ${from} to ${to}?`,
        a: `D&G Express Cabs offers ${vehicleList} for round trips between ${from} and ${to}. The same vehicle and verified chauffeur stay with you for your entire round trip journey.`,
      },
      {
        q: `What is the round-trip cab fare from ${from} to ${to}?`,
        a: `Round-trip cab fares from ${from} to ${to} start from ${effectiveFare}. This includes return kilometres, toll taxes, driver allowance, and doorstep pickup. Exact fares depend on your selected vehicle.`,
      },
      {
        q: `Can I select custom return dates and multiple pickups for a round trip?`,
        a: `Yes. You can choose your return date and pickup time in the search form above. Multiple pickup and drop points are included for your round-trip journey without hidden surcharges.`,
      },
      {
        q: `How can I book a round-trip cab from ${from} to ${to}?`,
        a: `Select your preferred round-trip cab from the search results above and confirm via WhatsApp. Our 24x7 support team will confirm your driver and vehicle details promptly.`,
      },
    ];
  } else if (mode === "ev") {
    faqs = [
      {
        q: `What electric cab (EV) options are available from ${from} to ${to}?`,
        a: `D&G Express Cabs offers 100% electric outstation cabs including MG Windsor EV and MG ZS EV for ${from} to ${to}. Enjoy zero engine vibration, whisper-quiet cabin comfort, and zero carbon emissions.`,
      },
      {
        q: `What is the EV cab fare from ${from} to ${to}?`,
        a: `Electric cab fares from ${from} to ${to} start from ${effectiveFare}. Fares are all-inclusive with zero fuel surcharges.`,
      },
      {
        q: `How is charging handled during outstation EV trips?`,
        a: `Our electric vehicles feature high real-world battery ranges (300+ km). For longer routes, drivers plan quick charging stops at high-speed expressway charging hubs during normal meal or rest breaks.`,
      },
      {
        q: `How can I book an EV cab for ${from} to ${to}?`,
        a: `Select the EV Cabs tab above, choose MG Windsor EV or MG ZS EV, and click Select Cab to confirm your eco-friendly booking on WhatsApp.`,
      },
    ];
  } else if (mode === "local") {
    faqs = [
      {
        q: `What local cab rental packages are available in ${from}?`,
        a: `We provide flexible hourly rental packages in ${from} (4 hrs/40 km, 8 hrs/80 km, and 12 hrs/120 km) across Hatchback, Sedan, SUV, and Innova Crysta.`,
      },
      {
        q: `What is the starting fare for local hourly cab rentals in ${from}?`,
        a: `Local hourly cab rentals in ${from} start from ${effectiveFare}. Extra kilometres and extra hours beyond your selected package are billed at standard, transparent rates.`,
      },
      {
        q: `Are multiple pickups and stops allowed in local city rentals?`,
        a: `Yes. Multiple stops, meetings, shopping visits, and city commutes within city limits are fully permitted during your booked duration.`,
      },
      {
        q: `How do I book a local cab rental in ${from}?`,
        a: `Choose your required hour and kilometre plan from the options above and click Select Cab to book directly with our team on WhatsApp.`,
      },
    ];
  } else {
    // One Way (default)
    faqs = [
      {
        q: `What cab options are available from ${from} to ${to}?`,
        a: `D&G Express Cabs offers ${vehicleList} for ${from} to ${to} travel. You can choose the vehicle that best suits your group size and budget.`,
      },
      {
        q: `What is the cab fare from ${from} to ${to}?`,
        a: `The cab fare from ${from} to ${to} starts from ${effectiveFare} for a one-way trip. The exact fare depends on the vehicle you select. You can see all vehicle-wise fares in the search results above.`,
      },
      {
        q: `Can I book a one-way cab from ${from} to ${to}?`,
        a: `Yes. D&G Express Cabs offers one-way cab bookings from ${from} to ${to}. You only pay for the one-way distance you travel with no return fare obligations.`,
      },
      {
        q: `How can I book a cab from ${from} to ${to} with D&G Express Cabs?`,
        a: `You can book your ${from} to ${to} cab by selecting your ride above or by reaching us on WhatsApp. Our team will assign a verified driver and confirm your pickup details promptly.`,
      },
    ];
  }

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

export default function RouteFAQ(props: Props) {
  if (!props.hasData) return null;
  return (
    <Suspense fallback={null}>
      <RouteFAQContent {...props} />
    </Suspense>
  );
}
