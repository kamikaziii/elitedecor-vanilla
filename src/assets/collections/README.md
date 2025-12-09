# Collections - Image Guidelines

Documentation for managing collection images in the Elite Decor website.

## Directory Structure

```
collections/
├── noble/              # Noble Collection
│   ├── hero.jpg        # Card thumbnail (required)
│   ├── noble-1.jpg     # Gallery image 1
│   ├── noble-2.jpg     # Gallery image 2
│   └── ...             # Additional images
└── essense/            # Essense Collection
    ├── hero.jpg        # Card thumbnail (required)
    ├── essense-1.jpg   # Gallery image 1
    └── ...             # Additional images
```

## Image Requirements

### File Naming

**Required files**:
- `hero.jpg` - Card thumbnail displayed in the main gallery grid

**Gallery images**:
- `{collection-name}-{number}.jpg` - Sequential numbering (1, 2, 3...)
- Example: `noble-1.jpg`, `noble-2.jpg`, `noble-13.jpg`

### Image Specifications

| Type | Dimensions | File Size | Format |
|------|------------|-----------|--------|
| Hero | 1200x800px (3:2 ratio) | < 300KB | JPG |
| Gallery | 1920x1280px (3:2 ratio) | < 500KB | JPG |

**Notes**:
- Use 3:2 aspect ratio for consistency
- Optimize images before upload (TinyPNG, ImageOptim, etc.)
- JPG quality: 80-85% for good balance of quality/size
- Use descriptive alt text when adding to HTML

### Image Optimization

**Recommended tools**:
- [TinyPNG](https://tinypng.com/) - Online compression
- [ImageOptim](https://imageoptim.com/) - Mac app
- [Squoosh](https://squoosh.app/) - Browser-based

**Command line** (ImageMagick):
```bash
# Resize and optimize
convert input.jpg -resize 1920x1280^ -gravity center -extent 1920x1280 -quality 85 output.jpg
```

## Current Collections

### Noble Collection
- **Directory**: `collections/noble/`
- **Images**: 13 gallery images + 1 hero
- **Year**: 2022
- **Materials**: Wood, Metal
- **Description**: Modern design celebrating simplicity and sophistication

**Files**:
```
hero.jpg
noble-1.jpg through noble-13.jpg
```

### Essense Collection
- **Directory**: `collections/essense/`
- **Images**: 5 gallery images + 1 hero
- **Year**: 2022
- **Materials**: Wood, Metal
- **Description**: Harmony between pure forms and intelligent functionality

**Files**:
```
hero.jpg
essense-1.jpg through essense-5.jpg
```

## Adding Images to Existing Collection

### Step 1: Prepare Images

1. **Resize** to 1920x1280px (3:2 ratio)
2. **Optimize** to < 500KB per image
3. **Rename** following convention: `{collection}-{next-number}.jpg`

### Step 2: Add to Directory

```bash
# Navigate to collection directory
cd src/assets/collections/{collection-name}/

# Copy new images
cp ~/Downloads/new-image-1.jpg ./{collection-name}-{n}.jpg
cp ~/Downloads/new-image-2.jpg ./{collection-name}-{n+1}.jpg
```

### Step 3: Update HTML

Add images to the gallery track in all language versions:
- `src/index.html`
- `src/pt/index.html`
- `src/ru/index.html`

```html
<!-- Find the collection's .cm-gallery-section__track -->
<div class="cm-gallery-section__track">
  <!-- Existing images... -->

  <!-- Add new images -->
  <div class="cm-gallery-section__item">
    <img src="assets/collections/{collection-name}/{collection-name}-{n}.jpg"
         alt="{Collection Name} {n}"
         loading="lazy">
  </div>
</div>
```

### Step 4: Update Image Count

Update the "Pieces" count in `.cm-info__details`:

```html
<div class="cm-info__detail">
  <div class="cm-info__detail-label">Pieces</div>
  <div class="cm-info__detail-value">{new total} Items</div>
</div>
```

## Creating a New Collection

### Step 1: Create Directory

```bash
mkdir src/assets/collections/{collection-name}
```

### Step 2: Add Images

1. Add `hero.jpg` (card thumbnail)
2. Add gallery images: `{collection-name}-1.jpg`, `{collection-name}-2.jpg`, etc.

### Step 3: Update HTML

See main README (`src/README.md`) for complete instructions on adding collection cards and views.

## Image Best Practices

### Photography Guidelines

1. **Lighting**: Consistent, well-lit photos
2. **Background**: Clean, neutral backgrounds
3. **Angle**: Multiple angles showing different perspectives
4. **Detail shots**: Include close-ups of materials and craftsmanship
5. **Context**: Show furniture in realistic room settings when possible

### File Organization

```
✅ Good:
- noble-1.jpg, noble-2.jpg, noble-3.jpg
- hero.jpg (standardized name)
- Consistent numbering

❌ Bad:
- IMG_1234.jpg (non-descriptive)
- noble_final_v2.jpg (unclear versioning)
- hero-noble.jpg (inconsistent naming)
```

### Alt Text Guidelines

When adding images to HTML, use descriptive alt text:

```html
<!-- ✅ Good -->
<img src="noble-5.jpg" alt="Noble Collection dining table with walnut finish">

<!-- ❌ Bad -->
<img src="noble-5.jpg" alt="Image 5">
```

## Image Loading Strategy

### Lazy Loading

All gallery images use `loading="lazy"` attribute:

```html
<img src="assets/collections/noble/noble-1.jpg" alt="..." loading="lazy">
```

**Exception**: Hero section images use `loading="eager"`:

```html
<img src="hero-image.jpg" alt="..." loading="eager">
```

### Hero Images

Hero images in the main hero slideshow use priority loading:

```html
<div class="hero-slide active">
  <img src="..." alt="..." loading="eager">
</div>
<div class="hero-slide">
  <img src="..." alt="..." loading="lazy">
</div>
```

## Troubleshooting

### Images Not Displaying

**Check**:
1. File exists in correct directory
2. File name matches HTML reference exactly (case-sensitive)
3. Image path is correct relative to HTML file
4. For `/pt/` and `/ru/` pages, use `../assets/collections/...`

### Large File Sizes

**Solutions**:
1. Use JPG instead of PNG for photos
2. Compress with TinyPNG or ImageOptim
3. Resize to recommended dimensions (1920x1280px)
4. Reduce JPG quality to 80-85%

### Inconsistent Aspect Ratios

**Fix**:
```bash
# Crop to 3:2 aspect ratio (1920x1280)
convert input.jpg -resize 1920x1280^ -gravity center -extent 1920x1280 output.jpg
```

## Maintenance

### Regular Tasks

- [ ] Check for broken image links
- [ ] Optimize new images before upload
- [ ] Update alt text for accessibility
- [ ] Verify image counts match HTML
- [ ] Remove unused images to save space

### Image Audit Checklist

```bash
# List all collection images
find . -name "*.jpg" -o -name "*.png"

# Check file sizes
find . -name "*.jpg" -exec ls -lh {} \; | awk '{print $5, $9}'

# Find large images (> 1MB)
find . -name "*.jpg" -size +1M
```

## Version Control

### Git Best Practices

**Add images**:
```bash
git add src/assets/collections/{collection-name}/
git commit -m "Add {collection-name} collection images"
```

**Optimize before commit**:
```bash
# Optimize all JPGs in a directory
for img in *.jpg; do
  convert "$img" -quality 85 "optimized_$img"
done
```

### .gitignore Exceptions

Images are tracked in Git. Do NOT add to `.gitignore`:
```
# ❌ Don't ignore
src/assets/collections/**/*.jpg
```

## Contact

For questions about image requirements or collection management:
- Email: geral@elitedecor.pt
- Phone: +351 917 591 176
