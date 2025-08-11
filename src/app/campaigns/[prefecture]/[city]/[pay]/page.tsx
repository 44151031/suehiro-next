// /app/campaigns/[prefecture]/[city]/[pay]/page.tsx

import type { Metadata } from "next";
import StandardCampaignPage from "./StandardCampaignPage";
import VoucherCampaignPage from "./VoucherCampaignPage";

// ✅ メタデータ生成をここで分岐（voucher は専用ロジック）
import { getVoucherMetadata } from "@/lib/voucherMetadateGenerators";
import { getPaytypeMetadata } from "@/lib/metadataGenerators";

type Props = {
  params: {
    prefecture: string;
    city: string;
    pay: string;
  };
};

// ✅ voucher 用と通常用で generateMetadata を切り替え
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { prefecture, city, pay } = params;

  if (pay === "paypay-voucher") {
    return getVoucherMetadata(prefecture, city, "paypay-voucher");
  }

  // 通常（PayPay/auPAY/楽天ペイ/d払い等）
  return getPaytypeMetadata(prefecture, city, pay);
}

export default function Page({ params }: Props) {
  const { pay } = params;

  if (pay === "paypay-voucher") {
    return <VoucherCampaignPage params={params} />;
  }

  return <StandardCampaignPage params={params} />;
}
