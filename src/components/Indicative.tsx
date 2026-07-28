import { onRoadConfig } from "@/data/scooters.data";

/**
 * Small pill shown next to any on-road figure while the pricing config is
 * unverified. Never let an on-road total read as final until isVerified flips.
 */
export function IndicativeNote() {
  if (onRoadConfig.isVerified) return null;
  return <span className="indicative">● indicative — confirm in-store</span>;
}

// Longer caveat line for under a total / breakup.
export function IndicativeLine({ extra }: { extra?: string }) {
  const verifiedNote = onRoadConfig.isVerified
    ? `Verified ${onRoadConfig.lastVerified}.`
    : "On-road figures are indicative (RTO/insurance/subsidy not yet verified) — confirm the final total in-store.";
  return (
    <p className="note" style={{ marginTop: 12 }}>
      {verifiedNote} Derived from the ex-showroom price field + RTO/insurance/subsidy config.
      {extra ? ` ${extra}` : ""}
    </p>
  );
}
