import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { sumFullpoint } from "@/lib/campaignCalculations";
import { PayTypeLabels, PayTypeId } from "@/lib/payType"; // ← 追加

//
// ✅ 全国トップページ
//
export function getNationalMetadata(): Metadata {
  const title = "PayPay・auPAY・楽天ペイ・d払いキャンペーン";
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
      card: "summary_large_image",
      title,
      description,
      images: ["https://paycancampaign.com/ogp.jpg"],
    },
  };
}

//
// ✅ 都道府県ページ
//
export function getPrefectureMetadata(prefectureSlug: string): Metadata {
  const now = new Date();
  const filtered = campaigns.filter((c) => c.prefectureSlug === prefectureSlug);
  const active = filtered.filter(
    (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
  );
  const prefecture = filtered[0]?.prefecture || "都道府県";
  const total = sumFullpoint(active);

  const title = active.length > 0
    ? `${prefecture}で開催中の合計${total.toLocaleString()}円分還元キャンペーン`
    : `${prefecture}のキャッシュレスキャンペーン一覧`;

  const description = active.length > 0
    ? `${prefecture}で実施中のPayPay・auPAY・楽天ペイ・d払いなどのキャンペーンを紹介。今もらえるポイント総額をチェック！`
    : `${prefecture}では現在開催中のキャンペーンはありません。次回実施情報をお待ちください。`;

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
      card: "summary_large_image",
      title,
      description,
      images: ["https://paycancampaign.com/ogp.jpg"],
    },
  };
}

//
// ✅ 市区町村ページ（[city]）
//
export function getCityMetadata(
  prefectureSlug: string,
  citySlug: string
): Metadata {
  const now = new Date();
  const cityCampaigns = campaigns.filter(
    (c) => c.prefectureSlug === prefectureSlug && c.citySlug === citySlug
  );

  const active = cityCampaigns.filter(
    (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
  );
  const total = sumFullpoint(active);

  const prefecture = cityCampaigns[0]?.prefecture || "都道府県";
  const city = cityCampaigns[0]?.city || "市区町村";
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/${prefectureSlug}-${citySlug}.jpg`;

  const title = active.length > 0
    ? `${city}で開催中の合計${total.toLocaleString()}円分還元キャンペーン`
    : `${city}のキャッシュレスキャンペーン一覧`;

  const description = active.length > 0
    ? `${prefecture}${city}で実施中のキャッシュレスキャンペーンを紹介。今なら合計で${total.toLocaleString()}円分の還元が受けられます。`
    : `${prefecture}${city}のキャッシュレスキャンペーン。このページでは開催中や開催予定のキャンペーンをご紹介いたします。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

//
// ✅ ペイタイプページ（[city]/[pay]）
//
export function getPaytypeMetadata(
  prefectureSlug: string,
  citySlug: string,
  paytypeSlug: string
): Metadata {
  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === prefectureSlug &&
      c.citySlug === citySlug &&
      c.paytype === paytypeSlug
  );

  if (!campaign) {
    return {
      title: "還元キャンペーン情報",
      description: "市区町村のキャッシュレスキャンペーン情報を紹介します。",
    };
  }

  const { city, prefecture, offer, startDate, endDate } = campaign;

  const paytypeLabel = PayTypeLabels[paytypeSlug as PayTypeId] || paytypeSlug;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeSlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/${prefectureSlug}-${citySlug}.jpg`;

  const title = `${city}の${paytypeLabel}${offer}％還元キャンペーン対象店舗`;
  const description = `${prefecture}${city}で${formatDate(startDate)}〜${formatDate(endDate)}まで${paytypeLabel}による${offer}％還元キャンペーン開催中。対象店舗の紹介やお得な使い方も。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
