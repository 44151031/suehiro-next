"use client";

import { campaigns } from "@/lib/campaignMaster";
import { isEndingSoon } from "@/lib/campaignUtils";
import { useFilteredAndSortedCampaigns } from "@/hooks/useFilteredAndSortedCampaigns";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";

export default function EndingSoonCampaigns() {
  const endingSoon = campaigns.filter((c) => isEndingSoon(c.endDate));
  const sorted = useFilteredAndSortedCampaigns(endingSoon);

  if (!sorted || sorted.length === 0) return null;

  return (
    <>
      <ScopedCampaignSlider
        campaigns={sorted}
        title="まもなく終了のキャンペーン"
        bgColor="#eeeeee"
      />
      <div className="pb-6 text-center" style={{ backgroundColor: "#eeeeee" }}>
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}
