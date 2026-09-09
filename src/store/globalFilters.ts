import { create } from "zustand";

import type { AudienceType, CampaignType, Mechanic } from "@/data/types";

export type PrimeScope = "all" | "prime" | "non_prime";
export type LifecycleScope = "all" | "fresh" | "active_repeat" | "lapsed";
export type Country = "CO" | "VE";

export interface GlobalFilterState {
  campaign_id: string;
  country: Country;
  sku_query: string;
  sku_filter: string[];
  campaign_type: CampaignType[];
  mechanic: Mechanic[];
  audience_type: AudienceType[];
  channel: string;
  prime_scope: PrimeScope;
  cluster_ids: number[];
  lifecycle: LifecycleScope;
  regular_discount: number;
  prime_discount: number;
  budget_cap_cop: number;
  date_range: [string, string];

  setCampaign: (id: string) => void;
  setCountry: (c: Country) => void;
  setSkuQuery: (q: string) => void;
  setSkuFilter: (skus: string[]) => void;
  toggleSku: (sku: string) => void;
  setCampaignType: (types: CampaignType[]) => void;
  toggleCampaignType: (t: CampaignType) => void;
  setMechanic: (m: Mechanic[]) => void;
  toggleMechanic: (m: Mechanic) => void;
  setAudienceType: (a: AudienceType[]) => void;
  toggleAudienceType: (a: AudienceType) => void;
  setChannel: (c: string) => void;
  setPrimeScope: (s: PrimeScope) => void;
  setClusterIds: (ids: number[]) => void;
  toggleCluster: (id: number) => void;
  setLifecycle: (l: LifecycleScope) => void;
  setRegularDiscount: (v: number) => void;
  setPrimeDiscount: (v: number) => void;
  setBudgetCap: (v: number) => void;
  resetAll: () => void;
}

const INITIAL = {
  campaign_id: "AWARE-2025-VIT",
  country: "CO" as Country,
  sku_query: "",
  sku_filter: [] as string[],
  campaign_type: [] as CampaignType[],
  mechanic: [] as Mechanic[],
  audience_type: [] as AudienceType[],
  channel: "all",
  prime_scope: "all" as PrimeScope,
  cluster_ids: [1, 2, 3, 4, 5, 6, 7],
  lifecycle: "all" as LifecycleScope,
  regular_discount: 0.15,
  prime_discount: 0.2,
  budget_cap_cop: 250_000_000,
  date_range: ["2026-06-15", "2026-06-22"] as [string, string],
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export const useGlobalFilters = create<GlobalFilterState>((set) => ({
  ...INITIAL,
  setCampaign: (campaign_id) => set({ campaign_id }),
  setCountry: (country) => set({ country }),
  setSkuQuery: (sku_query) => set({ sku_query }),
  setSkuFilter: (sku_filter) => set({ sku_filter }),
  toggleSku: (sku) => set((s) => ({ sku_filter: toggle(s.sku_filter, sku) })),
  setCampaignType: (campaign_type) => set({ campaign_type }),
  toggleCampaignType: (t) => set((s) => ({ campaign_type: toggle(s.campaign_type, t) })),
  setMechanic: (mechanic) => set({ mechanic }),
  toggleMechanic: (m) => set((s) => ({ mechanic: toggle(s.mechanic, m) })),
  setAudienceType: (audience_type) => set({ audience_type }),
  toggleAudienceType: (a) => set((s) => ({ audience_type: toggle(s.audience_type, a) })),
  setChannel: (channel) => set({ channel }),
  setPrimeScope: (prime_scope) => set({ prime_scope }),
  setClusterIds: (cluster_ids) => set({ cluster_ids }),
  toggleCluster: (id) => set((s) => ({ cluster_ids: toggle(s.cluster_ids, id).sort() })),
  setLifecycle: (lifecycle) => set({ lifecycle }),
  setRegularDiscount: (regular_discount) => set({ regular_discount }),
  setPrimeDiscount: (prime_discount) => set({ prime_discount }),
  setBudgetCap: (budget_cap_cop) => set({ budget_cap_cop }),
  resetAll: () => set({ ...INITIAL }),
}));
