// /scripts/updateDateModified.ts
import fs from "fs";
import path from "path";

const SHOPS_DIR = path.resolve("./src/data");
const CAMPAIGN_MASTER_PATH = path.resolve("./src/lib/campaignMasterA.ts");

let campaignText = fs.readFileSync(CAMPAIGN_MASTER_PATH, "utf8");
const files = fs.readdirSync(SHOPS_DIR).filter(f => f.endsWith(".json"));

files.forEach(file => {
  const filePath = path.join(SHOPS_DIR, file);
  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime.toISOString().split("T")[0];

  const match = file.match(/^(.+?)-(.+?)-(.+?)-shops\.json$/);
  if (!match) return;
  const [_, prefecture, city, paytype] = match;

  const entryRegex = new RegExp(
    `{[\\s\\S]*?prefectureSlug:\\s*['"]${prefecture}['"][\\s\\S]*?citySlug:\\s*['"]${city}['"][\\s\\S]*?paytype:\\s*['"]${paytype}['"][\\s\\S]*?datePublished:\\s*['"]\\d{4}-\\d{2}-\\d{2}['"][\\s\\S]*?dateModified:\\s*['"]\\d{4}-\\d{2}-\\d{2}['"][\\s\\S]*?}`,
    "g"
  );

  const entries = [...campaignText.matchAll(entryRegex)];
  if (entries.length === 0) {
    console.warn(`⚠️ Not found: ${prefecture}-${city}-${paytype}`);
    return;
  }

  // 最新のdatePublishedだけ更新
  let newestDate = "";
  let newestEntry = null;
  entries.forEach(entry => {
    const publishedMatch = entry[0].match(/datePublished:\s*['"](\d{4}-\d{2}-\d{2})['"]/);
    if (publishedMatch) {
      const date = publishedMatch[1];
      if (date > newestDate) {
        newestDate = date;
        newestEntry = entry[0];
      }
    }
  });

  if (!newestEntry) return;

  const updatedEntry = newestEntry.replace(
    /(dateModified:\s*['"])\d{4}-\d{2}-\d{2}(['"])/,
    `$1${lastModified}$2`
  );

  campaignText = campaignText.replace(newestEntry, updatedEntry);
  console.log(`✅ Updated ${prefecture}-${city}-${paytype} (latest datePublished: ${newestDate}) → ${lastModified}`);
});

fs.writeFileSync(CAMPAIGN_MASTER_PATH, campaignText, "utf8");
console.log("🎉 All updates complete!");
