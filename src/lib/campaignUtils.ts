// ✅ /src/lib/campaignUtils.ts

import { Campaign } from "@/types/campaign";

/**
 * ISO形式の日付文字列（例: "2025-06-30"）を日本語形式に変換
 * @param isoDate - ISO 8601 日付文字列
 * @param suffix - "から" または "まで"
 * @param options - 年を省略するかどうか（omitYear: true で省略）
 */
export function formatJapaneseDate(
  dateStr: string,
  label?: "から" | "まで",
  options?: { omitYear?: boolean }
): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const datePart = options?.omitYear
    ? `${month}月${day}日`
    : `${year}年${month}月${day}日`;

  return label ? `${datePart}${label}` : datePart;
}

// 終了していないかどうか
export function isCampaignActive(isoDate: string): boolean {
  const endDate = new Date(isoDate);
  const today = new Date();
  return endDate >= today;
}

// 開催中
export function isNowInCampaignPeriod(startDateStr: string, endDateStr: string): boolean {
  const today = new Date();
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  return start <= today && today <= end;
}

// 終了まで15日以内
export function isEndingSoon(isoDate: string): boolean {
  const endDate = new Date(isoDate);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 15;
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
 * 指定以上の還元率のキャンペーンを取得（デフォルト30%）
 * @param campaigns - キャンペーンデータ一覧
 * @param minPercentage - 最低還元率（デフォルト30）
 */
export function getHighDiscountCampaigns(campaigns: Campaign[], minPercentage = 30) {
  return campaigns.filter(c => Number(c.offer) >= minPercentage);
}

import { prefectures } from "@/lib/prefectures";

/**
 * 2地点間の距離を計算（単位：km）
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球の半径 (km)
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
 * 都道府県 slug から緯度経度を取得
 */
export function getPrefectureCoordinates(slug: string): { lat: number; lng: number } | null {
  const match = prefectures.find((p) => p.slug === slug);
  return match ? { lat: match.lat, lng: match.lng } : null;
}

// キャンペーン詳細ページの画像パスのルール
export function getCampaignImagePath(prefectureSlug: string, citySlug: string): string {
  return `/images/campaigns/${prefectureSlug}-${citySlug}.jpg`;
}

// ✅ /lib/campaignUtils.ts に追加
export function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}