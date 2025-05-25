"use client";

import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { prefectures } from "@/lib/prefectures";
import {
  isCampaignActive,
  isNowInCampaignPeriod,
} from "@/lib/campaignUtils";
import CampaignLineCard from "@/components/common/CampaignLineCard";

type Props = {
  groupName: string;
  showOnlyActive: boolean;
};

export default function CampaignGroupSection({
  groupName,
  showOnlyActive,
}: Props) {
  const groupPrefectures = prefectures.filter((p) => p.group === groupName);

  // ✅ このエリア内に表示可能なキャンペーンが1件もなければ、セクションごと非表示にする
  const hasVisibleCampaigns = groupPrefectures.some((pref) =>
    campaigns.some(
      (c) =>
        c.prefectureSlug === pref.slug &&
        isCampaignActive(c.endDate) &&
        (!showOnlyActive || isNowInCampaignPeriod(c.startDate, c.endDate))
    )
  );
  if (!hasVisibleCampaigns) return null;

  return (
    <section className="mb-16">
      {/* エリア見出し */}
      <h2 className="text-lg sm:text-xl font-bold text-neutral-800 border-l-4 border-neutral-800 pl-3 mb-4">
        {groupName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {groupPrefectures.map((pref) => {
          const prefCampaigns = campaigns.filter(
            (c) =>
              c.prefectureSlug === pref.slug && isCampaignActive(c.endDate)
          );

          const filtered = prefCampaigns.filter((c) =>
            !showOnlyActive || isNowInCampaignPeriod(c.startDate, c.endDate)
          );

          if (filtered.length === 0) return null;

          return (
            <div key={pref.slug} className="space-y-3">
              <h3 className="text-base font-semibold text-neutral-700 mb-1">
                {pref.name}
              </h3>

              {filtered.map((c) => (
                <Link
                  key={`${c.prefectureSlug}-${c.citySlug}`}
                  href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
                  className="block"
                >
                  <CampaignLineCard
                    prefecture={c.prefecture}
                    city={c.city}
                    offer={c.offer}
                    startDate={c.startDate}
                    endDate={c.endDate}
                    onepoint={c.onepoint}
                    fullpoint={c.fullpoint}
                    isActive={isNowInCampaignPeriod(
                      c.startDate,
                      c.endDate
                    )}
                  />
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
