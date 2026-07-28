import type { Metadata } from "next";
import OnRoadTool from "@/components/OnRoadTool";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Ather On-Road Price in Bengaluru — Itemised RTO, Insurance & Subsidy",
  description:
    "Your real Ather on-road price for Bengaluru, itemised: ex-showroom, RTO, insurance and subsidy. Indicative estimate — confirm the final total in-store at Autoelite.",
  alternates: { canonical: "/on-road-price" },
};

export default function OnRoadPricePage({ searchParams }: { searchParams: { variant?: string } }) {
  return (
    <main className="section fade" style={{ maxWidth: 820 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "On-road price", path: "/on-road-price" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Your real on-road price. No guessing.</h1>
      <p className="lead" style={{ marginBottom: 26 }}>
        Ex-showroom is only the start. See RTO, insurance and subsidy itemised for your Bengaluru pincode.
      </p>
      <OnRoadTool defaultVariantId={searchParams.variant} />
    </main>
  );
}
