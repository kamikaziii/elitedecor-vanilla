/**
 * HTML Image Transformation Script
 *
 * Transforms <img> tags to <picture> elements with:
 * - AVIF source (best compression)
 * - WebP source (wide support)
 * - JPG fallback with srcset
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const HTML_FILES = [
  path.join(DIST_DIR, 'index.html'),
  path.join(DIST_DIR, 'en', 'index.html'),
  path.join(DIST_DIR, 'ru', 'index.html')
];

const SIZES = [640, 960, 1280, 1920];

// Skip these images (SVG, special purpose, or already small)
const SKIP_PATTERNS = ['logo.svg', 'og-image', 'favicon', 'icon-'];

// Cache for image metadata
const metadataCache = new Map();

async function getImageMetadata(imagePath) {
  // Normalize path (handle ../assets/ vs assets/)
  const normalizedPath = imagePath.replace(/^\.\.\//, '');
  const cacheKey = normalizedPath;

  if (metadataCache.has(cacheKey)) {
    return metadataCache.get(cacheKey);
  }

  try {
    const fullPath = path.join(DIST_DIR, normalizedPath);
    const metadata = await sharp(fullPath).metadata();
    metadataCache.set(cacheKey, metadata);
    return metadata;
  } catch {
    return null;
  }
}

function shouldSkip(src) {
  if (!src) return true;
  if (src.startsWith('http')) return true;
  if (!src.match(/\.(jpg|jpeg)$/i)) return true;
  return SKIP_PATTERNS.some(pattern => src.includes(pattern));
}

async function generatePictureElement(src, alt, loading, fetchpriority, className) {
  const metadata = await getImageMetadata(src);
  if (!metadata) {
    console.warn(`  Warning: Could not read metadata for ${src}`);
    return null;
  }

  // Keep the original path prefix (../ or not)
  const basePath = src.replace(/\.(jpg|jpeg)$/i, '');
  const originalWidth = metadata.width;

  // Determine which srcset sizes are available (only sizes smaller than original)
  const availableSizes = SIZES.filter(s => s < originalWidth);

  // Build srcset strings
  const buildSrcset = (ext) => {
    const parts = availableSizes.map(w => `${basePath}-${w}w.${ext} ${w}w`);
    parts.push(`${basePath}.${ext} ${originalWidth}w`);
    return parts.join(', ');
  };

  const buildJpgSrcset = () => {
    const parts = availableSizes.map(w => `${basePath}-${w}w.jpg ${w}w`);
    parts.push(`${src} ${originalWidth}w`);
    return parts.join(', ');
  };

  // Build attributes
  const loadingAttr = loading ? ` loading="${loading}"` : '';
  const priorityAttr = fetchpriority ? ` fetchpriority="${fetchpriority}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  const altAttr = alt ? alt.replace(/"/g, '&quot;') : '';
  // Add decoding="async" for non-high-priority images (better rendering performance)
  const decodingAttr = fetchpriority === 'high' ? '' : ' decoding="async"';
  // Add width/height to prevent CLS (Core Web Vitals)
  const widthAttr = ` width="${metadata.width}"`;
  const heightAttr = ` height="${metadata.height}"`;

  // Determine sizes attribute based on context
  // Default to 100vw, could be smarter based on class
  const sizesAttr = '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw';

  return `<picture>
  <source type="image/avif" srcset="${buildSrcset('avif')}" sizes="${sizesAttr}">
  <source type="image/webp" srcset="${buildSrcset('webp')}" sizes="${sizesAttr}">
  <img src="${src}" srcset="${buildJpgSrcset()}" sizes="${sizesAttr}" alt="${altAttr}"${widthAttr}${heightAttr}${classAttr}${loadingAttr}${priorityAttr}${decodingAttr}>
</picture>`;
}

async function processHtmlFile(filePath) {
  console.log(`Processing: ${path.relative(DIST_DIR, filePath)}`);

  let html = await fs.readFile(filePath, 'utf-8');
  let replacements = 0;

  // Match img tags with local JPG/JPEG sources
  // This regex captures the full img tag and its attributes
  // Handles both "assets/" and "../assets/" paths
  const imgRegex = /<img\s+([^>]*?)src="((?:\.\.\/)?assets\/[^"]+\.jpe?g)"([^>]*?)>/gi;

  const matches = [...html.matchAll(imgRegex)];

  for (const match of matches) {
    const fullMatch = match[0];
    const beforeSrc = match[1] || '';
    const src = match[2];
    const afterSrc = match[3] || '';

    if (shouldSkip(src)) {
      continue;
    }

    // Extract attributes from before and after src
    const allAttrs = beforeSrc + afterSrc;

    const altMatch = allAttrs.match(/alt="([^"]*)"/);
    const loadingMatch = allAttrs.match(/loading="([^"]*)"/);
    const priorityMatch = allAttrs.match(/fetchpriority="([^"]*)"/);
    const classMatch = allAttrs.match(/class="([^"]*)"/);

    const alt = altMatch ? altMatch[1] : '';
    const loading = loadingMatch ? loadingMatch[1] : null;
    const fetchpriority = priorityMatch ? priorityMatch[1] : null;
    const className = classMatch ? classMatch[1] : null;

    const pictureElement = await generatePictureElement(src, alt, loading, fetchpriority, className);

    if (pictureElement) {
      // Use replaceAll to handle duplicate img tags correctly
      html = html.replaceAll(fullMatch, pictureElement);
      replacements++;
    }
  }

  await fs.writeFile(filePath, html);
  console.log(`  Replaced ${replacements} images with <picture> elements`);

  return replacements;
}

async function main() {
  console.log('='.repeat(60));
  console.log('HTML Image Transformation Script');
  console.log('='.repeat(60));

  let totalReplacements = 0;

  for (const file of HTML_FILES) {
    try {
      await fs.access(file);
      totalReplacements += await processHtmlFile(file);
    } catch {
      console.warn(`Warning: ${file} not found, skipping`);
    }
  }

  console.log('='.repeat(60));
  console.log(`Total images transformed: ${totalReplacements}`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
