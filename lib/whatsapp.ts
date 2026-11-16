import { siteConfig } from "@/config/site";

export function generateWhatsAppBookingUrl(details: {
  vehicle: string;
  model: string;
  from: string;
  to: string;
  date?: string;
  time?: string;
  returnDate?: string;
  returnTime?: string;
  name?: string;
  packageTitle?: string;
  tripType?: string;
}): string {
  const d = details.date || "To be confirmed";
  const timeStr = details.time ? ` at ${details.time}` : "";
  const n = details.name ? ` Name: ${details.name}` : "";
  const t = details.tripType ? ` [${details.tripType}]` : "";
  const ret = details.returnDate
    ? `, Return: ${details.returnDate}${details.returnTime ? ` at ${details.returnTime}` : ""}`
    : "";
  let message = "";

  if (details.packageTitle) {
    message = `Hi D&G Express Cabs, I'm interested in booking the tour package "${details.packageTitle}" from ${details.from} on ${d}${timeStr}.${n}`;
  } else {
    message = `Hi D&G Express Cabs, I want to book a ${details.vehicle} (${details.model}) for ${details.from} to ${details.to}${t} on ${d}${timeStr}${ret}.${n}`;
  }

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getQrCodeImageUrl(contentUrl: string, size: number = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    contentUrl
  )}`;
}
