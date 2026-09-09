import { KpiCard } from "@/components/common/KpiCard";
import { KpiSkeleton } from "@/components/common/states";
import { CAMPAIGN_KPIS } from "@/data/mock";
import { fmtInt, fmtMillionCOP, fmtMultiplier, fmtPct } from "@/lib/formatters";

export function StudioKpiBar({ share, loading }: { share: number; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        <KpiSkeleton count={7} />
      </div>
    );
  }

  const k = CAMPAIGN_KPIS;
  const s = share;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
      <KpiCard
        label="Incremental Revenue"
        value={fmtMillionCOP(k.incremental_revenue_cop * s)}
        delta="+16.7%"
        deltaTone="positive"
        sub="vs organic baseline"
        accent="brand"
        formula="Incremental Revenue = (Q_promo − Q_baseline) × P_promo, estimated by the Double ML uplift model."
      />
      <KpiCard
        label="Incremental Units"
        value={fmtInt(k.incremental_units * s)}
        delta="+14.4%"
        deltaTone="positive"
        sub="vs counterfactual"
        accent="brand"
        formula="Units above the modelled counterfactual for the treated cohort (gold_incrementality_results)."
      />
      <KpiCard
        label="True Promo ROI"
        value={`${fmtPct(k.true_promo_roi_pct, 0)} · ${fmtMultiplier(k.roi_multiplier)}`}
        sub="NIM / Realized Burn"
        accent="success"
        formula="True Promo ROI = Net Incremental Margin ÷ (Q_promo × D), where the burn covers redeemed transactions only."
      />
      <KpiCard
        label="Targeted Audience"
        value={fmtInt(k.targeted_audience * s)}
        sub="Eligible pool"
        accent="brand"
        formula="Eligible pool from gold_audience_eligibility after constraint and needs_discount_flag screening."
      />
      <KpiCard
        label="Delivered Reach"
        value={fmtInt(k.delivered_reach * s)}
        delta="81.4%"
        deltaTone="neutral"
        sub="via Braze"
        accent="brand"
        formula="Messages successfully delivered ÷ target cohort. Digital channels only — in-store reach is store-level."
      />
      <KpiCard
        label="Expected Redemptions"
        value={`${fmtInt(k.expected_redemptions * s)} (${fmtPct(k.redemption_rate)})`}
        sub="Talon.One uptake"
        accent="success"
        formula="Predicted coupon redemptions from the Talon.One send/redeem history, calibrated per cluster."
      />
      <KpiCard
        label="DER"
        value={fmtMultiplier(k.discount_efficiency_ratio)}
        sub="Target >1.5x ✓"
        accent="success"
        formula="DER = IU × P_promo ÷ (Q_promo × D) — Discount Efficiency Ratio. Target >1.5x for OTC/Personal Care, >1.2x for reactivation (blueprint §2.5)."
      />
    </div>
  );
}
