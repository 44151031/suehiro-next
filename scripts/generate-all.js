const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

// ts-node経由でTypeScriptファイルを読み込む
require("ts-node").register();
const { campaigns } = require("../src/lib/campaignMaster");
const { PayTypeLabels } = require("../src/lib/payType");

// HTMLテンプレート読み込み
const TEMPLATE_PATH = path.resolve(__dirname, "./templates/template.html");
const templateBase = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// 出力ディレクトリの設定（なければ作成）
const OUTPUT_DIR = path.resolve(__dirname, "../public/images/campaigns/ogp");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch();

  for (const campaign of campaigns) {
    const {
      prefecture,
      city,
      offer,
      prefectureSlug,
      citySlug,
      paytype
    } = campaign;

    // 表示用ラベル（例：PayPay、au PAY）
    const payLabel = PayTypeLabels[paytype] || "Pay";

    // テキストとして画像中央に表示される文言
    const title = `${prefecture}${city}×${payLabel}`;

    // 背景画像のパス（事前に配置されている必要あり）
    const backgroundPath = path.resolve(
      __dirname,
      `../public/images/campaigns/${prefectureSlug}-${citySlug}.jpg`
    );

    // 出力ファイル名（小文字、paytypeはslug）
    const outputFilename = `${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;
    const outputPath = path.resolve(OUTPUT_DIR, outputFilename);

    // 背景画像の存在確認
    if (!fs.existsSync(backgroundPath)) {
      console.warn(`⚠️ 背景画像が見つかりません: ${backgroundPath}`);
      continue;
    }

    // テンプレートへ変数埋め込み
    const html = templateBase
      .replace(/__TITLE__/g, title)
      .replace(/__OFFER__/g, offer)
      .replace(/__IMAGE_PATH__/g, backgroundPath.replace(/\\/g, "/"));

    // 一時HTMLファイル生成
    const tempFile = path.resolve(__dirname, "temp.html");
    fs.writeFileSync(tempFile, html);

    const page = await browser.newPage();
    await page.goto(`file://${tempFile}`, { waitUntil: "networkidle0" });

    // スクリーンショットとしてOGP画像を保存
    await page.screenshot({
      path: outputPath,
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });

    await page.close();
    console.log(`✅ 作成完了: ${outputFilename}`);
  }

  await browser.close();
  fs.unlinkSync(path.resolve(__dirname, "temp.html"));
})();
