// lib/popularSearches.ts

import { campaigns } from "./campaignMaster";

// 人気検索ワード（日本語）
const rawPopularSearches = [
  "神奈川県相模原市",
  "東京都練馬区",
  "大阪府大東市",
  "千葉県袖ケ浦市",
  "東京都杉並区",
  "東京都大田区",
  "愛知県あま市",
] as const;

// 都道府県・市区町村を抽出
const extractPrefectureAndCity = (label: string) => {
  const prefectureMatch = label.match(/^(.+?[都道府県])/);
  const cityMatch = label.match(/[都道府県](.+?[市区町村])$/);
  return {
    prefecture: prefectureMatch?.[1] || "",
    city: cityMatch?.[1] || "",
  };
};

// campaignMasterからslugを逆引き
const findSlugs = (prefecture: string, city: string) => {
  // prefectureSlug
  const prefectureEntry = campaigns.find(
    (c) => c.prefecture === prefecture
  );
  const prefectureSlug = prefectureEntry?.prefectureSlug || "";

  // citySlug
  const cityEntry = campaigns.find(
    (c) => c.prefecture === prefecture && c.city === city
  );
  const citySlug = cityEntry?.citySlug || "";

  return { prefectureSlug, citySlug };
};

export const popularSearches = rawPopularSearches.map((label) => {
  const { prefecture, city } = extractPrefectureAndCity(label);
  const { prefectureSlug, citySlug } = findSlugs(prefecture, city);

  return {
    label,
    prefecture,
    city,
    prefectureSlug,
    citySlug,
    // 英語slugでURLを生成
    url: `/campaigns/${prefectureSlug}/${citySlug}`,
  };
});
