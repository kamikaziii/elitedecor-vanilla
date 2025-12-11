/**
 * Generate iOS PWA splash screens for Elite Decor
 * Usage: node scripts/generate-splash.mjs
 *
 * Requires: npm install sharp (or pnpm add sharp)
 */
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Source logo and background color (Elite Decor brand)
const SOURCE_IMAGE = resolve(rootDir, 'src/assets/favicon/icon-512.png');
const BACKGROUND_COLOR = '#000000';

// All iPhone splash screen sizes (portrait only - landscape is buggy on iOS)
// Updated December 2025 - includes iPhone 17 series
const splashScreens = [
  // iPhone 17 Air (420x912 @3x) - NEW 2025
  { width: 1260, height: 2736, viewport: '420x912', ratio: 3, name: 'apple-splash-1260x2736.png' },
  // iPhone 17 Pro Max, 16 Pro Max (440x956 @3x)
  { width: 1320, height: 2868, viewport: '440x956', ratio: 3, name: 'apple-splash-1320x2868.png' },
  // iPhone 17, 17 Pro, 16 Pro (402x874 @3x)
  { width: 1206, height: 2622, viewport: '402x874', ratio: 3, name: 'apple-splash-1206x2622.png' },
  // iPhone 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max (430x932 @3x)
  { width: 1290, height: 2796, viewport: '430x932', ratio: 3, name: 'apple-splash-1290x2796.png' },
  // iPhone 16, 15 Pro, 15, 14 Pro (393x852 @3x)
  { width: 1179, height: 2556, viewport: '393x852', ratio: 3, name: 'apple-splash-1179x2556.png' },
  // iPhone 14, 14 Plus, 13, 13 Pro, 12, 12 Pro (390x844 @3x)
  { width: 1170, height: 2532, viewport: '390x844', ratio: 3, name: 'apple-splash-1170x2532.png' },
  // iPhone 13 Pro Max, 12 Pro Max (428x926 @3x)
  { width: 1284, height: 2778, viewport: '428x926', ratio: 3, name: 'apple-splash-1284x2778.png' },
  // iPhone 13 mini, 12 mini (360x780 @3x)
  { width: 1080, height: 2340, viewport: '360x780', ratio: 3, name: 'apple-splash-1080x2340.png' },
  // iPhone X, XS, 11 Pro (375x812 @3x)
  { width: 1125, height: 2436, viewport: '375x812', ratio: 3, name: 'apple-splash-1125x2436.png' },
  // iPhone 11, XR (414x896 @2x)
  { width: 828, height: 1792, viewport: '414x896', ratio: 2, name: 'apple-splash-828x1792.png' },
  // iPhone 11 Pro Max, XS Max (414x896 @3x)
  { width: 1242, height: 2688, viewport: '414x896', ratio: 3, name: 'apple-splash-1242x2688.png' },
  // iPhone 8 Plus, 7 Plus, 6s Plus (414x736 @3x)
  { width: 1242, height: 2208, viewport: '414x736', ratio: 3, name: 'apple-splash-1242x2208.png' },
  // iPhone SE 2nd/3rd, 8, 7, 6s (375x667 @2x)
  { width: 750, height: 1334, viewport: '375x667', ratio: 2, name: 'apple-splash-750x1334.png' },
];

async function generateSplash({ width, height, name }) {
  const outputPath = resolve(rootDir, 'src/assets/splash', name);

  // Calculate logo size (40% of smallest dimension for good visibility)
  const logoSize = Math.floor(Math.min(width, height) * 0.4);

  // Create background
  const background = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BACKGROUND_COLOR,
    },
  });

  // Resize logo
  const logo = await sharp(SOURCE_IMAGE)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Center the logo
  const left = Math.floor((width - logoSize) / 2);
  const top = Math.floor((height - logoSize) / 2);

  await background
    .composite([{ input: logo, left, top }])
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`✓ Generated ${name} (${width}x${height})`);
}

function generateHtmlTags() {
  console.log('\n<!-- iOS Splash Screens - Add to <head> -->\n');

  for (const { width, height, viewport, ratio, name } of splashScreens) {
    const [vw, vh] = viewport.split('x');
    const media = `(device-width: ${vw}px) and (device-height: ${vh}px) and (-webkit-device-pixel-ratio: ${ratio})`;
    console.log(`<link rel="apple-touch-startup-image" media="${media}" href="/assets/splash/${name}">`);
  }
  console.log('');
}

async function main() {
  console.log('Generating iOS splash screens for Elite Decor...\n');

  // Create output directory
  const { mkdirSync } = await import('node:fs');
  mkdirSync(resolve(rootDir, 'src/assets/splash'), { recursive: true });

  for (const config of splashScreens) {
    await generateSplash(config);
  }

  generateHtmlTags();
  console.log('Done! Copy the HTML tags above to your index.html <head> section.');
}

main().catch(console.error);
