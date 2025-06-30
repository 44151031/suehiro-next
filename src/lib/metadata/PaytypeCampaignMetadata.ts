// src/lib/metadata/PaytypeCampaignMetadata.ts

import type { Metadata } from "next";
import { commonIcons, siteBaseURL } from "./CommonMetadata";

export function generatePaytypeCampaignMetadata(
  prefecture: string,
  city: string,
  payLabel: string,
  prefectureSlug: string,
  citySlug: string,
  paytype: string
): Metadata {
  const title = `${city} × ${payLabel} の還元キャンペーン情報`;
  const description = `${prefecture}${city}で実施されている${payLabel}のキャンペーン情報を紹介。ポイント還元率、付与条件、対象店舗などの詳細をわかりやすく解説しています。`;
  const ogpImage = `${siteBaseURL}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;
  const url = `${siteBaseURL}/campaigns/${prefectureSlug}/${citySlug}/${paytype}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Payキャン",
      type: "article",
      images: [
        {
          url: ogpImage,
          width: 1200,
          height: 630,
          alt: `${city}×${payLabel}のキャンペーンOGP画像`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogpImage],
    },
    icons: commonIcons,
  };
}
