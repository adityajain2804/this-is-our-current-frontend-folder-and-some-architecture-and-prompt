import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CalendarClock, CircleDot, Search, Sparkles } from "lucide-react";

import { VenezuelaNotOnboarded } from "@/components/common/states";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGlobalFilters, type Country } from "@/store/globalFilters";

export const STUDIO_TABS = [
  { to: "/", label: "Campaign Studio" },
  { to: "/price-review", label: "Price & Quality Review" },
  { to: "/analytics", label: "Portfolio Analytics" },
  { to: "/causal", label: "Causal Lab" },
  { to: "/campaign", label: "Post-Campaign Audit" },
  { to: "/graph", label: "Knowledge Graph" },
] as const;

function Tier1() {
  const { campaign_id, country, sku_query, setCountry, setSkuQuery } = useGlobalFilters();

  return (
    <div className="flex h-14 items-center gap-3 bg-shell px-4 text-shell-foreground">
      <div className="flex shrink-0 items-center gap-2">
        <span className="grid size-7 place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground">
          F
        </span>
        <span className="text-sm font-semibold tracking-tight">Promotion Intelligence Studio</span>
      </div>

      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold xl:inline-flex">
        <Sparkles className="size-3" /> Awareness ({campaign_id})
      </span>
      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-warning/20 px-2.5 py-1 text-[11px] font-semibold text-warning lg:inline-flex">
        <CalendarClock className="size-3" /> 15-Day Milestone Freeze
      </span>

      <div className="relative ml-1 w-44 shrink-0 lg:w-60">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/50" />
        <Input
          value={sku_query}
          onChange={(e) => setSkuQuery(e.target.value)}
          placeholder="Search by SKU or product name..."
          aria-label="Global SKU search"
          className="h-8 border-white/15 bg-white/10 pl-8 text-xs text-white placeholder:text-white/50 focus-visible:ring-brand"
        />
      </div>

      <div className="flex-1" />

      <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
        <SelectTrigger
          aria-label="Market"
          className="h-8 w-[172px] shrink-0 border-white/15 bg-white/10 text-xs text-white"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CO">🇨🇴 Colombia (COP · INVIMA)</SelectItem>
          <SelectItem value="VE">🇻🇪 Venezuela (SUNDDE)</SelectItem>
        </SelectContent>
      </Select>

      <div className="hidden shrink-0 items-center gap-2 2xl:flex">
        <span className="rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-brand-foreground">
          Enhanced Studio (v2)
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-1">
        <span className="grid size-7 place-items-center rounded-full bg-white/15 text-[11px] font-semibold">
          MR
        </span>
        <span className="hidden text-xs text-white/80 lg:inline">M. Rodríguez</span>
      </div>
    </div>
  );
}

function Tier2() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex h-10 items-stretch gap-1 overflow-x-auto border-b border-hairline bg-card px-3">
      {STUDIO_TABS.map((tab) => {
        const active = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "flex items-center whitespace-nowrap border-b-2 px-3 text-[13px] font-medium transition-colors",
              active
                ? "border-brand text-ink"
                : "border-transparent text-ink-2 hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function StatusBar() {
  const country = useGlobalFilters((s) => s.country);
  const items = [
    { label: "Data", value: "Healthy — Gold Tables Synced", dot: "text-success" },
    { label: "ML Engine", value: "Phase 2 — Double ML & Causal Forests" },
    { label: "Optimizer", value: "Dual-Discount Knapsack Ready" },
    { label: "View Mode", value: "Enhanced Cockpit (v2)" },
    { label: "Market", value: country === "CO" ? "Colombia" : "Venezuela" },
    { label: "Ontology", value: "OntoBricks Published" },
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-8 items-center gap-4 overflow-x-auto bg-shell-2 px-4 text-[11px] text-white/75">
      {items.map((i) => (
        <span key={i.label} className="flex shrink-0 items-center gap-1.5">
          <span className="text-white/45">{i.label}:</span>
          {i.dot ? <CircleDot className={cn("size-3", i.dot)} /> : null}
          <span className="font-medium text-white/90">{i.value}</span>
        </span>
      ))}
    </footer>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const country = useGlobalFilters((s) => s.country);

  return (
    <div className="min-h-screen bg-surface-1 pb-8">
      <header className="sticky top-0 z-40">
        <Tier1 />
        <Tier2 />
      </header>
      <main className="px-4 py-5">{country === "VE" ? <VenezuelaNotOnboarded /> : children}</main>
      <StatusBar />
    </div>
  );
}
