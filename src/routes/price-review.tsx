import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader, Panel, PanelBody, PanelHeader } from "@/components/common/Panel";
import { Pill } from "@/components/common/pills";
import { Callout } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { CATEGORY_CAPS, MARGIN_FLOOR_LEDGER, OVERRIDE_QUEUE, PRICE_AUDIT_KPIS } from "@/data/mock";
import { fmtCOP, fmtInt, fmtPct } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/price-review")({
  head: () => ({
    meta: [
      { title: "Price & Quality Review — FarmaTODO Promotion Intelligence" },
      {
        name: "description",
        content:
          "Pre-flight compliance gate: statutory ceilings, supplier floors, margin-floor alerts and the pending override queue.",
      },
      { property: "og:title", content: "Price & Quality Review — FarmaTODO" },
      {
        property: "og:description",
        content:
          "Constraint governance over silver_constraint_table_unified before any campaign goes live.",
      },
    ],
  }),
  component: PriceReviewPage,
});

const statusTone = {
  BLOCKED: "danger",
  PENDING: "warning",
  APPROVED: "success",
} as const;

const auditTone = {
  VIOLATION: "danger",
  WARNING: "warning",
  OK: "success",
} as const;

function PriceReviewPage() {
  const k = PRICE_AUDIT_KPIS;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Price & Quality Review"
        subtitle="Compliance gate that codifies rules which used to live in people's heads. Tier 1 is the country regulatory cap; Tier 2 is brand, supplier and internal margin governance."
        badges={
          <>
            <Pill tone="brand">Phase 0 · Constraint Codification</Pill>
            <Pill tone="neutral">silver_constraint_table_unified</Pill>
          </>
        }
      />

      <Panel>
        <PanelBody className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              Market: Colombia · Regulatory framework: INVIMA &amp; SIC
            </p>
            <p className="mt-1 text-sm text-ink-2">
              Active statutory ceiling {fmtPct(k.statutory_cap, 1)} max · RX advertising in digital
              channels: 0 (banned and enforced)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="success">
              <ShieldCheck className="size-3" /> Tier 1 regulatory passed
            </Pill>
            <Pill tone="warning">
              <ShieldAlert className="size-3" /> Tier 2 supplier floors active
            </Pill>
          </div>
        </PanelBody>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Statutory Price Checks"
          value={`${fmtInt(k.skus_audited)} SKUs`}
          sub={`${k.statutory_violations} violations · cap ${fmtPct(k.statutory_cap, 0)}`}
          accent="success"
          formula="Every candidate SKU depth is compared against the country statutory ceiling in silver_constraint_table_unified before approval."
        />
        <KpiCard
          label="Margin Floor Alerts"
          value={`${k.margin_floor_alerts} SKUs`}
          sub={`Below the ${fmtPct(k.margin_floor, 0)} governance floor`}
          accent="warning"
          formula="Projected net margin = (price × (1 − depth) − COGS) ÷ (price × (1 − depth)). Anything under the internal floor needs written justification."
        />
        <KpiCard
          label="Cannibalization Audit"
          value={`${fmtInt(k.pantry_buyers)} buyers`}
          sub="High pull-forward risk flagged"
          accent="danger"
          formula="Customers whose purchase cycle indicates pantry loading — the promo shifts a purchase they would have made anyway inside the pull-forward window W."
        />
        <KpiCard
          label="Pending Overrides"
          value={`${k.pending_overrides} in queue`}
          sub="Awaiting sign-off"
          accent="brand"
          formula="Planner overrides written to gold_planner_override_log that still need a pricing-director decision."
        />
      </div>

      <Panel>
        <PanelHeader
          title="Pending override & compliance queue"
          description="Each row is a proposed depth that breached a constraint or carries a documented justification. Vetoes come from the brand's own ceiling, not from an internal preference."
          badge={<Pill tone="warning">{k.pending_overrides} awaiting sign-off</Pill>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-sm">
            <thead className="bg-surface-2">
              <tr>
                {[
                  "Campaign",
                  "Product SKU",
                  "Type",
                  "Proposed depth",
                  "Source / justification",
                  "Margin impact",
                  "Status",
                  "Actions",
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
              {OVERRIDE_QUEUE.map((r, i) => (
                <tr
                  key={`${r.campaign_id}-${r.sku}`}
                  className={cn("border-t border-hairline", i % 2 === 1 && "bg-surface-1")}
                >
                  <td className="px-3 py-2.5 font-mono text-xs text-ink-2">{r.campaign_id}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-ink">{r.name}</div>
                    <div className="font-mono text-[11px] text-ink-3">{r.sku}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <Pill tone={r.type === "PRIME" ? "brand" : "neutral"}>{r.type}</Pill>
                  </td>
                  <td className="px-3 py-2.5 font-semibold tabular-nums text-ink">
                    {fmtPct(r.proposed_depth, 0)}
                  </td>
                  <td className="max-w-sm px-3 py-2.5 text-ink-2">{r.source}</td>
                  <td
                    className={cn(
                      "px-3 py-2.5 font-semibold tabular-nums",
                      r.margin_delta >= 0 ? "text-success" : "text-danger",
                    )}
                  >
                    {r.margin_delta >= 0 ? "+" : "−"}
                    {fmtCOP(Math.abs(r.margin_delta))}
                  </td>
                  <td className="px-3 py-2.5">
                    <Pill tone={statusTone[r.status]}>{r.status}</Pill>
                    <div className="mt-1 font-mono text-[10px] text-ink-3">Flag: {r.flag}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    {r.status === "PENDING" ? (
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() =>
                            toast.success("Override approved", { description: r.sku })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toast.error("Override vetoed", { description: r.sku })}
                        >
                          Veto
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-3">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader
            title="Margin floor alerts ledger"
            description="Projected net margin per SKU at the proposed depth, against the 12% governance floor."
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-surface-2">
                <tr>
                  {[
                    "SKU & name",
                    "Base price",
                    "Unit COGS",
                    "Proposed discount",
                    "Projected net margin",
                    "Floor",
                    "Audit status",
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
                {MARGIN_FLOOR_LEDGER.map((r, i) => (
                  <tr
                    key={r.sku}
                    className={cn("border-t border-hairline", i % 2 === 1 && "bg-surface-1")}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-ink">{r.name}</div>
                      <div className="font-mono text-[11px] text-ink-3">{r.sku}</div>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-ink-2">{fmtCOP(r.base_price)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink-2">{fmtCOP(r.cogs)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink">
                      {fmtPct(r.proposed_discount, 0)}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2.5 font-semibold tabular-nums",
                        r.projected_margin < 0.12 ? "text-danger" : "text-success",
                      )}
                    >
                      {fmtPct(r.projected_margin)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-ink-3">12.0%</td>
                    <td className="px-3 py-2.5">
                      <Pill tone={auditTone[r.status]}>{r.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Category discount ceilings"
            description="Tier 2 caps as codified per category."
          />
          <PanelBody className="space-y-3">
            {CATEGORY_CAPS.map((c) => (
              <div key={c.category} className="rounded-lg border border-hairline bg-surface-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{c.category}</p>
                  <Pill tone={c.cap === 0 ? "danger" : c.cap <= 0.2 ? "warning" : "success"}>
                    {fmtPct(c.cap, 0)} cap
                  </Pill>
                </div>
                <p className="mt-1 text-xs text-ink-2">{c.note}</p>
              </div>
            ))}
            <Callout tone="warning">
              Dermocosmética is the most restricted category — its ceiling is set by the brands
              themselves, so a Prime differential above 20% is a hard veto, not a negotiation.
            </Callout>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}
