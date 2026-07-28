import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Ather Ownership in Bengaluru — Warranty, Service & Running Costs",
  description:
    "What owning an Ather with Autoelite Bengaluru looks like: warranty, genuine-parts service with pickup and drop, low running costs and OTA updates.",
  alternates: { canonical: "/ownership" },
};

const CARDS = [
  ["Warranty you can rely on", "Every Ather is covered by the manufacturer warranty on the vehicle and battery. Exact terms are on each model's spec table."],
  ["Service that comes to you", "Book online, and we pick up and drop across Koramangala and HSR — genuine Ather parts only, with a first-service reminder."],
  ["Low running costs", "Charging costs a fraction of petrol, and there's far less to service. The savings calculator on any model page shows your number."],
  ["Always improving", "Over-the-air updates add features and refinements to your scooter over time — no showroom visit needed."],
];

export default function OwnershipPage() {
  return (
    <main className="section fade" style={{ maxWidth: 900 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Ownership", path: "/ownership" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Owning an Ather, sorted.</h1>
      <p className="lead" style={{ marginBottom: 28 }}>Warranty, service, running costs and updates — what life with your Ather looks like after you ride it home.</p>

      <div className="grid grid-2">
        {CARDS.map(([t, d]) => (
          <div key={t} className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{t}</div>
            <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.55, color: "var(--muted)" }}>{d}</div>
          </div>
        ))}
      </div>

      <div className="card-soft" style={{ padding: 28, marginTop: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>Have an Ather already?</div>
          <div style={{ marginTop: 6, fontSize: 14, color: "var(--accent-soft-ink)" }}>Book a service with pickup and drop across Koramangala and HSR.</div>
        </div>
        <Link href="/service" className="btn btn-primary">Book Service</Link>
      </div>
    </main>
  );
}
