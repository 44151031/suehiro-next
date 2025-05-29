// ✅ /components/sections/top/YourAreaCampaigns.tsx
"use client";

import { campaigns } from "@/lib/campaigns";
import { isCampaignActive } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import ScopedCampaignSlider from "@/components/common/ScopedCampaignSlider";
import Button from "@/components/ui/Button/Button";

export default function AreaCampaignSlider() {
  const activeCampaigns = campaigns.filter((c) => isCampaignActive(c.endDate));
  const sorted = useSortedCampaignsByDistance(activeCampaigns);
  if (!sorted || sorted.length === 0) return null;

  return (
    <>
      <ScopedCampaignSlider
        campaigns={sorted}
        title="あなたのエリアのキャンペーン一覧"
        bgColor="#f6f6f6"
      />
      {/* ✅ 一覧ページへのボタン */}
      <div className="pb-6 text-center" style={{ backgroundColor: "#f6f6f6" }}>
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}
