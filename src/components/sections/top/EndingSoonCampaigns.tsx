"use client";

import { campaigns } from "@/lib/campaignMaster";
import { isEndingSoon } from "@/lib/campaignUtils";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";

export default function EndingSoonCampaigns() {
  const endingSoon = campaigns
    .filter((c) => isEndingSoon(c.endDate))
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()); // ← ここでソート

  if (endingSoon.length === 0) return null;

  return (
    <>
      <ScopedCampaignSlider
        campaigns={endingSoon}
        title="まもなく終了のキャンペーン"
        bgColor="#eeeeee"
      />
      <div className="pb-6 text-center" style={{ backgroundColor: "#eeeeee" }}>
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}
