// /types/voucher.ts

export type VoucherCampaign = {
  prefecture: string;
  city: string;
  prefectureSlug: string;
  citySlug: string;
  paytype: string;
  ticketUnit: number;
  purchasePrice: number;
  ticketAmount: number;
  maxUnits: number;
  applyStartDate: string;
  applyEndDate: string;
  useStartDate: string;
  useEndDate: string;
  resultAnnounceDate: string;
  officialUrl?: string;
  datePublished: string;
  dateModified?: string;
  campaigntitle: string;
  notice?: string;
};
