"use client";

import { useState } from "react";
import { campaigns } from "@/lib/campaignMaster";
import { isNowInCampaignPeriod } from "@/lib/campaignUtils";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/sections/campaign/RegionCampaignSection";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";

export default function CampaignTopPageClient() {
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyOver30Percent, setShowOnlyOver30Percent] = useState(false);
  const [showOnlyOver10000Yen, setShowOnlyOver10000Yen] = useState(false);

  const filtered = campaigns.filter((c) => {
    if (showOnlyActive && !isNowInCampaignPeriod(c.startDate, c.endDate)) return false;
    if (showOnlyOver30Percent && c.offer < 30) return false;
    if (showOnlyOver10000Yen && Number(c.fullpoint) < 10000) return false;
    return true;
  });

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="headline1">
          全国のキャッシュレスキャンペーン一覧
        </h1>
        <CampaignTotalPointSummary campaigns={filtered} areaLabel="全国" />

{/* ✅ 絞り込みセクション：stickyでヘッダー下に固定 */}
<div className="sticky top-16 z-30 bg-[#f8f7f2] pt-4 pb-3 mb-10">
  <div className="flex flex-wrap sm:flex-nowrap justify-end gap-3 sm:gap-6 px-2 sm:px-0 text-sm sm:text-base">
    {/* ✅ 開催中 */}
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={showOnlyActive}
        onChange={() => setShowOnlyActive((prev) => !prev)}
        className="form-checkbox h-5 w-5 text-[#f7931e] border-gray-400 focus:ring-[#f7931e]"
      />
      <span className="font-bold text-sm text-gray-600">開催中のみ</span>
    </label>

    {/* ✅ 還元率30%以上 */}
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={showOnlyOver30Percent}
        onChange={() => setShowOnlyOver30Percent((prev) => !prev)}
        className="form-checkbox h-5 w-5 text-green-600 border-gray-400 focus:ring-green-600"
      />
      <span className="font-bold text-sm text-gray-600">30%以上</span>
    </label>

    {/* ✅ 10,000円以上還元 */}
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={showOnlyOver10000Yen}
        onChange={() => setShowOnlyOver10000Yen((prev) => !prev)}
        className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 focus:ring-blue-600"
      />
      <span className="font-bold text-sm text-gray-600">1万円以上</span>
    </label>
  </div>
</div>
        {/* ✅ 各エリアのセクション */}
        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection
              key={group}
              groupName={group}
              showOnlyActive={showOnlyActive}
              showOnlyOver30Percent={showOnlyOver30Percent}
              showOnlyOver10000Yen={showOnlyOver10000Yen}
            />
          ))}
        </div>
{/* ✅ SNS共有ボタン（手入力タイトル＆ハッシュタグ） */}
<div className="mt-4 mb-6">
  <SNSShareButtons
    url="https://paycancampaign.com/campaigns"
    title="全国でキャッシュレス還元キャンペーン開催中！最大30%以上還元も"
    hashtags={["paypay還元", "全国キャンペーン", "キャッシュレス"]}
  />
</div>
        <BackNavigationButtons />
      </div>
    </div>
  );
}
