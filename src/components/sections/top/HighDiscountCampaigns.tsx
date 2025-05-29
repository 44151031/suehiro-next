// ✅ /components/sections/top/HighDiscountCampaigns.tsx
"use client";

import { campaigns } from "@/lib/campaigns";
import { getHighDiscountCampaigns } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import ScopedCampaignSlider from "@/components/common/ScopedCampaignSlider";
import Button from "@/components/ui/Button/Button";

export default function HighDiscountCampaigns() {
  const highDiscounts = getHighDiscountCampaigns(campaigns);
  const sorted = useSortedCampaignsByDistance(highDiscounts);
  if (!sorted) return null;
  
  return (
    <ScopedCampaignSlider
      campaigns={sorted}
      title="高還元キャンペーン特集"
      bgColor="#ffffff"
    />
  );
}