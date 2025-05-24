"use client";

import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/common/CampaignCard";
import { isEndingSoon } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import type { Campaign } from "@/types/campaign";

export default function EndingSoonCampaigns() {
  const endingSoon: Campaign[] = campaigns.filter((c) => isEndingSoon(c.endDate));
  const sorted = useSortedCampaignsByDistance(endingSoon);

  if (!sorted || sorted.length === 0) return null;

  return (
    <section className="w-full py-16 bg-accent/10 text-foreground">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* 見出し */}
        <h2 className="text-2xl font-bold text-accent drop-shadow-md mb-8 text-center">
          まもなく終了のキャンペーン（近い順）
        </h2>

        {/* キャンペーンカードリスト */}
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {sorted.map((c) => (
            <Link
              key={`${c.prefectureSlug}-${c.citySlug}`}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
              className="block flex-shrink-0"
            >
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                startDate={c.startDate}
                endDate={c.endDate}
                fullpoint={c.fullpoint}
              />
            </Link>
          ))}
        </div>

        {/* 一覧ボタン */}
        <div className="mt-6 text-center">
          <Link
            href="/campaigns"
            className="inline-block bg-primary text-primary-foreground font-bold text-sm rounded-full px-6 py-2 hover:bg-accent hover:text-accent-foreground transition"
          >
            一覧を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
