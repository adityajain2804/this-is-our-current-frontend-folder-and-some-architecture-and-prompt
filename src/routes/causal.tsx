import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader, Panel, PanelBody, PanelHeader } from "@/components/common/Panel";
import { Pill } from "@/components/common/pills";
import { Callout } from "@/components/common/states";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_ELASTICITY,
  DOSE_CATE_BY_DEPTH,
  EXPOSURE_CATE_DECILES,
  LIFECYCLE_UPLIFT,
} from "@/data/mock";
import { CAMPAIGN_TYPES, CHANNELS, LIFECYCLE_OPTIONS, MECHANICS, PRIME_OPTIONS } from "@/data/taxonomy";
import type { CampaignType, Mechanic } from "@/data/types";
import { fmtPct, fmtTau } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useFilteredAllocations } from "@/hooks/useStudioData";
import { useGlobalFilters } from "@/store/globalFilters";

export const Route = createFileRoute("/causal")({
  head: () => ({
    meta: [
      { title: "Causal Lab — FarmaTODO Promotion Intelligence" },
      {
        name: "description",
        content:
          "Exposure CATE, dose CATE and parametric discount response curves from the Double ML and causal forest models.",
      },
      { property: "og:title", content: "Causal Lab — FarmaTODO" },
      {
        property: "og:description",
        content:
          "Where the team validates heterogeneous treatment effects and makes the needs_discount_flag rule auditable.",
      },
    ],
  }),
  component: CausalLabPage,
});

function CausalLabPage() {
  const filters = useGlobalFilters();
  const { rows } = useFilteredAllocations();
  const [depth, setDepth] = useState(15);
  const [category, setCategory] = useState(CATEGORY_ELASTICITY[0]!.category);

  const params = CATEGORY_ELASTICITY.find((c) => c.category === category)!;
  const maxTau = Math.max(...EXPOSURE_CATE_DECILES.map((d) => Math.abs(d.exposure_tau)));
  const maxDose = Math.max(...DOSE_CATE_BY_DEPTH.map((d) => d.delta_tau));

  const curve = useMemo(() => {
    const pts = [];
    for (let d = 0; d <= 40; d += 2) {
      const x = d / 100;
      const conv =
        params.organic_base +
        (0.28 / (1 + Math.exp(-(x - params.d_threshold) / 0.045))) *
          (x > params.d_plateau ? 0.96 : 1);
      const margin = Math.max(0, 0.34 - x * 0.85);
      pts.push({ depth: d, conversion: Number(conv.toFixed(4)), margin: Number(margin.toFixed(4)) });
    }
    return pts;
  }, [params]);

  const elasticityAtSlider = Number(
    (
      params.point_elasticity_15 *
      (1 + (15 - depth) * 0.012) *
      (depth < params.d_threshold * 100 ? 0.72 : 1)
    ).toFixed(2),
  );
  const feasibleBelowThreshold = params.feasible_max <= params.d_threshold;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Causal Lab"
        subtitle="Heterogeneous treatment effects and discount response curves. Exposure effect and dose effect are modelled and shown separately, because they lead to different commercial decisions."
        meta={
          <>
            <span className="font-mono text-xs text-ink-3">
              Model: Double ML + Causal Forest (EconML)
            </span>
            <span className="font-mono text-xs text-ink-3">
              MLflow run: run_dml_cat_beauty_v2.4
            </span>
            <span className="font-mono text-xs text-ink-3">{rows.length} rows in filter scope</span>
          </>
        }
        badges={
          <>
            <Pill tone="success">Qini 0.382 (&gt;0.35 passed)</Pill>
            <Pill tone="brand">Overlap 98.4%</Pill>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <Panel>
            <PanelHeader
              title="Panel A — Exposure CATE by decile"
              description="Uplift caused by receiving the communication at all, isolating Persuadables from Sleeping Dogs regardless of discount depth."
            />
            <PanelBody className="space-y-2.5">
              {EXPOSURE_CATE_DECILES.map((d) => {
                const positive = d.exposure_tau >= 0;
                return (
                  <div key={d.decile} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-xs font-medium text-ink">
                      D{d.decile} · {d.label}
                    </span>
                    <span className="w-28 shrink-0 font-mono text-[11px] tabular-nums text-ink-2">
                      {fmtTau(d.exposure_tau)} (±{d.ci.toFixed(3)})
                    </span>
                    <div className="flex h-2.5 flex-1 items-center overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          positive ? (d.needs_discount_flag ? "bg-success" : "bg-success/40") : "bg-danger",
                        )}
                        style={{
                          width: `${Math.max((Math.abs(d.exposure_tau) / maxTau) * 100, 2)}%`,
                        }}
                      />
                    </div>
                    {!d.needs_discount_flag ? (
                      <Pill tone="neutral" className="shrink-0">
                        Excluded
                      </Pill>
                    ) : null}
                  </div>
                );
              })}
              <Callout tone="warning">
                Deciles 5–8 carry{" "}
                <span className="font-mono text-xs">needs_discount_flag = false</span>. The
                optimizer excludes them: a zero or negative causal effect means the discount is pure
                giveaway, and for Sleeping Dogs the contact itself raises unsubscribe risk.
              </Callout>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title="Panel B — Dose CATE by discount depth"
              description="Marginal causal effect of each extra 5% of depth, holding exposure constant."
            />
            <PanelBody className="space-y-2.5">
              {DOSE_CATE_BY_DEPTH.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 font-mono text-xs text-ink">{d.label}</span>
                  <span className="w-20 shrink-0 font-mono text-[11px] tabular-nums text-ink-2">
                    Δτ {fmtTau(d.delta_tau)}
                  </span>
                  <div className="flex h-2.5 flex-1 items-center overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${Math.max((d.delta_tau / maxDose) * 100, 2)}%` }}
                    />
                  </div>
                  <span className="w-52 shrink-0 text-xs text-ink-2">{d.note}</span>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title="Panel C — Customer lifecycle uplift"
              description="Fresh customers respond hardest to both exposure and depth — the strongest argument for spending the budget on acquisition-adjacent cohorts."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead className="bg-surface-2">
                  <tr>
                    {["Lifecycle", "Exposure CATE", "Dose CATE @15%", ""].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-2"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LIFECYCLE_UPLIFT.map((l, i) => (
                    <tr
                      key={l.lifecycle}
                      className={cn("border-t border-hairline", i % 2 === 1 && "bg-surface-1")}
                    >
                      <td className="px-3 py-2.5 font-medium text-ink">{l.label}</td>
                      <td className="px-3 py-2.5 font-semibold tabular-nums text-ink">
                        {fmtTau(l.exposure_cate)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-ink-2">
                        {fmtTau(l.dose_cate_15)}
                      </td>
                      <td className="px-3 py-2.5">
                        {l.lifecycle === "fresh" ? (
                          <Pill tone="success">Highest response</Pill>
                        ) : l.lifecycle === "sure_thing" ? (
                          <Pill tone="neutral">Do not target</Pill>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PanelBody className="pt-0">
              <Callout tone="success">
                Fresh customers (&lt;30 days) show the highest exposure CATE at{" "}
                {fmtTau(LIFECYCLE_UPLIFT[0]!.exposure_cate)} — every peso of depth buys more
                incremental behaviour here than on habituated repeat buyers.
              </Callout>
            </PanelBody>
          </Panel>
        </div>

        <Panel className="h-fit">
          <PanelHeader
            title="Parametric discount response curve"
            description="Isotonic conversion spline f(d) against net margin decay, fitted per category group and behavioural cluster."
          />
          <PanelBody className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <LabeledSelect label="Category scope" value={category} onChange={setCategory}>
                {CATEGORY_ELASTICITY.map((c) => (
                  <SelectItem key={c.category} value={c.category}>
                    {c.category}
                  </SelectItem>
                ))}
              </LabeledSelect>
              <LabeledSelect
                label="Loyalty tier"
                value={filters.prime_scope}
                onChange={(v) => filters.setPrimeScope(v as typeof filters.prime_scope)}
              >
                {PRIME_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </LabeledSelect>
              <LabeledSelect
                label="Delivery channel"
                value={filters.channel}
                onChange={filters.setChannel}
              >
                {CHANNELS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </LabeledSelect>
              <LabeledSelect
                label="Customer lifecycle"
                value={filters.lifecycle}
                onChange={(v) => filters.setLifecycle(v as typeof filters.lifecycle)}
              >
                {LIFECYCLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </LabeledSelect>
              <LabeledSelect
                label="Mechanic"
                value={filters.mechanic[0] ?? "all"}
                onChange={(v) => filters.setMechanic(v === "all" ? [] : [v as Mechanic])}
              >
                <SelectItem value="all">All mechanics</SelectItem>
                {MECHANICS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </LabeledSelect>
              <LabeledSelect
                label="Campaign type"
                value={filters.campaign_type[0] ?? "all"}
                onChange={(v) => filters.setCampaignType(v === "all" ? [] : [v as CampaignType])}
              >
                <SelectItem value="all">All campaign types</SelectItem>
                {CAMPAIGN_TYPES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </LabeledSelect>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-1 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
                  Discount depth
                </p>
                <span className="text-sm font-semibold tabular-nums text-ink">{depth}%</span>
              </div>
              <Slider
                className="mt-3"
                value={[depth]}
                min={0}
                max={40}
                step={1}
                onValueChange={(v) => setDepth(v[0] ?? 15)}
              />
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <Readout label="d_threshold" value={fmtPct(params.d_threshold)} />
                <Readout label="d_plateau" value={fmtPct(params.d_plateau)} />
                <Readout label="Organic base" value={fmtPct(params.organic_base)} />
                <Readout label="Point elasticity" value={elasticityAtSlider.toFixed(2)} />
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curve} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke="var(--hairline)" vertical={false} />
                  <XAxis
                    dataKey="depth"
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--hairline)" }}
                  />
                  <YAxis
                    tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                    tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RTooltip
                    formatter={(v: number, n) => [
                      fmtPct(v),
                      n === "conversion" ? "Conversion probability" : "Net margin contribution",
                    ]}
                    labelFormatter={(l) => `Depth ${l}%`}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid var(--hairline)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="margin"
                    stroke="var(--brand)"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={false}
                  />
                  <ReferenceLine
                    x={Math.round(params.d_threshold * 100)}
                    stroke="var(--warning)"
                    strokeDasharray="3 3"
                    label={{ value: "d_threshold", fontSize: 10, fill: "var(--ink-2)" }}
                  />
                  <ReferenceLine
                    x={Math.round(params.d_plateau * 100)}
                    stroke="var(--ink-3)"
                    strokeDasharray="3 3"
                    label={{ value: "d_plateau", fontSize: 10, fill: "var(--ink-2)" }}
                  />
                  <ReferenceLine
                    x={40}
                    stroke="var(--danger)"
                    label={{ value: "Statutory max", fontSize: 10, fill: "var(--danger)" }}
                  />
                  <ReferenceLine x={depth} stroke="var(--brand)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {feasibleBelowThreshold ? (
              <Callout tone="warning">
                Feasible range for {params.category} tops out at {fmtPct(params.feasible_max)}, below
                its d_threshold of {fmtPct(params.d_threshold)} — a percentage discount is
                ineffective here. Use a bundle or a Prime differential instead.
              </Callout>
            ) : null}

            <div className="overflow-x-auto rounded-lg border border-hairline">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead className="bg-surface-2">
                  <tr>
                    {[
                      "Category",
                      "d_threshold",
                      "d_plateau",
                      "Organic base",
                      "Point elasticity @15%",
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
                  {CATEGORY_ELASTICITY.map((c, i) => (
                    <tr
                      key={c.category}
                      onClick={() => setCategory(c.category)}
                      className={cn(
                        "cursor-pointer border-t border-hairline hover:bg-brand-soft/50",
                        i % 2 === 1 && "bg-surface-1",
                        c.category === category && "bg-brand-soft",
                      )}
                    >
                      <td className="px-3 py-2.5 font-medium text-ink">{c.category}</td>
                      <td className="px-3 py-2.5 tabular-nums text-ink-2">
                        {fmtPct(c.d_threshold)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-ink-2">{fmtPct(c.d_plateau)}</td>
                      <td className="px-3 py-2.5 tabular-nums text-ink-2">
                        {fmtPct(c.organic_base)}
                      </td>
                      <td className="px-3 py-2.5 font-semibold tabular-nums text-ink">
                        {c.point_elasticity_15.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}

function LabeledSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-3">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </label>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase text-ink-3">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
