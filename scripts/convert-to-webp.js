// scripts/convert-to-webp.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "../public/images/campaigns");
const outputDir = inputDir; // 上書き or 別フォルダでもOK

fs.readdirSync(inputDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);

  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `${base}.webp`);

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ Converted: ${file} → ${base}.webp`);
      })
      .catch((err) => {
        console.error(`❌ Failed: ${file}`, err);
      });
  }
});
