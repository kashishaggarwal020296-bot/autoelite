import { dealer, Store } from "@/data/site.data";
import { Model, Variant, getExShowroom, getOnRoadPrice, onRoadConfig, OnRoadConfig } from "@/data/scooters.data";

// Renders a JSON-LD block. Pass any schema.org object.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // schema is developer-authored, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE = dealer.url;

export function autoDealerSchema(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${SITE}/stores/${store.slug}`,
    name: `Autoelite ${store.name}`,
    brand: { "@type": "Brand", name: "Ather" },
    parentOrganization: { "@type": "Organization", name: dealer.legalName },
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.locality,
      postalCode: store.postalCode,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: store.geo.lat, longitude: store.geo.lng },
    telephone: store.phoneTel,
    openingHours: store.openingHours,
    url: `${SITE}/stores/${store.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: dealer.ratingValue,
      reviewCount: dealer.reviewCount,
    },
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
}

export function productSchema(model: Model, variant: Variant, config: OnRoadConfig = onRoadConfig) {
  const price = getOnRoadPrice(variant, config);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Ather ${variant.name}`,
    category: "Electric Scooter",
    brand: { "@type": "Brand", name: "Ather" },
    url: `${SITE}/scooters/${model.id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: price,
      priceValidUntil: config.lastVerified,
      availability:
        variant.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: { "@type": "AutoDealer", name: dealer.name },
      // ex-showroom for reference
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        price: getExShowroom(variant),
        valueAddedTaxIncluded: false,
      },
    },
  };
}
