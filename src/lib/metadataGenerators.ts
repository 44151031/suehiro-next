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
    },
    twitter: {
      card: "summary_large_image",
      title: "全国のキャッシュレス還元キャンペーン情報 - Payキャン",
      description: "全国の自治体で実施中のPayPay・auPay・楽天ペイ・d払いの還元キャンペーンを紹介。",
    },
  };
}

export function getPrefectureMetadata(prefectureSlug: string): Metadata {
  const prefecture = campaigns.find(c => c.prefectureSlug === prefectureSlug)?.prefecture || "全国";

  const title = `${prefecture}のキャッシュレス還元キャンペーン情報`;
  const description = `${prefecture}で開催中のPayPayやau Payや楽天ペイやd払いなどのキャッシュレス還元キャンペーンの一覧を紹介します。今獲得出来る総額ポイントも確認できます。`;

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
          url: `https://paycancampaign.com/ogp.jpg`,
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
      images: [`https://paycancampaign.com/ogp.jpg`],
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

  const { prefecture, city, paytype, offer, startDate, endDate } = campaign;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  const title = paytype
    ? `${city}の${paytype} ${offer}％還元の対象店舗情報`
    : `${prefecture}${city}の還元の対象店舗情報`;

  const description = `${prefecture}${city}で${formattedStart}から${formattedEnd}まで${paytype ? `${paytype}による${offer}％還元キャンペーン開催！${paytype}による${offer}％還元対象店舗の紹介や効率の良いポイント獲得方法を説明しています。` : ""}`;

  const ogImageUrl = `https://paycancampaign.com/ogp/${prefectureSlug}-${citySlug}.jpg`;

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
