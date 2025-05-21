// ✅ /components/sections/HighDiscountCampaigns.tsx
"use client";

import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { getHighDiscountCampaigns } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance"; // ✅ カスタムフック導入
import CampaignCard from "@/components/common/CampaignCard";
import type { Campaign } from "@/types/campaign";

export default function HighDiscountCampaigns() {
  const highDiscounts: Campaign[] = getHighDiscountCampaigns(campaigns); // ✅ 30%以上抽出
  const sorted = useSortedCampaignsByDistance(highDiscounts); // ✅ 現在地から近い順に並び替え

  if (!sorted || sorted.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-yellow-50">
      <h2 className="text-2xl font-bold mb-8 text-center">高還元キャンペーン特集（現在地に近い順）</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {sorted.map((c) => (
          <Link
            key={`${c.prefectureSlug}-${c.citySlug}`}
            href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
            className="block"
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
      <div className="mt-4 text-center">
        <Link
          href="/campaigns"
          className="inline-block bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600 transition"
        >
          一覧を見る
        </Link>
      </div>
    </section>
  );
}
