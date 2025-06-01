"use client";

import { campaigns } from "@/lib/campaignMaster";
import { useFilteredAndSortedCampaigns } from "@/hooks/useFilteredAndSortedCampaigns";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";

export default function AreaCampaignSlider() {
  // ✅ 全キャンペーンを対象（アクティブ限定なし）
  const sorted = useFilteredAndSortedCampaigns(campaigns);

  if (!sorted || sorted.length === 0) return null;

  return (
    <>
      <ScopedCampaignSlider
        campaigns={sorted}
        title="あなたのエリアのキャンペーン"
        bgColor="#f6f6f6"
      />
      <div className="pb-6 text-center" style={{ backgroundColor: "#f6f6f6" }}>
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}
