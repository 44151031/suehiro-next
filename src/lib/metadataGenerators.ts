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
    ? `${prefecture}のキャッシュレスキャンペーン！合計${total.toLocaleString("ja-JP")}円分還元-Payキャン`
    : future.length > 0
      ? `${prefecture}で開催予定のキャッシュレスキャンペーン！合計${futureTotal.toLocaleString("ja-JP")}円分還元-Payキャン`
      : `${prefecture}のキャッシュレスキャンペーン一覧-Payキャン`;

  const description = active.length > 0
    ? `${prefecture}で実施中のPayPay、au PAY、楽天ペイ、d払い等キャッシュレスキャンペーンを紹介。現在、合計で${total.toLocaleString("ja-JP")}円分のキャンペーンを紹介`
    : future.length > 0
      ? `${prefecture}で近日開催予定の合計${futureTotal.toLocaleString("ja-JP")}円分のキャッシュレスキャンペーンを紹介。今後の開催を見逃さずチェック！`
      : `${prefecture}のキャッシュレスキャンペーン情報。このページでは開催中または開催予定のキャンペーンと、${prefecture}の近くのキャンペーンをご紹介いたします。`;

  const ogImageUrl = `https://paycancampaign.com/images/campaigns/ogp/${prefectureSlug}-ogp.jpg?v=1`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://paycancampaign.com/campaigns/${prefectureSlug}`,
      siteName: "Payキャン",
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
  const future = cityCampaigns.filter((c) => new Date(c.startDate) > now);
  const total = sumFullpoint(active);
  const futureTotal = sumFutureFullpoint(future);

  const prefecture = cityCampaigns[0]?.prefecture || "都道府県";
  const city = cityCampaigns[0]?.city || "市区町村";
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/${prefectureSlug}-${citySlug}.jpg?v=1`;

  const title = active.length > 0
    ? `${city}のキャッシュレスキャンペーン!合計${total.toLocaleString("ja-JP")}円分還元-Payキャン`
    : future.length > 0
      ? `${city}で開催予定のキャッシュレスキャンペーン!合計${futureTotal.toLocaleString("ja-JP")}円分還元-Payキャン`
      : `${city}のキャッシュレスキャンペーン一覧-Payキャン`;

  const description = active.length > 0
    ? `${prefecture}${city}で実施中のキャッシュレスキャンペーンを紹介。現在、合計で${total.toLocaleString("ja-JP")}円分のキャンペーンを紹介`
    : future.length > 0
      ? `${prefecture}${city}で近日開催予定の合計${futureTotal.toLocaleString("ja-JP")}円分のキャッシュレスキャンペーンをご紹介します。`
      : `${prefecture}${city}のキャッシュレスキャンペーン。このページでは開催中または開催予定のキャンペーンと、${prefecture}${city}の近くのキャンペーンをご紹介いたします。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: "Payキャン",
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
//   → 開催中・終了・開催予定を自動判定
//
export function getPaytypeMetadata(
  prefectureSlug: string,
  citySlug: string,
  paytypeSlug: string
): Metadata {
  const now = new Date();
  const matched = campaigns
    .filter(
      (c) =>
        c.prefectureSlug === prefectureSlug &&
        c.citySlug === citySlug &&
        c.paytype === paytypeSlug
    )
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

  const campaign = matched[0];

  if (!campaign) {
    return {
      title: "還元キャンペーン情報-Payキャン",
      description: "市区町村のキャッシュレスキャンペーン情報を紹介します。",
    };
  }

  const { city, prefecture, offer, startDate, endDate, paytype } = campaign;
  const paytypeLabel = PayTypeLabels[paytype as PayTypeId] || paytypeSlug;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const isEnded = end < now;
  const isUpcoming = start > now;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeSlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg?v=1`;

  // ✅ 状態別タイトル／説明分岐
  let title = "";
  let description = "";

  if (isEnded) {
    title = `${city}で実施された${paytypeLabel}キャンペーン（最大${offer}%還元）-Payキャン`;
    description = `${prefecture}${city}で開催された${paytypeLabel}キャンペーンの実績ページ。${formatDate(startDate)}〜${formatDate(endDate)}に実施された過去の${offer}%還元キャンペーンの概要を掲載。次回開催の参考に。`;
  } else if (isUpcoming) {
    title = `${city}で開催予定の${paytypeLabel}キャンペーン（最大${offer}%還元）-Payキャン`;
    description = `${prefecture}${city}で${formatDate(startDate)}から開催予定の${paytypeLabel}${offer}%還元キャンペーンの情報。開催期間や上限額など、最新情報を先取り。`;
  } else {
    title = `${city}の${paytypeLabel}キャンペーン｜対象店舗一覧 最大${offer}%還元-Payキャン`;
    description = `${prefecture}${city}で開催中の${paytypeLabel}${offer}%還元キャンペーン情報。${formatDate(startDate)}〜${formatDate(endDate)}まで実施。対象店舗や付与上限も紹介。`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: "Payキャン",
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
// ✅ layout.tsx などから利用するための generateMetadata を追加
//
export async function generateMetadata({
  params,
}: {
  params: { prefecture?: string; city?: string; pay?: string };
}): Promise<Metadata> {
  const { prefecture, city, pay } = params;

  if (prefecture && city && pay) {
    return getPaytypeMetadata(prefecture, city, pay);
  } else if (prefecture && city) {
    return getCityMetadata(prefecture, city);
  } else if (prefecture) {
    return getPrefectureMetadata(prefecture);
  }

  return {
    title: "キャッシュレス還元キャンペーンまとめ-Payキャン",
    description: "全国のPayPay・au PAY・楽天ペイ・d払いの還元キャンペーン情報を紹介しています。",
  };
}
