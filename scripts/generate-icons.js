const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const resourcesDir = path.join(__dirname, '..', 'resources');

async function convertSvgToPng(inputFile, outputFile, size) {
  await sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(outputFile);
  console.log(`Generated: ${path.basename(outputFile)} (${size}x${size})`);
}

async function main() {
  const iconSvg = path.join(resourcesDir, 'icon.svg');
  const splashSvg = path.join(resourcesDir, 'splash.svg');
  const iconPng = path.join(resourcesDir, 'icon.png');
  const splashPng = path.join(resourcesDir, 'splash.png');

  if (!fs.existsSync(iconSvg)) {
    console.error('Missing resources/icon.svg');
    process.exit(1);
  }
  if (!fs.existsSync(splashSvg)) {
    console.error('Missing resources/splash.svg');
    process.exit(1);
  }

  await convertSvgToPng(iconSvg, iconPng, 1024);
  await convertSvgToPng(splashSvg, splashPng, 2732);

  console.log('\nDone! Now run: npx @capacitor/assets generate');
}

main().catch(console.error);
