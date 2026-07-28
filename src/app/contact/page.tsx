import type { Metadata } from "next";
import Link from "next/link";
import { stores, whatsappLink } from "@/data/site.data";
import CallbackForm from "@/components/CallbackForm";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contact Autoelite — Ather Dealer in Koramangala & HSR, Bengaluru",
  description:
    "Call, WhatsApp or request a callback from Autoelite — authorized Ather dealer in Koramangala and HSR Layout, Bengaluru. We usually ring back within the hour.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="section fade" style={{ maxWidth: 980 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Talk to Autoelite.</h1>
      <p className="lead" style={{ marginBottom: 28 }}>Call or WhatsApp either store, or leave your number and we&apos;ll ring back — usually within the hour.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
          {stores.map((s) => (
            <div key={s.id} className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 19 }}>Autoelite {s.name}</div>
              <div style={{ margin: "8px 0 3px", fontSize: 14, lineHeight: 1.45, color: "var(--muted)" }}>{s.address}</div>
              <div style={{ fontSize: 13, color: "var(--muted-2)" }}>{s.hours}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                <a href={`tel:${s.phoneTel}`} className="pill" style={{ background: "var(--ink)", color: "#fff", border: "none" }}>📞 {s.phoneDisplay}</a>
                <a href={whatsappLink(`Hi Autoelite ${s.name}!`)} target="_blank" rel="noopener noreferrer" className="pill" style={{ background: "var(--accent)", color: "#fff", border: "none" }}>💬 WhatsApp</a>
                <Link href={`/stores/${s.slug}`} className="pill">Store page</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Request a callback</div>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted-2)" }}>The nearest store&apos;s team will call you back.</p>
          <CallbackForm />
        </div>
      </div>
    </main>
  );
}
