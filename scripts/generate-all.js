const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

// ts-node 経由で TypeScript を使用
require("ts-node").register();

// ✅ campaignsA をインポート
const { campaignsA } = require("../src/lib/campaignMasterOgp");
const { PayTypeLabels } = require("../src/lib/payType");

// HTMLテンプレート読み込み
const TEMPLATE_PATH = path.resolve(__dirname, "./templates/template.html");
const templateBase = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// 出力先ディレクトリ（存在しなければ作成）
const OUTPUT_DIR = path.resolve(__dirname, "../public/images/campaigns/ogp");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch();

  for (const campaign of campaignsA) {
    const {
      prefecture,
      city,
      offer,
      prefectureSlug,
      citySlug,
      paytype
    } = campaign;

    const payLabel = PayTypeLabels[paytype] || "Pay";
    const title = `${prefecture}${city}×${payLabel}`;

    const backgroundPath = path.resolve(
      __dirname,
      `../public/images/campaigns/${prefectureSlug}-${citySlug}.webp`
    );

    const outputFilename = `${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;
    const outputPath = path.resolve(OUTPUT_DIR, outputFilename);

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
    console.log(`✅ 作成完了: ${outputFilename}`);

    // 不要なテンポラリファイルを削除
    try {
      fs.unlinkSync(tempFile);
    } catch (e) {
      console.warn(`⚠️ 一時HTMLファイル削除に失敗しました: ${e.message}`);
    }
  }

  await browser.close();
})();
