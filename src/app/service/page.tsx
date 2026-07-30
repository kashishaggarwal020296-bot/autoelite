import type { Metadata } from "next";
import ServiceForm from "@/components/ServiceForm";
import { stores } from "@/data/site.data";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

const serviceCentre = stores.find((s) => s.serviceAvailable && s.serviceAddress);

export const metadata: Metadata = {
  title: "Ather Service in Bengaluru — Book Online, Pickup & Drop | Autoelite",
  description:
    "Book Ather service online at Autoelite Bengaluru. Free pickup and drop across Koramangala and HSR Layout, genuine Ather parts only, first-service reminders.",
  alternates: { canonical: "/service" },
};

export default function ServicePage() {
  return (
    <main className="section fade" style={{ maxWidth: 720 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service", path: "/service" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Service, sorted.</h1>
      <p className="lead" style={{ marginBottom: 26 }}>Book online, pickup and drop across Koramangala and HSR, genuine Ather parts only.</p>
      <ServiceForm />
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", marginTop: 22 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Genuine parts only</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)" }}>Every part fitted is genuine Ather. No exceptions.</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>First-service reminder</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)" }}>Opt in and our team will remind you when it&apos;s due.</div>
        </div>
        {serviceCentre?.serviceAddress && (
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Where we service</div>
            <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)" }}>{serviceCentre.serviceAddress}</div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serviceCentre.serviceAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--accent-strong)" }}
            >
              📍 Get directions
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
