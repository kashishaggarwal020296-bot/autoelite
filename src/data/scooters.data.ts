/**
 * AUTOELITE — SINGLE SOURCE OF TRUTH FOR ALL SCOOTER DATA
 * ------------------------------------------------------------------
 * GOLDEN RULE: edit ONLY this file. Every component (model grid, model
 * pages, specs tables, colour picker, on-road price tool, EMI calculator,
 * footer links) reads from here. Never type a price, spec, colour, or
 * variant into a page or component again.
 *
 * When something changes (price / new variant / new model / colour / offer):
 *   1. edit the relevant object below
 *   2. bump `lastVerified` on that variant (and onRoadConfig if RTO/subsidy moved)
 *   3. the whole site updates from this one edit
 *
 * VERIFICATION STATUS (read before launch):
 *   - Ex-showroom + on-road figures below are from the Bengaluru configurator
 *     read (28 Jul 2026). On-road is set per-variant as `onRoadBlrOverride` and
 *     stays INDICATIVE — `onRoadConfig.isVerified` is false, so the UI keeps the
 *     "indicative — confirm in-store" note on every on-road figure.
 *   - The configurator benefit is ALREADY baked into the effective ex-showroom
 *     price — do NOT subtract a subsidy/offer on top (no stacking).
 *   - Colour hex is mostly SAMPLED from official Ather 3/4 shots (Rizta full set;
 *     450 Cosmic Black/True Red/Still White/Space Grey/Lunar Grey/Salt Green).
 *     A few neutrals (e.g. Cosmic Black, Still White) are close approximations.
 *     Indium Blue (Apex) sampled. 450 lineup refreshed 2026: Salt Green added,
 *     Hyper Sand + Stealth Blue removed.
 */

// ---------- TYPES ----------

export type Availability = "available" | "coming_soon" | "discontinued";

export interface Colour {
  name: string;          // "Terracotta Red Super Matte"
  hex: string;           // swatch fill — PLACEHOLDER, set from the real Ather colour kit
  finish: "mono" | "duo" | "matte";
  priceDelta: number;    // added to ex-showroom (₹). 0 if none.
  status: Availability;
}

export interface KeySpecs {
  // Display strings on purpose — we do NOT map a battery pack to a specific
  // range (the site doesn't publish that mapping). Full table lives at specSheetUrl.
  idcRangeKm: string;    // "123 / 161"
  topSpeedKmph: number;
  zeroToFortyS: number;
  power?: string;        // peak motor power — "4.3 kW"
  torque?: string;       // "22 Nm"
  batteryKwh: string;    // "2.7 / 2.9 / 3.5"
  fastCharge: string;    // "up to 15 km in 10 min"
  boot: string;          // "34 L (56 L with 22 L frunk accessory)"
  warranty?: string;     // "3 yr / 30,000 km"
}

export interface Offer {
  active: boolean;
  label: string;         // "₹5,000 off — ends 31 Aug"
  amount?: number;       // ₹ subtracted from on-road when the offer is live
  startsOn?: string;     // ISO date
  endsOn?: string;       // ISO date
}

export interface Variant {
  id: string;            // stable slug, used in URLs/keys — "rizta-z"
  name: string;          // "Rizta Z"
  tag?: string;          // short label — "The family EV"
  positioning?: string;  // one-line variant pitch
  // Effective ex-showroom (post-benefit) from configurator — benefit already
  // included (~₹9,499 Rizta / ₹8,499 450S / ₹9,500 450X). Moves with offers;
  // re-check monthly. Do NOT stack an offer line.
  exShowroomBlr: number;
  emiFrom: number | null;// legacy field — EMI is now COMPUTED (see getEmiFrom)
  onRoadBlrOverride?: number; // pasted on-road total; WINS over the config computation
  colours: Colour[];
  keySpecs: KeySpecs;
  offer: Offer;
  status: Availability;
  lastVerified?: string; // ISO date this variant's figures were confirmed
  specSheetUrl?: string;
  image?: string;        // public/ path to a 3/4-front studio shot; overrides model.image
}

export interface Model {
  id: string;            // used for /scooters/{id}/ — "rizta"
  name: string;          // "Ather Rizta"
  tagline: string;       // your original one-liner
  rangeNote?: string;    // range-option surcharge note, surfaced next to from-price
  order: number;         // display order in grids
  status: Availability;
  image?: string;        // public/ path — card image + model-page hero fallback
  variants: Variant[];
}

export interface OnRoadConfig {
  // Fallback used only when a variant has no onRoadBlrOverride. All current
  // variants carry an override, so these are dormant. PLACEHOLDER values — flip
  // `isVerified` to true only after confirming against your Ather channel / RTO.
  registration: number;  // flat ₹ RTO/registration
  insuranceRate: number; // 1-yr comprehensive, as a fraction of ex-showroom
  subsidy: number;       // flat ₹ FAME / Karnataka subsidy subtracted
  isVerified: boolean;   // false → UI marks every on-road figure "indicative"
  lastVerified: string;  // ISO date — the guardrail
}

export interface FinanceConfig {
  annualRate: number;    // reducing-balance annual rate for EMI estimates
  maxTenureMonths: number; // used for the "EMI from" figure
}

// ---------- HELPERS ----------

export function getExShowroom(variant: Variant, colour?: Colour): number {
  return variant.exShowroomBlr + (colour?.priceDelta ?? 0);
}

// True only when the offer is flagged active AND today falls within its window.
// Missing startsOn/endsOn are treated as open-ended on that side.
export function isOfferLive(offer: Offer, now: Date = new Date()): boolean {
  if (!offer.active) return false;
  if (offer.startsOn && now < new Date(offer.startsOn)) return false;
  if (offer.endsOn && now > new Date(offer.endsOn)) return false;
  return true;
}

// ₹ knocked off the on-road total by a currently-live offer (0 if none).
// NB: ignored when onRoadBlrOverride is set — the benefit is already in ex-showroom.
export function offerAmount(variant: Variant, now: Date = new Date()): number {
  return isOfferLive(variant.offer, now) ? variant.offer.amount ?? 0 : 0;
}

export function getOnRoadPrice(variant: Variant, config: OnRoadConfig, colour?: Colour): number {
  if (variant.onRoadBlrOverride != null) return variant.onRoadBlrOverride;
  const base = getExShowroom(variant, colour);
  const insurance = Math.round(base * config.insuranceRate);
  return base + config.registration + insurance - config.subsidy - offerAmount(variant);
}

export interface OnRoadRow {
  label: string;
  amount: number;        // signed: positive adds, negative subtracts
  note: string;
  kind: "base" | "add" | "sub";
}

// Itemised on-road breakup. The rows always sum to getOnRoadPrice().
export function getOnRoadBreakdown(variant: Variant, config: OnRoadConfig, colour?: Colour): OnRoadRow[] {
  const base = getExShowroom(variant, colour);

  // Override present: ex-showroom already includes the Bengaluru benefit, so we
  // show ex-showroom + remaining charges and NEVER a subsidy/offer line.
  if (variant.onRoadBlrOverride != null) {
    return [
      { label: "Ex-showroom (effective)", amount: base, note: `Post-benefit price · ${variant.name}`, kind: "base" },
      { label: "RTO, insurance & charges", amount: variant.onRoadBlrOverride - base, note: "RTO ₹1,062 + insurance; Karnataka EV road-tax exempt", kind: "add" },
    ];
  }

  const insurance = Math.round(base * config.insuranceRate);
  const rows: OnRoadRow[] = [
    { label: "Ex-showroom", amount: base, note: `Base price · ${variant.name}`, kind: "base" },
    { label: "RTO / registration", amount: config.registration, note: "Karnataka EV — road tax exempt (verify)", kind: "add" },
    { label: "Insurance (1 yr)", amount: insurance, note: "Comprehensive, indicative", kind: "add" },
    { label: "FAME / Karnataka subsidy", amount: -config.subsidy, note: "Applied at billing", kind: "sub" },
  ];
  const offer = offerAmount(variant);
  if (offer > 0) {
    rows.push({ label: "Autoelite offer", amount: -offer, note: variant.offer.label, kind: "sub" });
  }
  return rows;
}

// Reducing-balance EMI. Returns the monthly instalment (0 if nothing to finance).
export function computeEmi(principal: number, annualRate: number, months: number): number {
  const P = Math.max(0, principal);
  if (P <= 0 || months <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return P / months;
  const f = Math.pow(1 + r, months);
  return (P * r * f) / (f - 1);
}

export function getEmi(
  variant: Variant,
  config: OnRoadConfig,
  finance: FinanceConfig,
  downPayment: number,
  months: number,
  colour?: Colour,
): number {
  const onRoad = getOnRoadPrice(variant, config, colour);
  return computeEmi(onRoad - downPayment, finance.annualRate, months);
}

// "EMI from" = zero down, longest tenure, on-road financed.
export function getEmiFrom(variant: Variant, config: OnRoadConfig, finance: FinanceConfig, colour?: Colour): number {
  return getEmi(variant, config, finance, 0, finance.maxTenureMonths, colour);
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function cheapestVariant(model: Model): Variant {
  return model.variants
    .filter((v) => v.status === "available")
    .reduce((a, b) => (b.exShowroomBlr < a.exShowroomBlr ? b : a));
}

// Cheapest on-road across a model's available variants (for "on-road from").
export function modelFromOnRoad(model: Model, config: OnRoadConfig): { variant: Variant; onRoad: number } {
  const avail = model.variants.filter((v) => v.status === "available");
  const list = avail.length ? avail : model.variants;
  return list
    .map((variant) => ({ variant, onRoad: getOnRoadPrice(variant, config) }))
    .reduce((a, b) => (b.onRoad < a.onRoad ? b : a));
}

// ---------- ON-ROAD CONFIG ----------
// Dormant fallback while every variant carries an onRoadBlrOverride. Figures
// verified against the Autoelite Ather price list (August 2026).
export const onRoadConfig: OnRoadConfig = {
  registration: 1062,     // RTO registration & smart-card fees (flat), per price list. Road tax ₹0 (KA EV exempt)
  insuranceRate: 0.053,   // ~5.3% of effective ex-showroom (basic 1yr OD + 5yr TP + PA); varies slightly per variant
  subsidy: 0,             // PM E-Drive benefit already baked into effective ex-showroom — no stacking
  isVerified: true,       // verified against Autoelite Aug 2026 price list
  lastVerified: "2026-07-30",
};

// ---------- FINANCE CONFIG ----------
// Indicative default. Final rate depends on the finance partner and the buyer's profile.
// annualRate is a realistic average — NOT Ather's advertised "as low as 3.99%" floor,
// which most buyers won't qualify for. maxTenureMonths matches Ather Flexipay's 60-month
// ceiling (atherenergy.com/flexipay, checked 2026-07-30; tenures 6–60 months).
export const financeConfig: FinanceConfig = {
  annualRate: 0.095,      // 9.5% p.a. reducing balance
  maxTenureMonths: 60,
};

// ---------- PER-COLOUR STUDIO SHOTS ----------
// Official Ather 3/4 renders, keyed by "modelId::colourName". Only Rizta has a
// full per-colour set today; other models fall back to variant/model image.
const colourImages: Record<string, string> = {
  "rizta::Siachen White Mono": "/scooters/rizta/white.jpg",
  "rizta::Deccan Grey Mono": "/scooters/rizta/grey.jpg",
  "rizta::Deccan Grey Duo": "/scooters/rizta/grey-duo.jpg",
  "rizta::Terracotta Red Super Matte": "/scooters/rizta/red.jpg",
  "rizta::Terracotta Red Duo": "/scooters/rizta/red.jpg",
  "rizta::Pangong Blue Super Matte": "/scooters/rizta/blue.jpg",
  "rizta::Pangong Blue Duo": "/scooters/rizta/blue.jpg",
  "rizta::Alphonso Yellow Duo": "/scooters/rizta/yellow.jpg",
  "rizta::Cardamom Green Duo": "/scooters/rizta/green.jpg",
  // Ather 450 (450S + 450X share these colour renders). Every current 450 colour
  // has a shot after the 2026 refresh (Salt Green in, Hyper Sand/Stealth Blue out).
  "450::Cosmic Black": "/scooters/450/black.jpg",
  "450::True Red": "/scooters/450/red.jpg",
  "450::Still White": "/scooters/450/white.jpg",
  "450::Space Grey": "/scooters/450/space-grey.jpg",
  "450::Lunar Grey": "/scooters/450/lunar-grey.jpg",
  "450::Salt Green": "/scooters/450/salt-green.jpg",
};

export function colourImage(modelId: string, colourName: string): string | undefined {
  return colourImages[`${modelId}::${colourName}`];
}

// ---------- DATA ----------
// Colour hex: several sampled from Ather product shots (see header note); the
// rest are approximations pending the official Ather colour kit.

export const models: Model[] = [
  {
    id: "rizta",
    name: "Ather Rizta",
    image: "/scooters/rizta/red.jpg",
    tagline: "The family EV — up to ~161 km, 34–56 L storage, built for the daily Bengaluru run.",
    rangeNote: "161 km option +₹23,000 (S) / +₹20,000 (Z)",
    order: 1,
    status: "available",
    variants: [
      {
        id: "rizta-s",
        name: "Rizta S",
        image: "/scooters/rizta/blue.jpg",
        tag: "The family EV",
        positioning: "The easy daily EV — comfortable, roomy and built for the Bengaluru run.",
        exShowroomBlr: 121499,
        onRoadBlrOverride: 129504, // configurator on-road (indicative) — benefit already in ex-showroom
        emiFrom: 2235,
        status: "available",
        lastVerified: "2026-07-30",
        specSheetUrl: "",
        keySpecs: {
          idcRangeKm: "123 / 161", // 161 confirmed (the earlier 159 figure was wrong)
          topSpeedKmph: 80,
          zeroToFortyS: 4.7,
          power: "4.3 kW",
          torque: "22 Nm",
          batteryKwh: "2.7 / 2.9 / 3.5", // display string only — do NOT map a pack to a range
          fastCharge: "up to 15 km in 10 min",
          boot: "34 L (56 L with 22 L frunk accessory)",
          warranty: "3 yr / 30,000 km",
        },
        offer: { active: false, label: "" },
        colours: [
          { name: "Deccan Grey Mono", hex: "#6b6b68", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Siachen White Mono", hex: "#e9e8e2", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Terracotta Red Super Matte", hex: "#7a4a3e", finish: "matte", priceDelta: 1000, status: "available" },
          { name: "Pangong Blue Super Matte", hex: "#474d5e", finish: "matte", priceDelta: 1000, status: "available" },
        ],
      },
      {
        id: "rizta-z",
        name: "Rizta Z",
        image: "/scooters/rizta/red.jpg",
        tag: "The family EV",
        positioning: "More range, more storage and a bigger dash — the family Rizta, maxed out.",
        exShowroomBlr: 136999,
        onRoadBlrOverride: 145295,
        emiFrom: 2235,
        status: "available",
        lastVerified: "2026-07-30",
        specSheetUrl: "",
        keySpecs: {
          idcRangeKm: "123 / 161", // 161 confirmed (the earlier 159 figure was wrong)
          topSpeedKmph: 80,
          zeroToFortyS: 4.7,
          power: "4.3 kW",
          torque: "22 Nm",
          batteryKwh: "2.7 / 2.9 / 3.5",
          fastCharge: "up to 15–30 km in 10 min",
          boot: "34 L (56 L with 22 L frunk accessory)",
          warranty: "3 yr / 30,000 km",
        },
        offer: { active: false, label: "" },
        colours: [
          { name: "Deccan Grey Mono", hex: "#6b6b68", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Siachen White Mono", hex: "#e9e8e2", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Terracotta Red Super Matte", hex: "#7a4a3e", finish: "matte", priceDelta: 1000, status: "available" },
          { name: "Pangong Blue Super Matte", hex: "#474d5e", finish: "matte", priceDelta: 1000, status: "available" },
          { name: "Terracotta Red Duo", hex: "#7a4a3e", finish: "duo", priceDelta: 500, status: "available" },
          { name: "Pangong Blue Duo", hex: "#474d5e", finish: "duo", priceDelta: 500, status: "available" },
          { name: "Deccan Grey Duo", hex: "#6b6b68", finish: "duo", priceDelta: 500, status: "available" },
          { name: "Alphonso Yellow Duo", hex: "#e8c266", finish: "duo", priceDelta: 500, status: "available" },
          { name: "Cardamom Green Duo", hex: "#7c8a73", finish: "duo", priceDelta: 500, status: "available" },
        ],
      },
    ],
  },
  {
    id: "450",
    name: "Ather 450",
    image: "/scooters/450/black.jpg",
    tagline: "The sporty, connected Ather — quick off the line, Google Maps on the dash.",
    rangeNote: "161 km option +₹14,000 (450S) / +₹10,501 (450X)",
    order: 2,
    status: "available",
    variants: [
      {
        id: "450s",
        name: "450S",
        image: "/scooters/450/black.jpg",
        tag: "The sporty entry",
        positioning: "90 km/h, quick off the line and fully connected — the entry into 450.",
        exShowroomBlr: 135999,
        onRoadBlrOverride: 144257,
        emiFrom: 2545,
        status: "available",
        lastVerified: "2026-07-30",
        specSheetUrl: "",
        keySpecs: {
          idcRangeKm: "122 / 161",
          topSpeedKmph: 90,
          zeroToFortyS: 3.9,
          power: "5.4 kW",
          torque: "22 Nm",
          batteryKwh: "2.9 / 3.5",
          fastCharge: "up to 15 km in 10 min",
          boot: "22 L",
          warranty: "3 yr / 30,000 km",
        },
        offer: { active: false, label: "" },
        colours: [
          { name: "Still White", hex: "#e9e8e2", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Cosmic Black", hex: "#2f2f2c", finish: "mono", priceDelta: 0, status: "available" },
          { name: "True Red", hex: "#b23b3b", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Salt Green", hex: "#a9cdae", finish: "mono", priceDelta: 0, status: "available" },
        ],
      },
      {
        id: "450x",
        name: "450X",
        image: "/scooters/450/black.jpg",
        tag: "The enthusiast's Ather",
        positioning: "Warp mode and Google Maps on the dash — the connected enthusiast's 450.",
        exShowroomBlr: 152498,
        onRoadBlrOverride: 161085,
        emiFrom: 2545,
        status: "available",
        lastVerified: "2026-07-30",
        specSheetUrl: "",
        keySpecs: {
          idcRangeKm: "126 / 161",
          topSpeedKmph: 90,
          zeroToFortyS: 3.3,
          power: "6.4 kW",
          torque: "26 Nm",
          batteryKwh: "2.9 / 3.5",
          fastCharge: "up to 15–30 km in 10 min",
          boot: "22 L",
          warranty: "3 yr / 30,000 km",
        },
        offer: { active: false, label: "" },
        colours: [
          { name: "Cosmic Black", hex: "#2f2f2c", finish: "mono", priceDelta: 0, status: "available" },
          { name: "True Red", hex: "#b23b3b", finish: "mono", priceDelta: 0, status: "available" },
          { name: "Space Grey", hex: "#646260", finish: "mono", priceDelta: 1000, status: "available" },
          { name: "Lunar Grey", hex: "#6b6b68", finish: "mono", priceDelta: 1000, status: "available" },
          { name: "Still White", hex: "#e9e8e2", finish: "mono", priceDelta: 1000, status: "available" },
          { name: "Salt Green", hex: "#a9cdae", finish: "mono", priceDelta: 0, status: "available" },
        ],
      },
    ],
  },
  {
    id: "450-apex",
    name: "Ather 450 Apex",
    image: "/scooters/450-apex.webp",
    tagline: "The fastest Ather made — 0–40 in 2.9 s, 100 km/h.",
    order: 3,
    status: "available",
    variants: [
      {
        id: "450-apex",
        name: "450 Apex",
        image: "/scooters/450-apex.webp",
        tag: "The fastest Ather made",
        positioning: "0–40 in 2.9 s and 100 km/h — the sharpest, fastest ride Ather builds.",
        exShowroomBlr: 194999,
        onRoadBlrOverride: 204276,
        emiFrom: null,
        status: "available",
        lastVerified: "2026-07-30",
        specSheetUrl: "",
        keySpecs: {
          idcRangeKm: "165",
          topSpeedKmph: 100,
          zeroToFortyS: 2.9,
          power: "7.0 kW",
          torque: "26 Nm",
          batteryKwh: "3.5",
          fastCharge: "up to 30 km in 10 min",
          boot: "22 L",
          warranty: "3 yr / 30,000 km",
        },
        offer: { active: false, label: "" },
        colours: [
          { name: "Indium Blue", hex: "#38356c", finish: "duo", priceDelta: 0, status: "available" },
        ],
      },
    ],
  },
];

// Convenience: flat list of every variant for the /scooters index + on-road tool.
export const allVariants = models.flatMap((m) =>
  m.variants.map((v) => ({ model: m, variant: v }))
);
