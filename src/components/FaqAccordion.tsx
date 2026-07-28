"use client";

import { useState } from "react";
import type { Faq } from "@/data/site.data";

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="card"
            style={{ cursor: "pointer", padding: "18px 20px", borderRadius: 12 }}
            onClick={() => setOpen(isOpen ? -1 : i)}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{f.q}</span>
              <span style={{ fontWeight: 600, fontSize: 20, lineHeight: 1, color: "var(--accent)" }}>{isOpen ? "–" : "+"}</span>
            </div>
            {isOpen && <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.55, color: "var(--muted)" }}>{f.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
