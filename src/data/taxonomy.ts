import type {
  AudienceType,
  CampaignType,
  Mechanic,
  TaxonomyItem,
} from "@/data/types";

/** Briefing §3 — 6 mechanics. Canonical, never truncated. */
export const MECHANICS: TaxonomyItem<Mechanic>[] = [
  {
    value: "pct_discount",
    label: "Percentage discount",
    note: "Most common. Always carries both Regular and Prime values.",
  },
  {
    value: "special_price",
    label: "Special price",
    note: "Fixed price for campaign duration — needs reconstructed regular price for real depth.",
  },
  {
    value: "multibuy",
    label: "Multi-buy (2×1, 3×2)",
    note: "Drives basket size; complicates unit-level analysis.",
  },
  {
    value: "bundle",
    label: "Bundle / combo",
    note: "Margin analysis must decompose into component products.",
  },
  {
    value: "coupon",
    label: "Coupon (Talon One)",
    note: "Only mechanic with a clean send/redeem record — gold standard for treatment/control.",
  },
  {
    value: "prime_differential",
    label: "Prime differential",
    note: "Extra Prime-only layer on top of an existing promo; must be isolated from the base promo.",
  },
];

/** Briefing §4 — 8 campaign types. */
export const CAMPAIGN_TYPES: TaxonomyItem<CampaignType>[] = [
  { value: "big_moment", label: "Big Moment", note: "Largest events, own budget ceiling, every channel used." },
  { value: "shot", label: "Shot", note: "Short focused burst, usually one category. Good for testing." },
  { value: "launch", label: "Launch", note: "New brand/product introduction, often supplier co-funded." },
  { value: "leaflet", label: "Leaflet", note: "Recurring printed flyer, in-store only. No individual exposure tracking." },
  { value: "always_on", label: "Always On", note: "Permanent mechanic, treated as baseline noise in time-series models." },
  { value: "awareness", label: "Awareness", note: "May or may not carry a discount — can isolate awareness vs discount effect." },
  { value: "recurring", label: "Recurring", note: "Template-based fixed pattern. Used to study habituation." },
  { value: "personalization", label: "Personalization", note: "Segment-level, affinity-based. Control groups standard." },
];

/** Briefing §5 — 4 audience types. */
export const AUDIENCE_TYPES: TaxonomyItem<AudienceType>[] = [
  { value: "mass", label: "Mass / General", note: "No individual targeting — hardest to measure incrementality." },
  {
    value: "personalized_segment",
    label: "Personalized by Segment",
    note: "Selection bias present — segment often chosen because of prior behavior.",
  },
  { value: "reactivation", label: "Reactivation", note: "Inactive customers by days-since-purchase. High modeling value." },
  {
    value: "rx_replenishment",
    label: "Cyclical Replenishment (RX)",
    note: "Closest thing to a controlled experiment: D-3/D+0 informational, D+3 discount only if not yet purchased.",
  },
];

export const CHANNELS = [
  { value: "all", label: "All Channels" },
  { value: "digital_crm", label: "Digital CRM" },
  { value: "in_store_pos", label: "In-Store POS" },
  { value: "app_push", label: "App Push" },
];

export const LIFECYCLE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "fresh", label: "🌱 Fresh <30d" },
  { value: "active_repeat", label: "✓ Active Repeat" },
  { value: "lapsed", label: "↩ Lapsed" },
] as const;

export const PRIME_OPTIONS = [
  { value: "all", label: "All Tiers" },
  { value: "prime", label: "★ Prime" },
  { value: "non_prime", label: "Non-Prime" },
] as const;

export const mechanicLabel = (m: Mechanic) => MECHANICS.find((x) => x.value === m)?.label ?? m;
export const campaignTypeLabel = (c: CampaignType) =>
  CAMPAIGN_TYPES.find((x) => x.value === c)?.label ?? c;
export const audienceLabel = (a: AudienceType) =>
  AUDIENCE_TYPES.find((x) => x.value === a)?.label ?? a;
export const lifecycleLabel = (l: string) =>
  l === "fresh"
    ? "Fresh Customer"
    : l === "active_repeat"
      ? "Active Repeat"
      : l === "lapsed"
        ? "Lapsed"
        : "Sure Thing";
