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
  title: string;
  activities: string[];
}

export interface PackageDuration {
  days: number;
  nights: number;
  label: string;
}

export interface PackagePrices {
  currency: string;
  sedan: number;
  ertiga: number;
  crysta: number;
}

export interface TourPackage {
  id: string;
  route: {
    from: string;
    to: string;
    return_to?: string;
  };
  option?: number;
  title: string;
  duration: PackageDuration;
  status?: string;
  description?: string;
  best_for?: string;
  section?: string;
  itinerary: ItineraryDay[];
  prices: PackagePrices;
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
