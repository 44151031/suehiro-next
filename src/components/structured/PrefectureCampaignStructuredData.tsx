// /components/structured/PrefectureCampaignStructuredData.tsx
"use client";

import React from "react";
import type { Campaign } from "@/types/campaign";

type Props = {
  prefecture: string;
  prefectureSlug: string;
  campaigns?: Campaign[]; // ✅ optional に変更
};

export default function PrefectureTopStructuredData({
  prefecture,
  prefectureSlug,
  campaigns = [], // ✅ デフォルトで空配列に
}: Props) {
  const origin = "https://paycancampaign.com";

  const uniqueUrls = Array.from(
    new Set(
      campaigns.map(
        (c) =>
          `${origin}/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`
      )
    )
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${prefecture}のキャンペーン一覧`,
    itemListOrder: "http://schema.org/ItemListOrderDescending",
    numberOfItems: uniqueUrls.length,
    itemListElement: uniqueUrls.map((url, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
