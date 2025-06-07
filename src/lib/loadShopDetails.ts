// /lib/loadShopDetails.ts
import fs from "fs";
import path from "path";

type ShopDetail = {
  shopid: string;
  description?: string;
  image?: string;
  homepage?: string;
  instagram?: string;
  line?: string;
};

export function loadShopDetails(
  prefectureSlug: string,
  citySlug: string
): Record<string, ShopDetail> | null {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    `${prefectureSlug}-${citySlug}-shops-detail.json`
  );

  if (!fs.existsSync(filePath)) {
    console.warn(`📁 詳細ファイルが見つかりません: ${filePath}`);
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error(`❌ 詳細JSONの読み込み失敗: ${filePath}`, e);
    return null;
  }
}
