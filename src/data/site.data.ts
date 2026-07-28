/**
 * AUTOELITE — DEALER / SITE DATA (stores, contact, FAQ).
 * Scooter data lives in scooters.data.ts. This file holds everything about the
 * dealership itself. Edit here to change store details, phones or FAQs site-wide.
 */

export interface Store {
  id: "koramangala" | "hsr-layout";
  name: string;          // "Koramangala"
  slug: string;          // route segment
  address: string;
  locality: string;      // for schema
  postalCode: string;
  hours: string;         // human string
  openingHours: string;  // schema format "Mo-Su 09:30-20:00"
  phoneDisplay: string;  // "+91 80 4718 2200"
  phoneTel: string;      // "+918047182200"
  geo: { lat: number; lng: number };
  mapsUrl: string;
  mapEmbed: string;
}

export const WHATSAPP_NUMBER = "918047182200";
export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const stores: Store[] = [
  {
    id: "koramangala",
    name: "Koramangala",
    slug: "koramangala",
    address: "123, 80 Feet Road, 4th Block, Koramangala, Bengaluru 560034",
    locality: "Koramangala, Bengaluru",
    postalCode: "560034",
    hours: "Mon–Sun · 9:30 AM – 8:00 PM",
    openingHours: "Mo-Su 09:30-20:00",
    phoneDisplay: "+91 80 4718 2200",
    phoneTel: "+918047182200",
    geo: { lat: 12.9352, lng: 77.6245 },
    mapsUrl: "https://maps.google.com/?q=Autoelite+Koramangala+Bengaluru",
    mapEmbed: "https://www.google.com/maps?q=Koramangala,Bengaluru&output=embed",
  },
  {
    id: "hsr-layout",
    name: "HSR Layout",
    slug: "hsr-layout",
    address: "45, 27th Main, Sector 2, HSR Layout, Bengaluru 560102",
    locality: "HSR Layout, Bengaluru",
    postalCode: "560102",
    hours: "Mon–Sun · 9:30 AM – 8:00 PM",
    openingHours: "Mo-Su 09:30-20:00",
    phoneDisplay: "+91 80 4718 2233",
    phoneTel: "+918047182233",
    geo: { lat: 12.9116, lng: 77.6412 },
    mapsUrl: "https://maps.google.com/?q=Autoelite+HSR+Layout+Bengaluru",
    mapEmbed: "https://www.google.com/maps?q=HSR+Layout,Bengaluru&output=embed",
  },
];

export const storeBySlug = (slug: string) => stores.find((s) => s.slug === slug);

// Resolve a store label ("Koramangala" / "HSR Layout" / "At my home" / undefined)
// to a Store, for the call-us fallback. Defaults to the primary store.
export function storePhoneFor(store?: string): Store {
  const match = stores.find((s) => s.name.toLowerCase() === (store ?? "").toLowerCase());
  return match ?? stores[0];
}

// Dealer-supplied marketing claims (used in trust bar + schema aggregateRating).
// Replace with the live figures before launch.
export const dealer = {
  name: "Autoelite",
  legalName: "Autoelite Mobility Pvt Ltd",
  brand: "Ather",
  tagline: "Authorized Ather dealer for south Bengaluru.",
  delivered: "1,200+",
  ratingValue: 4.8,
  reviewCount: 340,
  url: "https://autoelite.example",
};

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  { q: "Can I test ride near me?", a: "Yes — at our Koramangala or HSR Layout showroom, or we'll bring the scooter to your home. Book online in under a minute." },
  { q: "What's the real on-road price?", a: "Ex-showroom is only part of it. Use our On-Road Price tool for an itemised Bengaluru total — RTO, insurance and subsidy included." },
  { q: "Do you handle finance?", a: "Yes, in-store. Zero down payment options, low EMIs, and we help with the paperwork." },
  { q: "Can I charge in an apartment?", a: "Most societies allow it — an Ather home charger fits a standard plug point. We'll guide you on society permissions and installation." },
  { q: "Where do I service it?", a: "At either Autoelite store, with pickup and drop across Koramangala and HSR, genuine Ather parts, and a first-service reminder." },
  { q: "Do you buy my old scooter?", a: "We run exchange offers on most models — bring your current two-wheeler and we'll value it against your new Ather at either store." },
];
