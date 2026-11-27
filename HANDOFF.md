# Autoelite — Session Handoff

_Last updated: 2026-11-27_

## Goal

Finish the Autoelite Ather dealership site (Next.js App Router + TypeScript, auto-deploys to autoelite.in via Vercel on push to `main`). This session's scope: wire the official Ather spec-sheet brochures into the model pages — the last inert link on the site.

## What's done

- **Brochures hosted** in `public/brochures/`: `ather-rizta.pdf` (10 MB) and `ather-450.pdf` (5 MB, compressed from 15 MB).
- **`specSheetUrl` wired** for all five variants in `src/data/scooters.data.ts`:
  - Rizta S, Rizta Z → `/brochures/ather-rizta.pdf`
  - 450S, 450X, 450 Apex → `/brochures/ather-450.pdf`
- **"Full specifications" link added** to the specs card in `src/components/ModelDetail.tsx`. It was not previously present anywhere — `specSheetUrl` had no consumer. The link renders only when a variant has a non-empty `specSheetUrl`, and opens the PDF in a new tab (`target="_blank" rel="noopener noreferrer"`).
- **`.gitattributes`** added: `*.pdf binary`, so brochure swaps show as clean binary diffs instead of thousands of text lines.
- **450 brochure compressed** 15 MB → 5 MB with Ghostscript (`/ebook` profile). All 11 pages preserved; images stay high-resolution.
- **Verified live on autoelite.in**: both brochures serve `200 application/pdf`; both are valid, complete PDFs (`%PDF-1.5` header, end with `%%EOF`); links resolve correctly per model; all pages rasterize and render cleanly (checked visually).

## Current file state

- `src/data/scooters.data.ts` — single source of truth for models/variants/colours/pricing. All five `specSheetUrl` fields now point at the hosted brochures (previously `""`).
- `src/components/ModelDetail.tsx` — specs card now has a conditional "Full specifications ↗" footer row driven by `variant.specSheetUrl`.
- `public/brochures/ather-rizta.pdf`, `public/brochures/ather-450.pdf` — committed as binary.
- `.gitattributes` — new, marks PDFs binary.

Working tree clean, `main` in sync with `origin/main`. `npm run typecheck` passes.

## Decisions made and why

- **450 Apex mapped to the 450 brochure** — assumed `ather-450.pdf` is the combined 450-family document. Unconfirmed by the owner. If Apex specs aren't in that PDF, unset or redirect that one link.
- **Rizta brochure left uncompressed at 10 MB** — it is 3 extremely tall long-scroll pages (1080 × ~10,000–14,000 pt, i.e. mobile web-page captures), already web-optimised. Every Ghostscript pass tested (down to 96 dpi and JPEG quality 50) produced a *larger* file (12–15 MB). 10 MB is its smallest safe form.
- **450 brochure compressed with `/ebook`** — normal-size print brochure (549 × 425 pt); the profile cut it to a third with no visible quality loss.

## Remaining steps (in order)

1. **Confirm 450 Apex coverage** with the owner. If the 450 brochure lacks Apex specs, set `450-apex`'s `specSheetUrl` back to `""` (hides the link) or point it at a dedicated Apex PDF.
2. **Rizta side gallery** — only Deccan Grey Duo has a side shot (a background-removed showroom photo). Other colours need reshooting *without the protective film* visible on the current cutout. A forwardable photo-request message was drafted in session chat; the owner will send it to the showroom. When shots arrive: background-remove, drop into `public/scooters/rizta/side/`, and add entries to `colourSideImages` in `src/data/scooters.data.ts`.
3. **Salt Green (450)** — finish type and exact variant coverage unconfirmed. Currently on both 450S + 450X, `finish: "mono"`, `priceDelta: 0`. Confirm with the owner and correct if needed.

## Gotchas

- **No stacking on price.** The Bengaluru configurator benefit is already baked into `exShowroomBlr`. Never subtract a subsidy/offer on top. On-road is a per-variant `onRoadBlrOverride` that wins over the config computation.
- **On-road pricing is VERIFIED** (`onRoadConfig.isVerified: true`, Aug 2026 price list). Colour hex values are still partly placeholder — keep the "approximate" wording on colour swatches; never present placeholder figures as final.
- **Do not publish the dealer price list PDF** — it contains bank details. (Memory note.)
- **Rizta brochure will grow if re-run through Ghostscript.** Leave it as the original 10 MB file; don't "re-compress" it.
- **`pdftoppm`/poppler is not installed**, so the Read tool can't render these PDFs. Ghostscript (`gs`, installed this session via Homebrew) handles both compression and page rasterisation for visual checks.
- Dev server: `preview_start {name: "autoelite-dev"}` on port 3000. Live site: https://www.autoelite.in.

## Key files

- `src/data/scooters.data.ts` — models, variants, colours, `onRoadConfig`, `financeConfig`, `colourImage`/`colourImageSide` maps, `specSheetUrl`.
- `src/components/ModelDetail.tsx` — per-colour image swap, side-profile gallery, specs table, "Full specifications" link.
- `src/data/site.data.ts` — stores, dealer rating/GST, reviews, service address.
