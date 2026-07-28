"use client";

import Link from "next/link";
import { stores, whatsappLink } from "@/data/site.data";
import { track } from "@/lib/analytics";

export default function MobileBar() {
  const primary = stores[0];
  return (
    <div className="mobar">
      <a href={`tel:${primary.phoneTel}`} onClick={() => track("cta_call", { location: "mobile_bar" })}>
        <span className="ico">📞</span>Call
      </a>
      <a
        href={whatsappLink("Hi Autoelite, I'd like to know more about an Ather scooter.")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("cta_whatsapp", { location: "mobile_bar" })}
      >
        <span className="ico">💬</span>WhatsApp
      </a>
      <Link href="/test-ride" className="book" onClick={() => track("cta_test_ride", { location: "mobile_bar" })}>
        <span className="ico">🛵</span>Book Test Ride
      </Link>
    </div>
  );
}
