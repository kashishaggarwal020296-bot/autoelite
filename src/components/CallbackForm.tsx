"use client";

import { useState } from "react";
import { models } from "@/data/scooters.data";
import { stores } from "@/data/site.data";
import { submitLead } from "@/lib/leads";
import { Honeypot, SubmitFallback } from "@/components/FormBits";

const modelNames = models.map((m) => m.name);

export default function CallbackForm({ compact = false, defaultModel }: { compact?: boolean; defaultModel?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [store, setStore] = useState(stores[0].name);
  const [model, setModel] = useState(defaultModel ?? modelNames[0]);
  const [botcheck, setBotcheck] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [sendFailed, setSendFailed] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit() {
    if (!name.trim() || !phone.trim()) {
      setError("Please add your name and phone.");
      setSendFailed(false);
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const res = await submitLead({ formType: "callback", name, phone, store, model, botcheck });
    if (res.ok) setStatus("done");
    else {
      setSendFailed(true);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div style={{ padding: compact ? "12px 4px" : "20px 4px", textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: "var(--accent-strong)" }}>Thanks, {name} 👍</div>
        <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, color: "var(--muted)" }}>
          Our {store} team will call you shortly to talk about the {model}.
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <>
        <input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <input className="field" placeholder="Phone (+91)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" style={{ height: 46, padding: "0 20px", fontSize: 14 }} onClick={onSubmit} disabled={status === "sending"}>
            {status === "sending" ? "…" : "Call me"}
          </button>
        </div>
        <Honeypot value={botcheck} onChange={setBotcheck} />
        {status === "error" && (sendFailed ? <SubmitFallback store={store} /> : <div className="note" style={{ color: "var(--danger)" }}>{error}</div>)}
      </>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="field" placeholder="Phone (+91)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div style={{ display: "flex", gap: 12 }}>
        <select className="field" value={store} onChange={(e) => setStore(e.target.value)} style={{ flex: 1 }}>
          {stores.map((s) => (
            <option key={s.id}>{s.name}</option>
          ))}
        </select>
        <select className="field" value={model} onChange={(e) => setModel(e.target.value)} style={{ flex: 1 }}>
          {modelNames.map((mn) => (
            <option key={mn}>{mn}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={onSubmit} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request a callback"}
      </button>
      <Honeypot value={botcheck} onChange={setBotcheck} />
      {status === "error" && (sendFailed ? <SubmitFallback store={store} /> : <div className="note" style={{ color: "var(--danger)" }}>{error}</div>)}
      <div className="note">By submitting you agree to be contacted about your enquiry. No spam.</div>
    </div>
  );
}
