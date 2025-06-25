import { Campaign } from "@/types/campaign";
import { prefectures } from "@/lib/prefectures";

/**
 * ISO形式の日付文字列（例: "2025-06-30"）を日本語形式に変換
 * @param dateStr - ISO 8601 日付文字列
 * @param options - omitYear: trueで年を省略
 */
export function formatJapaneseDate(
  dateStr: string,
  options?: { omitYear?: boolean }
): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return options?.omitYear
    ? `${month}月${day}日`
    : `${year}年${month}月${day}日`;
}

/**
 * 数値フォーマット（カンマ区切り）
 */
export function formatNumber(value: number | string): string {
  return Number(value).toLocaleString("ja-JP");
}

/**
 * 開催ステータス型定義
 */
export type CampaignStatus = "scheduled" | "active" | "ended";

/**
 * 開催ステータスの判定（開催前 / 開催中 / 終了）
 */
export function getCampaignStatus(start: string, end: string): CampaignStatus {
  const now = new Date();

  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T23:59:59`);

  if (now < startDate) {
    return "scheduled";
  } else if (now > endDate) {
    return "ended";
  } else {
    return "active";
  }
}

/**
 * 終了まで15日以内かどうか
 */
export function isEndingSoon(isoDate: string): boolean {
  const endDate = new Date(isoDate);
  endDate.setHours(23, 59, 59, 999); // 終了日の終わりまで含める

  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 15;
}

/**
 * 指定されたステータスのキャンペーンを抽出
 */
export function filterCampaignsByStatus(
  campaigns: Campaign[],
  status: CampaignStatus
): Campaign[] {
  return campaigns.filter(
    (c) => getCampaignStatus(c.startDate, c.endDate) === status
  );
}

/**
 * 都道府県 slug に基づく終了していないキャンペーン一覧
 */
export function getActiveCampaignsByPrefecture(
  prefectureSlug: string,
  campaigns: Campaign[]
): Campaign[] {
  return campaigns
    .filter((c) => c.prefectureSlug === prefectureSlug)
    .filter((c) => getCampaignStatus(c.startDate, c.endDate) !== "ended");
}

/**
 * 指定還元率以上のキャンペーンを取得（デフォルト30%）
 */
export function getHighDiscountCampaigns(
  campaigns: Campaign[],
  minPercentage = 30
): Campaign[] {
  return campaigns.filter((c) => Number(c.offer) >= minPercentage);
}

/**
 * 都道府県 slug から緯度経度を取得
 */
export function getPrefectureCoordinates(
  slug: string
): { lat: number; lng: number } | null {
  const match = prefectures.find((p) => p.slug === slug);
  return match ? { lat: match.lat, lng: match.lng } : null;
}

/**
 * 2地点間の距離を計算（km）
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * キャンペーン画像パス
 */
export function getCampaignImagePath(
  prefectureSlug: string,
  citySlug: string
): string {
  return `/images/campaigns/${prefectureSlug}-${citySlug}.webp`;
}
