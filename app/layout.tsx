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
    default: "RelaxCabs — Rides, Airports & Tours",
    template: "%s | RelaxCabs",
  },
  description: siteConfig.description,
  keywords: [
    "cabs in pune",
    "pune to mumbai cab",
    "mahabaleshwar tour package",
    "airport taxi pune",
    "mumbai airport cab",
    "sedan ertiga crysta outstation",
  ],
  authors: [{ name: "RelaxCabs" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "RelaxCabs — Rides, Airports & Tours",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.stockImages.hero,
        width: 1200,
        height: 630,
        alt: "RelaxCabs Outstation & Airport Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RelaxCabs — Rides, Airports & Tours",
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
    "@type": "AutoRental",
    "name": "RelaxCabs",
    "description": siteConfig.description,
    "telephone": siteConfig.phoneFormatted,
    "url": siteConfig.url,
    "areaServed": ["Pune", "Mumbai", "Mahabaleshwar", "Nashik", "Lonavala"],
    "priceRange": "₹₹",
    "openingHours": "Mo-Su 00:00-24:00",
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
