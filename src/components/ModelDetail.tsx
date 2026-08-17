"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Model,
  onRoadConfig,
  financeConfig,
  getExShowroom,
  getOnRoadPrice,
  getEmiFrom,
  isOfferLive,
  inr,
  colourImage,
} from "@/data/scooters.data";
import { IndicativeNote, IndicativeLine } from "@/components/Indicative";
import CallbackForm from "@/components/CallbackForm";

// [title, blurb, image] — images are generic Ather detail shots, shared across
// model pages (illustrative, not per-model-exact).
const FEATURES: [string, string, string][] = [
  ["Comfort", "Flat floorboard, deep seat and generous boot for the daily run.", "/features/comfort.avif"],
  ["Ride", "Instant torque and quick, sure handling through Bengaluru traffic.", "/features/ride.avif"],
  ["Safety", "Fall-safe alerts, all-LED lighting and a bright, readable dash.", "/features/safety.avif"],
  ["Connectivity", "Navigation, ride stats and OTA updates, straight on the dash.", "/features/connectivity.jpg"],
];

const statusLabel: Record<string, string> = { coming_soon: "Coming soon", discontinued: "Sold out" };

export default function ModelDetail({ model }: { model: Model }) {
  const available = model.variants.filter((v) => v.status === "available");
  const list = available.length ? available : model.variants;
  const [variantId, setVariantId] = useState(list[0].id);
  const variant = model.variants.find((v) => v.id === variantId) ?? list[0];
  const [savKm, setSavKm] = useState(30);

  // Selected colour drives the hero image. Falls back to the variant's first
  // colour when the picked one isn't offered on the current variant.
  const [colourName, setColourName] = useState<string | null>(null);
  const activeColour = variant.colours.find((c) => c.name === colourName) ?? variant.colours[0];
  const activeColourImage = colourImage(model.id, activeColour?.name ?? "");
  const heroImage = activeColourImage ?? variant.image ?? model.image;
  const hasColourImages = variant.colours.some((c) => colourImage(model.id, c.name));

  const ex = getExShowroom(variant);
  const onRoad = getOnRoadPrice(variant, onRoadConfig);
  const emiFrom = getEmiFrom(variant, onRoadConfig, financeConfig);
  const ks = variant.keySpecs;
  const liveOffer = isOfferLive(variant.offer) ? variant.offer : null;

  const specRows: [string, string][] = [
    ["Battery", ks.batteryKwh + " kWh"],
    ["Range (IDC)", ks.idcRangeKm + " km"],
    ["Top speed", ks.topSpeedKmph + " km/h"],
    ["Acceleration", "0–40 in " + ks.zeroToFortyS + " s"],
    ...(ks.power ? [["Peak power", ks.power] as [string, string]] : []),
    ...(ks.torque ? [["Torque", ks.torque] as [string, string]] : []),
    ["Charging", ks.fastCharge],
    ["Storage", ks.boot],
    ...(ks.warranty ? [["Warranty", ks.warranty] as [string, string]] : []),
  ];

  const savings = useMemo(() => {
    const petrol = (savKm * 30 / 35) * 106;
    const elec = savKm * 30 * 0.2;
    const monthly = Math.max(0, petrol - elec);
    return { monthly, yearly: monthly * 12 };
  }, [savKm]);

  return (
    <div className="fade">
      {liveOffer && (
        <div style={{ background: "var(--accent)", color: "#fff" }}>
          <div className="section" style={{ paddingTop: 10, paddingBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              Limited offer · {liveOffer.label} on the {variant.name} —{" "}
              <Link href="/stores/koramangala" style={{ color: "#fff", textDecoration: "underline" }}>visit a store</Link>
            </span>
          </div>
        </div>
      )}

      <div className="section" style={{ paddingTop: 24, paddingBottom: 0, fontWeight: 600, fontSize: 13, color: "var(--muted-2)" }}>
        <Link href="/scooters">Scooters</Link> / {model.name}
      </div>

      {/* hero */}
      <section className="section" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 36, alignItems: "center", paddingTop: 20, paddingBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {variant.tag && <div style={{ fontWeight: 600, fontSize: 14, color: "var(--accent-strong)" }}>{variant.tag}</div>}
            {model.status !== "available" && <span className="badge badge-dark">{statusLabel[model.status]}</span>}
          </div>
          <h1 className="h1" style={{ marginTop: 8 }}>{model.name}</h1>

          {list.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {list.map((v) => (
                <button key={v.id} className="pill" aria-pressed={v.id === variantId} onClick={() => setVariantId(v.id)}>
                  {v.name}
                </button>
              ))}
            </div>
          )}

          <p className="lead" style={{ marginBottom: 22, maxWidth: 460 }}>{variant.positioning ?? model.tagline}</p>

          <div style={{ display: "flex", gap: 22, marginBottom: 24 }}>
            <div><div className="stat-v">{ks.idcRangeKm} km</div><div className="stat-k">range</div></div>
            <div><div className="stat-v">{ks.topSpeedKmph} km/h</div><div className="stat-k">top speed</div></div>
            <div><div className="stat-v">{ks.boot}</div><div className="stat-k">storage</div></div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href={`/test-ride?model=${encodeURIComponent(variant.name)}`} className="btn btn-primary">Test Ride</Link>
            <Link href={`/on-road-price?variant=${variant.id}`} className="btn btn-outline">On-Road Price</Link>
          </div>
        </div>
        <div className="ph-strong" style={{ aspectRatio: "4 / 3", borderRadius: 16, position: "relative", overflow: "hidden", background: "var(--surface)" }}>
          {heroImage ? (
            <img
              key={heroImage}
              src={heroImage}
              alt={`${variant.name}${activeColour && activeColourImage ? ` in ${activeColour.name}` : " scooter"}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", animation: "fadeUp 0.3s ease" }}
            />
          ) : (
            <span className="ph-label">[ {variant.name}: 3/4 render ]<br />Ather asset kit</span>
          )}
        </div>
      </section>

      {/* features */}
      <section className="section" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <div className="grid grid-models">
          {FEATURES.map(([t, d, img]) => (
            <div key={t} className="card">
              <div className="ph" style={{ aspectRatio: "3 / 2", position: "relative", overflow: "hidden" }}>
                <img
                  src={img}
                  alt={`Ather ${t.toLowerCase()} detail`}
                  loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{t}</div>
                <div style={{ marginTop: 5, fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)" }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* colours */}
      <section className="section">
        <h2 className="h2" style={{ fontSize: 24, marginBottom: 4 }}>Colours</h2>
        <p className="note" style={{ fontSize: 14, color: "var(--muted-2)", marginBottom: 16 }}>
          {hasColourImages
            ? `Available finishes for the ${variant.name}. Tap a colour to preview it.`
            : `Available finishes for the ${variant.name}. Swatch colours are approximate — per-colour renders come from the Ather asset kit.`}
        </p>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {variant.colours.map((c) => {
            const selected = c.name === activeColour?.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setColourName(c.name)}
                aria-pressed={selected}
                title={c.name}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <span style={{ width: 52, height: 52, borderRadius: "50%", background: c.hex, border: "2px solid #fff", boxShadow: selected ? "0 0 0 2px var(--accent)" : "0 0 0 1px var(--line-2)", transform: selected ? "scale(1.06)" : "none", transition: "transform 0.15s ease, box-shadow 0.15s ease" }} />
                <span style={{ fontWeight: selected ? 700 : 500, fontSize: 11, lineHeight: 1.2, color: selected ? "var(--ink)" : "var(--muted-2)", textAlign: "center", maxWidth: 70 }}>{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* specs */}
      <section className="section" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <div className="card">
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 className="h2" style={{ fontSize: 22 }}>{variant.name} specs</h2>
            <span className="note" style={{ fontSize: 12 }}>Data snapshot {variant.lastVerified ?? onRoadConfig.lastVerified} · verify before purchase</span>
          </div>
          {specRows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid #f0efe9" }}>
              <span style={{ fontWeight: 500, fontSize: 14, color: "var(--muted-2)" }}>{k}</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* savings */}
      <section className="section" style={{ paddingBottom: 8 }}>
        <div className="card-soft" style={{ padding: 28 }}>
          <h2 className="h2" style={{ fontSize: 24, marginBottom: 4 }}>What you&apos;ll save vs petrol</h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--accent-soft-ink)" }}>Drag your daily distance to see the monthly running-cost saving.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 14, color: "#3f5a48", marginBottom: 8 }}>
                <span>Daily distance</span><span>{savKm} km/day</span>
              </div>
              <input type="range" min={5} max={80} step={1} value={savKm} onChange={(e) => setSavKm(parseInt(e.target.value, 10))} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-2)", marginTop: 6 }}><span>5 km</span><span>80 km</span></div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid var(--accent-soft-line)" }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: "var(--muted-2)" }}>Estimated monthly saving</div>
              <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1, color: "var(--accent-strong)", margin: "6px 0" }}>{inr(savings.monthly)}</div>
              <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--muted-2)" }}>≈ {inr(savings.yearly)} a year vs a 35 km/l petrol scooter.</div>
            </div>
          </div>
          <div className="note" style={{ marginTop: 14, color: "#7d8f83" }}>Assumes petrol ₹106/L (Bengaluru) and ~₹0.20/km to charge. Indicative only.</div>
        </div>
      </section>

      {/* price ladder */}
      <section className="section">
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <h2 className="h2" style={{ fontSize: 24 }}>Your price, three honest steps</h2>
            <IndicativeNote />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            <div style={{ padding: 20, borderRadius: 12, background: "var(--page)", border: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 500, fontSize: 12, color: "var(--muted-2)" }}>Ex-showroom</div>
              <div style={{ marginTop: 6, fontWeight: 800, fontSize: 24 }}>{inr(ex)}</div>
            </div>
            <div style={{ padding: 20, borderRadius: 12, background: "var(--page)", border: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 500, fontSize: 12, color: "var(--muted-2)" }}>EMI from</div>
              <div style={{ marginTop: 6, fontWeight: 800, fontSize: 24 }}>{inr(emiFrom)}<span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted-2)" }}>/mo</span></div>
            </div>
            <div style={{ padding: 20, borderRadius: 12, background: "var(--accent)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 500, fontSize: 12, color: "#dff0e6" }}>On-road (Bengaluru{onRoadConfig.isVerified ? "" : ", indicative"})</div>
              <div style={{ marginTop: 6, fontWeight: 800, fontSize: 24 }}>{inr(onRoad)}</div>
              <Link href={`/on-road-price?variant=${variant.id}`} className="btn" style={{ marginTop: 12, height: 38, background: "#fff", color: "var(--accent-strong)", fontSize: 13 }}>View on-road breakup</Link>
            </div>
          </div>
          <IndicativeLine />
        </div>
      </section>

      {/* callback */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--surface-2)", padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, alignItems: "end" }}>
          <div>
            <h3 className="h3">Want a callback about the {variant.name}?</h3>
            <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.45, color: "var(--muted-2)" }}>Leave your number — we&apos;ll ring back from your nearest store.</p>
          </div>
          <CallbackForm compact defaultModel={model.name} />
        </div>
      </section>
    </div>
  );
}
