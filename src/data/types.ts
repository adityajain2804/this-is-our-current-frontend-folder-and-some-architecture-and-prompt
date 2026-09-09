/**
 * Field names mirror the Databricks gold/silver tables from the Phase 0/1
 * Schema Proposal so a mock -> live API swap is a data-source change only.
 */

export type Mechanic =
  | "pct_discount"
  | "special_price"
  | "multibuy"
  | "bundle"
  | "coupon"
  | "prime_differential";

export type CampaignType =
  | "big_moment"
  | "shot"
  | "launch"
  | "leaflet"
  | "always_on"
  | "awareness"
  | "recurring"
  | "personalization";

export type AudienceType = "mass" | "personalized_segment" | "reactivation" | "rx_replenishment";

export type Lifecycle = "fresh" | "active_repeat" | "lapsed";
export type PrimeStatus = "prime" | "non_prime";
export type CannibalizationRisk = "clean" | "pantry_load" | "margin_floor";
export type ScoreConfidence = "high" | "medium" | "low";

export interface TaxonomyItem<T extends string> {
  value: T;
  label: string;
  note: string;
}

/** Mirrors gold_promo_recommendations + gold_incrementality_results */
export interface CustomerAllocation {
  customer_id: string;
  lifecycle: Lifecycle;
  prime_status: PrimeStatus;
  cluster_id: number;
  affinity_score: number;
  product_code: string;
  product_name: string;
  category_breadcrumb: string;
  mechanic: Mechanic;
  offer_label: string;
  campaign_type: CampaignType;
  audience_type: AudienceType;
  channel: string;
  base_price_cop: number;
  cogs_cop: number;
  regular_discount_pct: number;
  prime_discount_pct: number;
  cate_regular: number;
  cate_regular_ci: number;
  cate_prime: number;
  cate_prime_ci: number;
  needs_discount_flag: boolean;
  incremental_lift_units: number;
  realized_discount_burn_cop: number;
  expected_redemption_rate: number;
  nim_regular_cop: number;
  nim_prime_cop: number;
  net_margin_pct: number;
  pull_forward_rate: number;
  cannib_margin_loss_cop: number;
  true_promo_roi_pct: number;
  discount_efficiency_ratio: number;
  cannibalization_risk: CannibalizationRisk;
  score_confidence: ScoreConfidence;
  model_version: string;
}

/** Mirrors gold_pre_campaign_estimate */
export interface WaterfallBridge {
  gross_promo_sales: number;
  less_organic: number;
  less_realized_discounts: number;
  less_cannibalization: number;
  less_fixed_costs: number;
  net_incremental_margin: number;
}

export interface CampaignCost {
  fixed_creative: number;
  paid_digital: number;
  delivery_gateway: number;
  total: number;
}

export interface DeliveryFunnel {
  target_cohort: number;
  delivered: number;
  opened: number;
  redeemed: number;
  digital_only: boolean;
}

/** Mirrors gold_cate_scores — exposure and dose kept separate */
export interface ExposureCATEDecile {
  decile: number;
  label: string;
  exposure_tau: number;
  ci: number;
  needs_discount_flag: boolean;
  note: string;
}

export interface DoseCATEStep {
  depth_from: number;
  depth_to: number;
  delta_tau: number;
  label: string;
  note: string;
}

export interface LifecycleUplift {
  lifecycle: Lifecycle | "sure_thing";
  label: string;
  exposure_cate: number;
  dose_cate_15: number;
}

/** Mirrors response_curve_params */
export interface CategoryElasticity {
  category: string;
  d_threshold: number;
  d_plateau: number;
  organic_base: number;
  point_elasticity_15: number;
  feasible_max: number;
}

/** Mirrors mock_behavioral_clusters_global */
export interface ClusterEfficiency {
  id: number;
  name: string;
  population: number;
  mroi: number;
  der_index: number;
  realized_nim_cop: number;
  status: "optimal" | "ok" | "watch" | "suppress";
  note: string;
}
