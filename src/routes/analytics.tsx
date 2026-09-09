import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader, Panel, PanelBody, PanelHeader } from "@/components/common/Panel";
import { Pill, RedeemedOnly } from "@/components/common/pills";
import { Callout } from "@/components/common/states";
import {
  CAMPAIGN_COST,
  CLUSTER_EFFICIENCY,
  DELIVERY_FUNNEL,
  LIVE_TELEMETRY,
  PORTFOLIO_KPIS,
  WATERFALL_BRIDGE,
} from "@/data/mock";
import { fmtInt, fmtMillionCOP, fmtMultiplier, fmtPct } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Portfolio Analytics — FarmaTODO Promotion Intelligence" },
      {
        name: "description",
        content:
          "The CFO view: net incremental margin waterfall, holistic campaign cost, delivery funnel and cluster efficiency.",
      },
      { property: "og:title", content: "Portfolio Analytics — FarmaTODO" },
      {
        property: "og:description",
        content:
          "Did the promotion make more money, not just sell more units — the full NIM bridge end to end.",
      },
    ],
  }),
  component: PortfolioAnalyticsPage,
});

const STEPS = [
  {
    key: "gross",
    name: "Gross Sales",
    value: WATERFALL_BRIDGE.gross_promo_sales,
    tone: "brand",
    note: "All promoted revenue in the window, before any correction.",
  },
  {
    key: "organic",
    name: "Less Organic",
    value: WATERFALL_BRIDGE.less_organic,
    tone: "ink",
    note: "Q_baseline × D — margin eroded on volume that would have sold anyway.",
  },
  {
    key: "discount",
    name: "Less Discounts",
    value: WATERFALL_BRIDGE.less_realized_discounts,
    tone: "danger",
    note: "Realized burn over redeemed transactions only — never the exposed pool.",
  },
  {
    key: "cannib",
    name: "Less Cannibalization",
    value: WATERFALL_BRIDGE.less_cannibalization,
    tone: "danger",
    note: "Pull-forward inside window W plus cross-product substitution.",
  },
  {
    key: "fixed",
    name: "Less Fixed Costs",
    value: WATERFALL_BRIDGE.less_fixed_costs,
    tone: "warning",
    note: "Campaign_Fixed_Cost: creative, paid media and delivery gateway.",
  },
  {
    key: "nim",
    name: "Net Incr. Margin",
    value: WATERFALL_BRIDGE.net_incremental_margin,
    tone: "success",
    note: "The answer: profit the promotion actually created.",
  },
] as const;

const fillFor: Record<string, string> = {
  brand: "var(--brand)",
  ink: "var(--ink-3)",
  danger: "var(--danger)",
  warning: "var(--warning)",
  success: "var(--success)",
};

function buildWaterfall() {
  let running = 0;
  return STEPS.map((s) => {
    if (s.key === "gross") {
      running = s.value;
      return { name: s.name, base: 0, delta: s.value, tone: s.tone, label: s.value };
    }
    if (s.key === "nim") {
      return { name: s.name, base: 0, delta: s.value, tone: s.tone, label: s.value };
    }
    const next = running + s.value;
    const row = { name: s.name, base: next, delta: -s.value, tone: s.tone, label: s.value };
    running = next;
    return row;
  });
}

function PortfolioAnalyticsPage() {
  const k = PORTFOLIO_KPIS;
  const chartData = buildWaterfall();
  const f = DELIVERY_FUNNEL;

  const funnel = [
    { label: "Target cohort", value: f.target_cohort, pct: 1, note: "100% base" },
    {
      label: "Delivered",
      value: f.delivered,
      pct: f.delivered / f.target_cohort,
      note: "Reach after delivery failures",
    },
    {
      label: "Opened & viewed",
      value: f.opened,
      pct: f.opened / f.target_cohort,
      note: "Open rate on delivered sends",
    },
    {
      label: "Redeemed transactions",
      value: f.redeemed,
      pct: f.redeemed / f.target_cohort,
      note: "Talon.One redemption records",
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Portfolio Analytics"
        subtitle="Commercial performance from gross sales down to audited net incremental margin, with the full holistic cost of running the campaign included."
        badges={
          <>
            <Pill tone="brand">Phase 1 + 2</Pill>
            <Pill tone="neutral">gold_pre_campaign_estimate</Pill>
            <Pill tone="neutral">gold_incrementality_results</Pill>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Gross Promo Sales"
          value={fmtMillionCOP(k.gross_promo_sales)}
          delta={`+${fmtPct(k.gross_delta)}`}
          deltaTone="positive"
          sub="vs baseline period"
          accent="brand"
          formula="Total revenue on promoted SKUs in the campaign window. Top of the bridge — not a profit figure."
        />
        <KpiCard
          label="Net Incremental Margin"
          value={fmtMillionCOP(k.net_incremental_margin)}
          delta={`+${fmtPct(k.nim_delta)}`}
          deltaTone="positive"
          sub="True contribution"
          accent="success"
          formula="NIM = Incremental units × unit margin − realized discount burn − cannibalization − Campaign_Fixed_Cost."
        />
        <KpiCard
          label="DER"
          value={fmtMultiplier(k.der)}
          sub="Target >1.5x"
          accent="success"
          formula="Discount Efficiency Ratio = incremental revenue ÷ realized discount burn."
        />
        <KpiCard
          label="True Promo ROI"
          value={`${fmtPct(k.true_promo_roi_pct, 0)} · ${fmtMultiplier(k.ppm)} PPM`}
          sub="NIM ÷ total campaign cost"
          accent="success"
          formula="True Promo ROI divides NIM by every cost the campaign incurred, including creative and paid media — not by discount alone."
        />
      </div>

      <Panel>
        <PanelHeader
          title="Net incremental margin waterfall"
          description="Each step is a term in the NIM formula. Read left to right: gross sales become real profit only after organic erosion, realized burn, cannibalization and fixed cost are removed."
          badge={<Pill tone="success">{fmtMillionCOP(k.net_incremental_margin)} net</Pill>}
        />
        <PanelBody>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--ink-2)" }}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: "var(--hairline)" }}
                />
                <YAxis
                  tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
                  tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <RTooltip
                  formatter={(_v, _n, item) =>
                    fmtMillionCOP(Number((item?.payload as { label: number })?.label ?? 0))
                  }
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid var(--hairline)",
                  }}
                />
                <Bar dataKey="base" stackId="w" fill="transparent" />
                <Bar dataKey="delta" stackId="w" radius={[4, 4, 0, 0]}>
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={fillFor[d.tone] ?? "var(--brand)"} />
                  ))}
                  <LabelList
                    dataKey="label"
                    position="top"
                    formatter={(v: number) => fmtMillionCOP(v)}
                    style={{ fontSize: 10, fill: "var(--ink-2)" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.key} className="rounded-lg border border-hairline bg-surface-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
                    {s.name}
                  </p>
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      s.value >= 0 ? "text-success" : "text-danger",
                    )}
                  >
                    {fmtMillionCOP(s.value)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-2">{s.note}</p>
                {s.key === "discount" ? <RedeemedOnly className="mt-2" /> : null}
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Cost intelligence"
            description="The Campaign_Fixed_Cost term broken into the systems that actually generate it."
          />
          <PanelBody className="space-y-3">
            {[
              {
                label: "Fixed creative & agency",
                value: CAMPAIGN_COST.fixed_creative,
                note: "Artwork, legal review, localization",
              },
              {
                label: "Paid digital media",
                value: CAMPAIGN_COST.paid_digital,
                note: "Meta / Google / TikTok",
              },
              {
                label: "Variable delivery gateway",
                value: CAMPAIGN_COST.delivery_gateway,
                note: "Braze SMS & push",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-1 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{c.label}</p>
                  <p className="text-xs text-ink-2">{c.note}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-ink">
                  {fmtMillionCOP(c.value)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-brand/30 bg-brand-soft p-3">
              <p className="text-sm font-semibold text-ink">Total holistic campaign cost</p>
              <span className="text-base font-semibold tabular-nums text-ink">
                {fmtMillionCOP(CAMPAIGN_COST.total)}
              </span>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader
            title="End-to-end delivery & conversion funnel"
            description="Target cohort through to redeemed transactions, with drop-off at every stage."
            badge={
              f.digital_only ? (
                <Pill tone="success">Digital channels only</Pill>
              ) : (
                <Pill tone="warning">Includes in-store — store-level reach only</Pill>
              )
            }
          />
          <PanelBody className="space-y-3">
            {funnel.map((s, i) => (
              <div key={s.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{s.label}</p>
                  <span className="text-sm font-semibold tabular-nums text-ink">
                    {fmtInt(s.value)}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full", i === 3 ? "bg-success" : "bg-brand")}
                    style={{ width: `${Math.max(s.pct * 100, 3)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-ink-2">
                  {fmtPct(s.pct)} of target · {s.note}
                </p>
              </div>
            ))}
            <Callout tone="warning">
              In-store signage and leaflet reach is measured at store level, so this funnel is only
              fully traceable for digital delivery.
            </Callout>
          </PanelBody>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Cluster efficiency matrix"
          description="Seven behavioural clusters ranked on marginal ROI and discount efficiency. Suppression is a recommendation with money behind it."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="bg-surface-2">
              <tr>
                {["Cluster", "Population", "mROI", "DER index", "Realized NIM", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-2"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {CLUSTER_EFFICIENCY.map((c, i) => (
                <tr
                  key={c.id}
                  className={cn("border-t border-hairline", i % 2 === 1 && "bg-surface-1")}
                >
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-ink">
                      {c.id}. {c.name}
                    </div>
                    <div className="text-xs text-ink-2">{c.note}</div>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-ink-2">{fmtInt(c.population)}</td>
                  <td className="px-3 py-2.5 font-semibold tabular-nums text-ink">
                    {fmtMultiplier(c.mroi)}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-ink">
                    {fmtMultiplier(c.der_index)}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-2.5 font-semibold tabular-nums",
                      c.realized_nim_cop >= 0 ? "text-success" : "text-danger",
                    )}
                  >
                    {fmtMillionCOP(c.realized_nim_cop)}
                  </td>
                  <td className="px-3 py-2.5">
                    <Pill
                      tone={
                        c.status === "optimal"
                          ? "success"
                          : c.status === "ok"
                            ? "brand"
                            : c.status === "watch"
                              ? "warning"
                              : "danger"
                      }
                    >
                      {c.status.toUpperCase()}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="Live in-market telemetry"
          description="Campaigns currently running, with both discount layers visible."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead className="bg-surface-2">
              <tr>
                {[
                  "Campaign",
                  "Window",
                  "Channel",
                  "Category",
                  "Regular depth",
                  "Prime depth",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIVE_TELEMETRY.map((t, i) => (
                <tr
                  key={t.campaign_id}
                  className={cn("border-t border-hairline", i % 2 === 1 && "bg-surface-1")}
                >
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-ink">{t.name}</div>
                    <div className="font-mono text-[11px] text-ink-3">{t.campaign_id}</div>
                  </td>
                  <td className="px-3 py-2.5 text-ink-2">{t.duration}</td>
                  <td className="px-3 py-2.5 text-ink-2">{t.channel}</td>
                  <td className="px-3 py-2.5 text-ink-2">{t.category}</td>
                  <td className="px-3 py-2.5 tabular-nums text-ink">{fmtPct(t.regular, 0)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-ink">{fmtPct(t.prime, 0)}</td>
                  <td className="px-3 py-2.5">
                    <Pill tone={t.status === "Live" ? "success" : "warning"}>{t.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
