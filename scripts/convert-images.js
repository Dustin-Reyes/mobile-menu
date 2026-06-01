const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../src/assets');
const pngFiles = fs
  .readdirSync(assetsDir)
  .filter((file) => file.endsWith('.png'));

console.log('Converting PNG assets to WebP...\n');

async function convertToWebP(pngFile) {
  const pngPath = path.join(assetsDir, pngFile);
  const webpPath = path.join(assetsDir, pngFile.replace('.png', '.webp'));

  try {
    await sharp(pngPath)
      .webp({
        quality: 85,
        effort: 4,
        smartSubsample: true,
      })
      .toFile(webpPath);

    const pngStats = fs.statSync(pngPath);
    const webpStats = fs.statSync(webpPath);
    const savings = (
      ((pngStats.size - webpStats.size) / pngStats.size) *
      100
    ).toFixed(1);

    console.log(`✅ ${pngFile}`);
    console.log(`   PNG: ${(pngStats.size / 1024).toFixed(1)}KB`);
    console.log(`   WebP: ${(webpStats.size / 1024).toFixed(1)}KB`);
    console.log(`   Savings: ${savings}%\n`);

    return {
      pngFile,
      pngSize: pngStats.size,
      webpSize: webpStats.size,
      savings,
    };
  } catch (error) {
    console.error(`❌ Error converting ${pngFile}:`, error.message);
    return null;
  }
}

async function convertAll() {
  const results = [];

  for (const pngFile of pngFiles) {
    const result = await convertToWebP(pngFile);
    if (result) results.push(result);
  }

  const totalPngSize = results.reduce((sum, r) => sum + r.pngSize, 0);
  const totalWebpSize = results.reduce((sum, r) => sum + r.webpSize, 0);
  const totalSavings = (
    ((totalPngSize - totalWebpSize) / totalPngSize) *
    100
  ).toFixed(1);

  console.log('📊 Summary:');
  console.log(`Total PNG size: ${(totalPngSize / 1024).toFixed(1)}KB`);
  console.log(`Total WebP size: ${(totalWebpSize / 1024).toFixed(1)}KB`);
  console.log(
    `Total savings: ${totalSavings}% (${((totalPngSize - totalWebpSize) / 1024).toFixed(1)}KB)`,
  );
}

convertAll().catch(console.error);
