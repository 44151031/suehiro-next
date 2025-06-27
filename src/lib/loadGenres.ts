// lib/loadGenres.ts
import fs from "fs";
import path from "path";

/**
 * 指定された都道府県・市区町村・支払いタイプのジャンル一覧を読み込む
 */
export function loadGenres(prefectureSlug: string, citySlug: string, paytype: string): string[] {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    `${prefectureSlug}-${citySlug}-${paytype}-shops.json`
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Object.keys(json);
  } catch (error) {
    console.error(`ジャンルJSONの読み込みに失敗しました: ${filePath}`, error);
    return [];
  }
}
