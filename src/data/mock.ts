import type {
  AudienceType,
  CampaignType,
  CategoryElasticity,
  ClusterEfficiency,
  CustomerAllocation,
  DoseCATEStep,
  ExposureCATEDecile,
  Lifecycle,
  LifecycleUplift,
  Mechanic,
  PrimeStatus,
  ScoreConfidence,
} from "@/data/types";

export interface MockProduct {
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  base_price_cop: number;
  cogs_cop: number;
  mechanic: Mechanic;
  offer_label: string;
  campaign_type: CampaignType;
  audience_type: AudienceType;
  channel: string;
  regular_disc: number;
  prime_disc: number;
  expected_redemption: number;
  realized_burn_cop: number;
  cate_regular: number;
  cate_regular_ci: number;
  cate_prime: number;
  cate_prime_ci: number;
  needs_discount_flag: boolean;
  incremental_lift_units: number;
  net_incremental_margin_cop: number;
  pull_forward_rate: number;
  cannib_margin_loss_cop: number;
  true_promo_roi_pct: number;
  discount_efficiency_ratio: number;
  lifecycle: Lifecycle;
  prime_status: PrimeStatus;
  cannibalization_risk: CustomerAllocation["cannibalization_risk"];
  cross_elasticity_pct: number;
  score_confidence: ScoreConfidence;
  model_version: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    sku: "SKU-004412",
    name: "Nivea Soft Moisturizing Cream 200ml",
    category: "Personal Care",
    subcategory: "Skincare",
    base_price_cop: 28500,
    cogs_cop: 18200,
    mechanic: "coupon",
    offer_label: "20% Off · Coupon",
    campaign_type: "awareness",
    audience_type: "personalized_segment",
    channel: "digital_crm",
    regular_disc: 0.2,
    prime_disc: 0.2,
    expected_redemption: 0.24,
    realized_burn_cop: 1368,
    cate_regular: 0.058,
    cate_regular_ci: 0.012,
    cate_prime: 0.071,
    cate_prime_ci: 0.014,
    needs_discount_flag: true,
    incremental_lift_units: 5.8,
    net_incremental_margin_cop: 14250,
    pull_forward_rate: 0.124,
    cannib_margin_loss_cop: 820,
    true_promo_roi_pct: 1.45,
    discount_efficiency_ratio: 4.82,
    lifecycle: "fresh",
    prime_status: "prime",
    cannibalization_risk: "clean",
    cross_elasticity_pct: 0.124,
    score_confidence: "high",
    model_version: "run_dml_cat_beauty_v2.4",
  },
  {
    sku: "SKU-007823",
    name: "Dove Beauty Cream Bar 4x90g",
    category: "Personal Care",
    subcategory: "Bath & Body",
    base_price_cop: 9800,
    cogs_cop: 6100,
    mechanic: "multibuy",
    offer_label: "15% Off · Multibuy 2x1",
    campaign_type: "shot",
    audience_type: "mass",
    channel: "in_store_pos",
    regular_disc: 0.15,
    prime_disc: 0.15,
    expected_redemption: 0.35,
    realized_burn_cop: 514,
    cate_regular: 0.032,
    cate_regular_ci: 0.01,
    cate_prime: 0.032,
    cate_prime_ci: 0.01,
    needs_discount_flag: true,
    incremental_lift_units: 3.2,
    net_incremental_margin_cop: 4800,
    pull_forward_rate: 0.35,
    cannib_margin_loss_cop: 210,
    true_promo_roi_pct: 0.49,
    discount_efficiency_ratio: 1.34,
    lifecycle: "active_repeat",
    prime_status: "non_prime",
    cannibalization_risk: "pantry_load",
    cross_elasticity_pct: 0.087,
    score_confidence: "medium",
    model_version: "run_dml_cat_beauty_v2.4",
  },
  {
    sku: "SKU-006620",
    name: "La Roche-Posay Anthelios SPF50 50ml",
    category: "Dermocosmética",
    subcategory: "Sun Protection",
    base_price_cop: 118000,
    cogs_cop: 82000,
    mechanic: "pct_discount",
    offer_label: "20% Off · Pct Discount",
    campaign_type: "launch",
    audience_type: "personalized_segment",
    channel: "digital_crm",
    regular_disc: 0.2,
    prime_disc: 0.2,
    expected_redemption: 0.29,
    realized_burn_cop: 6844,
    cate_regular: 0.024,
    cate_regular_ci: 0.009,
    cate_prime: 0.031,
    cate_prime_ci: 0.011,
    needs_discount_flag: true,
    incremental_lift_units: 2.4,
    net_incremental_margin_cop: 28500,
    pull_forward_rate: 0.08,
    cannib_margin_loss_cop: 1900,
    true_promo_roi_pct: 1.03,
    discount_efficiency_ratio: 1.98,
    lifecycle: "active_repeat",
    prime_status: "prime",
    cannibalization_risk: "clean",
    cross_elasticity_pct: 0.055,
    score_confidence: "high",
    model_version: "run_dml_cat_beauty_v2.4",
  },
  {
    sku: "SKU-009901",
    name: "Advil Max Fast Relief 20s",
    category: "Salud y medicamentos",
    subcategory: "OTC · Analgesics",
    base_price_cop: 24500,
    cogs_cop: 15800,
    mechanic: "coupon",
    offer_label: "15% Off · Coupon",
    campaign_type: "recurring",
    audience_type: "reactivation",
    channel: "app_push",
    regular_disc: 0.15,
    prime_disc: 0.15,
    expected_redemption: 0.3,
    realized_burn_cop: 1102,
    cate_regular: 0.041,
    cate_regular_ci: 0.013,
    cate_prime: 0.041,
    cate_prime_ci: 0.013,
    needs_discount_flag: true,
    incremental_lift_units: 4.1,
    net_incremental_margin_cop: 9200,
    pull_forward_rate: 0.05,
    cannib_margin_loss_cop: 0,
    true_promo_roi_pct: 0.98,
    discount_efficiency_ratio: 2.51,
    lifecycle: "lapsed",
    prime_status: "non_prime",
    cannibalization_risk: "clean",
    cross_elasticity_pct: 0.041,
    score_confidence: "high",
    model_version: "run_dml_cat_beauty_v2.4",
  },
  {
    sku: "SKU-001034",
    name: "Teragrip Flu & Cold 24s",
    category: "Salud y medicamentos",
    subcategory: "Antigripales",
    base_price_cop: 28000,
    cogs_cop: 16500,
    mechanic: "pct_discount",
    offer_label: "20% Off · Pct Discount",
    campaign_type: "shot",
    audience_type: "mass",
    channel: "in_store_pos",
    regular_disc: 0.2,
    prime_disc: 0.2,
    expected_redemption: 0.25,
    realized_burn_cop: 1400,
    cate_regular: 0.006,
    cate_regular_ci: 0.011,
    cate_prime: 0.009,
    cate_prime_ci: 0.012,
    needs_discount_flag: false,
    incremental_lift_units: 1.7,
    net_incremental_margin_cop: 11200,
    pull_forward_rate: 0.18,
    cannib_margin_loss_cop: 3100,
    true_promo_roi_pct: 0.72,
    discount_efficiency_ratio: 1.18,
    lifecycle: "active_repeat",
    prime_status: "prime",
    cannibalization_risk: "margin_floor",
    cross_elasticity_pct: 0.098,
    score_confidence: "medium",
    model_version: "run_dml_cat_beauty_v2.4",
  },
];

/* ---------- Customer Allocation Matrix (35 rows) ---------- */

const LIFECYCLE_PLAN: Lifecycle[] = [
  ...Array<Lifecycle>(9).fill("fresh"),
  ...Array<Lifecycle>(17).fill("active_repeat"),
  ...Array<Lifecycle>(9).fill("lapsed"),
];

// Rows forced to needs_discount_flag: false (Sure Thing / Sleeping Dog exclusions)
const EXCLUDED_INDEXES = new Set([4, 12, 19, 27]);

export const CUSTOMER_ALLOCATIONS: CustomerAllocation[] = Array.from({ length: 35 }, (_, i) => {
  const p = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length]!;
  const excluded = EXCLUDED_INDEXES.has(i) || (!p.needs_discount_flag && i % 5 === 4);
  const prime: PrimeStatus = i % 2 === 0 ? "prime" : "non_prime";
  const drift = 1 + ((i % 7) - 3) * 0.06;
  const lifecycle: Lifecycle = LIFECYCLE_PLAN[i] ?? "active_repeat";

  const primeDisc = Math.min(0.48, p.prime_disc + (prime === "prime" ? 0.05 : 0));
  const nimRegular = Math.round(p.net_incremental_margin_cop * drift);
  const nimPrime = Math.round(nimRegular * 1.18);
  const burn = Math.round(p.realized_burn_cop * drift);

  return {
    customer_id: `C-00${2795 + i}`,
    lifecycle,
    prime_status: prime,
    cluster_id: (i % 7) + 1,
    affinity_score: Number((0.42 + ((i * 13) % 50) / 100).toFixed(2)),
    product_code: p.sku,
    product_name: p.name,
    category_breadcrumb: `${p.category} › ${p.subcategory}`,
    mechanic: p.mechanic,
    offer_label: p.offer_label,
    campaign_type: p.campaign_type,
    audience_type: p.audience_type,
    channel: p.channel,
    base_price_cop: p.base_price_cop,
    cogs_cop: p.cogs_cop,
    regular_discount_pct: p.regular_disc,
    prime_discount_pct: primeDisc,
    cate_regular: excluded ? Number((0.004 + (i % 3) * 0.002).toFixed(3)) : Number((p.cate_regular * drift).toFixed(3)),
    cate_regular_ci: p.cate_regular_ci,
    cate_prime: excluded ? Number((0.006 + (i % 3) * 0.002).toFixed(3)) : Number((p.cate_prime * drift).toFixed(3)),
    cate_prime_ci: p.cate_prime_ci,
    needs_discount_flag: !excluded,
    incremental_lift_units: excluded
      ? Number((0.4 + (i % 3) * 0.2).toFixed(1))
      : Number((p.incremental_lift_units * drift).toFixed(1)),
    realized_discount_burn_cop: burn,
    expected_redemption_rate: p.expected_redemption,
    nim_regular_cop: excluded ? Math.round(nimRegular * 0.18) : nimRegular,
    nim_prime_cop: excluded ? Math.round(nimPrime * 0.18) : nimPrime,
    net_margin_pct: Number(
      (((p.base_price_cop * (1 - p.regular_disc) - p.cogs_cop) / (p.base_price_cop * (1 - p.regular_disc))) * 100).toFixed(1),
    ),
    pull_forward_rate: p.pull_forward_rate,
    cannib_margin_loss_cop: p.cannib_margin_loss_cop,
    true_promo_roi_pct: excluded ? Number((p.true_promo_roi_pct * 0.2).toFixed(2)) : p.true_promo_roi_pct,
    discount_efficiency_ratio: excluded ? 0.42 : p.discount_efficiency_ratio,
    cannibalization_risk: excluded ? "margin_floor" : p.cannibalization_risk,
    score_confidence: p.score_confidence,
    model_version: p.model_version,
  } satisfies CustomerAllocation;
});

/* ---------- Campaign level ---------- */

export const CAMPAIGN_KPIS = {
  incremental_revenue_cop: 140_260_000,
  incremental_units: 3520,
  true_promo_roi_pct: 1.45,
  roi_multiplier: 2.45,
  targeted_audience: 128_400,
  delivered_reach: 104_500,
  expected_redemptions: 29_820,
  redemption_rate: 0.285,
  discount_efficiency_ratio: 4.97,
};

export const WATERFALL_BRIDGE = {
  gross_promo_sales: 384_500_000,
  less_organic: -198_200_000,
  less_realized_discounts: -42_800_000,
  less_cannibalization: -21_400_000,
  less_fixed_costs: -17_100_000,
  net_incremental_margin: 104_980_000,
};

export const PORTFOLIO_KPIS = {
  gross_promo_sales: 384_500_000,
  gross_delta: 0.184,
  net_incremental_margin: 104_980_000,
  nim_delta: 0.142,
  der: 4.97,
  true_promo_roi_pct: 2.45,
  ppm: 1.57,
};

export const CAMPAIGN_COST = {
  fixed_creative: 12_500_000,
  paid_digital: 48_200_000,
  delivery_gateway: 6_300_000,
  total: 67_000_000,
};

export const DELIVERY_FUNNEL = {
  target_cohort: 128_400,
  delivered: 104_500,
  opened: 47_280,
  redeemed: 29_820,
  digital_only: false,
};

export const EXPOSURE_CATE_DECILES: ExposureCATEDecile[] = [
  { decile: 1, label: "Persuadables", exposure_tau: 0.281, ci: 0.038, needs_discount_flag: true, note: "Highest causal responsiveness" },
  { decile: 2, label: "Decile 2", exposure_tau: 0.214, ci: 0.024, needs_discount_flag: true, note: "Strong incremental response" },
  { decile: 3, label: "Decile 3", exposure_tau: 0.162, ci: 0.019, needs_discount_flag: true, note: "Moderate treatment lift" },
  { decile: 4, label: "Decile 4", exposure_tau: 0.088, ci: 0.015, needs_discount_flag: true, note: "Low elasticity, moderate baseline" },
  { decile: 5, label: "Sure Things", exposure_tau: 0.012, ci: 0.01, needs_discount_flag: false, note: "Would buy anyway — excluded from targeting" },
  { decile: 6, label: "Decile 6", exposure_tau: -0.005, ci: 0.011, needs_discount_flag: false, note: "Negligible effect" },
  { decile: 7, label: "Decile 7", exposure_tau: -0.018, ci: 0.012, needs_discount_flag: false, note: "Negative: intrusive notification" },
  { decile: 8, label: "Sleeping Dogs", exposure_tau: -0.027, ci: 0.014, needs_discount_flag: false, note: "Unsubscribe risk elevated — do not contact" },
];

export const DOSE_CATE_BY_DEPTH: DoseCATEStep[] = [
  { depth_from: 0.05, depth_to: 0.1, delta_tau: 0.042, label: "5→10%", note: "Large marginal gain" },
  { depth_from: 0.1, depth_to: 0.15, delta_tau: 0.031, label: "10→15%", note: "Strong gain" },
  { depth_from: 0.15, depth_to: 0.2, delta_tau: 0.018, label: "15→20%", note: "Diminishing returns begin (near d_plateau)" },
  { depth_from: 0.2, depth_to: 0.25, delta_tau: 0.006, label: "20→25%", note: "Near saturation" },
  { depth_from: 0.25, depth_to: 0.3, delta_tau: 0.002, label: "25→30%", note: "Below noise floor" },
];

export const LIFECYCLE_UPLIFT: LifecycleUplift[] = [
  { lifecycle: "fresh", label: "🌱 Fresh (<30d)", exposure_cate: 0.198, dose_cate_15: 0.048 },
  { lifecycle: "active_repeat", label: "✓ Active Repeat", exposure_cate: 0.121, dose_cate_15: 0.022 },
  { lifecycle: "lapsed", label: "↩ Lapsed", exposure_cate: 0.163, dose_cate_15: 0.038 },
  { lifecycle: "sure_thing", label: "— Sure Things", exposure_cate: 0.008, dose_cate_15: 0.003 },
];

export const CATEGORY_ELASTICITY: CategoryElasticity[] = [
  { category: "Beauty & Dermo", d_threshold: 0.165, d_plateau: 0.382, organic_base: 0.042, point_elasticity_15: 1.82, feasible_max: 0.4 },
  { category: "Personal Care", d_threshold: 0.142, d_plateau: 0.3, organic_base: 0.031, point_elasticity_15: 1.35, feasible_max: 0.4 },
  { category: "OTC Analgesics", d_threshold: 0.128, d_plateau: 0.28, organic_base: 0.051, point_elasticity_15: 1.21, feasible_max: 0.35 },
  { category: "Dermocosmética", d_threshold: 0.19, d_plateau: 0.35, organic_base: 0.028, point_elasticity_15: 2.04, feasible_max: 0.2 },
];

export const CLUSTER_EFFICIENCY: ClusterEfficiency[] = [
  { id: 1, name: "Champions", population: 32400, mroi: 1.4, der_index: 1.12, realized_nim_cop: 24_200_000, status: "watch", note: "High baseline habituation" },
  { id: 2, name: "Category Explorers", population: 24100, mroi: 2.8, der_index: 1.84, realized_nim_cop: 41_500_000, status: "optimal", note: "Highest incremental revenue per discount peso" },
  { id: 3, name: "Promising", population: 18600, mroi: 2.4, der_index: 1.68, realized_nim_cop: 19_800_000, status: "optimal", note: "Strong margin builder with personal care coupons" },
  { id: 4, name: "Price Sensitive / At Risk", population: 21000, mroi: 2.1, der_index: 1.45, realized_nim_cop: 18_200_000, status: "optimal", note: "High elasticity, needs disciplined depth" },
  { id: 5, name: "Reactivation", population: 14200, mroi: 1.8, der_index: 1.3, realized_nim_cop: 12_400_000, status: "watch", note: "Valuable win-back with high cold-start LTV" },
  { id: 6, name: "Replenishment", population: 11800, mroi: 1.5, der_index: 1.15, realized_nim_cop: 8_600_000, status: "watch", note: "Best served with lower discount depth" },
  { id: 7, name: "Low Engagement", population: 6300, mroi: 0.9, der_index: 0.78, realized_nim_cop: -1_200_000, status: "suppress", note: "Negative incremental margin — suppress" },
];

export const LIVE_TELEMETRY = [
  { name: "Vitamins Awareness Burst", campaign_id: "AWARE-2025-VIT", duration: "15 Jun – 22 Jun", channel: "Digital CRM", category: "Salud y medicamentos", regular: 0.15, prime: 0.2, status: "Live" },
  { name: "Dermo Sun Launch", campaign_id: "LAUNCH-2025-DRM", duration: "10 Jun – 30 Jun", channel: "App Push", category: "Dermocosmética", regular: 0.12, prime: 0.18, status: "Live" },
  { name: "Bath & Body Shot", campaign_id: "SHOT-2025-BB", duration: "18 Jun – 21 Jun", channel: "In-Store POS", category: "Personal Care", regular: 0.15, prime: 0.15, status: "Closing" },
  { name: "RX Replenishment Cycle", campaign_id: "RECUR-2025-RX", duration: "Always On", channel: "App Push", category: "Salud y medicamentos", regular: 0.1, prime: 0.14, status: "Live" },
];

/* ---------- Price & Quality Review ---------- */

export const PRICE_AUDIT_KPIS = {
  skus_audited: 142,
  statutory_violations: 0,
  statutory_cap: 0.4,
  margin_floor_alerts: 18,
  margin_floor: 0.12,
  pantry_buyers: 410,
  pending_overrides: 2,
};

export const OVERRIDE_QUEUE = [
  { campaign_id: "LAUNCH-2025-DRM", sku: "SKU-006620", name: "La Roche-Posay Anthelios SPF50", type: "PRIME", proposed_depth: 0.28, source: "Supplier cap breach — Dermocosmética brand ceiling 20%", margin_delta: -420_000, status: "BLOCKED" as const, flag: "VETO" },
  { campaign_id: "SHOT-2025-BB", sku: "SKU-007823", name: "Dove Beauty Cream Bar 4x90g", type: "REGULAR", proposed_depth: 0.22, source: "Documented competitive response (Cruz Verde 20% week)", margin_delta: 180_000, status: "APPROVED" as const, flag: "JUSTIFIED" },
  { campaign_id: "AWARE-2025-VIT", sku: "SKU-001034", name: "Teragrip Flu & Cold 24s", type: "REGULAR", proposed_depth: 0.26, source: "Inventory clearance — expiry within 60 days", margin_delta: -95_000, status: "PENDING" as const, flag: "REVIEW" },
  { campaign_id: "RECUR-2025-RX", sku: "SKU-009901", name: "Advil Max Fast Relief 20s", type: "PRIME", proposed_depth: 0.18, source: "Commercial judgment — reactivation cohort", margin_delta: 62_000, status: "PENDING" as const, flag: "REVIEW" },
];

export const MARGIN_FLOOR_LEDGER = [
  { sku: "SKU-001034", name: "Teragrip Flu & Cold 24s", base_price: 28000, cogs: 16500, proposed_discount: 0.26, projected_margin: 0.104, status: "VIOLATION" as const },
  { sku: "SKU-007823", name: "Dove Beauty Cream Bar 4x90g", base_price: 9800, cogs: 6100, proposed_discount: 0.22, projected_margin: 0.202, status: "OK" as const },
  { sku: "SKU-006620", name: "La Roche-Posay Anthelios SPF50", base_price: 118000, cogs: 82000, proposed_discount: 0.2, projected_margin: 0.132, status: "WARNING" as const },
  { sku: "SKU-009901", name: "Advil Max Fast Relief 20s", base_price: 24500, cogs: 15800, proposed_discount: 0.15, projected_margin: 0.241, status: "OK" as const },
  { sku: "SKU-004412", name: "Nivea Soft Moisturizing Cream 200ml", base_price: 28500, cogs: 18200, proposed_discount: 0.2, projected_margin: 0.202, status: "OK" as const },
];

export const CATEGORY_CAPS = [
  { category: "Dermocosmética", cap: 0.2, note: "Brand-imposed ceiling — most restricted category" },
  { category: "Salud y medicamentos (RX)", cap: 0, note: "Banned — INVIMA Art. 79, no digital RX advertising" },
  { category: "Salud y medicamentos (OTC)", cap: 0.35, note: "Statutory cap with supplier co-funding terms" },
  { category: "Personal Care", cap: 0.4, note: "General statutory ceiling" },
];

/* ---------- Post-Campaign Audit ---------- */

export const POST_CAMPAIGN_RECONCILIATION = {
  observed_difference: 184_200,
  less_baseline_correction: -38_400,
  less_temporal_cannibalization: -24_100,
  less_cross_sku_cannibalization: -16_720,
  true_realized_nim: 104_980,
  redemption_rate: 0.252,
  calibration_error_pct: 0.0146,
  predicted_lift_pct: 0.082,
  observed_lift_pct: 0.0832,
};

export const MECHANIC_AUDIT_BREAKDOWN = [
  { mechanic: "coupon" as Mechanic, label: "Coupon", redemptions: 18200, avg_disc: 0.184, realized_burn: 22_800_000, incremental_nim: 48_200_000, calibration_error: 0.012 },
  { mechanic: "multibuy" as Mechanic, label: "Multibuy 2x1", redemptions: 7400, avg_disc: 0.15, realized_burn: 11_200_000, incremental_nim: 31_600_000, calibration_error: 0.028 },
  { mechanic: "pct_discount" as Mechanic, label: "Pct Discount", redemptions: 4220, avg_disc: 0.2, realized_burn: 8_800_000, incremental_nim: 25_200_000, calibration_error: -0.008 },
];

export const PRIME_NONPRIME_AUDIT = {
  prime: { redemptions: 16480, avg_discount: 0.2, realized_nim_cop: 67_400_000, roi_pct: 1.84 },
  non_prime: { redemptions: 13340, avg_discount: 0.15, realized_nim_cop: 37_580_000, roi_pct: 1.12 },
};

export const DECILE_CALIBRATION = [
  { decile: "D1", predicted: 0.281, observed: 0.274 },
  { decile: "D2", predicted: 0.214, observed: 0.221 },
  { decile: "D3", predicted: 0.162, observed: 0.151 },
  { decile: "D4", predicted: 0.088, observed: 0.094 },
  { decile: "D5", predicted: 0.012, observed: 0.009 },
  { decile: "D6", predicted: -0.005, observed: -0.002 },
  { decile: "D7", predicted: -0.018, observed: -0.021 },
  { decile: "D8", predicted: -0.027, observed: -0.024 },
];

export const HABITUATION_TIMELINE = [
  { day: "T-7", velocity: 100, phase: "baseline" },
  { day: "T-3", velocity: 102, phase: "baseline" },
  { day: "T+0", velocity: 168, phase: "promo" },
  { day: "T+3", velocity: 184, phase: "promo" },
  { day: "T+7", velocity: 121, phase: "promo" },
  { day: "T+14", velocity: 84, phase: "dip" },
  { day: "T+21", velocity: 79, phase: "dip" },
  { day: "T+28", velocity: 88, phase: "dip" },
  { day: "T+45", velocity: 95, phase: "recovery" },
  { day: "T+60", velocity: 99, phase: "recovery" },
  { day: "T+90", velocity: 103, phase: "recovery" },
];

/* ---------- Knowledge Graph ---------- */

export const GRAPH_STATS = [
  { label: "Entities", value: "48,210", note: "Customers, products, campaigns, constraints" },
  { label: "Relationships", value: "162,840", note: "Typed edges across the promo ontology" },
  { label: "Causal Results", value: "1,204", note: "hasCATEResult edges from gold_cate_scores" },
  { label: "Active Constraints", value: "318", note: "silver_constraint_table_unified" },
  { label: "Ontology Version", value: "v3.1", note: "OntoBricks published" },
];

export const COPILOT_SUGGESTIONS = [
  "Why did customer C-002795 receive a 20% coupon on Nivea Soft?",
  "Which constraint blocked the Dermocosmética Prime depth?",
  "Which SKUs substitute for Advil Max in the same sub-category?",
  "Show clusters where discount depth exceeds d_plateau.",
];
