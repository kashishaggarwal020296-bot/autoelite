import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Ather Charging in Bengaluru — Home, Apartment & Fast Charging",
  description:
    "How Ather charging works in Bengaluru — home charger on a standard plug, apartment society permissions, and the public fast-charging grid. Autoelite guides you through setup.",
  alternates: { canonical: "/charging" },
};

const CARDS = [
  ["Charge at home", "The Ather home charger plugs into a standard 5A/15A point. Overnight top-ups mean you leave every morning full — no fuel runs."],
  ["Living in an apartment?", "Most societies allow EV charging. We help with the permission letter, the load check and a clean install in your parking bay."],
  ["Public fast charging", "Ather Grid points across Bengaluru add serious range in minutes for longer days — mapped right on your scooter's dash."],
  ["What it costs", "At roughly ₹0.20/km to charge versus petrol, most riders recover a big chunk of running cost within the first year. See the savings tool on any model page."],
];

export default function ChargingPage() {
  return (
    <main className="section fade" style={{ maxWidth: 900 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Charging", path: "/charging" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Charging, the easy way.</h1>
      <p className="lead" style={{ marginBottom: 28 }}>Plug in at home, sort your society, and top up on the go — here&apos;s how Ather charging works in Bengaluru.</p>

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
          <div style={{ fontWeight: 800, fontSize: 20 }}>Not sure about charging where you live?</div>
          <div style={{ marginTop: 6, fontSize: 14, color: "var(--accent-soft-ink)" }}>Book a test ride and our team will talk you through setup for your building.</div>
        </div>
        <Link href="/test-ride" className="btn btn-primary">Book a Test Ride</Link>
      </div>
    </main>
  );
}
