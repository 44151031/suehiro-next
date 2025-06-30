// src/lib/metadata/PrefectureCampaignMetadata.ts

import type { Metadata } from "next";
import { commonOpenGraph, commonTwitter, commonIcons } from "./CommonMetadata";

export const metadata: Metadata = {
  title: "都道府県別のキャンペーン一覧",
  description:
    "都道府県別に開催されているPayPay・auPAY・楽天ペイ・d払いのキャンペーン情報を掲載。お住まいや旅行先でお得な還元情報をチェック！",
  openGraph: {
    ...commonOpenGraph,
    title: "都道府県別のキャンペーン一覧",
    description:
      "都道府県別に開催されているPayPay・auPAY・楽天ペイ・d払いのキャンペーン情報を掲載。お住まいや旅行先でお得な還元情報をチェック！",
  },
  twitter: {
    ...commonTwitter,
    title: "都道府県別のキャンペーン一覧",
    description:
      "都道府県別に開催されているPayPay・auPAY・楽天ペイ・d払いのキャンペーン情報を掲載。お住まいや旅行先でお得な還元情報をチェック！",
  },
  icons: commonIcons,
};
