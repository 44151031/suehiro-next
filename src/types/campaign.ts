import type { PayTypeId } from "@/lib/payType";

// ベース型
export type Campaign = {
  paytype: PayTypeId;
  prefectureSlug: string;
  citySlug: string;
  prefecture: string;
  city: string;
  offer: number;
  startDate: string;        // "YYYY-MM-DD"
  endDate: string;          // "YYYY-MM-DD"
  onepoint: string;         // 1回あたり還元上限 (ポイント数、文字列で定義)
  fullpoint: string;        // 期間中還元上限 (ポイント数、文字列で定義)
  campaigntitle: string;    // キャンペーンのタイトル
  isActive?: boolean;       // 動的に付加される可能性のあるフラグ
};

// 動的算出値付き型（必要に応じて拡張用途に使用）
export type CampaignWithCalc = Campaign & {
  // 今後 `還元ポイント`, `達成率` など算出用プロパティを加えるならここで管理
  // 例:
  // estimatedReturn: number;
};

export type MetadataContext = {
  prefecture?: string;
  city?: string;
};