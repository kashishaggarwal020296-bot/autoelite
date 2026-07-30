"use client";

import { useState } from "react";
import { models } from "@/data/scooters.data";
import { stores } from "@/data/site.data";
import { submitLead } from "@/lib/leads";
import { Honeypot, SubmitFallback } from "@/components/FormBits";

const vehicleNames = models.map((m) => m.name);
// Only stores with a running service station can take bookings.
const serviceStores = stores.filter((s) => s.serviceAvailable);

export default function ServiceForm() {
  const [vehicle, setVehicle] = useState(vehicleNames[0]);
  const [store, setStore] = useState(serviceStores[0].name);
  const [date, setDate] = useState("");
  const [pickup, setPickup] = useState(true);
  const [remind, setRemind] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
    const res = await submitLead({ formType: "service", name, phone, model: vehicle, store, slot: date, pickup, reminderOptIn: remind, botcheck });
    if (res.ok) setStatus("done");
    else { setSendFailed(true); setStatus("error"); }
  }

  if (status === "done") {
    return (
      <div className="card-soft" style={{ padding: 36, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 24, lineHeight: 1.15, color: "var(--accent-deep)" }}>Service booked ✅</div>
        <p style={{ margin: "14px auto 0", maxWidth: 420, fontSize: 16, lineHeight: 1.55, color: "#3f5a48" }}>
          {vehicle} · {store}{date ? ` · ${date}` : ""}. {pickup ? "Free pickup & drop is on." : "Drop-off at store."} We&apos;ll confirm with {name} shortly.
        </p>
        <button className="btn btn-outline" style={{ marginTop: 20, height: 44 }} onClick={() => { setStatus("idle"); setName(""); setPhone(""); }}>Book another</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div className="label">Your Ather</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {vehicleNames.map((n) => (
            <button key={n} className="pill" aria-pressed={vehicle === n} onClick={() => setVehicle(n)}>{n}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="label">Store</div>
        <div style={{ display: "flex", gap: 8 }}>
          {serviceStores.map((s) => (
            <button key={s.id} className="pill" aria-pressed={store === s.name} style={{ flex: 1, justifyContent: "center", borderRadius: 10 }} onClick={() => setStore(s.name)}>{s.name}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="label">Preferred date</div>
          <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 160, display: "flex", alignItems: "end" }}>
          <label onClick={() => setPickup(!pickup)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, height: 46, padding: "0 14px", border: "1px solid var(--line-2)", borderRadius: 10, width: "100%", fontWeight: 600, fontSize: 14 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${pickup ? "var(--accent)" : "#c7c6be"}`, background: pickup ? "var(--accent)" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13 }}>{pickup ? "✓" : ""}</span>
            Free pickup &amp; drop
          </label>
        </div>
      </div>
      <label onClick={() => setRemind(!remind)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", minHeight: 46, border: "1px solid var(--line-2)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
        <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 6, border: `2px solid ${remind ? "var(--accent)" : "#c7c6be"}`, background: remind ? "var(--accent)" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13 }}>{remind ? "✓" : ""}</span>
        Remind me when my first service is due
      </label>
      <input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="field" placeholder="Phone (+91)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Honeypot value={botcheck} onChange={setBotcheck} />
      {status === "error" && (sendFailed ? <SubmitFallback store={store} /> : <div className="note" style={{ color: "var(--danger)" }}>{error}</div>)}
      <button className="btn btn-primary" style={{ height: 50 }} onClick={onSubmit} disabled={status === "sending"}>
        {status === "sending" ? "Booking…" : "Book service"}
      </button>
    </div>
  );
}
