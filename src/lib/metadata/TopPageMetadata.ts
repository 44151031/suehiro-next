// src/lib/metadata/TopPageMetadata.ts

import type { Metadata } from "next";
import { commonOpenGraph, commonTwitter, commonIcons } from "./CommonMetadata";

export const metadata: Metadata = {
  title: {
    default: "PayPay・auPAY・楽天ペイ・d払いキャンペーン情報サイト-Payキャン",
    template: "%s-Payキャン",
  },
  description:
    "全国のPayPay・auPAY・楽天ペイ・d払いのキャンペーンをまとめて紹介。都道府県・市区町村ごとの還元情報をわかりやすく掲載しています。",
  openGraph: {
    ...commonOpenGraph,
    title: "PayPay・auPAY・楽天ペイ・d払いキャンペーン情報サイト-Payキャン",
    description:
      "全国のPayPay・auPAY・楽天ペイ・d払いのキャンペーンをまとめて紹介。都道府県・市区町村ごとの還元情報をわかりやすく掲載しています。",
    url: "https://paycancampaign.com",
  },
  twitter: {
    ...commonTwitter,
    title: "PayPay・auPAY・楽天ペイ・d払いキャンペーン情報サイト-Payキャン",
    description:
      "全国のPayPay・auPAY・楽天ペイ・d払いのキャンペーンをまとめて紹介。都道府県・市区町村ごとの還元情報をわかりやすく掲載しています。",
  },
  icons: commonIcons,
};
