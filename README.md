# Autoelite — Ather dealership site

Next.js (App Router) + TypeScript. Authorized Ather dealer, Koramangala + HSR
Layout, Bengaluru. Deployable to Vercel.

## Run locally

```bash
npm install
npm run dev
```

Build / typecheck:

```bash
npm run build
npm run typecheck
```

## Single source of truth

**All** model / variant / price / spec / colour data lives in
[`src/data/scooters.data.ts`](src/data/scooters.data.ts). Nothing is hardcoded in
a component or page — on-road price and EMI are computed from the ex-showroom
field + config. Add a `Variant` (or a whole `Model`) there and it flows to the
homepage grid, `/scooters`, the model page, the on-road tool, the EMI
calculator, the test-ride model list and the footer with no other change.

Dealer info (stores, phones, FAQ) lives in
[`src/data/site.data.ts`](src/data/site.data.ts).

### ⚠ Verification status (read before launch)

Prices/specs are a **captured snapshot, not yet verified** against the Ather
dealer circular. The on-road config (`onRoadConfig`) holds **placeholder**
RTO/insurance/subsidy values behind an `isVerified: false` flag:

- While `isVerified` is `false`, every on-road figure shows an
  **"indicative — confirm in-store"** note and is never presented as final.
- `registration` is seeded `0` (Karnataka EV road-tax-exempt assumption) —
  flagged for verification.
- After you confirm the real numbers, update them and set `isVerified: true`;
  the indicative notes disappear automatically.
- Known open discrepancy flagged in-code: Rizta range (161 vs 159 km).

`financeConfig` (9.5% p.a. reducing balance / 48 mo) is an indicative default.
Colour hex values are visual approximations — replace with real chips.

## Forms → Web3Forms (email)

Every form (test ride, on-road price gate, service, callback, homepage lead)
POSTs JSON directly to Web3Forms (`https://api.web3forms.com/submit`) — no
backend. Get a free access key at https://web3forms.com and set it (keys are
safe to expose client-side):

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-web3forms-uuid-key
NEXT_PUBLIC_GA4_ID=G-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=xxxxxxxxxxxx
```

Each submission sends `from_name`, a dynamic `subject`
(`New {test ride|on-road price|service|callback} — {store}`), a hidden
`botcheck` honeypot, and the canonical lead fields: `name, phone, store, model,
variant, slot, pincode, pickup, message, form_type, page_url, referrer,
utm_source, utm_medium, utm_campaign`.

The success screen only shows after a **200 + `success:true`**. On any failure
the form shows "Couldn't send — please call us" with the selected store's
tappable number — it never shows "done" on a failed submit.

**Switching delivery to Make later:** the lead field names are delivery-agnostic
and match the Make webhook spec, so change only the `ENDPOINT` constant in
[`src/lib/leads.ts`](src/lib/leads.ts) (e.g. to `/api/lead`, the retained Make
proxy). No form changes needed. Analytics snippets (GA4 + Meta Pixel) only load
when their IDs are set.

## Routes

`/` · `/scooters` · `/scooters/[id]` · `/test-ride` · `/on-road-price` ·
`/finance` · `/service` · `/stores/koramangala` · `/stores/hsr-layout` ·
`/charging` · `/ownership` · `/contact` · `/faq`

Server-rendered with per-page titles/meta (geo-modified), plus JSON-LD:
AutoDealer/LocalBusiness per store, FAQPage, BreadcrumbList, and Product+Offer
on model pages. `sitemap.xml` and `robots.txt` are generated.

Before deploying, set `dealer.url` in `src/data/site.data.ts` to the real domain
(used for canonical URLs, sitemap and JSON-LD `@id`s).

## Deploy to Vercel

Push to a Git repo, import in Vercel (framework auto-detected as Next.js), and
add the env vars above in **Project → Settings → Environment Variables**.
