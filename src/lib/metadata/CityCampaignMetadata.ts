// src/lib/metadata/CityCampaignMetadata.ts

import type { Metadata } from "next";
import { commonIcons, siteBaseURL } from "./CommonMetadata";

export function generateCityCampaignMetadata(
  prefecture: string,
  city: string,
  prefectureSlug: string,
  citySlug: string
): Metadata {
  const title = `${city}のPayPay・auPAY・楽天ペイ・d払い還元キャンペーン情報`;
  const description = `${prefecture}${city}で開催中のキャッシュレス還元キャンペーン情報を紹介。PayPay・auPAY・楽天ペイ・d払いの利用でお得になる情報を掲載しています。`;
  const ogpImage = `${siteBaseURL}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-ogp.jpg`;
  const url = `${siteBaseURL}/campaigns/${prefectureSlug}/${citySlug}`;

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
          alt: `${city}のキャンペーンOGP画像`,
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
