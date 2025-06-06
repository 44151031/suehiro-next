// ✅ /lib/metadataGenerators.ts
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";

export function getNationalMetadata(): Metadata {
  return {
    title: "全国のキャッシュレス還元キャンペーン情報 - Payキャン",
    description: "全国の自治体で実施中のPayPay・auPay・楽天ペイ・d払いの還元キャンペーンを紹介。",
    openGraph: {
      title: "全国のキャッシュレス還元キャンペーン情報 - Payキャン",
      description: "全国の自治体で実施中のPayPay・auPay・楽天ペイ・d払いの還元キャンペーンを紹介。",
      type: "website",
      url: "https://paycancampaign.com/",
      images: [
        {
          url: "https://paycancampaign.com/ogp/default.jpg",
          width: 1200,
          height: 630,
          alt: "全国のキャッシュレス還元キャンペーン情報",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "全国のキャッシュレス還元キャンペーン情報 - Payキャン",
      description: "全国の自治体で実施中のPayPay・auPay・楽天ペイ・d払いの還元キャンペーンを紹介。",
      images: ["https://paycancampaign.com/ogp/default.jpg"],
    },
  };
}

export function getPrefectureMetadata(prefectureSlug: string): Metadata {
  const prefecture = campaigns.find(c => c.prefectureSlug === prefectureSlug)?.prefecture || "全国";

  const title = `${prefecture}の還元キャンペーン情報`;
  const description = `${prefecture}で開催中のキャッシュレス還元キャンペーン一覧を紹介します。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://paycancampaign.com/campaigns/${prefectureSlug}`,
      images: [
        {
          url: `https://paycancampaign.com/ogp/${prefectureSlug}.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://paycancampaign.com/ogp/${prefectureSlug}.jpg`],
    },
  };
}

export function getCityMetadata(prefectureSlug: string, citySlug: string): Metadata {
  const campaign = campaigns.find(
    c => c.prefectureSlug === prefectureSlug && c.citySlug === citySlug
  );

  if (!campaign) {
    return {
      title: "還元キャンペーン情報",
      description: "市区町村のキャッシュレスキャンペーン情報を紹介します。",
    };
  }

  const { prefecture, city, paytype, offer } = campaign;

  const title = paytype
    ? `${city}の${paytype} ${offer}％還元キャンペーン情報`
    : `${prefecture}${city}の還元キャンペーン情報`;

  const description = `${prefecture}${city}で実施中のキャンペーンを紹介。${paytype ? `${paytype}による${offer}％還元対象！` : ""}`;

  const ogImageUrl = paytype
    ? `https://paycancampaign.com/api/og/campaigns/${prefectureSlug}/${citySlug}/${paytype}`
    : `https://paycancampaign.com/ogp/${prefectureSlug}-${citySlug}.jpg`;

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}${paytype ? `/${paytype}` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
