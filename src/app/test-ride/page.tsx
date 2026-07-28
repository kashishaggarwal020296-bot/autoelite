import type { Metadata } from "next";
import TestRideWizard from "@/components/TestRideWizard";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Book a Free Ather Test Ride in Bengaluru — Koramangala & HSR",
  description:
    "Book a free Ather test ride at Autoelite — Koramangala or HSR Layout showroom, or we bring the scooter to your home. Takes under a minute.",
  alternates: { canonical: "/test-ride" },
};

export default function TestRidePage({ searchParams }: { searchParams: { model?: string } }) {
  return (
    <main className="section fade" style={{ maxWidth: 720 }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Test ride", path: "/test-ride" }])} />
      <h1 className="h1 h1-sm" style={{ marginBottom: 6 }}>Book a free Ather test ride.</h1>
      <p className="lead" style={{ marginBottom: 26 }}>At our Koramangala or HSR showroom — or we bring it to you.</p>
      <TestRideWizard defaultModel={searchParams.model} />
    </main>
  );
}
