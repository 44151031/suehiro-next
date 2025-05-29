import fs from "fs";
import path from "path";

/**
 * 指定された都道府県・市区町村のジャンル一覧を読み込む
 * @param prefectureSlug 都道府県スラッグ（例: "fukushima"）
 * @param citySlug 市区町村スラッグ（例: "kitakata"）
 * @returns ジャンル名（"飲食", "サービス" など）の配列。ファイルがない場合は空配列。
 */
export function loadGenres(prefectureSlug: string, citySlug: string): string[] {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    `${prefectureSlug}-${citySlug}-shops.json`
  );

  // ファイルが存在しない場合は [] を返す
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // json オブジェクトのキーがジャンル名だと仮定
    return Object.keys(json);
  } catch (error) {
    console.error(`ジャンルJSONの読み込みに失敗しました: ${filePath}`, error);
    return [];
  }
}
