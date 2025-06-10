import type { Metadata } from "next";
import CampaignsArchiveContent from "./CampaignsArchiveContent";

export const metadata: Metadata = {
  title: "終了済みキャッシュレス還元キャンペーン一覧（アーカイブ）",
  description:
    "再開を待つ全国のPayPay・au PAY・楽天ペイ・d払い等のキャッシュレス還元キャンペーン一覧。過去の実績を参考に、次回開催の傾向をチェック。",
};

export default function CampaignsArchivePage() {
  return <CampaignsArchiveContent />;
}
