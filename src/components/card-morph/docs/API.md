# Card Morph API Reference

Complete JavaScript API documentation for the Card Morph Gallery component.

**Related Documentation:**
- [Full Guide](./README.md) - HTML structure, installation, accessibility
- [CSS Reference](./CSS-REFERENCE.md) - Theming and CSS custom properties
- [Changelog](./CHANGELOG.md) - Version history

## Table of Contents

- [CardMorph Class](#cardmorph-class)
  - [Static Properties](#static-properties)
  - [Static Methods](#static-methods)
  - [Constructor](#constructor)
  - [Instance Properties](#instance-properties)
  - [Instance Methods](#instance-methods)
- [Lightbox Class](#lightbox-class)
  - [Static Methods](#lightbox-static-methods)
  - [Static Properties](#lightbox-static-properties)
- [Configuration Options](#configuration-options)
- [Events](#events)
- [TypeScript Definitions](#typescript-definitions)

---

## CardMorph Class

The main class for creating and managing card morph galleries.

### Static Properties

#### `CardMorph.dependencies`

Object containing registered external dependencies.

```javascript
CardMorph.dependencies = {
  gsap: null,
  ScrollTrigger: null,
  Flip: null,
  Draggable: null,
  Lenis: null
};
```

---

### Static Methods

#### `CardMorph.registerDependencies(deps)`

Register external dependencies manually. Required when using ES modules.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `deps` | Object | Object containing dependencies |

**Example:**
```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import Lenis from 'lenis';

CardMorph.registerDependencies({
  gsap,
  ScrollTrigger,
  Draggable,
  Lenis
});
```

---

#### `CardMorph.autoDetectDependencies()`

Automatically detect and register globally available dependencies.

**Example:**
```javascript
// Dependencies available on window object
CardMorph.autoDetectDependencies();
// Now CardMorph.dependencies.gsap === window.gsap
```

---

#### `CardMorph.initAll(selector?, options?)`

Initialize all matching elements.

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `selector` | string | `'[data-card-morph]'` | CSS selector for containers |
| `options` | Object | `{}` | Configuration options |

**Returns:** `CardMorph[]` - Array of created instances

**Example:**
```javascript
// Basic
const instances = CardMorph.initAll();

// Custom selector and options
const instances = CardMorph.initAll('.my-gallery', {
  duration: 0.8,
  smoothScroll: false
});
```

---

#### `CardMorph.enableAutoInit(selector?, options?)`

Enable automatic initialization for dynamically added content using MutationObserver.

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `selector` | string | `'[data-card-morph]'` | CSS selector to watch for |
| `options` | Object | `{}` | Default options for new instances |

**Example:**
```javascript
CardMorph.enableAutoInit('[data-card-morph]', {
  smoothScroll: false
});

// Later, dynamically add gallery HTML
document.body.innerHTML += galleryHTML;
// CardMorph automatically initializes the new gallery
```

---

#### `CardMorph.disableAutoInit()`

Disable automatic initialization.

**Example:**
```javascript
CardMorph.disableAutoInit();
```

---

#### `CardMorph.getInstance(element)`

Get the CardMorph instance for a specific element.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `element` | Element | Container element |

**Returns:** `CardMorph | undefined`

**Example:**
```javascript
const container = document.querySelector('[data-card-morph]');
const instance = CardMorph.getInstance(container);

if (instance) {
  instance.open(0); // Open first card
}
```

---

#### `CardMorph.getInstances()`

Get all active CardMorph instances.

**Returns:** `CardMorph[]`

**Example:**
```javascript
const allInstances = CardMorph.getInstances();
console.log(`${allInstances.length} galleries initialized`);
```

---

#### `CardMorph.destroyAll()`

Destroy all active instances.

**Example:**
```javascript
// Clean up before page navigation
CardMorph.destroyAll();
```

---

### Constructor

#### `new CardMorph(container, options?)`

Create a new CardMorph instance.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `container` | string \| Element | Container element or CSS selector |
| `options` | Object | Configuration options |

**Throws:** Error if container not found or GSAP not available

**Example:**
```javascript
// With selector
const gallery = new CardMorph('#my-gallery', {
  duration: 0.6,
  onOpen: (card, view) => console.log('Opened')
});

// With element
const element = document.querySelector('.cm-gallery');
const gallery = new CardMorph(element);
```

---

### Instance Properties

#### `gallery.container`

**Type:** `Element`

The container element.

---

#### `gallery.options`

**Type:** `Object`

Current configuration options (merged defaults + provided options).

---

#### `gallery.cards`

**Type:** `NodeList`

Collection of card elements.

---

#### `gallery.views`

**Type:** `NodeList`

Collection of view elements.

---

#### `gallery.activeView`

**Type:** `Element | null`

Currently active view, or null if no view is open.

---

#### `gallery.activeCard`

**Type:** `Element | null`

Currently active card (the one that triggered the open view).

---

#### `gallery.scrollPosition`

**Type:** `number`

Saved scroll position when view opened (used for restoration on close).

---

### Instance Methods

#### `gallery.open(card)`

Open a view by card element, index, or view ID.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `card` | Element \| number \| string | Card element, index, or `data-cm-view-id` value |

**Example:**
```javascript
// By element
gallery.open(cardElement);

// By index (0-based)
gallery.open(0);

// By view ID
gallery.open('noble'); // Opens the view linked to data-cm-view-id="noble"
```

---

#### `gallery.close()`

Close the currently active view.

**Example:**
```javascript
gallery.close();
```

---

#### `gallery.setOptions(options)`

Update instance options.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `options` | Object | Partial options to merge |

**Returns:** `CardMorph` - Returns instance for chaining

**Example:**
```javascript
gallery
  .setOptions({ duration: 0.8 })
  .refresh();
```

---

#### `gallery.refresh()`

Refresh ScrollTrigger calculations. Call after layout changes.

**Returns:** `CardMorph` - Returns instance for chaining

**Example:**
```javascript
// After adding new cards
gallery.refresh();
```

---

#### `gallery.destroy()`

Destroy the instance and clean up all event listeners.

**Example:**
```javascript
gallery.destroy();
```

---

## Lightbox Class

Static class for the modern lightbox functionality.

### Lightbox Static Methods

#### `Lightbox.init()`

Initialize the lightbox (creates DOM structure). Called automatically when needed.

```javascript
// Usually not needed - called automatically
Lightbox.init();
```

---

#### `Lightbox.open(images, startIndex?, triggerElement?)`

Open the lightbox with images.

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `images` | Array | - | Array of image objects |
| `startIndex` | number | `0` | Index to start at |
| `triggerElement` | Element | `null` | Element that triggered open (for focus return) |

**Image Object:**
```typescript
{
  src: string;      // Image URL
  alt?: string;     // Alt text
  caption?: string; // Caption text
}
```

**Example:**
```javascript
const images = [
  { src: 'img1.jpg', alt: 'Image 1', caption: 'Beautiful sunset' },
  { src: 'img2.jpg', alt: 'Image 2', caption: 'Mountain view' },
];

Lightbox.open(images, 0, clickedElement);
```

---

#### `Lightbox.close()`

Close the lightbox.

```javascript
Lightbox.close();
```

---

#### `Lightbox.prev()`

Go to previous image.

```javascript
Lightbox.prev();
```

---

#### `Lightbox.next()`

Go to next image.

```javascript
Lightbox.next();
```

---

### Lightbox Static Properties

#### `Lightbox.isOpen`

**Type:** `boolean` (getter)

Whether the lightbox is currently open.

```javascript
if (Lightbox.isOpen) {
  console.log('Lightbox is open');
}
```

---

## Configuration Options

Complete list of configuration options.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cardSelector` | string | `'.cm-card'` | CSS selector for card elements |
| `viewSelector` | string | `'.cm-view'` | CSS selector for view elements |
| `galleryTrackSelector` | string | `'.cm-gallery-section__track'` | Selector for gallery track |
| `gallerySectionSelector` | string | `'.cm-gallery-section'` | Selector for gallery section |
| `duration` | number | `0.6` | Animation duration in seconds |
| `ease` | string | `'power2.inOut'` | GSAP easing function |
| `draggable` | boolean | `true` | Enable gallery dragging |
| `keyboard` | boolean | `true` | Enable keyboard navigation |
| `smoothScroll` | boolean | `true` | Enable Lenis smooth scroll |
| `cardStacking` | boolean | `true` | Enable scroll-triggered card stacking |
| `scrollStep` | number | `400` | Pixels per arrow key/button press |
| `lightbox` | boolean | `true` | Enable lightbox on gallery images |
| `lenis` | Object | See below | Lenis configuration |
| `onOpen` | Function | `null` | Callback when view opens |
| `onClose` | Function | `null` | Callback when view closes |
| `onInit` | Function | `null` | Callback when initialized |
| `onDestroy` | Function | `null` | Callback when destroyed |

### Lenis Default Configuration

```javascript
{
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
}
```

### Callback Signatures

```typescript
onInit: (instance: CardMorph) => void
onOpen: (card: Element, view: Element) => void
onClose: (card: Element, view: Element) => void
onDestroy: (instance: CardMorph) => void
```

---

## Events

Card Morph dispatches custom events on the container element.

### `cardmorph:init`

Fired after initialization.

```javascript
container.addEventListener('cardmorph:init', (e) => {
  console.log('Instance:', e.detail.instance);
});
```

**Detail:**
| Property | Type | Description |
|----------|------|-------------|
| `instance` | CardMorph | The initialized instance |

---

### `cardmorph:open`

Fired when a view opens.

```javascript
container.addEventListener('cardmorph:open', (e) => {
  console.log('Card:', e.detail.card);
  console.log('View:', e.detail.view);
});
```

**Detail:**
| Property | Type | Description |
|----------|------|-------------|
| `card` | Element | The clicked card |
| `view` | Element | The opened view |
| `instance` | CardMorph | The instance |

---

### `cardmorph:close`

Fired when a view closes.

```javascript
container.addEventListener('cardmorph:close', (e) => {
  console.log('Closed view:', e.detail.view);
});
```

**Detail:**
| Property | Type | Description |
|----------|------|-------------|
| `card` | Element | The associated card |
| `view` | Element | The closed view |
| `instance` | CardMorph | The instance |

---

### `cardmorph:beforeDestroy`

Fired before destruction. Can be cancelled.

```javascript
container.addEventListener('cardmorph:beforeDestroy', (e) => {
  if (!confirmDestroy) {
    e.preventDefault(); // Cancel destruction
  }
});
```

**Detail:**
| Property | Type | Description |
|----------|------|-------------|
| `instance` | CardMorph | The instance about to be destroyed |

---

### `cardmorph:destroyed`

Fired after destruction.

```javascript
container.addEventListener('cardmorph:destroyed', (e) => {
  console.log('Destroyed container:', e.detail.container);
});
```

**Detail:**
| Property | Type | Description |
|----------|------|-------------|
| `container` | Element | The container element |

---

## TypeScript Definitions

```typescript
interface CardMorphOptions {
  cardSelector?: string;
  viewSelector?: string;
  galleryTrackSelector?: string;
  gallerySectionSelector?: string;
  duration?: number;
  ease?: string;
  draggable?: boolean;
  keyboard?: boolean;
  smoothScroll?: boolean;
  cardStacking?: boolean;
  scrollStep?: number;
  lightbox?: boolean;
  lenis?: LenisOptions;
  onOpen?: (card: Element, view: Element) => void;
  onClose?: (card: Element, view: Element) => void;
  onInit?: (instance: CardMorph) => void;
  onDestroy?: (instance: CardMorph) => void;
}

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
}

interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface CardMorphEventDetail {
  instance?: CardMorph;
  card?: Element;
  view?: Element;
  container?: Element;
}

declare class CardMorph {
  static dependencies: {
    gsap: any;
    ScrollTrigger: any;
    Flip: any;
    Draggable: any;
    Lenis: any;
  };

  static registerDependencies(deps: Partial<typeof CardMorph.dependencies>): void;
  static autoDetectDependencies(): void;
  static initAll(selector?: string, options?: CardMorphOptions): CardMorph[];
  static enableAutoInit(selector?: string, options?: CardMorphOptions): void;
  static disableAutoInit(): void;
  static getInstance(element: Element): CardMorph | undefined;
  static getInstances(): CardMorph[];
  static destroyAll(): void;

  container: Element;
  options: CardMorphOptions;
  cards: NodeList;
  views: NodeList;
  activeView: Element | null;
  activeCard: Element | null;
  scrollPosition: number;

  constructor(container: string | Element, options?: CardMorphOptions);
  open(card: Element | number | string): void;
  close(): void;
  setOptions(options: Partial<CardMorphOptions>): CardMorph;
  refresh(): CardMorph;
  destroy(): void;
}

declare class Lightbox {
  static init(): void;
  static open(images: LightboxImage[], startIndex?: number, triggerElement?: Element): void;
  static close(): void;
  static prev(): void;
  static next(): void;
  static readonly isOpen: boolean;
}
```

---

## Usage Examples

### Basic Usage

```javascript
document.addEventListener('DOMContentLoaded', () => {
  CardMorph.initAll();
});
```

### With All Options

```javascript
const gallery = new CardMorph('#my-gallery', {
  cardSelector: '.cm-card',
  viewSelector: '.cm-view',
  duration: 0.8,
  ease: 'power3.inOut',
  draggable: true,
  keyboard: true,
  smoothScroll: false,
  cardStacking: true,
  scrollStep: 500,
  lightbox: true,
  lenis: {
    duration: 0.8,
    smoothWheel: true
  },
  onInit: (instance) => {
    console.log('Gallery initialized');
  },
  onOpen: (card, view) => {
    console.log('Opened:', card.dataset.cmViewId);
    // Analytics tracking
    trackEvent('gallery_view_open', { collection: card.dataset.cmViewId });
  },
  onClose: (card, view) => {
    console.log('Closed');
  },
  onDestroy: () => {
    console.log('Gallery destroyed');
  }
});
```

### Dynamic Content

```javascript
// Enable auto-init
CardMorph.enableAutoInit('[data-card-morph]', {
  smoothScroll: false
});

// Load content via AJAX
fetch('/api/galleries')
  .then(res => res.json())
  .then(data => {
    document.getElementById('galleries').innerHTML = data.html;
    // CardMorph automatically initializes new galleries
  });
```

### Programmatic Control

```javascript
const gallery = CardMorph.getInstance(container);

// Open specific collection
document.getElementById('open-noble').addEventListener('click', () => {
  gallery.open('noble');
});

// Close current view
document.getElementById('close-btn').addEventListener('click', () => {
  gallery.close();
});

// Open lightbox programmatically
document.getElementById('show-gallery').addEventListener('click', () => {
  const images = [
    { src: 'img1.jpg', alt: 'Image 1' },
    { src: 'img2.jpg', alt: 'Image 2' },
  ];
  Lightbox.open(images, 0);
});
```

### Event Handling

```javascript
const container = document.querySelector('[data-card-morph]');

container.addEventListener('cardmorph:open', (e) => {
  const { card, view } = e.detail;

  // Lazy load video content
  const video = view.querySelector('video[data-src]');
  if (video) {
    video.src = video.dataset.src;
    video.play();
  }
});

container.addEventListener('cardmorph:close', (e) => {
  const { view } = e.detail;

  // Pause any playing videos
  const video = view.querySelector('video');
  if (video) {
    video.pause();
  }
});
```
