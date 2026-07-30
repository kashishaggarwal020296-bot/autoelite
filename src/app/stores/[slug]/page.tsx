import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { stores, storeBySlug, whatsappLink } from "@/data/site.data";
import { JsonLd, autoDealerSchema, breadcrumbSchema } from "@/lib/jsonld";
import Storefront from "@/components/Storefront";

export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const store = storeBySlug(params.slug);
  if (!store) return { title: "Store not found" };
  return {
    title: `Ather Showroom in ${store.name}, Bengaluru — Autoelite`,
    description: `Autoelite ${store.name}: authorized Ather showroom in Bengaluru. Test ride, buy, finance, service and accessories. ${store.address}. Call ${store.phoneDisplay}.`,
    alternates: { canonical: `/stores/${store.slug}` },
  };
}

const CAPABILITIES = ["Test ride", "Buy", "Finance", "Service", "Accessories"];

export default function StorePage({ params }: { params: { slug: string } }) {
  const store = storeBySlug(params.slug);
  if (!store) notFound();

  return (
    <main className="section fade">
      <JsonLd
        data={[
          autoDealerSchema(store),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Stores", path: `/stores/${store.slug}` },
            { name: store.name, path: `/stores/${store.slug}` },
          ]),
        ]}
      />
      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--muted-2)", marginBottom: 10 }}>Stores / {store.name}</div>
      <h1 className="h1 h1-sm" style={{ marginBottom: 24 }}>Autoelite {store.name}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ aspectRatio: "16 / 10", borderRadius: 16, overflow: "hidden" }}>
            <Storefront name={store.name} photo={store.photo} />
          </div>
          <iframe
            title={`Map of Autoelite ${store.name}`}
            src={store.mapEmbed}
            style={{ width: "100%", aspectRatio: "16 / 7", border: 0, borderRadius: 16 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, lineHeight: 1.55 }}>{store.address}</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted-2)" }}>{store.hours}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
              <a href={`tel:${store.phoneTel}`} className="pill" style={{ height: 44, background: "var(--ink)", color: "#fff", border: "none" }}>📞 {store.phoneDisplay}</a>
              <a href={whatsappLink(`Hi Autoelite ${store.name}!`)} target="_blank" rel="noopener noreferrer" className="pill" style={{ height: 44, background: "var(--accent)", color: "#fff", border: "none" }}>💬 WhatsApp</a>
              <a href={store.mapsUrl} target="_blank" rel="noopener noreferrer" className="pill" style={{ height: 44 }}>Directions</a>
            </div>
            <Link href="/test-ride" className="btn btn-primary btn-block" style={{ marginTop: 16 }}>Book a test ride at this store</Link>
          </div>

          <div style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--surface-2)", padding: 22, marginTop: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>What you can do here</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CAPABILITIES.map((c) => (
                <span key={c} className="chip-tag" style={{ color: "var(--accent-soft-ink)" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        {stores.map((s, i) => (
          <span key={s.id} style={{ display: "flex", gap: 12 }}>
            <Link href={`/stores/${s.slug}`} style={{ fontWeight: 600, fontSize: 14, color: s.slug === store.slug ? "var(--accent-strong)" : "var(--muted-2)" }}>{s.name}</Link>
            {i === 0 && <span style={{ color: "#cfcec6" }}>·</span>}
          </span>
        ))}
      </div>
    </main>
  );
}
