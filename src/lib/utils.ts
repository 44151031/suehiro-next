import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ /lib/utils.ts に追加
export const formatNumber = (num: number) => num.toLocaleString("ja-JP");