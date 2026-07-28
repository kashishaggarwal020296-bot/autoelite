import type { Metadata } from "next";
import { faqs } from "@/data/site.data";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqPageSchema, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Ather FAQs — Test Rides, On-Road Price, Finance & Service in Bengaluru",
  description:
    "Answers to common questions about buying an Ather from Autoelite Bengaluru: test rides, real on-road price, finance, apartment charging and service.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main className="section fade" style={{ maxWidth: 820 }}>
      <JsonLd
        data={[
          faqPageSchema(faqs),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
        ]}
      />
      <h1 className="h1 h1-sm" style={{ marginBottom: 18 }}>Questions, answered plainly</h1>
      <FaqAccordion items={faqs} />
    </main>
  );
}
