// lib/loadShopList.ts
import fs from "fs";
import path from "path";

export function loadShopList(prefectureSlug: string, citySlug: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    `${prefectureSlug}-${citySlug}-shops.json`
  );

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent) as {
      [category: string]: { name: string; address: string }[];
    };
  } catch {
    return null; // ファイルがない場合はnull返却
  }
}
