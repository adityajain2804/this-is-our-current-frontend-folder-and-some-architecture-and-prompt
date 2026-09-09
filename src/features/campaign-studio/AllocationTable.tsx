import { useState } from "react";
import { ChevronDown, ChevronRight, Download, Search } from "lucide-react";
import { toast } from "sonner";

import { LifecyclePill, Pill, PrimePill, RedeemedOnly, RiskPill } from "@/components/common/pills";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomerAllocation } from "@/data/types";
import { useFilteredAllocations } from "@/hooks/useStudioData";
import { fmtCOP, fmtPct, fmtUnits } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useGlobalFilters } from "@/store/globalFilters";
import { OverrideDialog } from "./OverrideDialog";
import { RowDrawer } from "./RowDrawer";

const HEADERS = [
  "Customer & Lifecycle",
  "Loyalty Tier",
  "Promoted SKU",
  "Rec. Offer & Mechanic",
  "Incremental Lift",
  "Realized Discount Burn",
  "Net Incr. Margin (NIM)",
  "Cannibalization Risk",
  "Actions",
];

export function AllocationTable() {
  const { rows, isPending, isError, refetch } = useFilteredAllocations();
  const { sku_query, setSkuQuery, resetAll, prime_scope } = useGlobalFilters();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [overrideRow, setOverrideRow] = useState<CustomerAllocation | null>(null);

  return (
    <section className="rounded-xl border border-hairline bg-card">
      <header className="flex flex-wrap items-center gap-2 border-b border-hairline px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Customer Allocation Matrix</h2>
          <p className="text-xs text-ink-2">
            gold_promo_recommendations · {rows.length} allocations in view
          </p>
        </div>
        <div className="flex-1" />
        <div className="relative w-56">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-3" />
          <Input
            value={sku_query}
            onChange={(e) => setSkuQuery(e.target.value)}
            placeholder="Search SKU / Customer ID..."
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Pill tone="brand">
          {prime_scope === "all" ? "All Tiers" : prime_scope === "prime" ? "★ Prime only" : "Non-Prime only"}
        </Pill>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => toast.info("Export queued", { description: `${rows.length} rows` })}
        >
          <Download className="size-3.5" /> Export CSV
        </Button>
      </header>

      {isError ? (
        <ErrorState what="the allocation matrix" onRetry={() => void refetch()} />
      ) : isPending ? (
        <TableSkeleton rows={8} />
      ) : rows.length === 0 ? (
        <EmptyState onReset={resetAll} />
      ) : (
        <div className="max-h-[720px] overflow-auto">
          <table className="w-full min-w-[1180px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-surface-2">
              <tr>
                <th className="w-8" />
                {HEADERS.map((h) => (
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
              {rows.map((row, i) => {
                const isOpen = expanded === row.customer_id;
                const nim = row.prime_status === "prime" ? row.nim_prime_cop : row.nim_regular_cop;
                return (
                  <>
                    <tr
                      key={row.customer_id}
                      onClick={() => setExpanded(isOpen ? null : row.customer_id)}
                      className={cn(
                        "cursor-pointer border-t border-hairline transition-colors hover:bg-brand-soft/50",
                        i % 2 === 1 && "bg-surface-1",
                        !row.needs_discount_flag && "opacity-70",
                      )}
                    >
                      <td className="px-2 text-ink-3">
                        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-mono text-xs font-semibold text-ink">{row.customer_id}</div>
                        <div className="mt-1">
                          <LifecyclePill lifecycle={row.lifecycle} />
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <PrimePill prime={row.prime_status} />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-ink">{row.product_name}</div>
                        <div className="font-mono text-[11px] text-ink-3">
                          {row.product_code} · {row.category_breadcrumb}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Pill tone="brand">{row.offer_label}</Pill>
                      </td>
                      <td className="px-3 py-2.5 font-semibold tabular-nums text-success">
                        {fmtUnits(row.incremental_lift_units)}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold tabular-nums text-ink">
                          {fmtCOP(row.realized_discount_burn_cop)}
                        </div>
                        <div className="text-[11px] text-ink-2">
                          {fmtPct(row.expected_redemption_rate, 0)} Exp. Red.
                        </div>
                        <RedeemedOnly />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold tabular-nums text-success">+{fmtCOP(nim)}</div>
                        <div className="text-[11px] text-ink-2">{row.net_margin_pct}% Net</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <RiskPill risk={row.cannibalization_risk} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-64">
                            Pull-forward {fmtPct(row.pull_forward_rate)} · Cross-SKU margin loss{" "}
                            {fmtCOP(row.cannib_margin_loss_cop)}
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        {row.needs_discount_flag ? (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2 text-[11px]"
                              onClick={() =>
                                toast.success(`Approved ${row.customer_id}`, {
                                  description: `${row.offer_label} · ${row.product_code}`,
                                })
                              }
                            >
                              Approve ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={() => setOverrideRow(row)}
                            >
                              Override
                            </Button>
                          </div>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Pill tone="neutral">Sure Thing — Excluded</Pill>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-64">
                              needs_discount_flag = false. CATE ≤ 0, so this customer would buy
                              anyway — excluded by Knapsack constraint #4. Approval is disabled.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr key={`${row.customer_id}-drawer`} className="border-t border-hairline bg-surface-1">
                        <td colSpan={HEADERS.length + 1} className="p-0">
                          <RowDrawer row={row} />
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <OverrideDialog row={overrideRow} onClose={() => setOverrideRow(null)} />
    </section>
  );
}
