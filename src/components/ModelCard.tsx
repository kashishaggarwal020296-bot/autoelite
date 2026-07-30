import Link from "next/link";
import {
  Model,
  onRoadConfig,
  financeConfig,
  modelFromOnRoad,
  getEmiFrom,
  isOfferLive,
  inr,
} from "@/data/scooters.data";
import { IndicativeNote } from "@/components/Indicative";

const statusLabel: Record<string, string> = {
  coming_soon: "Coming soon",
  discontinued: "Sold out",
};

export default function ModelCard({ model, showTag = false }: { model: Model; showTag?: boolean }) {
  const { variant: fromVar, onRoad } = modelFromOnRoad(model, onRoadConfig);
  const emiFrom = getEmiFrom(fromVar, onRoadConfig, financeConfig);
  const variantCount = model.variants.length;
  const liveOffer = model.variants.find((v) => isOfferLive(v.offer));
  const showStatus = model.status !== "available";

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      <div className="ph" style={{ position: "relative", aspectRatio: "4 / 3", background: model.image ? "var(--surface)" : undefined }}>
        {model.image ? (
          <img
            src={model.image}
            alt={`${model.name} scooter`}
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span className="ph-label">[ {model.name} ]</span>
        )}
        {showStatus && (
          <span
            className={`badge ${model.status === "discontinued" ? "badge-danger" : "badge-dark"}`}
            style={{ position: "absolute", top: 10, left: 10 }}
          >
            {statusLabel[model.status]}
          </span>
        )}
        {liveOffer && (
          <span className="badge badge-dark" style={{ position: "absolute", top: 10, right: 10 }}>
            {liveOffer.offer.label}
          </span>
        )}
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 19, lineHeight: 1 }}>{model.name}</div>
        {showTag && fromVar.tag && <div style={{ fontWeight: 600, fontSize: 13, color: "var(--accent-strong)" }}>{fromVar.tag}</div>}
        <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--muted-2)", minHeight: 36 }}>
          {fromVar.positioning ?? model.tagline}
        </div>
        <div style={{ marginTop: 6, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          On-road from {inr(onRoad)}
          <IndicativeNote />
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-2)" }}>
          EMI from {inr(emiFrom)}/mo · {variantCount > 1 ? `${variantCount} variants` : "1 variant"}
        </div>
        {model.rangeNote && (
          <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 2 }}>{model.rangeNote}</div>
        )}
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <Link href={`/scooters/${model.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
            Explore
          </Link>
          <Link href={`/test-ride?model=${encodeURIComponent(fromVar.name)}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            Test Ride
          </Link>
        </div>
      </div>
    </div>
  );
}
