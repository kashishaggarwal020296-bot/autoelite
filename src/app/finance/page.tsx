import type { Metadata } from "next";
import { allVariants, onRoadConfig, financeConfig, getEmiFrom, inr } from "@/data/scooters.data";
import EmiCalculator from "@/components/EmiCalculator";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Ather Finance & EMI Calculator — Bengaluru | Zero Down Payment",
  description:
    "Calculate your Ather EMI at Autoelite Bengaluru. Pick a model, set your down payment and tenure, see your monthly instalment. Zero down payment options available.",
  alternates: { canonical: "/finance" },
};

export default function FinancePage() {
  const emiLow = Math.min(
    ...allVariants
      .filter(({ variant }) => variant.status === "available")
      .map(({ variant }) => getEmiFrom(variant, onRoadConfig, financeConfig)),
  );

  return (
    <main className="section fade" style={{ maxWidth: 820 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Finance", path: "/finance" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>EMIs from {inr(emiLow)}/mo. Zero down payment available.</h1>
      <p className="lead" style={{ marginBottom: 26 }}>Pick a model, set your down payment and tenure — see your monthly EMI instantly.</p>
      <EmiCalculator />
    </main>
  );
}
