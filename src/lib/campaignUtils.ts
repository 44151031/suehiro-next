// ✅ /src/lib/campaignUtils.ts
import { Campaign } from "@/types/campaign"; // ✅ 型をインポート


/**
 * 日付文字列を Date オブジェクトに変換するユーティリティ
 * @param text - 例: "2025年6月30日"
 */
export function parseDate(text: string): Date | null {
  const match = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return null;
  const [_, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * 終了まで15日以内か判定
 * @param endDateText - 日付文字列（例: "2025年6月30日"）
 */
export function isEndingSoon(endDateText: string): boolean {
  const endDate = parseDate(endDateText);
  if (!endDate) return false;
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 15;
}
/**
 * キャンペーンが現在有効かどうかを判定
 * @param endDateText - 例: "2025年6月30日"
 */
export function isCampaignActive(endDateText: string): boolean {
  const endDate = parseDate(endDateText);
  if (!endDate) return true; // 日付不明なら表示する
  const today = new Date();
  return endDate >= today;
}

/**
 * 指定された都道府県Slugに基づき、終了していないキャンペーン一覧を取得
 * @param prefectureSlug - 例: "tokyo"
 * @param campaigns - キャンペーンデータ一覧
 */
export function getActiveCampaignsByPrefecture(prefectureSlug: string, campaigns: Campaign[]) {
  return campaigns
    .filter(c => c.prefectureSlug === prefectureSlug)
    .filter(c => isCampaignActive(c.endDate));
}

/**
 * 数値部分だけを抽出して数値化
 * @param text - 例: "最大30%還元"
 */
export function extractPercentage(text: string): number {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * 指定以上の還元率のキャンペーンを取得（デフォルト30%）
 * @param campaigns - キャンペーンデータ一覧
 * @param minPercentage - 最低還元率（デフォルト30）
 */
export function getHighDiscountCampaigns(campaigns: Campaign[], minPercentage = 30) {
  return campaigns.filter(c => extractPercentage(c.offer) >= minPercentage);
}