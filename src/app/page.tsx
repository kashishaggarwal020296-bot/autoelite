import Link from "next/link";
import { models } from "@/data/scooters.data";
import { stores, faqs, dealer, whatsappLink } from "@/data/site.data";
import ModelCard from "@/components/ModelCard";
import Reviews from "@/components/Reviews";
import CallbackForm from "@/components/CallbackForm";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, autoDealerSchema, faqPageSchema } from "@/lib/jsonld";

export default function HomePage() {
  const gridModels = models.filter((m) => m.status === "available").sort((a, b) => a.order - b.order);

  return (
    <div className="fade">
      <JsonLd data={[...stores.map(autoDealerSchema), faqPageSchema(faqs)]} />

      {/* hero */}
      <section className="section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 40, alignItems: "center", paddingTop: 56, paddingBottom: 44 }}>
        <div>
          <div className="chip-tag">● Authorized Ather dealer · South Bengaluru</div>
          <h1 className="h1" style={{ marginTop: 16 }}>Ride an Ather home — from Koramangala or HSR Layout.</h1>
          <p className="lead" style={{ marginBottom: 26, maxWidth: 480 }}>
            A test ride near you, your real on-road price in a minute, finance and service under one roof.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/test-ride" className="btn btn-primary" style={{ height: 52 }}>Book a Test Ride</Link>
            <Link href="/on-road-price" className="btn btn-outline" style={{ height: 52 }}>Get On-Road Price</Link>
          </div>
        </div>
        <div style={{ aspectRatio: "4 / 3", borderRadius: 16, overflow: "hidden", position: "relative" }}>
          <img
            src="/lifestyle/rizta-riding.webp"
            alt="Rider on an Ather Rizta on a Bengaluru road"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </section>

      {/* trust bar */}
      <div className="trust">
        <div className="trust-inner">
          <span>Authorized Ather dealer</span><span className="trust-sep">·</span>
          <span>{dealer.delivered} delivered</span><span className="trust-sep">·</span>
          <span>{dealer.reviewCount} Google reviews ({dealer.ratingValue}★)</span><span className="trust-sep">·</span>
          <span>2 stores: Koramangala + HSR</span>
        </div>
      </div>

      {/* quick actions */}
      <section className="section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, paddingTop: 32, paddingBottom: 32 }}>
        <Link href="/test-ride" className="card" style={{ padding: "22px 20px" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Book a Test Ride</div>
          <div style={{ marginTop: 5, fontSize: 13, color: "var(--muted-2)" }}>Free · under a minute</div>
        </Link>
        <Link href="/on-road-price" className="card" style={{ padding: "22px 20px" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Get On-Road Price</div>
          <div style={{ marginTop: 5, fontSize: 13, color: "var(--muted-2)" }}>Itemised, honest</div>
        </Link>
        <Link href="/stores/koramangala" className="card" style={{ padding: "22px 20px" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Visit a Showroom</div>
          <div style={{ marginTop: 5, fontSize: 13, color: "var(--muted-2)" }}>2 stores near you</div>
        </Link>
        <a href={whatsappLink("Hi Autoelite!")} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: "22px 20px", background: "var(--accent)", color: "#fff", border: "none" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Talk to Us</div>
          <div style={{ marginTop: 5, fontSize: 13, color: "#dff0e6" }}>WhatsApp us now</div>
        </a>
      </section>

      {/* model grid */}
      <section className="section" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 className="h2">Choose your Ather</h2>
          <Link href="/scooters" style={{ fontWeight: 600, fontSize: 14 }}>See all scooters →</Link>
        </div>
        <div className="grid grid-models">
          {gridModels.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </section>

      {/* why buy */}
      <section className="section">
        <h2 className="h2" style={{ marginBottom: 18 }}>Why buy from Autoelite</h2>
        <div className="grid grid-cards">
          {[
            ["Test ride at your door", "Can't come in? We bring the scooter to your home."],
            ["Real on-road price, itemised", "Ex-showroom, RTO, insurance and subsidy — no guessing."],
            ["Finance sorted in-store", "Zero down payment options and we handle the paperwork."],
            ["Service & pickup-drop", "Across Koramangala and HSR, genuine Ather parts only."],
          ].map(([t, d]) => (
            <div key={t} className="card-soft" style={{ padding: 22 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{t}</div>
              <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.45, color: "var(--accent-soft-ink)" }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* stores */}
      <section className="section" style={{ paddingTop: 8 }}>
        <h2 className="h2" style={{ marginBottom: 18 }}>Two stores in south Bengaluru</h2>
        <div className="grid grid-2">
          {stores.map((s) => (
            <div key={s.id} className="card">
              <div className="ph" style={{ aspectRatio: "16 / 9" }}>
                <span className="ph-label">[ {s.name} storefront ]</span>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 19 }}>Autoelite {s.name}</div>
                <div style={{ margin: "8px 0 3px", fontSize: 14, lineHeight: 1.45, color: "var(--muted)" }}>{s.address}</div>
                <div style={{ fontSize: 13, color: "var(--muted-2)" }}>{s.hours}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  <a href={`tel:${s.phoneTel}`} className="pill" style={{ background: "var(--ink)", color: "#fff", border: "none" }}>📞 Call</a>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="pill" style={{ background: "var(--accent)", color: "#fff", border: "none" }}>💬 WhatsApp</a>
                  <Link href={`/stores/${s.slug}`} className="pill">Store page</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* reviews */}
      <Reviews />

      {/* callback */}
      <section style={{ background: "var(--ink)" }}>
        <div className="section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 32, alignItems: "center", paddingTop: 48, paddingBottom: 48 }}>
          <div>
            <h2 className="h2" style={{ color: "#fff", fontSize: 30 }}>Prefer we call you?</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "#a9a89f", maxWidth: 400 }}>
              Leave your number and the nearest store&apos;s team will ring back — usually within the hour.
            </p>
          </div>
          <div style={{ background: "var(--surface-2)", borderRadius: 16, padding: 24 }}>
            <CallbackForm />
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="section" style={{ maxWidth: 820 }}>
        <h2 className="h2" style={{ marginBottom: 18 }}>Questions, answered plainly</h2>
        <FaqAccordion items={faqs} />
        <div style={{ marginTop: 18 }}>
          <Link href="/faq" style={{ fontWeight: 600, fontSize: 14 }}>See all FAQs →</Link>
        </div>
      </section>
    </div>
  );
}
