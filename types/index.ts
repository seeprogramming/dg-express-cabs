export interface RouteInfo {
  from: string;
  to: string;
  fare: number;
}

export interface VehicleInfo {
  category: string;
  model: string;
  seats: number;
  bags: number;
  multiplier: number;
  icon: string;
  image?: string;
  badge?: string;
}

export interface AirportInfo {
  city: string;
  code: string;
  fare: number;
  image?: string;
  description?: string;
}

export interface ItineraryDay {
  day: number;
  title?: string;
  activities: string[];
}

export interface PackageDuration {
  days: number;
  nights: number;
  label: string;
}

/** Prices can be flat numbers (Goa/Konkan/Mahabaleshwar) or objects with amount+pax (Ashtavinayak/Jyotirlinga) */
export type PriceValue = number | { amount: number; pax?: number };

export interface PackagePrices {
  currency?: string;
  sedan: PriceValue;
  ertiga: PriceValue;
  crysta: PriceValue;
}

/** Extract the numeric amount from a PriceValue */
export function getPriceAmount(price: PriceValue): number {
  return typeof price === "number" ? price : price.amount;
}

export interface TourPackage {
  id: string;
  route: {
    from: string;
    to?: string;
    return_to?: string;
    stops?: string[];
  };
  option?: number;
  variant?: string;
  title: string;
  duration: PackageDuration;
  status?: string;
  description?: string;
  best_for?: string;
  section?: string;
  route_sequence?: string;
  itinerary?: ItineraryDay[];
  prices: PackagePrices;
  image?: string;
}

export interface BookingDetails {
  vehicle: string;
  model: string;
  seats: number;
  bags: number;
  from: string;
  to: string;
  date: string;
  price?: number;
  name?: string;
  mobile?: string;
  pickup?: string;
  notes?: string;
}
