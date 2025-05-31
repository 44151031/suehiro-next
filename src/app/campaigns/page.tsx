"use client";

import { useState } from "react";
import { campaigns } from "@/lib/campaignMaster";
import { isNowInCampaignPeriod } from "@/lib/campaignUtils";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/sections/campaign/RegionCampaignSection";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary"; // ✅ 追加

export default function CampaignTopPage() {
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // ✅ 対象キャンペーンを絞り込み（全 or 開催中のみ）
  const filtered = showOnlyActive
    ? campaigns.filter((c) => isNowInCampaignPeriod(c.startDate, c.endDate))
    : campaigns;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-4">
          全国のキャッシュレスキャンペーン一覧
        </h1>

        {/* ✅ 合計ポイント表示 */}
        <CampaignTotalPointSummary
          campaigns={filtered}
          areaLabel="全国"
        />

        {/* フィルター */}
        <div className="flex justify-end mb-10">
          <label className="inline-flex items-center gap-3 px-4 py-2 bg-[#f7931e] rounded-full shadow text-white text-base font-semibold">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={() => setShowOnlyActive((prev) => !prev)}
              className="form-checkbox h-5 w-5 rounded border-white text-white bg-white/20 checked:bg-white checked:text-[#f7931e] focus:ring-0"
            />
            開催中だけに絞る
          </label>
        </div>

        {/* エリア別キャンペーン */}
        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection
              key={group}
              groupName={group}
              showOnlyActive={showOnlyActive}
            />
          ))}
        </div>

        <BackNavigationButtons />
      </div>
    </div>
  );
}
