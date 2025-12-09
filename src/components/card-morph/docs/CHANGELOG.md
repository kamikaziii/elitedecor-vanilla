# Changelog

All notable changes to Card Morph Gallery will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-12-09

### Added

#### Core Features
- **Card Morph Gallery** - Main component with card-to-view morphing
- **GSAP Integration** - Smooth animations powered by GSAP
- **Card Stacking Effect** - Scroll-triggered card stacking with ScrollTrigger
- **Draggable Gallery** - Horizontal draggable gallery with momentum
- **Keyboard Navigation** - Full keyboard support (arrows, escape)
- **Touch Gestures** - Swipe support for mobile devices
- **Touchpad Support** - Horizontal scroll with trackpad gestures

#### Lightbox
- **Modern Lightbox** - Built with native `<dialog>` element
- **GSAP Animations** - Smooth open/close/transition animations
- **Image Preloading** - Preloads adjacent images for smooth navigation
- **Touch Swipe** - Swipe left/right to navigate images
- **Keyboard Navigation** - Arrow keys and escape to close
- **Click Outside to Close** - Click overlay or empty area to close
- **Counter Display** - Shows current position (e.g., "3 / 13")
- **Focus Management** - Returns focus to trigger element on close

#### Accessibility
- **ARIA Labels** - Proper labeling for all interactive elements
- **Focus Management** - Focus trapping in lightbox, focus restoration
- **Screen Reader Announcements** - State changes announced via aria-live
- **Keyboard Navigation** - All features accessible via keyboard
- **Reduced Motion Support** - Respects `prefers-reduced-motion`

#### Theming
- **40+ CSS Custom Properties** - Complete control over appearance
- **Dark Theme** - Default dark theme
- **Light Theme** - Built-in light theme modifier
- **BEM Naming** - Scoped styles with `cm-` prefix

#### Developer Experience
- **UMD + ES Module Support** - Works with bundlers or script tags
- **Auto-Detection** - Automatically detects global dependencies
- **Manual Registration** - Register dependencies for ES modules
- **Auto-Initialization** - Optional MutationObserver for dynamic content
- **Event System** - Custom events for all lifecycle moments
- **Callback Options** - onInit, onOpen, onClose, onDestroy
- **Instance Management** - getInstance, getInstances, destroyAll
- **Data Attributes** - Configure via HTML attributes

### Dependencies

#### Required
- GSAP 3.x

#### Optional (Recommended)
- GSAP ScrollTrigger - For card stacking effect
- GSAP Draggable - For gallery drag functionality
- GSAP Flip - For advanced morph animations
- Lenis - For smooth scroll experience

---

## [Unreleased]

### Planned Features
- NPM package distribution
- Minified build (`card-morph.min.js`)
- Source maps for debugging
- More example files (custom theme, dynamic content)
- Image zoom functionality in lightbox
- Video support in gallery
- Infinite scroll option for gallery
- RTL (right-to-left) support

### Under Consideration
- React wrapper component
- Vue wrapper component
- Svelte wrapper component
- TypeScript source rewrite
- CSS-in-JS alternative

---

## Migration Guides

### From Custom Implementation

If migrating from a custom card gallery implementation:

1. **Replace HTML Structure**
   ```html
   <!-- Old -->
   <div class="gallery">
     <div class="card" data-id="1">...</div>
   </div>

   <!-- New -->
   <div class="cm-gallery" data-card-morph>
     <article class="cm-card" data-cm-view-id="noble">...</article>
     <div id="noble-view" class="cm-view">...</div>
   </div>
   ```

2. **Update CSS Classes**
   - `.gallery` → `.cm-gallery`
   - `.card` → `.cm-card`
   - `.card-image` → `.cm-card__image`
   - `.card-title` → `.cm-card__title`

3. **Update JavaScript**
   ```javascript
   // Old
   initGallery('.gallery');

   // New
   CardMorph.initAll('[data-card-morph]');
   ```

4. **Update Event Listeners**
   ```javascript
   // Old
   element.addEventListener('galleryOpen', callback);

   // New
   element.addEventListener('cardmorph:open', callback);
   ```

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.0.0 | 2024-12-09 | Initial release with full feature set |

---

## Reporting Issues

Found a bug or have a feature request? Please open an issue on GitHub.

When reporting bugs, please include:
- Browser and version
- Card Morph version
- GSAP version
- Minimal reproduction code
- Expected vs actual behavior
