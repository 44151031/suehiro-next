// /src/lib/loadShopList.ts
// ✅ 完全刷新版：fetch を廃止し fs 読み込みに統一
//    - Egress 0
//    - 即時反映
//    - Vercel / Dev 両対応
//    - JSON 構造自動判別

import fs from "fs/promises";
import path from "path";

export async function loadShopList(
  prefectureSlug: string,
  citySlug: string,
  paytype: string
): Promise<Record<string, { name: string; address?: string }[]>> {
  try {
    // 📌 public/data 内の JSON を直接読む
    const fileName = `${prefectureSlug}-${citySlug}-${paytype}-shops.json`;

    const jsonPath = path.join(
      process.cwd(),
      "public",
      "data",
      fileName
    );

    // Dev のみログ表示
    if (process.env.NODE_ENV === "development") {
      console.log(`📘 [loadShopList] reading local file: ${jsonPath}`);
    }

    // JSON を直接読み込む（fetch より高速 & キャッシュ問題ゼロ）
    const rawText = await fs.readFile(jsonPath, "utf8");
    const raw = JSON.parse(rawText);

    let result: Record<string, { name: string; address?: string }[]> = {};

    // 📌 JSON 構造を自動判定
    if (Array.isArray(raw)) {
      // 単配列 → "全て"にまとめる
      result["全て"] = raw.filter((x) => x && x.name);
    } else if (typeof raw === "object" && raw !== null) {
      // ジャンル別構造
      for (const key of Object.keys(raw)) {
        const arr = raw[key];
        if (Array.isArray(arr)) {
          result[key] = arr.filter((x) => x && x.name);
        }
      }
    } else {
      console.warn("⚠ JSONの形式が想定外です:", raw);
      return {};
    }

    return result;
  } catch (err: any) {
    console.warn(
      `⚠ 店舗JSONが存在しません: public/data/${prefectureSlug}-${citySlug}-${paytype}-shops.json`
    );
    return {};
  }
}
