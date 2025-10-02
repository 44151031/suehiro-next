import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "public", "data");

// --- 店舗ごとのユニークID (支払いタイプを含めない)
function generateStoreId(fileName: string, shop: any): string {
  const parts = fileName.replace("-shops.json", "").split("-");
  const city = parts[1]; // ex: tokai

  // name / address を文字列に強制変換
  const safeName = String(shop.name ?? "");
  const safeAddress = String(shop.address ?? "");

  // name+address で安定したキーを生成
  const base = safeAddress ? `${safeName}-${safeAddress}` : safeName;

  const hash = crypto.createHash("md5").update(base).digest("hex").slice(0, 6);
  return `${city}-${hash}`;
}

// --- 支払いタイプ別 shopid (storeid + paytype)
function generateShopId(fileName: string, shop: any, storeid: string): string {
  const parts = fileName.replace("-shops.json", "").split("-");
  const paytype = parts[2]; // ex: paypay, dbarai, rakutenpay

  return `${storeid}-${paytype}`;
}

// --- 重複削除（name+address または name が同じなら削除）
function deduplicateShops(shops: any[], fileName: string) {
  const seen = new Set<string>();
  const result: any[] = [];

  for (const shop of shops) {
    const safeName = String(shop.name ?? "");
    const safeAddress = String(shop.address ?? "");
    const key = safeAddress ? `${safeName}-${safeAddress}` : safeName;

    if (seen.has(key)) {
      console.log(
        `⚠️ 重複削除: ${fileName} → "${safeName}${
          safeAddress ? " / " + safeAddress : ""
        }"`
      );
      continue;
    }
    seen.add(key);
    result.push(shop);
  }
  return result;
}

function processFile(filePath: string) {
  const fileName = path.basename(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  for (const genre of Object.keys(data)) {
    let shops = data[genre];
    if (!Array.isArray(shops)) continue;

    // ✅ 重複削除
    shops = deduplicateShops(shops, fileName);

    data[genre] = shops.map((shop: any) => {
      // 既存があれば維持
      if (shop.shopid && shop.storeid) return shop;

      // storeid の生成（支払いタイプを含めない）
      const storeid = shop.storeid ?? generateStoreId(fileName, shop);

      // shopid の生成（storeid + paytype）
      const shopid = shop.shopid ?? generateShopId(fileName, shop, storeid);

      return {
        ...shop,
        storeid,
        shopid,
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
    .filter((f) => f.endsWith("-shops.json")); // すべての対象ファイル

  if (files.length === 0) {
    console.warn("⚠️ 対象ファイルが見つかりませんでした (*-shops.json)");
    return;
  }

  for (const file of files) {
    processFile(path.join(DATA_DIR, file));
  }
}

main();
