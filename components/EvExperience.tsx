"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/packages";

interface EVRouteOption {
  id: string;
  label: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  windsorFare: number;
  zsFare: number;
}

const EV_ROUTES: EVRouteOption[] = [
  {
    id: "pune-mumbai",
    label: "Pune → Mumbai",
    from: "Pune",
    to: "Mumbai",
    distance: "150 km",
    duration: "Approx. 3 hrs",
    windsorFare: 3300,
    zsFare: 3600,
  },
  {
    id: "mumbai-pune",
    label: "Mumbai → Pune",
    from: "Mumbai",
    to: "Pune",
    distance: "150 km",
    duration: "Approx. 3 hrs",
    windsorFare: 3300,
    zsFare: 3600,
  },
  {
    id: "pune-nashik",
    label: "Pune → Nashik",
    from: "Pune",
    to: "Nashik",
    distance: "210 km",
    duration: "Approx. 4.5 hrs",
    windsorFare: 3600,
    zsFare: 4000,
  },
  {
    id: "nashik-pune",
    label: "Nashik → Pune",
    from: "Nashik",
    to: "Pune",
    distance: "210 km",
    duration: "Approx. 4.5 hrs",
    windsorFare: 3600,
    zsFare: 4000,
  },
];

export default function EvExperience() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("pune-mumbai");

  const currentRoute =
    EV_ROUTES.find((r) => r.id === selectedRouteId) || EV_ROUTES[0];

  const differentiators = [
    {
      icon: "🛑",
      title: "Zero Surge Pricing",
      desc: "Unlike cab aggregators that spike prices 1.5x–2.5x during rain or rush hours, our EV fares are 100% fixed and transparent 365 days a year.",
    },
    {
      icon: "⚡",
      title: "Zero Range Anxiety",
      desc: "Every EV arrives at your doorstep charged above 90%. All intercity expressway routes are monitored with pre-planned fast-charging buffers.",
    },
    {
      icon: "👨‍✈️",
      title: "Certified EV Chauffeurs",
      desc: "Our drivers are specially trained for smooth electric acceleration and regenerative braking, delivering an ultra-smooth ride with zero motion sickness.",
    },
    {
      icon: "🌱",
      title: "Real Carbon Savings",
      desc: "Cut approximately 35 kg of CO₂ per one-way Pune–Mumbai trip. Breathe cleaner air and travel guilt-free in modern, silent electric luxury.",
    },
  ];

  const buildBookingUrl = (
    modelName: string,
    fare: number
  ) => {
    const params = new URLSearchParams({
      vehicle: modelName,
      model: modelName,
      category: "EV",
      from: currentRoute.from,
      to: currentRoute.to,
      price: String(fare),
      seats: "4",
      bags: "2",
    });
    return `/cabs/details?${params.toString()}`;
  };

  const whatsappEvEnquiryUrl = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(
    `Hi D&G Express Cabs, I'm interested in booking an EV cab (${currentRoute.from} to ${currentRoute.to}). Could you help me with availability?`
  )}`;

  return (
    <section className="py-20 lg:py-28 bg-[#f4f8f3] relative overflow-hidden" id="ev">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#62c33a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#123f38]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf5e7] border border-[#c2e2be] text-[#2d7335] text-xs font-extrabold tracking-wider uppercase mb-4 shadow-sm">
            <span>⚡</span>
            <span>100% Electric · Green Mobility</span>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-[#123f38] mb-5">
            Intercity Outstation Cabs, <br className="hidden sm:inline" />
            <span className="text-[#3d9646]">Now 100% Electric &amp; Silent.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5e6d66] leading-relaxed">
            Say goodbye to engine vibrations, diesel fumes, and surge pricing. Experience executive comfort on Maharashtra&apos;s busiest corridors with D&amp;G Express Cabs&apos; modern green fleet.
          </p>
        </div>

        {/* Feel Good Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dce5da] shadow-sm text-center flex flex-col items-center justify-center">
            <span className="text-2xl mb-1.5">🍃</span>
            <span className="text-xl sm:text-2xl font-black text-[#123f38]">~35 kg</span>
            <span className="text-xs sm:text-[13px] font-semibold text-[#718079] mt-0.5">CO₂ Saved per Trip</span>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dce5da] shadow-sm text-center flex flex-col items-center justify-center">
            <span className="text-2xl mb-1.5">🤫</span>
            <span className="text-xl sm:text-2xl font-black text-[#123f38]">0 dB</span>
            <span className="text-xs sm:text-[13px] font-semibold text-[#718079] mt-0.5">Engine Noise &amp; Shakes</span>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dce5da] shadow-sm text-center flex flex-col items-center justify-center">
            <span className="text-2xl mb-1.5">🛡️</span>
            <span className="text-xl sm:text-2xl font-black text-[#123f38]">100%</span>
            <span className="text-xs sm:text-[13px] font-semibold text-[#718079] mt-0.5">Fixed Honest Pricing</span>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dce5da] shadow-sm text-center flex flex-col items-center justify-center">
            <span className="text-2xl mb-1.5">🔌</span>
            <span className="text-xl sm:text-2xl font-black text-[#123f38]">Fast DC</span>
            <span className="text-xs sm:text-[13px] font-semibold text-[#718079] mt-0.5">Expressway Fast Charging</span>
          </div>
        </div>

        {/* Quick EV Booking & Fleet Showcase Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#dce5da] shadow-xl mb-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#edf2ec] mb-8">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#3d9646] mb-1">
                INSTANT EV RESERVATIONS
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123f38] tracking-tight">
                Choose Your Route &amp; Ride Electric
              </h3>
            </div>

            {/* Route Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {EV_ROUTES.map((route) => {
                const isActive = route.id === selectedRouteId;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#123f38] text-white shadow-md scale-[1.02]"
                        : "bg-[#f4f7f4] text-[#5e6d66] hover:bg-[#e6eee5] hover:text-[#123f38]"
                    }`}
                  >
                    <span>⚡</span>
                    <span>{route.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Route Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f8faf7] p-4 rounded-2xl border border-[#e2eade] mb-8">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#62c33a]/20 text-[#2d7335] flex items-center justify-center font-bold text-lg">
                📍
              </span>
              <div>
                <span className="text-sm font-extrabold text-[#123f38] block">
                  {currentRoute.from} to {currentRoute.to}
                </span>
                <span className="text-xs text-[#718079]">
                  One-Way Expressway Route · {currentRoute.distance} · {currentRoute.duration}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2d7335] bg-[#edf5e7] px-3.5 py-2 rounded-xl border border-[#cbe2c8]">
              <span>✓ All Tolls, Taxes &amp; GST included</span>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* MG Windsor EV Card */}
            <div className="rounded-2xl border border-[#dce5da] bg-[#fafbf9] p-5 sm:p-6 hover:border-[#62c33a] hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#edf5e7] text-[#2d7335] border border-[#c2e2be]">
                    Aero Lounge Cabin
                  </span>
                  <span className="text-xs font-semibold text-[#718079]">
                    👤 4 Seats · 🧳 2 Bags
                  </span>
                </div>

                <div className="relative w-full h-44 sm:h-48 mb-4 rounded-xl overflow-hidden bg-white p-3 flex items-center justify-center border border-[#e8eee6]">
                  <Image
                    src="/images/windsor.webp"
                    alt="MG Windsor EV"
                    width={320}
                    height={180}
                    className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-xl font-extrabold text-[#123f38] mb-1">
                  MG Windsor EV
                </h4>
                <p className="text-xs sm:text-sm text-[#718079] mb-4">
                  135° reclining rear seats, ultra-spacious legroom, and whisper-quiet suspension for ultimate passenger comfort.
                </p>

                <div className="space-y-1.5 mb-6 text-xs font-semibold text-[#485650]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3d9646]">✓</span>
                    <span>Panoramic glass skyroof with ambient lighting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3d9646]">✓</span>
                    <span>High-speed USB device charging &amp; silent AC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3d9646]">✓</span>
                    <span>Free cancellation up to 2 hours before trip</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e5ebe4] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#718079] block">
                    Fixed Total Fare
                  </span>
                  <span className="text-2xl font-black text-[#123f38]">
                    {formatINR(currentRoute.windsorFare)}
                  </span>
                </div>
                <Link
                  href={buildBookingUrl("MG Windsor EV", currentRoute.windsorFare)}
                  className="px-5 py-2.5 rounded-xl bg-[#62c33a] hover:bg-[#52ad2e] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Book Windsor</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* MG ZS EV Card */}
            <div className="rounded-2xl border border-[#dce5da] bg-[#fafbf9] p-5 sm:p-6 hover:border-[#62c33a] hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#edf5e7] text-[#2d7335] border border-[#c2e2be]">
                    Executive Luxury SUV
                  </span>
                  <span className="text-xs font-semibold text-[#718079]">
                    👤 4 Seats · 🧳 2 Bags
                  </span>
                </div>

                <div className="relative w-full h-44 sm:h-48 mb-4 rounded-xl overflow-hidden bg-white p-3 flex items-center justify-center border border-[#e8eee6]">
                  <Image
                    src="/images/zs.jpeg"
                    alt="MG ZS EV"
                    width={320}
                    height={180}
                    className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-xl font-extrabold text-[#123f38] mb-1">
                  MG ZS EV
                </h4>
                <p className="text-xs sm:text-sm text-[#718079] mb-4">
                  Long-range flagship electric SUV with 50.3 kWh battery, plush leatherette seating, and 5-star European safety credentials.
                </p>

                <div className="space-y-1.5 mb-6 text-xs font-semibold text-[#485650]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3d9646]">✓</span>
                    <span>5-Star Euro NCAP safety &amp; advanced stability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3d9646]">✓</span>
                    <span>Deep luggage trunk for large outstation bags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3d9646]">✓</span>
                    <span>Direct highway pickup &amp; doorstep drop-off</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e5ebe4] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#718079] block">
                    Fixed Total Fare
                  </span>
                  <span className="text-2xl font-black text-[#123f38]">
                    {formatINR(currentRoute.zsFare)}
                  </span>
                </div>
                <Link
                  href={buildBookingUrl("MG ZS EV", currentRoute.zsFare)}
                  className="px-5 py-2.5 rounded-xl bg-[#123f38] hover:bg-[#1b554c] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Book ZS EV</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Different from Other Service Providers */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#3d9646] mb-2">
              THE D&amp;G GREEN ADVANTAGE
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123f38] tracking-tight">
              Why Travelers Choose D&amp;G EV Over Ordinary Cabs
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((point) => (
              <div
                key={point.title}
                className="bg-white p-6 rounded-2xl border border-[#dce5da] shadow-sm hover:shadow-md transition-all flex flex-col justify-start"
              >
                <div className="w-12 h-12 rounded-xl bg-[#edf5e7] border border-[#cbe2c8] flex items-center justify-center text-2xl mb-4">
                  {point.icon}
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-[#123f38] mb-2">
                  {point.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5e6d66] leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feel Good Footer Banner / Contact Strip */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123f38] to-[#1c574d] p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#62c33a]/20 border border-[#62c33a]/30 text-[#aee27d] text-xs font-bold uppercase mb-3">
              <span>🌿</span>
              <span>Corporate &amp; Customized Trips</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Need a Customized EV Itinerary or Round-Trip?
            </h4>
            <p className="text-sm sm:text-base text-[#c8ded5] leading-relaxed">
              Planning multiple business stops in Mumbai or a family weekend in Nashik? Our fleet specialists can arrange bespoke EV packages tailored to your schedule.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={whatsappEvEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#62c33a] hover:bg-[#52ad2e] text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>💬</span>
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="#booking"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>Search Other Dates</span>
              <span>↑</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
