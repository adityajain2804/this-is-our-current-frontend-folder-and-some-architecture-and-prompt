import type { ReactNode } from "react";
import { Info } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  formula: string;
  accent?: "brand" | "success" | "warning" | "danger" | "causal";
  icon?: ReactNode;
  onClick?: () => void;
}

const accentBar: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  causal: "bg-causal",
};

export function KpiCard({
  label,
  value,
  sub,
  delta,
  deltaTone = "neutral",
  formula,
  accent = "brand",
  icon,
  onClick,
}: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-hairline bg-card p-5 transition-shadow",
        onClick ? "cursor-pointer hover:shadow-md" : "hover:shadow-md",
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-0.5", accentBar[accent])} />
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{label}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`${label} formula`}
              className="text-ink-3 transition-colors hover:text-ink"
            >
              {icon ?? <Info className="size-3.5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-72 leading-relaxed">{formula}</TooltipContent>
        </Tooltip>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {delta ? (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
              deltaTone === "positive" && "bg-success-soft text-success",
              deltaTone === "negative" && "bg-danger-soft text-danger",
              deltaTone === "neutral" && "bg-surface-2 text-ink-2",
            )}
          >
            {delta}
          </span>
        ) : null}
        {sub ? <span className="text-xs text-ink-2">{sub}</span> : null}
      </div>
    </div>
  );
}
