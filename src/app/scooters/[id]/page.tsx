import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { models, cheapestVariant } from "@/data/scooters.data";
import ModelDetail from "@/components/ModelDetail";
import { JsonLd, productSchema, breadcrumbSchema } from "@/lib/jsonld";

export function generateStaticParams() {
  return models.map((m) => ({ id: m.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const model = models.find((m) => m.id === params.id);
  if (!model) return { title: "Scooter not found" };
  return {
    title: `${model.name} On-Road Price in Bengaluru — Specs, Colours, EMI`,
    description: `${model.name} at Autoelite, Bengaluru — ${model.tagline} See variants, specs, colours, indicative on-road price and EMI, and book a test ride in Koramangala or HSR.`,
    alternates: { canonical: `/scooters/${model.id}` },
  };
}

export default function ModelPage({ params }: { params: { id: string } }) {
  const model = models.find((m) => m.id === params.id);
  if (!model) notFound();

  const lead = cheapestVariant(model);

  return (
    <main>
      <JsonLd
        data={[
          productSchema(model, lead),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Scooters", path: "/scooters" },
            { name: model.name, path: `/scooters/${model.id}` },
          ]),
        ]}
      />
      <ModelDetail model={model} />
    </main>
  );
}
