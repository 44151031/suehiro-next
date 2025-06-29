// /components/structured/CityTopStructuredData.tsx
"use client";

import React from "react";
import type { Campaign } from "@/types/campaign";

type Props = {
  prefecture: string;
  city: string;
  prefectureSlug: string;
  citySlug: string;
  campaigns?: Campaign[]; // optional にして undefined 対策
};

export default function CityTopStructuredData({
  prefecture,
  city,
  prefectureSlug,
  citySlug,
  campaigns = [], // デフォルトで空配列を設定
}: Props) {
  const origin = "https://paycancampaign.com";

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${prefecture}${city}のキャンペーン一覧`,
    itemListOrder: "http://schema.org/ItemListOrderDescending",
    numberOfItems: campaigns.length,
    itemListElement: campaigns.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${origin}/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
