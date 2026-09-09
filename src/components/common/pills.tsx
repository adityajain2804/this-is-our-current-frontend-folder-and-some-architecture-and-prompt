import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { REDEEMED_ONLY_NOTE } from "@/lib/formatters";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "causal" | "fresh";

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2 border-hairline",
  brand: "bg-brand-soft text-brand border-brand/25",
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/25",
  causal: "bg-causal-soft text-causal border-causal/25",
  fresh: "bg-causal-soft text-causal border-causal/25",
};

export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LifecyclePill({ lifecycle }: { lifecycle: string }) {
  if (lifecycle === "fresh") return <Pill tone="fresh">🌱 Fresh Customer</Pill>;
  if (lifecycle === "lapsed") return <Pill tone="warning">↩ Lapsed</Pill>;
  return <Pill tone="success">✓ Active Repeat</Pill>;
}

export function PrimePill({ prime }: { prime: string }) {
  return prime === "prime" ? <Pill tone="brand">★ Prime</Pill> : <Pill tone="neutral">Non-Prime</Pill>;
}

export function RiskPill({ risk }: { risk: string }) {
  if (risk === "clean") return <Pill tone="success">✓ Clean</Pill>;
  if (risk === "pantry_load") return <Pill tone="warning">▲ Pantry Load</Pill>;
  return <Pill tone="danger">✕ Margin Floor</Pill>;
}

export function RedeemedOnly({ className }: { className?: string }) {
  return (
    <span className={cn("block text-[11px] font-medium text-ink-3", className)}>
      {REDEEMED_ONLY_NOTE}
    </span>
  );
}
