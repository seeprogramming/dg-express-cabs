import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "D&G Express Cabs — Rides, Airports & Tours",
    template: "%s | D&G Express Cabs",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "cabs in pune",
    "pune to mumbai cab",
    "mahabaleshwar tour package",
    "airport taxi pune",
    "mumbai airport cab",
    "sedan ertiga crysta outstation",
  ],
  authors: [{ name: "D&G Express Cabs" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "D&G Express Cabs — Rides, Airports & Tours",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.stockImages.hero,
        width: 1200,
        height: 630,
        alt: "D&G Express Cabs Outstation & Airport Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D&G Express Cabs — Rides, Airports & Tours",
    description: siteConfig.description,
    images: [siteConfig.stockImages.hero],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "D&G Express Cabs",
    "description": siteConfig.description,
    "telephone": "+917030813082",
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/dgxcabs.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sant Nagar, Lohgaon, Near Pune International Airport",
      "addressLocality": "Pune",
      "postalCode": "411047",
      "addressCountry": "IN",
    },
    "areaServed": ["Pune", "Mumbai", "Mahabaleshwar", "Nashik", "Lonavala"],
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
