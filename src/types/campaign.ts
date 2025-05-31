import type { PayTypeId } from "@/lib/payType";

export type Campaign = {
  paytype: PayTypeId;
  prefectureSlug: string;
  citySlug: string;
  prefecture: string;
  city: string;
  offer: number;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  onepoint: string;  // 1回あたり還元上限 (ポイント数)
  fullpoint: string; // 期間中還元上限 (ポイント数)
  campaigntitle: string;
  isActive?: boolean;
  onepay: number;
  fullpay: number;
  paytime: number;
};

// ✅ 追加型（動的算出値付きキャンペーン型）
export type CampaignWithCalc = Campaign & {
  onepay: number;
  fullpay: number;
  paytime: number;
};