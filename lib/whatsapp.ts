import { siteConfig } from "@/config/site";

export function generateWhatsAppBookingUrl(details: {
  vehicle: string;
  model: string;
  from: string;
  to: string;
  date?: string;
  name?: string;
  packageTitle?: string;
}): string {
  const d = details.date || "To be confirmed";
  const n = details.name ? ` Name: ${details.name}` : "";
  let message = "";

  if (details.packageTitle) {
    message = `Hi RelaxCabs, I'm interested in booking the tour package "${details.packageTitle}" from ${details.from} on ${d}.${n}`;
  } else {
    message = `Hi RelaxCabs, I want to book a ${details.vehicle} (${details.model}) for ${details.from} to ${details.to} on ${d}.${n}`;
  }

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getQrCodeImageUrl(contentUrl: string, size: number = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    contentUrl
  )}`;
}
