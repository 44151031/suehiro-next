//types/campaign.ts
export type PayTypeId = "paypay" | "aupay" | "rakutenpay" | "dbarai";

export type Campaign = {
  paytype: PayTypeId;
  prefectureSlug: string;
  citySlug: string;
  prefecture: string;
  city: string;
  offer: number;
  startDate: string;
  endDate: string;
  onepoint: string;
  fullpoint: string;
  campaigntitle: string;
  lastModified?: string; // ← ✅ これがないと sitemap.ts に波線が出る
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