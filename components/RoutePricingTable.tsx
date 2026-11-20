import websiteRates from "@/data/website-rates.json";
import vehiclesData from "@/data/vehicles.json";
import { siteConfig } from "@/config/site";

interface VehicleRow {
  key: string;
  label: string;
  model: string;
  seats: number;
  icon: string;
  fare: number;
}

interface Props {
  from: string;
  to: string;
}

const VEHICLE_ORDER = [
  "hatchback",
  "sedan",
  "suv",
  "windsor",
  "zs",
  "innova_kia_carens",
  "innova_crysta",
  "hycross",
  "vinfast",
  "byd",
] as const;

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Looks up the factual one-way fares for the given route from website-rates.json */
function getRouteFares(from: string, to: string): Record<string, number> | null {
  const norm = (v: string) => v.trim().toLowerCase();
  const routes = websiteRates.one_way as Array<{
    from: string;
    to: string;
    fares: Record<string, number>;
  }>;
  const match = routes.find(
    (r) => norm(r.from) === norm(from) && norm(r.to) === norm(to)
  );
  return match ? match.fares : null;
}

/** Returns vehicle metadata (model, seats, icon) from vehicles.json keyed by rate key */
function buildVehicleMap(): Record<
  string,
  { label: string; model: string; seats: number; icon: string }
> {
  const keyMapping: Record<string, string> = {
    hatchback: "Hatchback",
    sedan: "Sedan",
    suv: "SUV",
    windsor: "windsor",
    zs: "zs",
    innova_kia_carens: "Innova / Kia Carens",
    innova_crysta: "Innova Crysta",
    hycross: "Toyota Hycross",
    vinfast: "VinFast VF7",
    byd: "BYD 7 Seater",
  };
  const result: Record<
    string,
    { label: string; model: string; seats: number; icon: string }
  > = {};
  const vehicles = vehiclesData as Array<{
    category: string;
    model: string;
    seats: number;
    icon: string;
    rateKey?: string;
  }>;
  for (const [rateKey, categoryName] of Object.entries(keyMapping)) {
    const v = vehicles.find(
      (veh) =>
        veh.rateKey === rateKey ||
        veh.model?.toLowerCase().includes(rateKey) ||
        veh.category === categoryName
    );
    result[rateKey] = {
      label: websiteRates.vehicle_labels[rateKey as keyof typeof websiteRates.vehicle_labels] || categoryName,
      model: v?.model || categoryName,
      seats: v?.seats || 4,
      icon: v?.icon || "🚗",
    };
  }
  return result;
}

export default function RoutePricingTable({ from, to }: Props) {
  const fares = getRouteFares(from, to);
  if (!fares) return null;

  const vehicleMap = buildVehicleMap();

  const rows: VehicleRow[] = [];
  for (const key of VEHICLE_ORDER) {
    if (fares[key] == null) continue;
    const meta = vehicleMap[key];
    rows.push({
      key,
      label: meta.label,
      model: meta.model,
      seats: meta.seats,
      icon: meta.icon,
      fare: fares[key],
    });
  }

  if (rows.length === 0) return null;

  const validFares = rows.map((r) => r.fare).filter((f) => f > 0);
  const lowestFare = validFares.length > 0 ? Math.min(...validFares) : 0;
  const whatsappText = encodeURIComponent(
    `Hi D&G Express Cabs, I want to book a cab from ${from} to ${to}.`
  );

  return (
    <section className="section white" id="pricing">
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="head">
          <div>
            <div className="ey">FARE DETAILS</div>
            <h2>
              {from} to {to} Cab Fare
            </h2>
          </div>
          <p>
            Starting from {formatINR(lowestFare)} for one-way travel. All prices
            are for a cab with driver.
          </p>
        </div>

        <div className="pricingTable" style={{ overflowX: "auto", marginTop: "24px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--g, #123f38)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "12px 16px", borderRadius: "10px 0 0 0" }}>
                  Vehicle
                </th>
                <th style={{ padding: "12px 16px" }}>Seats</th>
                <th style={{ padding: "12px 16px" }}>One-Way Fare</th>
                <th
                  style={{ padding: "12px 16px", borderRadius: "0 10px 0 0" }}
                >
                  Book
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.key}
                  style={{
                    background: i % 2 === 0 ? "#f7faf4" : "#fff",
                    borderBottom: "1px solid #e2e8df",
                  }}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                    <span style={{ marginRight: "8px" }}>{row.icon}</span>
                    {row.label}
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--muted, #718079)",
                        fontWeight: 400,
                        marginTop: "2px",
                      }}
                    >
                      {row.model}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--muted, #718079)",
                    }}
                  >
                    Up to {row.seats}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 700,
                      color: "var(--g, #123f38)",
                      fontSize: row.fare === 0 ? "14px" : "17px",
                    }}
                  >
                    {row.fare === 0 ? (
                      <div>
                        <span>Rates on Call</span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#92400e",
                            marginTop: "2px",
                          }}
                        >
                          ✨ Luxury Segment
                        </span>
                      </div>
                    ) : (
                      formatINR(row.fare)
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                        row.fare === 0
                          ? `Hi D&G Express Cabs, I want to book a ${row.label} (${row.model}) from ${from} to ${to}. Please discuss rates with me.`
                          : `Hi D&G Express Cabs, I want to book a ${row.label} from ${from} to ${to}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn green"
                      style={{ fontSize: "13px", padding: "8px 14px" }}
                      aria-label={`Book ${row.label} from ${from} to ${to}`}
                    >
                      {row.fare === 0 ? "Call / WhatsApp" : "Book via WhatsApp"}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          style={{
            marginTop: "14px",
            fontSize: "13px",
            color: "var(--muted, #718079)",
          }}
        >
          * Fare shown is based on the current route pricing provided by D&amp;G Express Cabs.
        </p>
      </div>
    </section>
  );
}
