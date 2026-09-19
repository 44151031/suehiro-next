import type { VoucherCampaign } from "@/types/voucher";

export function voucherPath(v: VoucherCampaign): string {
  return `/campaigns/${v.prefectureSlug}/${v.citySlug}/${v.paytype}${v.campaignSlug ? `/${v.campaignSlug}` : ""}`;
}

export function voucherAssetKey(v: VoucherCampaign): string {
  return `${v.prefectureSlug}-${v.citySlug}-${v.paytype}${v.campaignSlug ? `-${v.campaignSlug}` : ""}`;
}

export function voucherStatus(v: VoucherCampaign, now = new Date()): string {
  if (new Date(v.useEndDate) < now) return "利用終了";
  if (v.salesStatus === "sold-out") return "完売・利用期間中";
  if (new Date(v.applyStartDate) > now) return "受付開始前";
  if (new Date(v.applyEndDate) < now) return "申込終了・利用期間中";
  return v.applicationMethod === "first-come" ? "販売中" : "申込受付中";
}
