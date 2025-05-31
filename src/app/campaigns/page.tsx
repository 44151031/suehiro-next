"use client";

import { useState } from "react";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/sections/campaign/RegionCampaignSection";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";

export default function CampaignTopPage() {
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* ✅ タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-4">
          全国のキャッシュレスキャンペーン一覧
        </h1>

        {/* ✅ 絞り込みフィルター（右寄せ・目立つ表示） */}
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

        {/* ✅ 各エリアごとの表示 */}
        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection
              key={group}
              groupName={group}
              showOnlyActive={showOnlyActive} // ← ここで状態を渡す
            />
          ))}
        </div>
        <BackNavigationButtons />
      </div>
    </div>
  );
}
