import type { Metadata } from "next";
import CampaignsContent from "./CampaignsContent";

export const metadata: Metadata = {
  title: "全国のキャッシュレス還元キャンペーン一覧",
  description: "今、獲得できるポイントの総額が分かる。全国のPayPay・auPAY・楽天ペイ・d払い等の還元キャンペーン一覧。",
};

export default function CampaignsPage() {
  return <CampaignsContent />;
}
