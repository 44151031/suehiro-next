import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";

//
// ✅ 1. トップページのメタデータ
//    URL: https://paycancampaign.com/
//    内容: 全国のキャンペーンを紹介するトップページ用のOGP設定
//
export function getNationalMetadata(): Metadata {
  const title = "PayPay・auPAY・楽天ペイ・d払い還元キャンペーン-Payキャン";
  const description =
    "全国の自治体で実施中のPayPay・auPAY・楽天ペイ・d払いの還元キャンペーンを紹介。最大30％、10000円分の還元も。";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://paycancampaign.com/",
      images: [
        {
          url: "https://paycancampaign.com/ogp.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image", // ✅ 大きなOGP画像を表示
      title,
      description,
      images: ["https://paycancampaign.com/ogp.jpg"],
    },
  };
}

//
// ✅ 2. 都道府県ページのメタデータ
//    URL: https://paycancampaign.com/campaigns/{prefectureSlug}
//    内容: 特定都道府県のキャンペーン一覧ページ
//
export function getPrefectureMetadata(prefectureSlug: string): Metadata {
  const prefecture =
    campaigns.find((c) => c.prefectureSlug === prefectureSlug)?.prefecture || "全国";

  const title = `${prefecture}キャッシュレス還元キャンペーン情報-Pキャン`;
  const description = `${prefecture}で開催中のPayPayやauPAYや楽天ペイやd払いなどのキャッシュレス還元キャンペーンの一覧を紹介します。今獲得出来る総額ポイントも確認できます。`;

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
          url: "https://paycancampaign.com/ogp.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image", // ✅ X用に明示
      title,
      description,
      images: ["https://paycancampaign.com/ogp.jpg"],
    },
  };
}

//
// ✅ 3. 市区町村 or 市区町村+決済別ページのメタデータ
//    URL例: 
//     - https://paycancampaign.com/campaigns/tokyo/nerima
//     - https://paycancampaign.com/campaigns/tokyo/nerima/paypay
//
export function getCityMetadata(
  prefectureSlug: string,
  citySlug: string
): Metadata {
  const campaign = campaigns.find(
    (c) => c.prefectureSlug === prefectureSlug && c.citySlug === citySlug
  );

  // 万が一データが見つからない場合のフォールバック
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
    ? `${city}の${paytype}${offer}％還元キャンペーン対象店舗-Payキャン`
    : `${prefecture}${city}の還元キャンペーン対象店舗-Payキャン`;

  const description = `${prefecture}${city}で${formattedStart}から${formattedEnd}まで${
    paytype
      ? `${paytype}による${offer}％還元キャンペーン開催！${paytype}による${offer}％還元対象店舗の紹介や効率の良いポイント獲得方法を説明しています。`
      : ""
  }`;

  const ogImageUrl = `https://paycancampaign.com/images/campaigns/${prefectureSlug}-${citySlug}.jpg`;
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}${
    paytype ? `/${paytype}` : ""
  }`;

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
      card: "summary_large_image", // ✅ カード表示強制
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
