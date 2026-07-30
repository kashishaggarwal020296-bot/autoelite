"use client";

import { track } from "./analytics";

/**
 * Single lead pipeline. Every form (test ride, on-road price, service, callback,
 * homepage lead) builds a canonical payload and POSTs it as JSON.
 *
 * Delivery is Web3Forms (email, client-side — no backend). The payload's lead
 * field names are delivery-agnostic and match the Make webhook spec, so switching
 * delivery to Make later is a one-line change: repoint ENDPOINT below. Nothing in
 * the forms changes. Web3Forms-only wrapper fields (access_key / from_name /
 * subject / botcheck) are extra keys Make simply ignores.
 */

const ENDPOINT = "https://api.web3forms.com/submit";
// Web3Forms delivers to the inbox tied to each access key. Service leads go to
// a separate key (service manager's inbox); everything else uses the sales key.
// If the service key is unset, service falls back to the sales key so nothing
// breaks before it's configured.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const SERVICE_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY_SERVICE || ACCESS_KEY;

function accessKeyFor(formType: FormType): string | undefined {
  return formType === "service" ? SERVICE_KEY : ACCESS_KEY;
}

export type FormType = "test_ride" | "on_road_price" | "service" | "callback";

const FORM_LABEL: Record<FormType, string> = {
  test_ride: "test ride",
  on_road_price: "on-road price",
  service: "service",
  callback: "callback",
};

export interface LeadInput {
  formType: FormType;
  name?: string;
  phone?: string;
  store?: string;
  model?: string;
  variant?: string;
  slot?: string;       // preferred day / date
  pincode?: string;
  pickup?: boolean;
  reminderOptIn?: boolean; // service: customer opted in to a first-service reminder
  message?: string;    // free text; auto-composed from fields if omitted
  botcheck?: string;   // honeypot — must be empty for a human
}

export interface LeadResult {
  ok: boolean;
  error?: string;
}

function utm() {
  if (typeof window === "undefined") return { utm_source: "", utm_medium: "", utm_campaign: "" };
  const q = new URLSearchParams(window.location.search);
  return {
    utm_source: q.get("utm_source") ?? "",
    utm_medium: q.get("utm_medium") ?? "",
    utm_campaign: q.get("utm_campaign") ?? "",
  };
}

function composeMessage(i: LeadInput): string {
  if (i.message) return i.message;
  const parts: string[] = [];
  if (i.model) parts.push(i.model);
  if (i.variant && i.variant !== i.model) parts.push(i.variant);
  if (i.store) parts.push(i.store);
  if (i.slot) parts.push(i.slot);
  if (i.pincode) parts.push(`PIN ${i.pincode}`);
  if (i.pickup != null) parts.push(i.pickup ? "Pickup & drop" : "Drop at store");
  if (i.reminderOptIn) parts.push("First-service reminder: opted in");
  return parts.join(" · ");
}

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const label = FORM_LABEL[input.formType];
  const subject = `New ${label}${input.store ? ` — ${input.store}` : ""}`;

  const accessKey = accessKeyFor(input.formType);

  const payload = {
    // ---- Web3Forms wrapper (ignored by Make) ----
    access_key: accessKey,
    from_name: "Autoelite Website",
    subject,
    botcheck: input.botcheck ?? "",

    // ---- canonical lead fields (identical across delivery targets) ----
    form_type: input.formType,
    name: input.name ?? "",
    phone: input.phone ?? "",
    store: input.store ?? "",
    model: input.model ?? "",
    variant: input.variant ?? "",
    slot: input.slot ?? "",
    pincode: input.pincode ?? "",
    pickup: input.pickup ?? "",
    reminder_opt_in: input.reminderOptIn ?? "",
    message: composeMessage(input),
    page_url: typeof window !== "undefined" ? window.location.href : "",
    referrer: typeof window !== "undefined" ? document.referrer || "direct" : "",
    ...utm(),
  };

  if (!accessKey) {
    return { ok: false, error: "Form is not configured (missing Web3Forms key)." };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || data.success !== true) {
      return { ok: false, error: data.message || `Request failed (${res.status})` };
    }
    track("lead_submit", { lead_type: input.formType, model: input.model, store: input.store });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
