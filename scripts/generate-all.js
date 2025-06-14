const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

// ▼ TypeScriptファイルのデータを読み込むために require-hook を使う
require('ts-node').register(); // 必須：tsを動的に解釈する

const { campaigns } = require("../src/lib/campaignMaster");

// ▼ HTMLテンプレートのパス
const TEMPLATE_PATH = path.resolve(__dirname, "./templates/template.html");
const templateBase = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// ▼ OGP出力先のディレクトリ
const OUTPUT_DIR = path.resolve(__dirname, "../public/images/campaigns/ogp");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch();

  for (const campaign of campaigns) {
    const { prefecture, city, offer, prefectureSlug, citySlug } = campaign;
    const title = `${prefecture}${city}×PayPay`;

    const backgroundPath = path.resolve(
      __dirname,
      `../public/images/campaigns/${prefectureSlug}-${citySlug}.jpg`
    );

    const outputPath = path.resolve(
      OUTPUT_DIR,
      `${prefectureSlug}-${citySlug}-ogp.jpg`
    );

    if (!fs.existsSync(backgroundPath)) {
      console.warn(`⚠️ 背景画像が見つかりません: ${backgroundPath}`);
      continue;
    }

    const html = templateBase
      .replace(/__TITLE__/g, title)
      .replace(/__OFFER__/g, offer)
      .replace(/__IMAGE_PATH__/g, backgroundPath.replace(/\\/g, "/"));

    const tempFile = path.resolve(__dirname, "temp.html");
    fs.writeFileSync(tempFile, html);

    const page = await browser.newPage();
    await page.goto(`file://${tempFile}`, { waitUntil: "networkidle0" });

    await page.screenshot({
      path: outputPath,
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });

    await page.close();
    console.log(`✅ 作成完了: ${outputPath}`);
  }

  await browser.close();
  fs.unlinkSync(path.resolve(__dirname, "temp.html"));
})();
