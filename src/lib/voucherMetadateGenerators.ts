import { Metadata } from "next";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { calculateVoucherDiscountRate } from "@/lib/voucherUtils";

type VoucherPaySlug = "paypay-voucher";

function formatJP(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  const m = dt.getMonth() + 1;
  const day = dt.getDate();
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return hh === "00" && mm === "00" ? `${m}月${day}日` : `${m}月${day}日 ${hh}:${mm}`;
}

/** 商品券（Voucher）ページ専用 Metadata（pay は固定で "paypay-voucher"） */
export function getVoucherMetadata(
  prefectureSlug: string,
  citySlug: string,
  _paySlug?: VoucherPaySlug // 受け取っても無視して固定運用
): Metadata {
  const paySlug: VoucherPaySlug = "paypay-voucher";
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paySlug}`;
  const ogImageUrl = `https://paycancampaign.com/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paySlug}-ogp.jpg?v=1`;

  const matched = voucherCampaignMaster
    .filter(
      (v) =>
        v.prefectureSlug === prefectureSlug &&
        v.citySlug === citySlug &&
        v.paytype === "paypay-voucher"
    )
    .sort(
      (a, b) =>
        new Date(b.applyStartDate).getTime() -
        new Date(a.applyStartDate).getTime()
    );

  const v = matched[0];

  // フォールバック
  if (!v) {
    const title = "商品券キャンペーン情報 - Payキャン";
    const description =
      "自治体のプレミアム商品券（PayPay商品券）の最新情報を紹介します。申込期間・上限・対象者・利用期限などをわかりやすく解説。";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: pageUrl,
        siteName: "Payキャン",
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
    };
  }

  const prefecture = v.prefecture;
  const city = v.city;
  const start = v.applyStartDate;
  const end = v.applyEndDate;

  const ticketAmount = Number(v.ticketAmount ?? 0);
  const purchasePrice = Number(v.purchasePrice ?? 0);
  const maxUnits = Number(v.maxUnits ?? 0);
  const rate = calculateVoucherDiscountRate(ticketAmount, purchasePrice);
  const benefit = Math.max(ticketAmount - purchasePrice, 0) * maxUnits;

  const year = new Date(start || Date.now()).getFullYear();

  // 商品券は PayPay 固定
  const payLabel = "PayPay";

  const title = `${city}の${payLabel}商品券｜最大${rate}%お得【${year}】– Payキャン`;
  const description = `${prefecture}${city}の${payLabel}商品券。申込期間は${formatJP(
    start
  )}〜${formatJP(end)}。最大${benefit.toLocaleString(
    "ja-JP"
  )}円お得（上限${maxUnits}口）。対象者・利用期限などをわかりやすく解説。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      siteName: "Payキャン",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  };
}

/** ページ用 generateMetadata ラッパー */
export async function generateVoucherMetadata({
  params,
}: {
  params: { prefecture: string; city: string; pay: VoucherPaySlug };
}): Promise<Metadata> {
  const { prefecture, city } = params;
  return getVoucherMetadata(prefecture, city, "paypay-voucher");
}
