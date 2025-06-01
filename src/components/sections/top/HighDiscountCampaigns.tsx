"use client";

import { campaigns } from "@/lib/campaignMaster";
import { getHighDiscountCampaigns } from "@/lib/campaignUtils";
import { useFilteredAndSortedCampaigns } from "@/hooks/useFilteredAndSortedCampaigns";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";

export default function HighDiscountCampaigns() {
  const highDiscounts = getHighDiscountCampaigns(campaigns);
  const sorted = useFilteredAndSortedCampaigns(highDiscounts);

  if (!sorted || sorted.length === 0) return null;

  return (
    <>
      <ScopedCampaignSlider
        campaigns={sorted}
        title="高還元キャンペーン特集"
        bgColor="#ffffff"
      />
      <div className="pb-6 text-center">
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}
