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
  serviceAvailable: boolean; // false → hidden from the service-booking store picker
  photo?: string;            // public/ path to a real storefront photo; if absent, a brand card is shown
  serviceAddress?: string;   // service centre address when it differs from the showroom/experience centre
}

export const WHATSAPP_NUMBER = "918047182200";
export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const stores: Store[] = [
  {
    id: "koramangala",
    name: "Koramangala",
    slug: "koramangala",
    address: "#474, 6th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560095",
    locality: "Koramangala, Bengaluru",
    postalCode: "560095",
    hours: "Mon–Sun · 9:30 AM – 8:00 PM",
    openingHours: "Mo-Su 09:30-20:00",
    phoneDisplay: "+91 80 4718 2200",
    phoneTel: "+918047182200",
    geo: { lat: 12.9402927, lng: 77.6249765 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ather+Space+Koramangala+474+80+Feet+Road+6th+Block+Bengaluru+560095",
    mapEmbed: "https://www.google.com/maps?q=Ather+Space+Koramangala+474+80+Feet+Road+6th+Block+Bengaluru+560095&output=embed",
    serviceAvailable: true,
    photo: "/stores/koramangala.jpg",
    serviceAddress: "620, 17th A Main Rd, 6th Block, Koramangala, Bengaluru, Karnataka 560095",
  },
  {
    id: "hsr-layout",
    name: "HSR Layout",
    slug: "hsr-layout",
    address: "14, 9th Main, 13th Cross Road, Sector 6, HSR Layout, Bengaluru, Karnataka 560102",
    locality: "HSR Layout, Bengaluru",
    postalCode: "560102",
    hours: "Mon–Sun · 9:30 AM – 8:00 PM",
    openingHours: "Mo-Su 09:30-20:00",
    phoneDisplay: "+91 80 4718 2233",
    phoneTel: "+918047182233",
    geo: { lat: 12.9137705, lng: 77.6292697 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ather+Space+HSR+Layout+14+9th+Main+13th+Cross+Sector+6+Bengaluru+560102",
    mapEmbed: "https://www.google.com/maps?q=Ather+Space+HSR+Layout+14+9th+Main+13th+Cross+Sector+6+Bengaluru+560102&output=embed",
    serviceAvailable: false, // HSR service station not yet operational (2026-07-30)
    photo: "/stores/hsr.jpg",
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
// ratingValue/reviewCount read live from the Koramangala Google Business listing
// on 2026-07-30 (4.6 ★ / 396 reviews). Re-check periodically — reviewCount drifts.
export const dealer = {
  name: "Autoelite",
  legalName: "Autoelite Mobility Pvt Ltd",
  brand: "Ather",
  tagline: "Authorized Ather dealer for south Bengaluru.",
  delivered: "1,200+",
  ratingValue: 4.6,
  reviewCount: 396,
  ratingVerified: "2026-07-30",
  googleReviewsUrl:
    "https://www.google.com/maps/place/Ather+Electric+Scooter+Showroom+in+Koramangala,+Bangalore/data=!4m2!3m1!1s0x0:0x6da654817582f5d4",
  url: "https://www.autoelite.in",
};

export interface Review {
  author: string;
  rating: number;      // stars, 1–5
  date: string;        // approx. month from Google's relative timestamp (captured 2026-07-30)
  store: "Koramangala"; // listing the review belongs to
  text: string;        // verbatim from Google — do not paraphrase
}

// Curated 5★ reviews, copied verbatim from the Koramangala Google listing
// (captured 2026-07-30, sorted "Highest rating"). These are real customers'
// public words — do not edit the text; to change the selection, swap whole
// entries. Aggregate rating/count + the "all reviews" link live on `dealer`.
export const reviews: Review[] = [
  {
    author: "John Mathew",
    rating: 5,
    date: "Jun 2026",
    store: "Koramangala",
    text: "I recently took delivery of my new Ather 450X, and I had a wonderful experience throughout the process. The delivery was smooth, and I was provided with detailed information about the vehicle. A special thanks to Kumaran, who explained every feature and aspect of the Ather 450X very clearly and patiently. His knowledge and professionalism made the experience even better. Thank you, Kumaran, and the entire Ather team for making my new vehicle delivery a memorable one!",
  },
  {
    author: "S. Bharath Bhushan",
    rating: 5,
    date: "Jun 2026",
    store: "Koramangala",
    text: "I recently purchased my Ather X from the Koramangala showroom, and I had a wonderful experience thanks to Mr. Pawan. From the very beginning, he was patient, knowledgeable, and always ready to answer all my questions. He guided me through the entire process smoothly and made the buying experience completely hassle-free. His professionalism, friendly attitude, and prompt support really stood out.",
  },
  {
    author: "anu pallavi",
    rating: 5,
    date: "May 2026",
    store: "Koramangala",
    text: "Had a great experience at the Ather showroom in Koramangala. The showroom atmosphere was very welcoming and the staff were professional and helpful throughout the visit. Special thanks to Shashank, the Product Specialist, for explaining all the features in detail and patiently answering every question. Highly recommended for anyone planning to buy an electric scooter!",
  },
  {
    author: "Manu sb",
    rating: 5,
    date: "May 2026",
    store: "Koramangala",
    text: "It was a very good experience at Ather Koramangala. Mr. Rakshith is very polite and gave me complete insights about the product. He helped me throughout my purchasing process. It was a smooth auto delivery — all credit goes to the sales staff, especially Rakshith. I will recommend this showroom for a smooth and better experience.",
  },
  {
    author: "Ashok Asirvatham",
    rating: 5,
    date: "May 2026",
    store: "Koramangala",
    text: "Had a good experience with Ather Koramangala. Sashank the sales guy and Kumaran delivery lead were so kind and helped all through the process. I got my bike delivery before the eta. Happy buying my 1st EV.",
  },
  {
    author: "Praveen Kumar",
    rating: 5,
    date: "Jun 2026",
    store: "Koramangala",
    text: "Kumaran was very good at explaining the bike's performance in detail. He patiently answered all my questions and provided clear comparisons between different models. His communication was polite and professional. He also explained the service and maintenance aspects, which gave me confidence in the purchase decision. Overall, his product knowledge and customer-friendly approach made the experience very satisfactory.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  { q: "Can I test ride near me?", a: "Yes — at our Koramangala or HSR Layout showroom, or we'll bring the scooter to your home. Book online in under a minute." },
  { q: "What's the real on-road price?", a: "Ex-showroom is only part of it. Use our On-Road Price tool for an itemised Bengaluru total — RTO, insurance and subsidy included." },
  { q: "Do you handle finance?", a: "Yes, in-store. Zero down payment options, low EMIs, and we help with the paperwork." },
  { q: "Can I charge in an apartment?", a: "Most societies allow it — an Ather home charger fits a standard plug point. We'll guide you on society permissions and installation." },
  { q: "Where do I service it?", a: "At either Autoelite store, with pickup and drop across Koramangala and HSR, genuine Ather parts only." },
  { q: "Do you buy my old scooter?", a: "We run exchange offers on most models — bring your current two-wheeler and we'll value it against your new Ather at either store." },
];
