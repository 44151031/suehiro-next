// /app/campaigns/[prefecture]/[city]/[pay]/page.tsx
// ✅ 開催中・終了済み・商品券ページの自動切り替え対応版

import type { Metadata } from "next";
import StandardCampaignPage from "./StandardCampaignPage";
import VoucherCampaignPage from "./VoucherCampaignPage";
import EndedCampaignPage from "./EndedCampaignPage"; // ← 追加

// ✅ メタデータ生成をここで分岐（voucher・終了済みを含む）
import { getVoucherMetadata } from "@/lib/voucherMetadateGenerators";
import { getPaytypeMetadata } from "@/lib/metadataGenerators";
import { campaigns } from "@/lib/campaignMaster";

type Props = {
  params: {
    prefecture: string;
    city: string;
    pay: string;
  };
};

// ✅ generateMetadata：paypay-voucher のみ別処理
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { prefecture, city, pay } = params;

  if (pay === "paypay-voucher") {
    return getVoucherMetadata(prefecture, city, "paypay-voucher");
  }

  // 通常ペイ系のメタデータ生成
  return getPaytypeMetadata(prefecture, city, pay);
}

// ✅ 開催状況に応じてページを自動切り替え
export default function Page({ params }: Props) {
  const { prefecture, city, pay } = params;

  // 商品券（Voucher）の場合
  if (pay === "paypay-voucher") {
    return <VoucherCampaignPage params={params} />;
  }

  // キャンペーンデータを抽出（終了判定に使用）
  const campaign = campaigns
    .filter(
      (c) =>
        c.prefectureSlug === prefecture &&
        c.citySlug === city &&
        c.paytype === pay
    )
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];

  // データが存在しない場合は404
  if (!campaign) {
    return <StandardCampaignPage params={params} />;
  }

  // ✅ 終了判定
  const now = new Date();
  const end = new Date(campaign.endDate);

  // 終了日を過ぎていれば EndedCampaignPage に切り替え
  if (end < now) {
    return <EndedCampaignPage params={params} />;
  }

  // 開催中は通常ページを表示
  return <StandardCampaignPage params={params} />;
}
