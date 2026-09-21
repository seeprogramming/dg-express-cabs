"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/packages";
import { siteConfig } from "@/config/site";
import type { RouteInfo } from "@/types";

type Mode = "one_way" | "round_trip" | "local_rentals";

interface LocalPlan {
  hours: number;
  km: number;
  label: string;
  fare: number;
}

interface LocalRentalVehicle {
  vehicle: string;
  plans: LocalPlan[];
}

interface AllRoutesClientProps {
  oneWayRoutes: RouteInfo[];
  roundTripRoutes: RouteInfo[];
  localRentals: LocalRentalVehicle[];
}

function getRouteImage(to: string): string {
  const t = (to || "").toLowerCase();
  if (t.includes("lonavala")) return siteConfig.stockImages.lonavala;
  if (t.includes("mahabaleshwar")) return siteConfig.stockImages.maha;
  if (t.includes("mumbai")) return siteConfig.stockImages.city;
  if (t.includes("nashik")) return siteConfig.stockImages.road;
  return siteConfig.stockImages.highway;
}

const modeConfig: Record<Mode, { label: string; icon: string }> = {
  one_way: { label: "One Way", icon: "➡️" },
  round_trip: { label: "Round Trip", icon: "🔄" },
  local_rentals: { label: "Local Rentals", icon: "⏱️" },
};

export default function AllRoutesClient({
  oneWayRoutes,
  roundTripRoutes,
  localRentals,
}: AllRoutesClientProps) {
  const [mode, setMode] = useState<Mode>("one_way");
  const [search, setSearch] = useState("");

  const routes = mode === "one_way" ? oneWayRoutes : roundTripRoutes;

  const filteredRoutes = useMemo(() => {
    if (!search.trim()) return routes;
    const q = search.trim().toLowerCase();
    return routes.filter(
      (r) =>
        r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q)
    );
  }, [routes, search]);

  // Get unique cities for the search placeholder
  const cities = useMemo(() => {
    const set = new Set<string>();
    [...oneWayRoutes, ...roundTripRoutes].forEach((r) => {
      set.add(r.from);
      set.add(r.to);
    });
    return Array.from(set).slice(0, 4).join(", ");
  }, [oneWayRoutes, roundTripRoutes]);

  return (
    <section className="section white" id="allRoutes">
      <div className="container">
        {/* Mode Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.keys(modeConfig) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setSearch("");
              }}
              className={`
                px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all duration-200 flex items-center gap-2
                ${
                  mode === m
                    ? "bg-[#123f38] text-white shadow-lg shadow-[#123f38]/25 scale-105"
                    : "bg-white text-[#5e6d66] border border-[#dce5da] hover:border-[#62c33a] hover:text-[#123f38] hover:shadow-md"
                }
              `}
            >
              <span>{modeConfig[m].icon}</span>
              {modeConfig[m].label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  mode === m
                    ? "bg-white/20 text-white"
                    : "bg-[#edf5e7] text-[#3d7c3a]"
                }`}
              >
                {m === "local_rentals"
                  ? localRentals.length
                  : m === "one_way"
                  ? oneWayRoutes.length
                  : roundTripRoutes.length}
              </span>
            </button>
          ))}
        </div>

        {/* Search — only for one_way / round_trip */}
        {mode !== "local_rentals" && (
          <div className="max-w-md mx-auto mb-10 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a5b3ac] text-lg pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by city — ${cities}…`}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#dce5da] bg-white text-sm font-bold text-[#123f38] placeholder:text-[#a5b3ac] focus:outline-none focus:border-[#62c33a] focus:ring-2 focus:ring-[#62c33a]/20 transition-all shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a5b3ac] hover:text-[#123f38] transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content: Route Cards or Local Rentals */}
        {mode !== "local_rentals" ? (
          <>
            {filteredRoutes.length === 0 ? (
              <div className="text-center py-16 text-[#a5b3ac]">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-bold">
                  No routes found for &quot;{search}&quot;
                </p>
                <p className="text-sm mt-1">Try a different city name</p>
              </div>
            ) : (
              <div className="grid4" id="routesGrid">
                {filteredRoutes.map((r) => {
                  const slug = `${r.from.toLowerCase()}-to-${r.to.toLowerCase()}`;
                  return (
                    <div className="card" key={`${mode}-${r.from}-${r.to}`}>
                      <div
                        className="art"
                        style={{
                          backgroundImage: `url(${getRouteImage(r.to)})`,
                        }}
                      >
                        <span
                          className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm"
                          style={{
                            background:
                              mode === "round_trip"
                                ? "rgba(98,195,58,.85)"
                                : "rgba(18,63,56,.75)",
                            color: "#fff",
                          }}
                        >
                          {modeConfig[mode].label}
                        </span>
                      </div>
                      <div className="body">
                        <h3>
                          {r.from} → {r.to}
                        </h3>
                        <p>
                          {mode === "one_way"
                            ? "One-way · Starting fare"
                            : "Round trip · Starting fare"}
                        </p>
                        <div className="bottom">
                          <div className="price">
                            <small>Starting at</small>
                            <b>{formatINR(r.fare)}</b>
                          </div>
                          <Link className="btn green" href={`/cabs/${slug}`}>
                            View cabs
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Local Rentals */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {localRentals.map((v) => (
              <div
                key={v.vehicle}
                className="bg-white rounded-3xl border border-[#dce5da] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-12 h-12 rounded-2xl bg-[#edf5e7] text-2xl flex items-center justify-center">
                    🚕
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#123f38]">
                      {v.vehicle}
                    </h3>
                    <p className="text-xs text-[#a5b3ac] font-bold">
                      Local city rental
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {v.plans.map((plan) => (
                    <div
                      key={plan.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#f7f5eb] border border-[#eef2eb] hover:border-[#62c33a] transition-colors"
                    >
                      <div>
                        <span className="text-sm font-extrabold text-[#123f38]">
                          {plan.hours} hrs / {plan.km} km
                        </span>
                        <span className="text-[11px] text-[#a5b3ac] ml-2 font-bold">
                          ({plan.label})
                        </span>
                      </div>
                      <span className="text-lg font-extrabold text-[#123f38]">
                        {formatINR(plan.fare)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                    `Hi, I'd like to book a ${v.vehicle} for local rental.`
                  )}`}
                  target="_blank"
                  className="btn green w-full mt-5 text-center"
                >
                  Book on WhatsApp
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
