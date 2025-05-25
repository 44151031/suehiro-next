"use client";

import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import { isCampaignActive } from "@/lib/campaignUtils";
import { campaigns } from "@/lib/campaigns";
import ScopedCampaignSlider from "@/components/common/ScopedCampaignSlider";
import type { Campaign } from "@/types/campaign";

type Props = {
  prefectureSlug: string;
  excludeCitySlug?: string;
};

export default function PrefectureCampaignList({
  prefectureSlug,
  excludeCitySlug,
}: Props) {
  // 対象都道府県で、開催中 & 除外されていない市区町村のキャンペーンを取得
  const filtered: Campaign[] = campaigns.filter(
    (c) =>
      c.prefectureSlug === prefectureSlug &&
      c.citySlug !== excludeCitySlug &&
      isCampaignActive(c.endDate)
  );

  const sorted = useSortedCampaignsByDistance(filtered);

  if (!sorted || sorted.length === 0) return null;

  return (
    <ScopedCampaignSlider
      campaigns={sorted}
      title={`他のキャンペーン（${sorted[0].prefecture}内）`}
      bgColor="#f8f7f2"
    />
  );
}
