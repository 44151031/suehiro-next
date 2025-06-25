"use client";

import { campaigns } from "@/lib/campaignMaster";
import { useFilteredAndSortedCampaigns } from "@/hooks/useFilteredAndSortedCampaigns";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";

export default function AreaCampaignSlider() {
  const sorted = useFilteredAndSortedCampaigns(campaigns);

  // ✅ 条件を外す（空でも描画）
  const limited = sorted?.slice(0, 6) ?? [];

  return (
    <>
      <ScopedCampaignSlider
        campaigns={limited}
        title="あなたのエリアのキャンペーン"
        bgColor="#f6f6f6"
      />
      <div className="pb-6 text-center" style={{ backgroundColor: "#f6f6f6" }}>
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}