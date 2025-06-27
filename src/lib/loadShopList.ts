// lib/loadShopList.ts
import fs from "fs";
import path from "path";

/**
 * 支払いタイプごとのショップリストJSONを読み込む
 * 
 * @param prefectureSlug - 例: "tokyo"
 * @param citySlug - 例: "shibuya"
 * @param paytype - 例: "paypay", "aupay", "rakutenpay", "dbarai", "aeonpay"
 * @returns 店舗リスト or null（ファイルが存在しない場合）
 */
export function loadShopList(
  prefectureSlug: string,
  citySlug: string,
  paytype: string
) {
  const fileName = `${prefectureSlug}-${citySlug}-${paytype}-shops.json`;
  const filePath = path.join(process.cwd(), "public", "data", fileName);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent) as {
      [category: string]: { name: string; address: string }[];
    };
  } catch {
    return null; // ファイルがない場合はnull返却
  }
}
