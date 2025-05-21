// ✅ /components/sections/CampaignCards.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { campaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/common/CampaignCard";
import { isCampaignActive } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import type { Campaign } from "@/types/campaign";

export default function CampaignCards() {
  const activeCampaigns: Campaign[] = campaigns.filter((c) => isCampaignActive(c.endDate));
  const sorted = useSortedCampaignsByDistance(activeCampaigns);

  if (!sorted || sorted.length === 0) return null;

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* ✅ 背景画像（publicから直接参照） */}
      <Image
        src="/images/top/campaigns-bg.png"
        alt="キャンペーン背景"
        fill
        className="object-cover object-center"
        priority
      />
      
      {/* ✅ オーバーレイ */}
      <div className="absolute inset-0 bg-black/30 backdrop-brightness-75" />

      {/* ✅ コンテンツ */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-white drop-shadow text-center">
          開催中のキャンペーン（近い順）
        </h2>
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
      </div>
    </section>
  );
}
