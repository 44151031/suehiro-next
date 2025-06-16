import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { sumFullpoint, sumFutureFullpoint } from "@/lib/campaignCalculations";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";

//
// ✅ 都道府県ページ
//
export function getPrefectureMetadata(prefectureSlug: string): Metadata {
  const now = new Date();
  const filtered = campaigns.filter((c) => c.prefectureSlug === prefectureSlug);
  const active = filtered.filter(
    (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
  );
  const future = filtered.filter((c) => new Date(c.startDate) > now);
  const prefecture = filtered[0]?.prefecture || "都道府県";
  const total = sumFullpoint(active);
  const futureTotal = sumFutureFullpoint(future);

  const title = active.length > 0
    ? `${prefecture}で開催中の合計${total.toLocaleString()}円分還元キャンペーン`
    : future.length > 0
      ? `${prefecture}で近日開催予定の合計${futureTotal.toLocaleString()}円分還元キャンペーン`
      : `${prefecture}のキャッシュレスキャンペーン一覧`;

  const description = active.length > 0
    ? `${prefecture}で実施中のPayPay、au PAY、楽天Pay、d払い等キャッシュレスキャンペーンを紹介。現在、合計で${total.toLocaleString()}円分のキャンペーンを紹介`
    : future.length > 0
      ? `${prefecture}で近日開催予定の合計${futureTotal.toLocaleString()}円分のキャッシュレスキャンペーンを紹介。今後の開催を見逃さずチェック！`
      : `${prefecture}のキャッシュレスキャンペーン情報。このページでは開催中または開催予定のキャンペーンと、${prefecture}の近くのキャンペーンをご紹介いたします。`;

  const ogImageUrl = `https://paycancampaign.com/images/campaigns/ogp/${prefectureSlug}-ogp.jpg`;

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
  const future = cityCampaigns.filter(
    (c) => new Date(c.startDate) > now
  );
  const total = sumFullpoint(active);
  const futureTotal = sumFutureFullpoint(future);

  const prefecture = cityCampaigns[0]?.prefecture || "都道府県";
  const city = cityCampaigns[0]?.city || "市区町村";
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/${prefectureSlug}-${citySlug}.jpg`;

  const title = active.length > 0
    ? `${city}で開催中の合計${total.toLocaleString()}円分還元キャンペーン`
    : future.length > 0
      ? `${city}で近日開催予定の合計${futureTotal.toLocaleString()}円分還元キャンペーン`
      : `${city}のキャッシュレスキャンペーン一覧`;

  const description = active.length > 0
    ? `${prefecture}${city}で実施中のキャッシュレスキャンペーンを紹介。現在、合計で${total.toLocaleString()}円分のキャンペーンを紹介`
    : future.length > 0
      ? `${prefecture}${city}で近日開催予定の合計${futureTotal.toLocaleString()}円分のキャッシュレスキャンペーンをご紹介します。`
      : `${prefecture}${city}のキャッシュレスキャンペーン。このページでは開催中または開催予定のキャンペーンと、${prefecture}${city}の近くのキャンペーンをご紹介いたします。`;

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
  const matched = campaigns
    .filter(
      (c) =>
        c.prefectureSlug === prefectureSlug &&
        c.citySlug === citySlug &&
        c.paytype === paytypeSlug
    )
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const campaign = matched[0];

  if (!campaign) {
    return {
      title: "還元キャンペーン情報",
      description: "市区町村のキャッシュレスキャンペーン情報を紹介します。",
    };
  }

  const { city, prefecture, offer, startDate, endDate, paytype } = campaign;
  const paytypeLabel = PayTypeLabels[paytypeSlug as PayTypeId] || paytypeSlug;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeSlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;

  const title = `${city}の${paytypeLabel}${offer}％還元キャンペーン対象店舗`;
  const description = `${prefecture}${city}で${formatDate(startDate)}から${formatDate(endDate)}まで${paytypeLabel}による${offer}％還元キャンペーン開催中。対象店舗の紹介やお得な使い方も。`;

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
