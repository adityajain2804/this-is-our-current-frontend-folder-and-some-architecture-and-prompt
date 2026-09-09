import type { ReactNode } from "react";
import { AlertTriangle, Globe2, Inbox, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function KpiSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-hairline bg-card p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-7 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      ))}
    </>
  );
}

export function BlockSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-hairline bg-card p-5", className)}>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-48 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No allocations match these filters",
  description,
  onReset,
}: {
  title?: string;
  description?: string;
  onReset?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <Inbox className="size-8 text-ink-3" />
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description ? <p className="mt-1 text-sm text-ink-2">{description}</p> : null}
      </div>
      {onReset ? (
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      ) : null}
    </div>
  );
}

export function ErrorState({ what, onRetry }: { what: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <AlertTriangle className="size-7 text-danger" />
      <p className="text-sm font-semibold text-ink">Unable to load {what} — retry</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-3.5" /> Retry
        </Button>
      ) : null}
    </div>
  );
}

export function VenezuelaNotOnboarded() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-hairline bg-surface-1 px-6 py-20 text-center">
      <Globe2 className="size-12 text-ink-3" />
      <div>
        <h2 className="text-lg font-semibold text-ink">
          Venezuela (SUNDDE) — Data Not Yet Onboarded
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-2">
          Venezuela runs under a different regulator, currency and price-display rules than
          Colombia. Rather than reuse Colombian figures with a swapped currency symbol, this market
          stays empty until its constraint table and gold tables are onboarded.
        </p>
      </div>
      <p className="font-mono text-xs text-ink-3">
        Pending: silver_constraint_table_unified (VE) · gold_promo_recommendations (VE)
      </p>
    </div>
  );
}

export function Callout({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        tone === "info" && "border-brand/30 bg-brand-soft text-ink",
        tone === "warning" && "border-warning/40 bg-warning-soft text-ink",
        tone === "danger" && "border-danger/40 bg-danger-soft text-ink",
        tone === "success" && "border-success/30 bg-success-soft text-ink",
      )}
    >
      {children}
    </div>
  );
}
