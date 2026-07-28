"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const NAV = [
  { href: "/scooters", label: "Scooters" },
  { href: "/on-road-price", label: "On-Road Price" },
  { href: "/finance", label: "Finance" },
  { href: "/service", label: "Service" },
  { href: "/stores/koramangala", label: "Stores" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      <div className="header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Link href="/" className="brand">
            auto<span>elite</span>
          </Link>
          <nav className="nav">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
              return (
                <Link key={n.href} href={n.href} className={active ? "active" : ""}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="header-cta">
          <span className="pin" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13, color: "var(--muted)" }}>
            📍 Koramangala + HSR
          </span>
          <Link
            href="/test-ride"
            onClick={() => track("cta_test_ride", { location: "header" })}
            className="pill"
            style={{ height: 38, padding: "0 18px", background: "var(--accent)", color: "#fff", border: "none", fontSize: 14 }}
          >
            Book a Test Ride
          </Link>
        </div>
      </div>
    </header>
  );
}
