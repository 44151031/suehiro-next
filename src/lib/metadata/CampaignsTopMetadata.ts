// src/lib/metadata/CampaignsTopMetadata.ts

import type { Metadata } from "next";
import { commonIcons, siteBaseURL } from "./CommonMetadata";

const title = "全国のキャッシュレス還元キャンペーン一覧｜Payキャン";
const description =
  "日本全国で開催中のPayPay・auPAY・楽天ペイ・d払いのキャッシュレス還元キャンペーンを都道府県・市区町村別に一覧で紹介。最新情報をまとめてチェック。";

export const campaignsTopMetadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${siteBaseURL}/campaigns`,
    siteName: "Payキャン",
    type: "website",
    images: [
      {
        url: `${siteBaseURL}/ogp.jpg`,
        width: 1200,
        height: 630,
        alt: "キャンペーントップ OGP画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteBaseURL}/ogp.jpg`],
  },
  icons: commonIcons,
};
