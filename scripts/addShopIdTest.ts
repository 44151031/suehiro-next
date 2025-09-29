import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "public", "data");

function generateShopId(fileName: string, shop: any): string {
  const parts = fileName.replace("-shops.json", "").split("-");
  const city = parts[1];      // abu
  const paytype = parts[2];   // paypay
  const base = `${shop.name || ""}-${shop.address || ""}`;
  const hash = crypto.createHash("md5").update(base).digest("hex").slice(0, 6);
  return `${city}-${paytype}-${hash}`;
}

function processFile(filePath: string) {
  const fileName = path.basename(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  // 全ジャンルを走査
  for (const genre of Object.keys(data)) {
    const shops = data[genre];
    if (!Array.isArray(shops)) continue;

    data[genre] = shops.map((shop: any) => {
      if (shop.shopid) return shop;
      return {
        ...shop,
        shopid: generateShopId(fileName, shop),
      };
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Updated: ${fileName}`);
}

function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ ディレクトリが存在しません: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.startsWith("aichi-tokai-") && f.endsWith(".json"));

  if (files.length === 0) {
    console.warn("⚠️ 対象ファイルが見つかりませんでした (aichi-tokai-*.json)");
    return;
  }

  for (const file of files) {
    processFile(path.join(DATA_DIR, file));
  }
}

main();
