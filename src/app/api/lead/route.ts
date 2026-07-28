import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side lead proxy. Forwards every submitted form to the configurable
 * Make.com webhook so the URL/secret never ships to the browser.
 *   MAKE_WEBHOOK_URL — set in .env.local / Vercel env.
 * If it's unset (e.g. during local dev before wiring), we log and return ok so
 * the UX can be tested end-to-end without a live webhook.
 */
export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const webhook = process.env.MAKE_WEBHOOK_URL;
  const enriched = {
    ...(typeof payload === "object" && payload ? payload : {}),
    source: "autoelite-web",
    serverReceivedAt: new Date().toISOString(),
  };

  if (!webhook) {
    console.warn("[lead] MAKE_WEBHOOK_URL not set — lead not forwarded:", enriched);
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Webhook responded ${res.status}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Webhook error" },
      { status: 502 },
    );
  }
}
