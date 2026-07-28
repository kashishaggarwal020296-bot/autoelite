"use client";

import { storePhoneFor } from "@/data/site.data";

// Hidden honeypot. Web3Forms rejects the submission if a bot fills "botcheck".
// Off-screen and removed from the tab order so humans never touch it.
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      name="botcheck"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
    />
  );
}

// Shown when a submit fails — never let the UI say "done" on failure.
export function SubmitFallback({ store }: { store?: string }) {
  const s = storePhoneFor(store);
  return (
    <div className="note" style={{ color: "var(--danger)", fontSize: 13 }}>
      Couldn&apos;t send — please call us:{" "}
      <a href={`tel:${s.phoneTel}`} style={{ color: "var(--danger)", fontWeight: 700 }}>{s.phoneDisplay}</a>
    </div>
  );
}
