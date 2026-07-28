"use client";

import { useMemo, useState } from "react";
import { allVariants } from "@/data/scooters.data";
import { submitLead } from "@/lib/leads";
import { Honeypot, SubmitFallback } from "@/components/FormBits";

const STEP_LABELS = ["Model", "Where", "Day", "Details"];
const WHERE_OPTS: [string, string][] = [
  ["Koramangala showroom", "Koramangala"],
  ["HSR Layout showroom", "HSR Layout"],
  ["At my home", "At my home"],
];

function nextDays(n: number) {
  const names = ["Today", "Tomorrow"];
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    return {
      day: i < 2 ? names[i] : d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    };
  });
}

export default function TestRideWizard({ defaultModel }: { defaultModel?: string }) {
  const variantNames = allVariants.map(({ variant }) => variant.name);
  const [step, setStep] = useState(1);
  const [model, setModel] = useState(defaultModel && variantNames.includes(defaultModel) ? defaultModel : variantNames[0]);
  const [where, setWhere] = useState("Koramangala");
  const [pin, setPin] = useState("");
  const [date, setDate] = useState("Today");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [sendFailed, setSendFailed] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(() => nextDays(7), []);
  const isHome = where === "At my home";
  const storeLabel = isHome ? "nearest" : where;

  async function confirm() {
    if (!name.trim() || !phone.trim()) {
      setError("Please add your name and phone.");
      setSendFailed(false);
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const res = await submitLead({
      formType: "test_ride",
      name,
      phone,
      model,
      store: where,
      slot: date,
      pincode: isHome ? pin : undefined,
      botcheck,
    });
    if (res.ok) setStatus("done");
    else {
      setSendFailed(true);
      setStatus("error");
    }
  }

  function next() {
    if (step < 4) setStep(step + 1);
    else confirm();
  }

  if (status === "done") {
    return (
      <div className="card-soft" style={{ padding: 36, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.15, color: "var(--accent-deep)" }}>You&apos;re booked, {name}! ✅</div>
        <p style={{ margin: "14px auto 0", maxWidth: 420, fontSize: 16, lineHeight: 1.55, color: "#3f5a48" }}>
          {model} · {where} · {date}. Our {storeLabel} team will call {phone} to confirm your slot.
        </p>
        <button
          className="btn btn-outline"
          style={{ marginTop: 20, height: 44 }}
          onClick={() => { setStatus("idle"); setStep(1); setName(""); setPhone(""); }}
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", borderBottom: "1px solid var(--line)" }}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div
              key={label}
              style={{
                flex: 1, padding: "14px 8px", textAlign: "center", fontWeight: 700, fontSize: 12, lineHeight: 1.2,
                color: active ? "var(--accent-ink)" : done ? "var(--ink-2)" : "#a3a299",
                background: active ? "var(--accent-soft)" : "#fff",
                borderBottom: `3px solid ${active ? "var(--accent)" : "transparent"}`,
              }}
            >
              {n}. {label}
            </div>
          );
        })}
      </div>

      <div style={{ padding: 28 }}>
        {step === 1 && (
          <>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Which model?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
              {variantNames.map((n) => (
                <button
                  key={n}
                  className="pill"
                  aria-pressed={model === n}
                  style={{ justifyContent: "center", padding: 16, fontSize: 15 }}
                  onClick={() => setModel(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Where?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WHERE_OPTS.map(([label, val]) => (
                <button key={val} className="pill" aria-pressed={where === val} style={{ borderRadius: 12, padding: "16px 18px", fontSize: 15, justifyContent: "flex-start" }} onClick={() => setWhere(val)}>
                  {label}
                </button>
              ))}
              {isHome && (
                <input className="field field-lg" placeholder="Your pincode (e.g. 560034)" value={pin} onChange={(e) => setPin(e.target.value)} />
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Which day?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {days.map((o) => (
                <button key={o.day + o.date} className="pill" aria-pressed={date === o.day} style={{ flexDirection: "column", minWidth: 78, padding: "12px 10px", borderRadius: 12, textAlign: "center" }} onClick={() => setDate(o.day)}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{o.day}</div>
                  <div style={{ fontWeight: 400, fontSize: 11, marginTop: 3, opacity: 0.75 }}>{o.date}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Your details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="field field-lg" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="field field-lg" placeholder="Phone (+91)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--page)", fontWeight: 500, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
                Booking: <b>{model}</b> · {where}{isHome && pin ? ` (${pin})` : ""} · {date}
              </div>
              <div className="note">We&apos;ll send a WhatsApp confirmation and our team will call to confirm your slot.</div>
            </div>
          </>
        )}

        <Honeypot value={botcheck} onChange={setBotcheck} />
        {status === "error" && (
          <div style={{ marginTop: 12 }}>
            {sendFailed ? <SubmitFallback store={where} /> : <div className="note" style={{ color: "var(--danger)" }}>{error}</div>}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button className="btn btn-outline" style={{ height: 46, visibility: step > 1 ? "visible" : "hidden" }} onClick={() => setStep(Math.max(1, step - 1))}>Back</button>
          <button className="btn btn-primary" style={{ height: 46 }} onClick={next} disabled={status === "sending"}>
            {status === "sending" ? "Booking…" : step < 4 ? "Continue" : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
