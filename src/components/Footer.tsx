import Link from "next/link";
import { models } from "@/data/scooters.data";
import { stores, dealer } from "@/data/site.data";

export default function Footer() {
  const footerModels = models
    .filter((m) => m.status === "available")
    .sort((a, b) => a.order - b.order);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/brand/autoelite-icon.png" alt="" style={{ height: 34, width: "auto", display: "block" }} />
            <span className="brand" style={{ color: "#fff" }}>auto<span>elite</span></span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.55, color: "#94938b", maxWidth: 240 }}>
            {dealer.tagline} Sales, finance and service — Koramangala &amp; HSR Layout.
          </p>
        </div>

        <div className="col">
          <h4>Models</h4>
          {footerModels.map((m) => (
            <Link key={m.id} href={`/scooters/${m.id}`}>
              {m.name}
            </Link>
          ))}
          <Link href="/scooters">All scooters</Link>
        </div>

        <div className="col">
          <h4>Explore</h4>
          <Link href="/on-road-price">On-Road Price</Link>
          <Link href="/finance">Finance &amp; EMI</Link>
          <Link href="/service">Service</Link>
          <Link href="/charging">Charging</Link>
          <Link href="/ownership">Ownership</Link>
          <Link href="/test-ride">Book a Test Ride</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {stores.map((s) => (
          <div key={s.id} className="col">
            <h4>{s.name}</h4>
            <span style={{ color: "#94938b", cursor: "default" }}>{s.address}</span>
            <span style={{ color: "#94938b", cursor: "default", marginTop: 4 }}>{s.hours}</span>
            <a href={`tel:${s.phoneTel}`} style={{ color: "var(--accent-light)", fontWeight: 700, marginTop: 8 }}>
              📞 {s.phoneDisplay}
            </a>
          </div>
        ))}
      </div>
      <div className="footer-legal">
        <div>
          Authorized Ather dealer. GSTIN 29ABACA0605K1ZW. Prices are read from our live pricing data (Autoelite Ather
          price list, Aug 2026); ex-showroom and on-road figures vary by variant, colour and current offers — confirm
          in-store before purchase.
        </div>
      </div>
    </footer>
  );
}
