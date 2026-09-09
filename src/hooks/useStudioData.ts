import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { CUSTOMER_ALLOCATIONS } from "@/data/mock";
import type { CustomerAllocation } from "@/data/types";
import { useGlobalFilters } from "@/store/globalFilters";

/** Simulates the REST call that will later hit gold_promo_recommendations. */
async function fetchAllocations(): Promise<CustomerAllocation[]> {
  await new Promise((r) => setTimeout(r, 220));
  return CUSTOMER_ALLOCATIONS;
}

export function useAllocationsQuery() {
  return useQuery({
    queryKey: ["gold_promo_recommendations"],
    queryFn: fetchAllocations,
    staleTime: 5 * 60 * 1000,
  });
}

/** The single global-filter predicate, shared by every tab. */
export function useAllocationFilter() {
  const f = useGlobalFilters();

  return useMemo(() => {
    const q = f.sku_query.trim().toLowerCase();
    return (row: CustomerAllocation) => {
      if (q && !`${row.product_code} ${row.product_name} ${row.customer_id}`.toLowerCase().includes(q))
        return false;
      if (f.sku_filter.length && !f.sku_filter.includes(row.product_code)) return false;
      if (f.campaign_type.length && !f.campaign_type.includes(row.campaign_type)) return false;
      if (f.mechanic.length && !f.mechanic.includes(row.mechanic)) return false;
      if (f.audience_type.length && !f.audience_type.includes(row.audience_type)) return false;
      if (f.channel !== "all" && row.channel !== f.channel) return false;
      if (f.prime_scope !== "all" && row.prime_status !== f.prime_scope) return false;
      if (f.lifecycle !== "all" && row.lifecycle !== f.lifecycle) return false;
      if (!f.cluster_ids.includes(row.cluster_id)) return false;
      return true;
    };
  }, [
    f.sku_query,
    f.sku_filter,
    f.campaign_type,
    f.mechanic,
    f.audience_type,
    f.channel,
    f.prime_scope,
    f.lifecycle,
    f.cluster_ids,
  ]);
}

export function useFilteredAllocations() {
  const query = useAllocationsQuery();
  const predicate = useAllocationFilter();
  const rows = useMemo(() => (query.data ?? []).filter(predicate), [query.data, predicate]);
  return { ...query, rows };
}

/** Scales a campaign-level aggregate by how much of the base the filters keep. */
export function useFilterShare() {
  const { data, rows } = useFilteredAllocations();
  const total = data?.length ?? 0;
  return total ? rows.length / total : 1;
}
