// ✅ /lib/metadataGenerators.ts
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";

export function getNationalMetadata(): Metadata {
  return {
    title: "全国のキャッシュレス還元キャンペーン情報 - Payキャン",
    description: "全国の自治体で実施中のPayPay・auPay・楽天ペイ・d払いの還元キャンペーンを紹介。",
  };
}

export function getPrefectureMetadata(prefectureSlug: string): Metadata {
  const prefecture = campaigns.find(c => c.prefectureSlug === prefectureSlug)?.prefecture || "全国";

  return {
    title: `${prefecture}の還元キャンペーン情報 - Payキャン`,
    description: `${prefecture}で開催中のキャッシュレス還元キャンペーン一覧を紹介します。`,
  };
}

export function getCityMetadata(prefectureSlug: string, citySlug: string): Metadata {
  const campaign = campaigns.find(
    c => c.prefectureSlug === prefectureSlug && c.citySlug === citySlug
  );

  if (!campaign) {
    return {
      title: "還元キャンペーン情報 - Payキャン",
      description: "市区町村のキャッシュレスキャンペーン情報を紹介します。",
    };
  }

  const { prefecture, city, paytype, offer } = campaign;

  const title = paytype
    ? `${city}の${paytype} ${offer}％還元キャンペーン情報 - Payキャン`
    : `${prefecture}${city}の還元キャンペーン情報 - Payキャン`;

  const description = `${prefecture}${city}で実施中のキャンペーンを紹介。${paytype ? `${paytype}による${offer}％還元対象！` : ""}`;

  return {
    title,
    description,
  };
}
