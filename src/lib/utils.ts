import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日本語日付フォーマット
export function formatJapaneseDate(dateString: string, suffix: "から" | "まで") {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日${suffix}`;
}

// キャンペーン期間判定
export function isCampaignActive(endDate: string): boolean {
  const today = new Date();
  const end = new Date(endDate);
  return end >= today;
}