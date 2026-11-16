import React from "react";
import { Check, X } from "lucide-react";

interface InclusionExclusionProps {
  distanceKm?: number | null;
  extraKmRate?: number;
  isRoundTrip?: boolean;
}

export default function InclusionExclusion({
  distanceKm,
  extraKmRate = 20,
  isRoundTrip = false,
}: InclusionExclusionProps) {
  const kmText = distanceKm
    ? `${distanceKm} Km included. Extra ₹${extraKmRate}/km beyond the included kilometres.`
    : `Standard route kilometres included. Extra ₹${extraKmRate}/km beyond the included kilometres.`;

  const inclusions = [
    {
      title: "Kilometres Included",
      description: kmText,
    },
    {
      title: "Toll, Tax & Other Charges",
      description: "Toll, state tax, airport entry and parking charges included.",
    },
    {
      title: "Driver Allowance",
      description: isRoundTrip
        ? "Driver food, day allowance and night stay charges included."
        : "Driver food and accommodation charges included.",
    },
    {
      title: "Fuel Charges",
      description: "Fuel cost is included in the package fare.",
    },
  ];

  const exclusions = [
    {
      title: "Multiple Pickups & Drops",
      description: "Additional pickup or drop points not mentioned in the booking are chargeable.",
    },
    {
      title: "Airport / Station Waiting Charges",
      description: "Waiting beyond 45 minutes from scheduled arrival time may incur extra charges.",
    },
    {
      title: "Sightseeing & Route Deviations",
      description: "Detours or extra sightseeing beyond the agreed route are charged extra per km.",
    },
    {
      title: "Personal Expenses & Entry Fees",
      description: "Monument entry fees, camera passes, personal shopping and meals are excluded.",
    },
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusions Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dce5da] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#eef2eb]">
            <div className="w-8 h-8 rounded-full bg-[#edf5e7] border border-[#c2deb9] flex items-center justify-center text-[#2d7335]">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#123f38] leading-tight">
                Trip Inclusions
              </h3>
              <p className="text-xs text-[#718079] font-medium">Included in your package fare</p>
            </div>
          </div>

          <div className="space-y-4">
            {inclusions.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  idx !== inclusions.length - 1 ? "pb-3.5 border-b border-[#f4f7f2]" : ""
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#edf5e7] text-[#2d7335] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-[#123f38] mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#5e6d66] leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dce5da] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#eef2eb]">
            <div className="w-8 h-8 rounded-full bg-[#fdf2f2] border border-[#fbd5d5] flex items-center justify-center text-[#d93838]">
              <X className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#123f38] leading-tight">
                Trip Exclusions
              </h3>
              <p className="text-xs text-[#718079] font-medium">Extra / payable directly if applicable</p>
            </div>
          </div>

          <div className="space-y-4">
            {exclusions.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  idx !== exclusions.length - 1 ? "pb-3.5 border-b border-[#fdf6f6]" : ""
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#fdf2f2] text-[#d93838] flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-[#123f38] mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#5e6d66] leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
