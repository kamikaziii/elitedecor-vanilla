/**
 * Image Optimization Script
 *
 * Processes all JPG images in dist/assets/:
 * - Generates WebP and AVIF versions
 * - Creates srcset variants (640w, 960w, 1280w, 1920w)
 * - Skips favicon directory and small images
 * - Uses file-based caching to skip unchanged images
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DIST_ASSETS = path.join(__dirname, '..', 'dist', 'assets');
const SRC_ASSETS = path.join(__dirname, '..', 'src', 'assets');
const CACHE_FILE = path.join(__dirname, '.image-cache.json');
const SIZES = [640, 960, 1280, 1920];
const QUALITY = { jpg: 80, webp: 80, avif: 65 };

// Skip these directories/files (already optimized or special purpose)
const SKIP_PATTERNS = ['favicon', 'og-image.jpg', 'logo.svg'];

// Minimum width to generate srcset variants (skip tiny images)
const MIN_WIDTH_FOR_SRCSET = 800;

let stats = {
  processed: 0,
  skipped: 0,
  cached: 0,
  variants: 0,
  savedBytes: 0
};

// Cache management
let imageCache = {};

async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    imageCache = JSON.parse(data);
  } catch {
    imageCache = {};
  }
}

async function saveCache() {
  await fs.writeFile(CACHE_FILE, JSON.stringify(imageCache, null, 2));
}

async function getFileHash(filePath) {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function getCacheKey(inputPath) {
  // Use relative path from src/assets as cache key for consistency
  return path.relative(DIST_ASSETS, inputPath);
}

function shouldSkip(filePath) {
  // Skip if matches skip patterns
  if (SKIP_PATTERNS.some(pattern => filePath.includes(pattern))) return true;
  // Skip generated srcset variants (files like image-640w.jpg)
  if (/-\d+w\.jpe?g$/i.test(filePath)) return true;
  return false;
}

async function processImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg') return;

  if (shouldSkip(inputPath)) {
    stats.skipped++;
    return;
  }

  const cacheKey = getCacheKey(inputPath);
  const currentHash = await getFileHash(inputPath);
  const dir = path.dirname(inputPath);
  const baseName = path.basename(inputPath, ext);

  // Check cache - skip if unchanged AND output files exist
  if (imageCache[cacheKey] === currentHash) {
    // Verify at least the webp version exists (indicates previous successful build)
    const webpPath = path.join(dir, `${baseName}.webp`);
    try {
      await fs.access(webpPath);
      console.log(`Cached: ${cacheKey}`);
      stats.cached++;
      return;
    } catch {
      // Output files don't exist, need to reprocess
      console.log(`Rebuilding (output missing): ${cacheKey}`);
    }
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalSize = (await fs.stat(inputPath)).size;

    console.log(`Processing: ${path.relative(DIST_ASSETS, inputPath)} (${metadata.width}x${metadata.height})`);

    // Generate full-size WebP
    const webpPath = path.join(dir, `${baseName}.webp`);
    await sharp(inputPath)
      .webp({ quality: QUALITY.webp })
      .toFile(webpPath);
    stats.variants++;

    // Generate full-size AVIF
    const avifPath = path.join(dir, `${baseName}.avif`);
    await sharp(inputPath)
      .avif({ quality: QUALITY.avif })
      .toFile(avifPath);
    stats.variants++;

    // Calculate savings from WebP/AVIF
    const webpSize = (await fs.stat(webpPath)).size;
    const avifSize = (await fs.stat(avifPath)).size;
    stats.savedBytes += originalSize - Math.min(webpSize, avifSize);

    // Generate srcset variants only for large images
    if (metadata.width >= MIN_WIDTH_FOR_SRCSET) {
      for (const width of SIZES) {
        if (metadata.width > width) {
          // JPG variant
          await sharp(inputPath)
            .resize(width)
            .jpeg({ quality: QUALITY.jpg })
            .toFile(path.join(dir, `${baseName}-${width}w.jpg`));
          stats.variants++;

          // WebP variant
          await sharp(inputPath)
            .resize(width)
            .webp({ quality: QUALITY.webp })
            .toFile(path.join(dir, `${baseName}-${width}w.webp`));
          stats.variants++;

          // AVIF variant
          await sharp(inputPath)
            .resize(width)
            .avif({ quality: QUALITY.avif })
            .toFile(path.join(dir, `${baseName}-${width}w.avif`));
          stats.variants++;
        }
      }
    }

    // Update cache after successful processing
    imageCache[cacheKey] = currentHash;
    stats.processed++;
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err.message);
  }
}

async function walkDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip favicon directory entirely
      if (entry.name === 'favicon') {
        console.log(`Skipping directory: ${entry.name}`);
        continue;
      }
      await walkDirectory(fullPath);
    } else if (entry.isFile()) {
      await processImage(fullPath);
    }
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Image Optimization Script');
  console.log('='.repeat(60));
  console.log(`Source: ${DIST_ASSETS}`);
  console.log(`Sizes: ${SIZES.join(', ')}w`);
  console.log(`Quality: JPG ${QUALITY.jpg}, WebP ${QUALITY.webp}, AVIF ${QUALITY.avif}`);
  console.log('='.repeat(60));

  const startTime = Date.now();

  // Load cache from previous builds
  await loadCache();

  try {
    await fs.access(DIST_ASSETS);
  } catch {
    console.error(`Error: dist/assets directory not found. Run 'npm run copy' first.`);
    process.exit(1);
  }

  await walkDirectory(DIST_ASSETS);

  // Save cache for next build
  await saveCache();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const savedMB = (stats.savedBytes / (1024 * 1024)).toFixed(1);

  console.log('='.repeat(60));
  console.log('Summary:');
  console.log(`  Images processed: ${stats.processed}`);
  console.log(`  Images cached: ${stats.cached}`);
  console.log(`  Images skipped: ${stats.skipped}`);
  console.log(`  Variants created: ${stats.variants}`);
  if (stats.savedBytes > 0) {
    console.log(`  Estimated savings: ~${savedMB} MB`);
  }
  console.log(`  Duration: ${duration}s`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
