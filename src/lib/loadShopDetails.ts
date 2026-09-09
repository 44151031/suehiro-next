import fs from "fs";
import path from "path";
import type { ShopDetail } from "@/hooks/useShopDetails";

export function loadShopDetails(prefecture: string, city: string): Record<string, ShopDetail> {
  const base = path.join(process.cwd(), "public", "data");
  const candidates = [
    path.join(base, "shopsdetails", `${prefecture}-${city}-shops-details.json`),
    path.join(base, `${prefecture}-${city}-shops-detail.json`),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data)
      ? Object.fromEntries(data.filter((item) => item?.shopid).map((item) => [item.shopid, item]))
      : data;
  }
  return {};
}
