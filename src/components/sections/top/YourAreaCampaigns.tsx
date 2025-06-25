"use client";

import { campaigns } from "@/lib/campaignMaster";
import { useFilteredAndSortedCampaigns } from "@/hooks/useFilteredAndSortedCampaigns";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";
import { useLocationStore } from "@/stores/locationStore";

export default function AreaCampaignSlider() {
  const { fetched } = useLocationStore();
  const sorted = useFilteredAndSortedCampaigns(campaigns);

  // ✅ 現在地未取得、または絞り込み結果がない場合は非表示
  if (!fetched || !sorted || sorted.length === 0) return null;

  // ✅ 上限6件までに制限
  const limited = sorted.slice(0, 6);

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
