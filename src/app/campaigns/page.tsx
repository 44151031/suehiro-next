"use client";

import { useState } from "react";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/campaign/CampaignGroupSection";

export default function CampaignTopPage() {
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* ✅ タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-4">
          PayPayキャンペーン都道府県一覧
        </h1>

        {/* ✅ 絞り込みフィルター（右寄せ） */}
        <div className="flex justify-end mb-10">
          <label className="inline-flex items-center gap-2 text-base text-neutral-800">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={() => setShowOnlyActive((prev) => !prev)}
              className="form-checkbox h-5 w-5 rounded border-border text-primary"
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
      </div>
    </div>
  );
}
