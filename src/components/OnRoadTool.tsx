"use client";

import { useState } from "react";
import Link from "next/link";
import {
  models,
  onRoadConfig,
  getOnRoadPrice,
  getOnRoadBreakdown,
  inr,
} from "@/data/scooters.data";
import { IndicativeNote } from "@/components/Indicative";
import { submitLead } from "@/lib/leads";
import { Honeypot, SubmitFallback } from "@/components/FormBits";

function findVariant(variantId?: string) {
  for (const m of models) {
    const v = m.variants.find((x) => x.id === variantId);
    if (v) return { model: m, variant: v };
  }
  const m = models[0];
  return { model: m, variant: m.variants[0] };
}

export default function OnRoadTool({ defaultVariantId }: { defaultVariantId?: string }) {
  const start = findVariant(defaultVariantId);
  const [modelId, setModelId] = useState(start.model.id);
  const [variantId, setVariantId] = useState(start.variant.id);
  const [pin, setPin] = useState("560034");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [sendFailed, setSendFailed] = useState(false);
  const [error, setError] = useState("");

  const model = models.find((m) => m.id === modelId) ?? models[0];
  const availVariants = model.variants;
  const variant = availVariants.find((v) => v.id === variantId) ?? availVariants[0];

  const rows = getOnRoadBreakdown(variant, onRoadConfig);
  const total = getOnRoadPrice(variant, onRoadConfig);

  function pickModel(id: string) {
    const m = models.find((x) => x.id === id)!;
    setModelId(id);
    setVariantId(m.variants[0].id);
    setRevealed(false);
  }

  async function reveal() {
    if (!name.trim() || !phone.trim()) {
      setError("Please add your name and phone.");
      setSendFailed(false);
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const res = await submitLead({ formType: "on_road_price", name, phone, model: model.name, variant: variant.name, pincode: pin, botcheck });
    if (res.ok) { setRevealed(true); setStatus("idle"); }
    else { setSendFailed(true); setStatus("error"); }
  }

  return (
    <div className="card">
      {/* selectors */}
      <div style={{ padding: 24, borderBottom: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div className="label">Model</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {models.map((m) => (
              <button key={m.id} className="pill" aria-pressed={m.id === modelId} onClick={() => pickModel(m.id)}>{m.name}</button>
            ))}
          </div>
        </div>
        {availVariants.length > 1 && (
          <div>
            <div className="label">Variant</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {availVariants.map((v) => (
                <button key={v.id} className="pill" aria-pressed={v.id === variantId} onClick={() => { setVariantId(v.id); setRevealed(false); }}>{v.name}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ width: 150 }}>
          <div className="label">Pincode</div>
          <input className="field" style={{ height: 44 }} value={pin} onChange={(e) => setPin(e.target.value)} />
        </div>
      </div>

      {/* breakup */}
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {rows.map((r) => {
            const isSub = r.amount < 0;
            const prefix = r.kind === "base" ? "" : isSub ? "– " : "+ ";
            const color = isSub ? "var(--accent-deep)" : "var(--ink)";
            return (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f0efe9" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color }}>{r.label}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3, color: "var(--faint)", marginTop: 2 }}>{r.note}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color }}>{prefix}{inr(Math.abs(r.amount))}</div>
              </div>
            );
          })}
        </div>

        {revealed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, padding: 20, borderRadius: 12, background: "var(--accent)", color: "#fff", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>On-road total, {variant.name} <IndicativeNote /></div>
              <div style={{ fontWeight: 800, fontSize: 26 }}>{inr(total)}</div>
            </div>
            <p className="note" style={{ marginTop: 12 }}>
              Pincode {pin} · Bengaluru. {onRoadConfig.isVerified ? `Verified ${onRoadConfig.lastVerified}.` : "Indicative — RTO/insurance/subsidy not yet verified; confirm the final total in-store."} Derived from the ex-showroom price field + config.
            </p>
            <Link href={`/test-ride?model=${encodeURIComponent(variant.name)}`} className="btn btn-dark btn-block" style={{ marginTop: 16 }}>
              Book a test ride for the {variant.name}
            </Link>
          </>
        ) : (
          <div style={{ marginTop: 18, padding: 20, borderRadius: 12, background: "var(--page)", border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>See your on-road total</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)", marginBottom: 14 }}>Enter your details to reveal the full itemised total and lock any live offer.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
              <input className="field" placeholder="Phone (+91)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
              <button className="btn btn-primary" style={{ height: 46 }} onClick={reveal} disabled={status === "sending"}>
                {status === "sending" ? "…" : "Show total"}
              </button>
            </div>
            <Honeypot value={botcheck} onChange={setBotcheck} />
            {status === "error" && (
              <div style={{ marginTop: 10 }}>
                {sendFailed ? <SubmitFallback /> : <div className="note" style={{ color: "var(--danger)" }}>{error}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
