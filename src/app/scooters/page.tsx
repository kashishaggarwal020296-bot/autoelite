import type { Metadata } from "next";
import { models } from "@/data/scooters.data";
import ModelCard from "@/components/ModelCard";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Every Ather Scooter — On-Road Prices in Bengaluru",
  description:
    "Compare every Ather scooter Autoelite sells — Rizta, 450 and 450 Apex — with honest on-road-from prices and EMIs for Bengaluru. Tap a model for the full breakup.",
  alternates: { canonical: "/scooters" },
};

export default function ScootersIndexPage() {
  const gridModels = models.sort((a, b) => a.order - b.order);

  return (
    <main className="section fade">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Scooters", path: "/scooters" },
        ])}
      />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Every Ather, with an honest price.</h1>
      <p className="lead" style={{ marginBottom: 28 }}>
        On-road-from prices for Bengaluru, straight from our live pricing. Tap a model for the full breakup and a test
        ride.
      </p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}>
        {gridModels.map((m) => (
          <ModelCard key={m.id} model={m} showTag />
        ))}
      </div>
    </main>
  );
}
