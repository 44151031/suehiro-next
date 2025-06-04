import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const CSV_FILE = "./data/form-responses.csv";
const OUTPUT_FILE = "./data/fukushima-kitakata-shopDetails.json";

const csv = fs.readFileSync(CSV_FILE, "utf8");
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

const details = records.map((row: any) => ({
  name: row["店舗名"]?.trim(),
  description: row["お店紹介文（150文字以内）"]?.trim(),
  image: row["店舗の写真（1枚）"]?.trim(),
  website: row["ホームページURL"]?.trim(),
  instagram: row["InstagramアカウントURL"]?.trim(),
  x: row["X（旧Twitter）アカウントURL"]?.trim(),
  line: row["LINE公式アカウントURLまたはID"]?.trim(),
}));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(details, null, 2), "utf8");

console.log("✅ shopDetails.json を出力しました:", OUTPUT_FILE);
