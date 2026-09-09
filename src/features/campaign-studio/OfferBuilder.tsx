import { AlertTriangle, Download, ShieldCheck, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Pill } from "@/components/common/pills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AUDIENCE_TYPES,
  CAMPAIGN_TYPES,
  CHANNELS,
  LIFECYCLE_OPTIONS,
  MECHANICS,
  PRIME_OPTIONS,
} from "@/data/taxonomy";
import { CLUSTER_EFFICIENCY } from "@/data/mock";
import { fmtCOP, fmtPct } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useGlobalFilters } from "@/store/globalFilters";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-hairline px-4 py-4 last:border-b-0">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">{title}</p>
      {children}
    </div>
  );
}

function ChipGroup<T extends string>({
  items,
  selected,
  onToggle,
}: {
  items: { value: T; label: string; note?: string }[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const active = selected.includes(item.value);
        const chip = (
          <button
            key={item.value}
            type="button"
            onClick={() => onToggle(item.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              active
                ? "border-brand bg-brand text-brand-foreground"
                : "border-hairline bg-card text-ink-2 hover:border-brand/40 hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
        return item.note ? (
          <Tooltip key={item.value}>
            <TooltipTrigger asChild>{chip}</TooltipTrigger>
            <TooltipContent className="max-w-64">{item.note}</TooltipContent>
          </Tooltip>
        ) : (
          chip
        );
      })}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
            value === o.value ? "bg-card text-ink shadow-sm" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function OfferBuilder() {
  const f = useGlobalFilters();
  const violation = f.prime_discount < f.regular_discount;

  return (
    <div className="rounded-xl border border-hairline bg-card">
      <div className="border-b border-hairline px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Cohort &amp; Offer Builder</h2>
        <p className="mt-0.5 text-xs text-ink-2">
          Constrained Dual-Level Offer Optimizer inputs
        </p>
      </div>

      <Group title="Campaign Type">
        <ChipGroup items={CAMPAIGN_TYPES} selected={f.campaign_type} onToggle={f.toggleCampaignType} />
      </Group>

      <Group title="Mechanic">
        <ChipGroup items={MECHANICS} selected={f.mechanic} onToggle={f.toggleMechanic} />
      </Group>

      <Group title="Audience Type">
        <ChipGroup items={AUDIENCE_TYPES} selected={f.audience_type} onToggle={f.toggleAudienceType} />
      </Group>

      <Group title="Channel">
        <Select value={f.channel} onValueChange={f.setChannel}>
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHANNELS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
          In-store mechanics (except signage) carry no individual exposure record. Digital delivery
          is fully traceable.
        </p>
      </Group>

      <Group title="Behavioral Clusters">
        <div className="flex flex-wrap gap-1.5">
          {CLUSTER_EFFICIENCY.map((c) => {
            const active = f.cluster_ids.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => f.toggleCluster(c.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-hairline bg-card text-ink-2 hover:border-brand/40",
                )}
              >
                {c.id}. {c.name}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => f.setClusterIds([1, 2, 3, 4, 5, 6, 7])}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => f.setClusterIds([])}>
            Deselect All
          </Button>
        </div>
      </Group>

      <Group title="Customer Lifecycle">
        <Segmented options={LIFECYCLE_OPTIONS} value={f.lifecycle} onChange={f.setLifecycle} />
      </Group>

      <Group title="Prime Loyalty Tier">
        <Segmented options={PRIME_OPTIONS} value={f.prime_scope} onChange={f.setPrimeScope} />
      </Group>

      <Group title="Dual Discount Ladder">
        <Pill tone={violation ? "danger" : "success"} className="mb-3">
          <ShieldCheck className="size-3" /> Prime ≥ Regular — hard rule
        </Pill>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <Label className="text-ink-2">Regular Discount</Label>
              <span className="font-semibold tabular-nums text-ink">{fmtPct(f.regular_discount, 0)}</span>
            </div>
            <Slider
              value={[f.regular_discount * 100]}
              onValueChange={([v]) => f.setRegularDiscount((v ?? 0) / 100)}
              max={40}
              step={1}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <Label className="text-ink-2">Prime Discount</Label>
              <span className="font-semibold tabular-nums text-ink">{fmtPct(f.prime_discount, 0)}</span>
            </div>
            <Slider
              value={[f.prime_discount * 100]}
              onValueChange={([v]) => f.setPrimeDiscount((v ?? 0) / 100)}
              max={48}
              step={1}
            />
          </div>
        </div>
        {violation ? (
          <p className="mt-3 flex items-center gap-1.5 rounded-md bg-danger-soft px-2.5 py-2 text-[11px] font-semibold text-danger">
            <AlertTriangle className="size-3.5" /> Prime &lt; Regular — Fix Required
          </p>
        ) : null}
        <p className="mt-2 text-[11px] text-ink-3">
          Ladder bounds come from silver_constraint_table_unified.
        </p>
      </Group>

      <Group title="Targeting Rule">
        <p className="rounded-md border border-hairline bg-surface-1 px-3 py-2 text-[11px] leading-relaxed text-ink-2">
          Excludes customers with CATE ≤ 0 (needs_discount_flag = false). These customers would buy
          anyway — discounting them is pure margin giveaway.
        </p>
      </Group>

      <Group title="Campaign Budget Cap">
        <Input
          inputMode="numeric"
          value={f.budget_cap_cop}
          onChange={(e) => f.setBudgetCap(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className="h-8 text-xs tabular-nums"
        />
        <p className="mt-1 text-[11px] text-ink-3">{fmtCOP(f.budget_cap_cop)}</p>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            className="h-8 flex-1 text-xs"
            disabled={violation}
            onClick={() => toast.success("Allocation generated", { description: "Knapsack solved against the current constraint set." })}
          >
            <Wand2 className="size-3.5" /> Generate Allocation
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => toast.info("Export queued", { description: "CSV of the current allocation view." })}
          >
            <Download className="size-3.5" />
          </Button>
        </div>
      </Group>
    </div>
  );
}
