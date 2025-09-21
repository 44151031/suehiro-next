export type VoucherCampaign = {
  prefecture: string;
  city: string;
  prefectureSlug: string;
  citySlug: string;
  paytype: string;
  purchasePrice: number;
  ticketAmount: number;
  maxUnits: number;
  applyStartDate: string;
  applyEndDate: string;
  // --- 修正ここから ---
  purchaseEndDate: string;   // ← 追加！
  // --- 修正ここまで ---
  useStartDate?: string;     // 任意にした方が安全（無いケースが多い）
  useEndDate: string;
  resultAnnounceDate?: string; // 抽選方式でない場合は無いので optional に
  officialUrl?: string;
  datePublished: string;
  dateModified?: string;
  campaigntitle: string;
  notice?: string;
  applicationStart?: string;
  applicationEnd?: string;
  target?: string;
  eligiblePersons: string;
  applicationUrl?: string;
  campaign?: string;
  payTypeLabel?: string;
};
