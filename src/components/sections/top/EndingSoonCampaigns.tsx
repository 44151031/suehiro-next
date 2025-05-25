"use client";

import { campaigns } from "@/lib/campaigns";
import { isEndingSoon } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import type { Campaign } from "@/types/campaign";
import ScopedCampaignSlider from "@/components/common/ScopedCampaignSlider";

export default function EndingSoonCampaigns() {
  // まもなく終了するキャンペーンを抽出
  const endingSoon: Campaign[] = campaigns.filter((c) =>
    isEndingSoon(c.endDate)
  );

  const sorted = useSortedCampaignsByDistance(endingSoon);

  if (!sorted || sorted.length === 0) return null;

  return (
    <ScopedCampaignSlider
      campaigns={sorted}
      title="まもなく終了のキャンペーン（近い順）"
      bgColor="#eeeeee"
    />
  );
}
