import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/Panel";
import { Pill } from "@/components/common/pills";
import { Callout } from "@/components/common/states";
import { AllocationTable } from "@/features/campaign-studio/AllocationTable";
import { OfferBuilder } from "@/features/campaign-studio/OfferBuilder";
import { StudioKpiBar } from "@/features/campaign-studio/StudioKpiBar";
import { useAllocationsQuery, useFilterShare } from "@/hooks/useStudioData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campaign Studio — FarmaTODO Promotion Intelligence" },
      {
        name: "description",
        content:
          "Decide who gets which offer at which depth, and see expected net incremental margin before approving a campaign.",
      },
      { property: "og:title", content: "Campaign Studio — FarmaTODO Promotion Intelligence" },
      {
        property: "og:description",
        content:
          "Constrained dual-discount offer optimizer over gold_promo_recommendations, with NIM projected per customer.",
      },
    ],
  }),
  component: CampaignStudioPage,
});

function CampaignStudioPage() {
  const share = useFilterShare();
  const { isPending } = useAllocationsQuery();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Campaign Studio"
        subtitle="Pre-campaign decision matrix for the Constrained Dual-Level Offer Optimizer. Every row is a customer × SKU × depth candidate scored on net incremental margin, not on sales volume."
        badges={
          <>
            <Pill tone="brand">Phase 1 · Rules Engine</Pill>
            <Pill tone="neutral">gold_promo_recommendations</Pill>
            <Pill tone="warning">15-Day Milestone Freeze</Pill>
          </>
        }
      />

      <StudioKpiBar share={share} loading={isPending} />

      <Callout tone="info">
        <strong>Targeting rule.</strong> Customers with CATE ≤ 0 (
        <span className="font-mono text-xs">needs_discount_flag = false</span>) stay in the matrix
        for auditability but cannot be approved — they would buy anyway, so discounting them is pure
        margin giveaway.
      </Callout>

      <div className="grid gap-4 xl:grid-cols-[22%_1fr]">
        <OfferBuilder />
        <AllocationTable />
      </div>
    </div>
  );
}
