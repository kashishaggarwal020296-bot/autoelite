"use client";

import { useState } from "react";
import { models, onRoadConfig, financeConfig, getOnRoadPrice, computeEmi, inr } from "@/data/scooters.data";
import { IndicativeNote } from "@/components/Indicative";

const TENURES = [12, 24, 36, 48];

export default function EmiCalculator() {
  const [modelId, setModelId] = useState(models[0].id);
  const [variantId, setVariantId] = useState(models[0].variants[0].id);
  const [down, setDown] = useState(15000);
  const [tenure, setTenure] = useState(24);

  const model = models.find((m) => m.id === modelId) ?? models[0];
  const variant = model.variants.find((v) => v.id === variantId) ?? model.variants[0];

  const onRoad = getOnRoadPrice(variant, onRoadConfig);
  const downMax = Math.round((onRoad * 0.6) / 1000) * 1000;
  const clampedDown = Math.min(down, downMax);
  const loan = Math.max(0, onRoad - clampedDown);
  const emi = computeEmi(loan, financeConfig.annualRate, tenure);

  function pickModel(id: string) {
    const m = models.find((x) => x.id === id)!;
    setModelId(id);
    setVariantId(m.variants[0].id);
    setDown((d) => Math.min(d, Math.round(getOnRoadPrice(m.variants[0], onRoadConfig) * 0.6)));
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="label">Model</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {models.map((m) => (
          <button key={m.id} className="pill" aria-pressed={m.id === modelId} onClick={() => pickModel(m.id)}>{m.name}</button>
        ))}
      </div>

      {model.variants.length > 1 && (
        <>
          <div className="label">Variant</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            {model.variants.map((v) => (
              <button key={v.id} className="pill" aria-pressed={v.id === variantId} onClick={() => setVariantId(v.id)}>{v.name}</button>
            ))}
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 14, color: "var(--ink-2)", marginBottom: 8 }}>
        <span>Down payment</span><span>{inr(clampedDown)}</span>
      </div>
      <input type="range" min={0} max={downMax} step={1000} value={clampedDown} onChange={(e) => setDown(parseInt(e.target.value, 10))} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-2)", margin: "6px 0 22px" }}><span>₹0</span><span>{inr(downMax)}</span></div>

      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-2)", marginBottom: 10 }}>Tenure</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {TENURES.map((t) => (
          <button key={t} className="pill" aria-pressed={tenure === t} style={{ borderRadius: 10 }} onClick={() => setTenure(t)}>{t} mo</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <div style={{ padding: 18, borderRadius: 12, background: "var(--page)", border: "1px solid var(--line)" }}>
          <div style={{ fontWeight: 500, fontSize: 12, color: "var(--muted-2)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>On-road ({variant.name}) <IndicativeNote /></div>
          <div style={{ marginTop: 5, fontWeight: 800, fontSize: 20 }}>{inr(onRoad)}</div>
        </div>
        <div style={{ padding: 18, borderRadius: 12, background: "var(--page)", border: "1px solid var(--line)" }}>
          <div style={{ fontWeight: 500, fontSize: 12, color: "var(--muted-2)" }}>Loan amount</div>
          <div style={{ marginTop: 5, fontWeight: 800, fontSize: 20 }}>{inr(loan)}</div>
        </div>
        <div style={{ padding: 18, borderRadius: 12, background: "var(--accent)", color: "#fff" }}>
          <div style={{ fontWeight: 500, fontSize: 12, color: "#dff0e6" }}>Your EMI</div>
          <div style={{ marginTop: 5, fontWeight: 800, fontSize: 24 }}>{inr(emi)}<span style={{ fontSize: 13, fontWeight: 500 }}>/mo</span></div>
        </div>
      </div>
      <div className="note" style={{ marginTop: 12 }}>
        On-road figure is indicative (derived from ex-showroom + config). At {(financeConfig.annualRate * 100).toFixed(1)}% p.a. reducing balance — final rate depends on the finance partner and your profile.
      </div>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <div style={{ padding: 18, borderRadius: 12, border: "1px solid var(--line)" }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Named partners</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)" }}>Leading banks and NBFCs — we match you to the best rate.</div>
        </div>
        <div style={{ padding: 18, borderRadius: 12, border: "1px solid var(--line)" }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Documents</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.45, color: "var(--muted-2)" }}>KYC, address proof and a recent bank statement. That&apos;s it.</div>
        </div>
      </div>
    </div>
  );
}
