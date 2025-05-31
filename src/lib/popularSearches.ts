// /lib/popularSearches.ts

import type { PayTypeId } from "./payType";

export const popularSearches: {
  prefectureSlug: string;
  citySlug: string;
  label: string;
  paytype?: PayTypeId; // ✅ これを追加
}[] = [
  { prefectureSlug: "tokyo", citySlug: "suginami", label: "東京都 杉並区" },
  { prefectureSlug: "tokyo", citySlug: "nerima", label: "東京都 練馬区" },
];