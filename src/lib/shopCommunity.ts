import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { campaigns } from "@/lib/campaignMaster";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import type { PublicShopMessage } from "./shopCommunityValidation";

export const communityTag = "shop-community";
const pilots = new Set(["aichi/ama/paypay", "wakayama/kimino/paypay", "saitama/asaka/paypay", "osaka/tondabayashi/paypay-voucher"]);
export function communityDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Community database is not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function communityScope(pagePath: string) {
  const match = /^\/campaigns\/([a-z-]+)\/([a-z-]+)\/([a-z-]+)$/.exec(pagePath);
  if (!match || !pilots.has(match.slice(1).join("/"))) return null;
  const [, prefecture, city, pay] = match;
  const campaign = campaigns.filter(c => c.prefectureSlug === prefecture && c.citySlug === city && c.paytype === pay).sort((a,b) => b.startDate.localeCompare(a.startDate))[0];
  const voucher = pay === "paypay-voucher" ? voucherCampaignMaster.filter(c => c.prefectureSlug === prefecture && c.citySlug === city).sort((a,b) => b.applyStartDate.localeCompare(a.applyStartDate))[0] : undefined;
  const start = voucher?.applyStartDate ?? campaign?.startDate;
  const end = voucher?.useEndDate ?? campaign?.endDate;
  if (!start || !end) return null;
  return { prefecture, city, pay, pagePath, key: `${pagePath}@${start}`, end: new Date(`${end.slice(0,10)}T23:59:59+09:00`) };
}
export function communityEnabled() {
  return process.env.SHOP_COMMUNITY_ENABLED === "true" && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
const readMessages = unstable_cache(async (key: string): Promise<PublicShopMessage[]> => {
  const { data, error } = await communityDatabase().rpc("public_shop_messages", { p_campaign_key: key });
  if (error) throw new Error("Community messages unavailable");
  return data ?? [];
}, ["public-shop-messages-v1"], { revalidate: 60, tags: [communityTag] });
export async function getCommunity(pagePath: string) {
  const scope = communityScope(pagePath);
  if (!communityEnabled() || !scope || scope.end < new Date()) return null;
  try { return { key: scope.key, pagePath, messages: await readMessages(scope.key) }; }
  catch { return null; } // 未設定・障害時は既存の店舗一覧だけを表示する。
}
