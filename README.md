# RelaxCabs — Next.js Outstation Cabs & Holiday Packages

Production-quality Next.js application migrated from the RelaxCabs static website.

## Tech Stack
- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables (RelaxCabs design tokens)
- **Fonts**: Google Fonts (`Plus Jakarta Sans` and `DM Sans` via `next/font/google`)
- **Icons & QR**: `lucide-react`, dynamic WhatsApp URL generator & QR code renderer
- **Data Architecture**: Structured JSON in `/data` (`routes.json`, `vehicles.json`, `airports.json`, `packages/mahabaleshwar.json`)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

## Project Structure
```
├── app/
│   ├── layout.tsx                     # Root layout with fonts, metadata, and JSON-LD schema
│   ├── page.tsx                       # Homepage assembling all sections
│   ├── cabs/
│   │   ├── [route]/page.tsx           # Dynamic SEO outstation route pages (/cabs/pune-to-mumbai, etc.)
│   │   └── details/page.tsx           # Interactive cab details & booking page
│   ├── packages/
│   │   ├── page.tsx                   # All packages directory
│   │   └── [category]/
│   │       ├── page.tsx               # Category landing page (/packages/mahabaleshwar)
│   │       └── [slug]/page.tsx        # Individual package itinerary & booking page
│   ├── airports/page.tsx              # Airport transfers landing page
│   ├── booking/page.tsx               # Online cab booking page
│   ├── sitemap.ts                     # Dynamic sitemap generator
│   └── robots.ts                      # Dynamic robots.txt
├── components/
│   ├── Header.tsx                     # Sticky frosted navigation bar
│   ├── Footer.tsx                     # Brand footer with services and support
│   ├── Hero.tsx                       # Emerald hero section with headline and visual aura
│   ├── CabSearch.tsx                  # Interactive tabbed search & fare calculation (Client)
│   ├── PopularRides.tsx               # Popular routes cards with starting fares
│   ├── AirportTransfers.tsx           # Airport transfer cards with IATA codes
│   ├── PackageSection.tsx             # Curated holiday packages grid & cards
│   ├── PackageHero.tsx                # Package details hero
│   ├── PackageItinerary.tsx           # Day-by-day timeline with bulleted activities
│   ├── PackagePricing.tsx             # Multi-vehicle pricing & interactive WhatsApp booking
│   ├── CabDetails.tsx                 # Full cab details, specs, booking form & QR
│   ├── InclusionExclusion.tsx         # Trip inclusions and exclusions grid
│   ├── WhyChooseUs.tsx                # Story, editorial band, promises, comfort cards
│   ├── RouteRibbon.tsx                # Quick route filter pills
│   └── TravelGallery.tsx              # Photography strip
├── config/
│   └── site.ts                        # Central site configuration, phone & WhatsApp number
├── data/
│   ├── routes.json                    # Popular routes & fares
│   ├── vehicles.json                  # Vehicle categories, multipliers, capacities
│   ├── airports.json                  # Airport hubs (PNQ, BOM, ISK)
│   └── packages/
│       └── mahabaleshwar.json         # Complete unabridged Mahabaleshwar tour packages
├── lib/
│   ├── packages.ts                    # Package querying and formatters
│   ├── routes.ts                      # Route finder and dynamic fare calculations
│   └── whatsapp.ts                    # Dynamic WhatsApp prefilled message & QR generator
├── types/
│   └── index.ts                       # TypeScript interfaces
├── next.config.ts                     # Remote image patterns configured
└── tailwind.config.ts                 # RelaxCabs color theme and font mappings
```

## WhatsApp Integration
The business phone number is configured in one central file: [`config/site.ts`](config/site.ts).
All WhatsApp buttons and QR codes dynamically generate pre-filled booking requests with vehicle, route, travel date, customer name, and package details.
