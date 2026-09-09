import { RedeemedOnly } from "@/components/common/pills";
import { DOSE_CATE_BY_DEPTH } from "@/data/mock";
import type { CustomerAllocation } from "@/data/types";
import { fmtCOP, fmtMultiplier, fmtPct } from "@/lib/formatters";

export function RowDrawer({ row }: { row: CustomerAllocation }) {
  const discounted = row.base_price_cop * (1 - row.regular_discount_pct);
  const nim = row.prime_status === "prime" ? row.nim_prime_cop : row.nim_regular_cop;
  const maxTau = Math.max(...DOSE_CATE_BY_DEPTH.map((d) => d.delta_tau));

  return (
    <div className="border-t border-hairline px-5 py-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-ink">
          {row.product_name} ({row.product_code}) · Customer {row.customer_id}
        </p>
        <p className="text-xs text-ink-2">
          Talon.One Coupon Engine &amp; CATE Causal Optimization · model {row.model_version}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-hairline bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
            5-Step Dose Response Lift
          </p>
          <div className="mt-3 space-y-2">
            {DOSE_CATE_BY_DEPTH.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="w-16 font-mono text-[11px] text-ink-2">{d.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(d.delta_tau / maxTau) * 100}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-[11px] tabular-nums text-ink">
                  +{d.delta_tau.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-hairline bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
            Unit Cost Economics Waterfall
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-2">Gross Price</dt>
              <dd className="font-semibold tabular-nums text-ink">{fmtCOP(row.base_price_cop)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Discount Burn</dt>
              <dd className="font-semibold tabular-nums text-danger">
                −{fmtCOP(row.realized_discount_burn_cop)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Unit COGS</dt>
              <dd className="font-semibold tabular-nums text-ink-2">−{fmtCOP(row.cogs_cop)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Net Price After Discount</dt>
              <dd className="font-semibold tabular-nums text-ink">{fmtCOP(discounted)}</dd>
            </div>
            <div className="flex justify-between border-t border-hairline pt-2">
              <dt className="font-semibold text-ink">Net Incremental Margin</dt>
              <dd className="font-semibold tabular-nums text-success">+{fmtCOP(nim)}</dd>
            </div>
          </dl>
          <RedeemedOnly className="mt-2" />
        </div>

        <div className="rounded-lg border border-hairline bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
            Cannibalization Audit (with Promo KPIs)
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-2">NIM</dt>
              <dd className="font-semibold tabular-nums text-success">+{fmtCOP(nim)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">DER</dt>
              <dd className="font-semibold tabular-nums text-ink">
                {fmtMultiplier(row.discount_efficiency_ratio)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">True Promo ROI</dt>
              <dd className="font-semibold tabular-nums text-ink">
                {fmtPct(row.true_promo_roi_pct, 0)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Pull-Forward Rate</dt>
              <dd className="font-semibold tabular-nums text-warning">
                {fmtPct(row.pull_forward_rate)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Cross-SKU Margin Loss</dt>
              <dd className="font-semibold tabular-nums text-danger">
                {fmtCOP(row.cannib_margin_loss_cop)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-hairline pt-2">
              <dt className="text-ink-2">Post-Promo Dip</dt>
              <dd className="font-medium text-ink">Est. Day T+7 to T+21</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
