"use client";

import { useLocationStore } from "@/stores/locationStore";
import { campaigns } from "@/lib/campaignMaster";
import { getHighDiscountCampaigns } from "@/lib/campaignUtils";
import ScopedCampaignSlider from "@/components/common/CampaignSlider";
import Button from "@/components/ui/button/button";
import { prefectures } from "@/lib/prefectures";

// Haversine 距離計算（km）
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function HighDiscountCampaigns() {
  const { fetched, lat, lng } = useLocationStore();

  let highDiscounts = getHighDiscountCampaigns(campaigns);

  if (fetched && lat != null && lng != null) {
    highDiscounts = highDiscounts
      .map((c) => {
        const pref = prefectures.find((p) => p.slug === c.prefectureSlug);
        if (!pref) return null;
        const distance = getDistance(lat, lng, pref.lat, pref.lng);
        return { ...c, distance };
      })
      .filter((c): c is typeof campaigns[number] & { distance: number } => c !== null)
      .sort((a, b) => a.distance - b.distance);
  } else {
    // 距離が取れない場合は還元率の降順でソート（従来通り）
    highDiscounts = highDiscounts.sort((a, b) => Number(b.offer) - Number(a.offer));
  }

  if (highDiscounts.length === 0) return null;

  return (
    <>
      <ScopedCampaignSlider
        campaigns={highDiscounts}
        title="高還元キャンペーン特集"
        bgColor="#ffffff"
      />
      <div className="pb-6 text-center">
        <Button href="/campaigns">全国の自治体キャンペーン一覧</Button>
      </div>
    </>
  );
}
