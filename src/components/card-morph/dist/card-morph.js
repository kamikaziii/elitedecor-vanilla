/**
 * Card Morph Gallery v1.0.0
 * A morphing card gallery component using GSAP
 *
 * @license MIT
 * @author Elite Decor
 * @see https://github.com/example/card-morph
 *
 * Dependencies:
 * - GSAP 3.x (required)
 * - GSAP ScrollTrigger plugin (optional, for card stacking)
 * - GSAP Flip plugin (optional, for morph animations)
 * - GSAP Draggable plugin (optional, for gallery drag)
 * - Lenis (optional, for smooth scroll)
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
         global.CardMorph = factory());
})(this, (function () {
  'use strict';

  // ==========================================================================
  // DEFAULT OPTIONS
  // ==========================================================================

  /**
   * @typedef {Object} CardMorphOptions
   * @property {string} [cardSelector='.cm-card'] - Selector for card elements
   * @property {string} [viewSelector='.cm-view'] - Selector for view elements
   * @property {string} [galleryTrackSelector='.cm-gallery-section__track'] - Gallery track selector
   * @property {string} [gallerySectionSelector='.cm-gallery-section'] - Gallery section selector
   * @property {number} [duration=0.6] - Animation duration in seconds
   * @property {string} [ease='power2.inOut'] - GSAP easing function
   * @property {boolean} [draggable=true] - Enable draggable gallery
   * @property {boolean} [keyboard=true] - Enable keyboard navigation
   * @property {boolean} [smoothScroll=true] - Enable Lenis smooth scroll
   * @property {boolean} [cardStacking=true] - Enable scroll-triggered card stacking
   * @property {number} [scrollStep=400] - Pixels to scroll per arrow/key press
   * @property {boolean} [lightbox=true] - Enable lightbox on gallery images
   * @property {Object} [lenis] - Lenis configuration
   * @property {Function} [onOpen] - Callback when view opens
   * @property {Function} [onClose] - Callback when view closes
   * @property {Function} [onInit] - Callback when instance initializes
   * @property {Function} [onDestroy] - Callback when instance is destroyed
   */

  /** @type {CardMorphOptions} */
  const DEFAULTS = Object.freeze({
    cardSelector: '.cm-card',
    viewSelector: '.cm-view',
    galleryTrackSelector: '.cm-gallery-section__track',
    gallerySectionSelector: '.cm-gallery-section',
    duration: 0.6,
    ease: 'power2.inOut',
    draggable: true,
    keyboard: true,
    smoothScroll: true,
    cardStacking: true,
    scrollStep: 400,
    lightbox: true,
    lenis: {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    },
    onOpen: null,
    onClose: null,
    onInit: null,
    onDestroy: null
  });

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  /**
   * Deep merge objects
   * @param {Object} target
   * @param {Object} source
   * @returns {Object}
   */
  function mergeDeep(target, source) {
    const output = { ...target };

    for (const key in source) {
      if (source[key] !== undefined) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && typeof source[key] !== 'function') {
          output[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
          output[key] = source[key];
        }
      }
    }

    return output;
  }

  /**
   * Parse data attributes to options
   * @param {Element} element
   * @returns {Object}
   */
  function parseDataOptions(element) {
    const options = {};
    const prefix = 'cm';
    const dataset = element.dataset;

    for (const key in dataset) {
      if (key.startsWith(prefix) && key.length > prefix.length) {
        const optionKey = key.slice(prefix.length);
        const normalizedKey = optionKey.charAt(0).toLowerCase() + optionKey.slice(1);

        let value = dataset[key];
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(value) && value !== '') value = parseFloat(value);

        options[normalizedKey] = value;
      }
    }

    return options;
  }

  /**
   * Announce message to screen readers
   * @param {string} message
   */
  function announce(message) {
    let announcer = document.getElementById('cm-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'cm-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'cm-sr-only';
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
    setTimeout(() => { announcer.textContent = ''; }, 1000);
  }

  // ==========================================================================
  // LIGHTBOX CLASS
  // Modern lightbox using native <dialog> element (2025 best practice)
  // ==========================================================================

  /**
   * Lightbox Component
   * @class
   */
  class Lightbox {
    /** @type {HTMLDialogElement|null} */
    static #dialog = null;

    /** @type {Object} DOM element references */
    static #dom = {};

    /** @type {Array} Current images array */
    static #images = [];

    /** @type {number} Current image index */
    static #currentIndex = 0;

    /** @type {boolean} Is lightbox open */
    static #isOpen = false;

    /** @type {boolean} Is animating */
    static #isAnimating = false;

    /** @type {Element|null} Element that triggered the lightbox */
    static #triggerElement = null;

    /** @type {Function|null} Keyboard handler */
    static #keyHandler = null;

    /** @type {Function|null} Touch start handler */
    static #touchStartX = 0;

    /**
     * Initialize the lightbox (creates DOM once)
     * @static
     */
    static init() {
      if (Lightbox.#dialog) return;

      Lightbox.#createDOM();
      Lightbox.#bindEvents();
    }

    /**
     * Create lightbox DOM structure
     * @private
     */
    static #createDOM() {
      const html = `
        <dialog class="cm-lightbox" aria-labelledby="cm-lightbox-title" aria-describedby="cm-lightbox-desc">
          <div class="cm-lightbox__overlay"></div>
          <div class="cm-lightbox__container">
            <header class="cm-lightbox__header">
              <h2 id="cm-lightbox-title" class="cm-sr-only">Image Gallery</h2>
              <p id="cm-lightbox-desc" class="cm-sr-only">
                Use arrow keys to navigate between images. Press Escape to close.
              </p>
              <button class="cm-lightbox__close" aria-label="Close gallery" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>

            <main class="cm-lightbox__main">
              <figure class="cm-lightbox__figure" role="group" aria-roledescription="slide">
                <div class="cm-lightbox__image-wrapper" data-zoomed="false">
                  <img class="cm-lightbox__image" src="" alt="" />
                  <div class="cm-lightbox__loader" style="display: none;"></div>
                </div>
                <figcaption class="cm-lightbox__caption"></figcaption>
              </figure>
            </main>

            <nav class="cm-lightbox__nav" aria-label="Gallery navigation">
              <button class="cm-lightbox__prev" aria-label="Previous image" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <div class="cm-lightbox__counter" aria-live="polite" aria-atomic="true">
                <span class="cm-lightbox__current">1</span>
                <span aria-hidden="true"> / </span>
                <span class="cm-lightbox__total">1</span>
              </div>

              <button class="cm-lightbox__next" aria-label="Next image" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </nav>
          </div>
        </dialog>
      `;

      const template = document.createElement('template');
      template.innerHTML = html.trim();
      Lightbox.#dialog = template.content.firstChild;
      document.body.appendChild(Lightbox.#dialog);

      // Cache DOM references
      Lightbox.#dom = {
        overlay: Lightbox.#dialog.querySelector('.cm-lightbox__overlay'),
        container: Lightbox.#dialog.querySelector('.cm-lightbox__container'),
        image: Lightbox.#dialog.querySelector('.cm-lightbox__image'),
        imageWrapper: Lightbox.#dialog.querySelector('.cm-lightbox__image-wrapper'),
        caption: Lightbox.#dialog.querySelector('.cm-lightbox__caption'),
        loader: Lightbox.#dialog.querySelector('.cm-lightbox__loader'),
        closeBtn: Lightbox.#dialog.querySelector('.cm-lightbox__close'),
        prevBtn: Lightbox.#dialog.querySelector('.cm-lightbox__prev'),
        nextBtn: Lightbox.#dialog.querySelector('.cm-lightbox__next'),
        current: Lightbox.#dialog.querySelector('.cm-lightbox__current'),
        total: Lightbox.#dialog.querySelector('.cm-lightbox__total')
      };
    }

    /**
     * Bind event listeners
     * @private
     */
    static #bindEvents() {
      const { overlay, container, closeBtn, prevBtn, nextBtn, imageWrapper } = Lightbox.#dom;

      // Close handlers
      closeBtn.addEventListener('click', () => Lightbox.close());
      overlay.addEventListener('click', () => Lightbox.close());

      // Close when clicking outside the image (on the main content area)
      // Similar to replica/js/app.js pattern: if (e.target === this.el) this.close();
      container.addEventListener('click', (e) => {
        // Only close if clicking the main empty area or container directly
        // NOT on buttons, image, counter, or nav area (to prevent accidental closes)
        const clickedMain = e.target.classList.contains('cm-lightbox__main');
        const clickedContainer = e.target.classList.contains('cm-lightbox__container');
        if (clickedMain || clickedContainer) {
          Lightbox.close();
        }
      });

      // Native dialog cancel (Escape key)
      Lightbox.#dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        Lightbox.close();
      });

      // Navigation
      prevBtn.addEventListener('click', () => Lightbox.prev());
      nextBtn.addEventListener('click', () => Lightbox.next());

      // Touch swipe support
      imageWrapper.addEventListener('touchstart', (e) => {
        Lightbox.#touchStartX = e.changedTouches[0].pageX;
      }, { passive: true });

      imageWrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].pageX;
        const diff = Lightbox.#touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            Lightbox.next();
          } else {
            Lightbox.prev();
          }
        }
      }, { passive: true });
    }

    /**
     * Open lightbox with images
     * @param {Array} images - Array of {src, alt, caption} objects
     * @param {number} startIndex - Index to start at
     * @param {Element} triggerElement - Element that triggered opening
     * @static
     */
    static open(images, startIndex = 0, triggerElement = null) {
      if (Lightbox.#isOpen || Lightbox.#isAnimating) return;
      if (!images || images.length === 0) return;

      // Initialize if not done
      if (!Lightbox.#dialog) {
        Lightbox.init();
      }

      Lightbox.#isAnimating = true;
      Lightbox.#images = images;
      Lightbox.#currentIndex = startIndex;
      Lightbox.#triggerElement = triggerElement;

      // Update total count
      Lightbox.#dom.total.textContent = images.length;

      // Show dialog
      Lightbox.#dialog.showModal();

      // Load first image
      Lightbox.#loadImage(startIndex);

      // Animate open
      Lightbox.#animateOpen().then(() => {
        Lightbox.#isOpen = true;
        Lightbox.#isAnimating = false;

        // Enable keyboard navigation
        // Use capture phase and stopPropagation to prevent gallery from also handling arrows
        Lightbox.#keyHandler = (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            Lightbox.prev();
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            Lightbox.next();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            Lightbox.close();
          }
        };
        document.addEventListener('keydown', Lightbox.#keyHandler, { capture: true });

        // Focus close button
        Lightbox.#dom.closeBtn.focus();
      });

      // Preload adjacent images
      Lightbox.#preloadAdjacent(startIndex);

      announce(`Image gallery opened. Image ${startIndex + 1} of ${images.length}`);
    }

    /**
     * Close lightbox
     * @static
     */
    static close() {
      if (!Lightbox.#isOpen || Lightbox.#isAnimating) return;

      Lightbox.#isAnimating = true;

      // Remove keyboard handler (must match capture: true from addEventListener)
      if (Lightbox.#keyHandler) {
        document.removeEventListener('keydown', Lightbox.#keyHandler, { capture: true });
        Lightbox.#keyHandler = null;
      }

      // Animate close
      Lightbox.#animateClose().then(() => {
        Lightbox.#dialog.close();
        Lightbox.#isOpen = false;
        Lightbox.#isAnimating = false;

        // Return focus to trigger
        if (Lightbox.#triggerElement) {
          Lightbox.#triggerElement.focus();
        }

        announce('Gallery closed');
      });
    }

    /**
     * Go to previous image
     * @static
     */
    static prev() {
      if (Lightbox.#isAnimating || Lightbox.#currentIndex === 0) return;
      Lightbox.#goTo(Lightbox.#currentIndex - 1, 'prev');
    }

    /**
     * Go to next image
     * @static
     */
    static next() {
      if (Lightbox.#isAnimating || Lightbox.#currentIndex === Lightbox.#images.length - 1) return;
      Lightbox.#goTo(Lightbox.#currentIndex + 1, 'next');
    }

    /**
     * Go to specific image
     * @param {number} index
     * @param {string} direction
     * @private
     */
    static #goTo(index, direction = 'next') {
      if (Lightbox.#isAnimating) return;
      if (index < 0 || index >= Lightbox.#images.length) return;

      Lightbox.#isAnimating = true;

      Lightbox.#animateTransition(direction, () => {
        Lightbox.#currentIndex = index;
        Lightbox.#loadImage(index);
      }).then(() => {
        Lightbox.#isAnimating = false;
        Lightbox.#preloadAdjacent(index);
      });
    }

    /**
     * Load image at index
     * @param {number} index
     * @private
     */
    static #loadImage(index) {
      const imageData = Lightbox.#images[index];
      const { image, caption, current, prevBtn, nextBtn, loader } = Lightbox.#dom;

      // Show loader
      loader.style.display = 'block';

      // Create new image to preload
      const newImg = new Image();
      newImg.onload = () => {
        image.src = imageData.src;
        image.alt = imageData.alt || '';
        loader.style.display = 'none';
      };
      newImg.onerror = () => {
        image.src = '';
        image.alt = 'Image failed to load';
        loader.style.display = 'none';
      };
      newImg.src = imageData.src;

      // Update caption
      caption.textContent = imageData.caption || imageData.alt || '';

      // Update counter
      current.textContent = index + 1;

      // Update button states
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === Lightbox.#images.length - 1;
    }

    /**
     * Preload adjacent images
     * @param {number} index
     * @private
     */
    static #preloadAdjacent(index) {
      const preloadIndices = [index - 1, index + 1].filter(
        i => i >= 0 && i < Lightbox.#images.length
      );

      preloadIndices.forEach(i => {
        const img = new Image();
        img.src = Lightbox.#images[i].src;
      });
    }

    /**
     * Animate lightbox open
     * @returns {Promise}
     * @private
     */
    static #animateOpen() {
      const { gsap } = CardMorph.dependencies;
      const { overlay, container } = Lightbox.#dom;

      return new Promise(resolve => {
        gsap.set(overlay, { opacity: 0 });
        gsap.set(container, { opacity: 0, scale: 0.9 });

        const tl = gsap.timeline({ onComplete: resolve });

        tl.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(container, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'expo.out'
        }, '<0.1');
      });
    }

    /**
     * Animate lightbox close
     * @returns {Promise}
     * @private
     */
    static #animateClose() {
      const { gsap } = CardMorph.dependencies;
      const { overlay, container } = Lightbox.#dom;

      return new Promise(resolve => {
        const tl = gsap.timeline({ onComplete: resolve });

        tl.to(container, {
          opacity: 0,
          scale: 0.95,
          duration: 0.25,
          ease: 'power1.in'
        })
        .to(overlay, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }, '<0.1');
      });
    }

    /**
     * Animate image transition
     * @param {string} direction
     * @param {Function} onMidpoint
     * @returns {Promise}
     * @private
     */
    static #animateTransition(direction, onMidpoint) {
      const { gsap } = CardMorph.dependencies;
      const { image } = Lightbox.#dom;
      const xOffset = direction === 'next' ? -50 : 50;

      return new Promise(resolve => {
        const tl = gsap.timeline({ onComplete: resolve });

        tl.to(image, {
          x: xOffset,
          opacity: 0,
          duration: 0.15,
          ease: 'power2.in'
        })
        .call(onMidpoint)
        .fromTo(image,
          { x: -xOffset, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.15, ease: 'power2.out' }
        );
      });
    }

    /**
     * Check if lightbox is open
     * @returns {boolean}
     * @static
     */
    static get isOpen() {
      return Lightbox.#isOpen;
    }
  }

  // ==========================================================================
  // CARD MORPH CLASS
  // ==========================================================================

  /**
   * Card Morph Gallery Component
   * @class
   */
  class CardMorph {
    /** @type {Object} Registered external dependencies */
    static dependencies = {
      gsap: null,
      ScrollTrigger: null,
      Flip: null,
      Draggable: null,
      Lenis: null
    };

    /** @type {Map<Element, CardMorph>} Instance registry */
    static #instances = new Map();

    /** @type {boolean} Auto-init enabled */
    static #autoInitEnabled = false;

    /** @type {MutationObserver|null} */
    static #observer = null;

    // ========================================================================
    // STATIC METHODS
    // ========================================================================

    /**
     * Register external dependencies
     * @param {Object} deps - Dependencies object
     * @static
     */
    static registerDependencies(deps) {
      Object.assign(CardMorph.dependencies, deps);

      const { gsap, ScrollTrigger, Flip, Draggable } = CardMorph.dependencies;

      // Register GSAP plugins
      if (gsap) {
        if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
        if (Flip) gsap.registerPlugin(Flip);
        if (Draggable) gsap.registerPlugin(Draggable);
      }
    }

    /**
     * Auto-detect globally available dependencies
     * @static
     */
    static autoDetectDependencies() {
      const global = typeof globalThis !== 'undefined' ? globalThis : window;

      CardMorph.registerDependencies({
        gsap: global.gsap || null,
        ScrollTrigger: global.ScrollTrigger || null,
        Flip: global.Flip || null,
        Draggable: global.Draggable || null,
        Lenis: global.Lenis || null
      });
    }

    /**
     * Get instance for element
     * @param {Element} element
     * @returns {CardMorph|undefined}
     * @static
     */
    static getInstance(element) {
      return CardMorph.#instances.get(element);
    }

    /**
     * Get all instances
     * @returns {CardMorph[]}
     * @static
     */
    static getInstances() {
      return Array.from(CardMorph.#instances.values());
    }

    /**
     * Initialize all matching elements
     * @param {string} [selector='[data-card-morph]'] - Container selector
     * @param {CardMorphOptions} [options={}] - Default options
     * @returns {CardMorph[]}
     * @static
     */
    static initAll(selector = '[data-card-morph]', options = {}) {
      // Auto-detect dependencies if not registered
      if (!CardMorph.dependencies.gsap) {
        CardMorph.autoDetectDependencies();
      }

      const containers = document.querySelectorAll(selector);
      const instances = [];

      containers.forEach(container => {
        if (CardMorph.#instances.has(container)) return;

        const dataOptions = parseDataOptions(container);
        const mergedOptions = mergeDeep(options, dataOptions);

        try {
          instances.push(new CardMorph(container, mergedOptions));
        } catch (e) {
          console.error('CardMorph: Failed to initialize', container, e);
        }
      });

      return instances;
    }

    /**
     * Enable auto-initialization for dynamic content
     * @param {string} [selector='[data-card-morph]']
     * @param {CardMorphOptions} [options={}]
     * @static
     */
    static enableAutoInit(selector = '[data-card-morph]', options = {}) {
      if (CardMorph.#autoInitEnabled) return;

      CardMorph.initAll(selector, options);

      CardMorph.#observer = new MutationObserver(mutations => {
        let shouldInit = false;

        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            if (node.matches?.(selector) || node.querySelectorAll?.(selector).length) {
              shouldInit = true;
            }
          });
        });

        if (shouldInit) {
          CardMorph.initAll(selector, options);
        }
      });

      CardMorph.#observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      CardMorph.#autoInitEnabled = true;
    }

    /**
     * Disable auto-initialization
     * @static
     */
    static disableAutoInit() {
      CardMorph.#observer?.disconnect();
      CardMorph.#observer = null;
      CardMorph.#autoInitEnabled = false;
    }

    /**
     * Destroy all instances
     * @static
     */
    static destroyAll() {
      CardMorph.#instances.forEach(instance => instance.destroy());
    }

    // ========================================================================
    // INSTANCE PROPERTIES
    // ========================================================================

    /** @type {Element} */
    container;

    /** @type {CardMorphOptions} */
    options;

    /** @type {NodeList} */
    cards;

    /** @type {NodeList} */
    views;

    /** @type {Element|null} */
    activeView = null;

    /** @type {Element|null} */
    activeCard = null;

    /** @type {number} */
    scrollPosition = 0;

    /** @type {AbortController} */
    #abortController;

    /** @type {Object|null} Lenis instance */
    #lenis = null;

    /** @type {Object|null} Active draggable */
    #activeDraggable = null;

    /** @type {boolean} Flag to prevent race condition in draggable creation */
    #draggableCreating = false;

    /** @type {Element|null} Gallery navigation container */
    #galleryNavContainer = null;

    /** @type {Function|null} Gallery wheel handler */
    #galleryWheelHandler = null;

    /** @type {Function|null} Gallery keyboard handler */
    #galleryKeyHandler = null;

    /** @type {Function|null} Resize handler */
    #resizeHandler = null;

    /** @type {Function|null} Escape key handler */
    #boundEscapeHandler = null;

    /** @type {Array} Lightbox event handlers for cleanup */
    #lightboxHandlers = [];

    /** @type {ScrollTrigger[]} */
    #scrollTriggers = [];

    /** @type {Function|null} Popstate handler for URL navigation */
    #boundPopStateHandler = null;

    // ========================================================================
    // CONSTRUCTOR
    // ========================================================================

    /**
     * Create a CardMorph instance
     * @param {string|Element} container - Container element or selector
     * @param {CardMorphOptions} [options={}] - Configuration options
     */
    constructor(container, options = {}) {
      // Resolve container
      this.container = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!this.container) {
        throw new Error(`CardMorph: Container "${container}" not found`);
      }

      // Check for existing instance
      if (CardMorph.#instances.has(this.container)) {
        console.warn('CardMorph: Instance already exists for this container');
        return CardMorph.#instances.get(this.container);
      }

      // Auto-detect dependencies if needed
      if (!CardMorph.dependencies.gsap) {
        CardMorph.autoDetectDependencies();
      }

      // Validate required dependencies
      if (!CardMorph.dependencies.gsap) {
        throw new Error('CardMorph: GSAP is required. Include GSAP or call CardMorph.registerDependencies()');
      }

      // Merge options
      const dataOptions = parseDataOptions(this.container);
      this.options = mergeDeep(mergeDeep(DEFAULTS, options), dataOptions);

      // Initialize
      this.#init();
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize the component
     * @private
     */
    #init() {
      const { gsap, ScrollTrigger, Lenis } = CardMorph.dependencies;

      // Set up abort controller for event cleanup
      this.#abortController = new AbortController();
      const { signal } = this.#abortController;

      // Query elements
      this.cards = this.container.querySelectorAll(this.options.cardSelector);
      this.views = this.container.querySelectorAll(this.options.viewSelector);

      // Bind card events
      this.cards.forEach(card => {
        card.addEventListener('click', () => this.#openView(card), { signal });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.#openView(card);
          }
        }, { signal });

        // Ensure focusable
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
        card.setAttribute('role', 'button');
      });

      // Bind close buttons
      this.views.forEach(view => {
        const closeBtn = view.querySelector('.cm-view__close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.close(), { signal });
        }
      });

      // Initialize smooth scroll
      if (this.options.smoothScroll && Lenis) {
        this.#initLenis();
      }

      // Initialize card stacking
      if (this.options.cardStacking && ScrollTrigger) {
        this.#initCardStacking();
      }

      // Register instance
      CardMorph.#instances.set(this.container, this);

      // Mark as initialized
      this.container.classList.add('cm-gallery--initialized');

      // Dispatch event
      this.container.dispatchEvent(new CustomEvent('cardmorph:init', {
        detail: { instance: this }
      }));

      // Callback
      this.options.onInit?.(this);

      // Set up URL navigation
      this.#boundPopStateHandler = (e) => this.#handlePopState(e);
      window.addEventListener('popstate', this.#boundPopStateHandler);

      // Check for initial hash on page load
      const initialHash = window.location.hash.slice(1);
      if (initialHash) {
        const card = this.container.querySelector(`[data-cm-view-id="${initialHash}"]`);
        if (card) {
          // Open view after a short delay to ensure page is ready
          requestAnimationFrame(() => this.#openView(card, true));
        }
      }

      console.log('CardMorph: Initialized', this.container);
    }

    /**
     * Initialize Lenis smooth scroll
     * @private
     */
    #initLenis() {
      const { Lenis } = CardMorph.dependencies;
      const { gsap, ScrollTrigger } = CardMorph.dependencies;

      this.#lenis = new Lenis({
        ...this.options.lenis,
        // Prevent Lenis from handling scroll inside views
        prevent: (node) => node.closest('.cm-view')
      });

      if (ScrollTrigger) {
        this.#lenis.on('scroll', ScrollTrigger.update);
      }

      gsap.ticker.add((time) => {
        this.#lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    /**
     * Initialize card stacking effect
     * @private
     */
    #initCardStacking() {
      const { ScrollTrigger } = CardMorph.dependencies;

      if (this.cards.length === 0) return;

      const lastCard = this.cards[this.cards.length - 1];

      this.cards.forEach((card, index) => {
        const isLast = index === this.cards.length - 1;

        if (!isLast) {
          const st = ScrollTrigger.create({
            trigger: card,
            start: 'center center',
            endTrigger: lastCard,
            end: 'center center',
            pin: true,
            pinSpacing: false
          });

          this.#scrollTriggers.push(st);
        }
      });
    }

    // ========================================================================
    // VIEW MANAGEMENT
    // ========================================================================

    /**
     * Open a view
     * @param {Element|number|string} card - Card element, index, or data-cm-view-id
     */
    open(card) {
      let cardElement;

      if (typeof card === 'number') {
        cardElement = this.cards[card];
      } else if (typeof card === 'string') {
        cardElement = this.container.querySelector(`[data-cm-view-id="${card}"]`);
      } else {
        cardElement = card;
      }

      if (cardElement) {
        this.#openView(cardElement);
      }
    }

    /**
     * Internal open view handler
     * @param {Element} card
     * @param {boolean} skipHistory - Skip pushing to browser history
     * @private
     */
    #openView(card, skipHistory = false) {
      const { gsap } = CardMorph.dependencies;

      const viewId = card.dataset.cmViewId || card.dataset.collection;
      const view = document.getElementById(`${viewId}-view`) ||
                   this.container.querySelector(`[data-cm-view-for="${viewId}"]`);

      if (!view) {
        console.warn('CardMorph: View not found for', viewId);
        return;
      }

      // Save state
      this.scrollPosition = window.scrollY;
      this.activeView = view;
      this.activeCard = card;

      // Update URL hash (unless opening from popstate)
      if (!skipHistory) {
        this.#updateHash(viewId);
      }

      // Stop Lenis with error handling
      try {
        this.#lenis?.stop();
      } catch (e) {
        console.warn('CardMorph: Error stopping Lenis', e);
      }

      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
      document.body.classList.add('cm-no-scroll');

      // Reset view scroll
      view.scrollTop = 0;

      // Show view
      view.classList.add('cm-view--active');
      view.setAttribute('aria-hidden', 'false');

      // Add escape key listener
      this.#boundEscapeHandler = (e) => {
        if (e.key === 'Escape') this.close();
      };
      document.addEventListener('keydown', this.#boundEscapeHandler);

      // Animate entrance
      if (!this.#isReducedMotion()) {
        const tl = gsap.timeline();

        tl.fromTo(view,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        const heroContent = view.querySelector('.cm-hero__content');
        if (heroContent) {
          tl.fromTo(heroContent,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.3'
          );
        }

        const infoElements = view.querySelectorAll('.cm-info > *');
        if (infoElements.length > 0) {
          tl.fromTo(infoElements,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
            '-=0.3'
          );
        }
      } else {
        gsap.set(view, { opacity: 1 });
      }

      // Initialize gallery after view is visible
      requestAnimationFrame(() => {
        this.#initGallery(view);
        view.querySelector('.cm-view__close')?.focus();
      });

      // Dispatch event
      this.container.dispatchEvent(new CustomEvent('cardmorph:open', {
        detail: { card, view, instance: this }
      }));

      // Callback
      this.options.onOpen?.(card, view);

      announce(`Opened ${viewId} view`);
    }

    /**
     * Close the active view
     */
    close() {
      this.#closeInternal(false);
    }

    /**
     * Finalize view close
     * @param {Element} view
     * @private
     */
    #finalizeClose(view) {
      const { gsap } = CardMorph.dependencies;

      view.classList.remove('cm-view--active');
      view.setAttribute('aria-hidden', 'true');

      // Remove escape handler
      if (this.#boundEscapeHandler) {
        document.removeEventListener('keydown', this.#boundEscapeHandler);
        this.#boundEscapeHandler = null;
      }

      // Cleanup gallery
      this.#cleanupGallery();

      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('cm-no-scroll');

      // Restore scroll position
      window.scrollTo(0, this.scrollPosition);

      // Resume Lenis with error handling
      try {
        this.#lenis?.start();
      } catch (e) {
        console.warn('CardMorph: Error starting Lenis', e);
      }

      // Return focus
      this.activeCard?.focus();

      // Dispatch event
      this.container.dispatchEvent(new CustomEvent('cardmorph:close', {
        detail: { view, card: this.activeCard, instance: this }
      }));

      // Callback
      this.options.onClose?.(this.activeCard, view);

      // Reset state
      const card = this.activeCard;
      this.activeView = null;
      this.activeCard = null;

      // Reset view
      gsap.set(view, { opacity: 0 });

      const gallery = view.querySelector(this.options.galleryTrackSelector);
      if (gallery) {
        gsap.set(gallery, { x: 0 });
      }

      announce('View closed');
    }

    // ========================================================================
    // URL NAVIGATION
    // ========================================================================

    /**
     * Update URL hash when opening a view
     * @param {string} viewId
     * @private
     */
    #updateHash(viewId) {
      history.pushState({ cmView: viewId }, '', `#${viewId}`);
    }

    /**
     * Clear URL hash when closing a view
     * @private
     */
    #clearHash() {
      history.pushState({}, '', window.location.pathname + window.location.search);
    }

    /**
     * Handle popstate event (browser back/forward)
     * @param {PopStateEvent} e
     * @private
     */
    #handlePopState(e) {
      const hash = window.location.hash.slice(1);

      if (hash && !this.activeView) {
        // Hash present but no view open - open the view
        const card = this.container.querySelector(`[data-cm-view-id="${hash}"]`);
        if (card) {
          this.#openView(card, true); // true = skip history push
        }
      } else if (!hash && this.activeView) {
        // No hash but view open - close the view without pushing history
        this.#closeInternal(true);
      }
    }

    /**
     * Internal close method with history control
     * @param {boolean} skipHistory - Skip clearing hash from history
     * @private
     */
    #closeInternal(skipHistory = false) {
      if (!this.activeView) return;

      const { gsap } = CardMorph.dependencies;
      const view = this.activeView;

      // Clear hash before closing (unless skipping for popstate)
      if (!skipHistory) {
        this.#clearHash();
      }

      // Safety timeout to ensure Lenis is restarted even if animation fails
      const safetyTimeout = setTimeout(() => {
        if (this.activeView) {
          console.warn('CardMorph: Close animation timed out, forcing cleanup');
          this.#finalizeClose(view);
        }
      }, 1000);

      const cleanupAndFinalize = () => {
        clearTimeout(safetyTimeout);
        this.#finalizeClose(view);
      };

      if (!this.#isReducedMotion()) {
        gsap.to(view, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: cleanupAndFinalize
        });
      } else {
        cleanupAndFinalize();
      }
    }

    // ========================================================================
    // GALLERY
    // ========================================================================

    /**
     * Initialize gallery for a view
     * @param {Element} view
     * @private
     */
    #initGallery(view) {
      if (!this.options.draggable) return;

      const gallery = view.querySelector(this.options.galleryTrackSelector);
      if (!gallery) return;

      const { gsap } = CardMorph.dependencies;
      const images = gallery.querySelectorAll('img');

      if (images.length === 0) {
        this.#createDraggable(gallery);
        return;
      }

      // Reset gallery position
      gsap.set(gallery, { x: 0 });

      // Initialize lightbox for gallery items
      if (this.options.lightbox !== false) {
        this.#initLightbox(gallery, images);
      }

      // Wait for images to load with debounced draggable creation
      let loadedCount = 0;
      const totalImages = images.length;
      let createScheduled = false;

      const scheduleCreateDraggable = () => {
        if (createScheduled) return;
        createScheduled = true;
        // Use double rAF to ensure DOM is fully ready (especially on mobile)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.#createDraggable(gallery);
          });
        });
      };

      const onImageReady = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          scheduleCreateDraggable();
        }
      };

      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          onImageReady();
        } else {
          img.addEventListener('load', onImageReady);
          img.addEventListener('error', onImageReady);
        }
      });

      // Fallback timeout (reduced from 2s to 1s for better UX)
      setTimeout(() => {
        if (!this.#activeDraggable && !this.#draggableCreating) {
          scheduleCreateDraggable();
        }
      }, 1000);
    }

    /**
     * Initialize lightbox for gallery images
     * @param {Element} gallery
     * @param {NodeList} images
     * @private
     */
    #initLightbox(gallery, images) {
      // Collect image data
      const imageData = Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt || '',
        caption: img.alt || ''
      }));

      // Track if we're dragging to prevent click
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      // Store handlers for cleanup
      this.#lightboxHandlers = [];

      // Add click handlers to gallery items
      const galleryItems = gallery.querySelectorAll('.cm-gallery-section__item');

      galleryItems.forEach((item, index) => {
        const handler = (e) => {
          // Only open if not dragging
          if (!isDragging) {
            e.preventDefault();
            Lightbox.open(imageData, index, item);
          }
        };

        const mouseDownHandler = (e) => {
          startX = e.clientX;
          startY = e.clientY;
          isDragging = false;
        };

        const mouseMoveHandler = (e) => {
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx > 5 || dy > 5) {
            isDragging = true;
          }
        };

        const mouseUpHandler = () => {
          // Reset after a short delay to allow click to process
          setTimeout(() => {
            isDragging = false;
          }, 100);
        };

        item.addEventListener('click', handler);
        item.addEventListener('mousedown', mouseDownHandler);
        item.addEventListener('mousemove', mouseMoveHandler);
        item.addEventListener('mouseup', mouseUpHandler);

        // Make items focusable for keyboard access
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image ${index + 1}: ${imageData[index].alt || 'Gallery image'}`);

        // Keyboard handler
        const keyHandler = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            Lightbox.open(imageData, index, item);
          }
        };
        item.addEventListener('keydown', keyHandler);

        // Store handlers for cleanup
        this.#lightboxHandlers.push({
          item,
          handlers: { handler, mouseDownHandler, mouseMoveHandler, mouseUpHandler, keyHandler }
        });
      });
    }

    /**
     * Create draggable gallery
     * @param {Element} gallery
     * @private
     */
    #createDraggable(gallery) {
      // Prevent race condition - check both active and creating flags
      if (this.#activeDraggable || this.#draggableCreating) return;
      this.#draggableCreating = true;

      const { gsap, Draggable } = CardMorph.dependencies;

      if (!Draggable) {
        console.warn('CardMorph: Draggable plugin not available');
        return;
      }

      const gallerySection = gallery.closest(this.options.gallerySectionSelector);
      if (!gallerySection) return;

      const scrollStep = this.options.scrollStep;

      // Velocity tracking for momentum
      let lastX = 0;
      let lastTime = 0;
      let velocity = 0;

      // Bounds calculation
      const updateBounds = () => {
        const containerWidth = gallerySection.offsetWidth;
        const galleryWidth = gallery.scrollWidth;
        const maxDrag = Math.max(0, galleryWidth - containerWidth + 40);
        return { minX: -maxDrag, maxX: 0 };
      };

      // Update arrow states
      const updateArrowStates = () => {
        if (!this.#galleryNavContainer) return;

        const bounds = updateBounds();
        const currentX = gsap.getProperty(gallery, 'x');
        const prevArrow = this.#galleryNavContainer.querySelector('.cm-gallery-nav__arrow--prev');
        const nextArrow = this.#galleryNavContainer.querySelector('.cm-gallery-nav__arrow--next');

        prevArrow?.classList.toggle('cm-gallery-nav__arrow--hidden', currentX >= 0);
        nextArrow?.classList.toggle('cm-gallery-nav__arrow--hidden', currentX <= bounds.minX);
      };

      // Create draggable with mobile-optimized settings
      this.#activeDraggable = Draggable.create(gallery, {
        type: 'x',
        bounds: updateBounds(),
        edgeResistance: 0.85,
        zIndexBoost: false,
        cursor: 'grab',
        activeCursor: 'grabbing',
        // Critical for mobile: prevent Draggable from allowing native touch scroll
        allowNativeTouchScrolling: false,
        // Ensure touch events are properly handled
        dragClickables: true,
        onDragStart: function() {
          lastX = this.x;
          lastTime = Date.now();
          velocity = 0;
        },
        onDrag: function() {
          const now = Date.now();
          const dt = now - lastTime;
          if (dt > 0) {
            velocity = (this.x - lastX) / dt * 16;
          }
          lastX = this.x;
          lastTime = now;
          updateArrowStates();
        },
        onDragEnd: function() {
          if (Math.abs(velocity) > 1) {
            const bounds = updateBounds();
            const throwDistance = velocity * 15;
            let targetX = this.x + throwDistance;
            targetX = Math.max(bounds.minX, Math.min(bounds.maxX, targetX));

            gsap.to(gallery, {
              x: targetX,
              duration: 0.8,
              ease: 'power3.out',
              onUpdate: updateArrowStates
            });
          }
        }
      })[0];

      // Create navigation
      this.#createGalleryNav(gallerySection, gallery, updateBounds, updateArrowStates, scrollStep);

      // Keyboard navigation
      if (this.options.keyboard) {
        this.#galleryKeyHandler = (e) => {
          if (!this.activeView) return;

          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.#scrollGallery(gallery, 1, updateBounds, updateArrowStates, scrollStep);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.#scrollGallery(gallery, -1, updateBounds, updateArrowStates, scrollStep);
          }
        };
        document.addEventListener('keydown', this.#galleryKeyHandler);
      }

      // Wheel/touchpad scroll
      this.#galleryWheelHandler = (e) => {
        const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);

        if (!isHorizontalScroll || Math.abs(e.deltaX) < 2) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const bounds = updateBounds();
        const currentX = gsap.getProperty(gallery, 'x');
        const newX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX - e.deltaX));

        if (Math.abs(newX - currentX) > 0.1) {
          gsap.set(gallery, { x: newX });
          updateArrowStates();
        }
      };
      gallerySection.addEventListener('wheel', this.#galleryWheelHandler, { passive: false, capture: true });

      // Resize handler
      let resizeTimeout;
      this.#resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.#activeDraggable?.applyBounds(updateBounds());
          updateArrowStates();
        }, 150);
      };
      window.addEventListener('resize', this.#resizeHandler);

      updateArrowStates();
    }

    /**
     * Create gallery navigation arrows
     * @private
     */
    #createGalleryNav(gallerySection, gallery, updateBounds, updateArrowStates, scrollStep) {
      const navContainer = document.createElement('div');
      navContainer.className = 'cm-gallery-nav';

      const prevArrow = document.createElement('button');
      prevArrow.className = 'cm-gallery-nav__arrow cm-gallery-nav__arrow--prev';
      prevArrow.setAttribute('aria-label', 'Previous images');
      prevArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"></polyline></svg>';

      const nextArrow = document.createElement('button');
      nextArrow.className = 'cm-gallery-nav__arrow cm-gallery-nav__arrow--next';
      nextArrow.setAttribute('aria-label', 'Next images');
      nextArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,6 15,12 9,18"></polyline></svg>';

      prevArrow.addEventListener('click', () => {
        this.#scrollGallery(gallery, 1, updateBounds, updateArrowStates, scrollStep);
      });

      nextArrow.addEventListener('click', () => {
        this.#scrollGallery(gallery, -1, updateBounds, updateArrowStates, scrollStep);
      });

      navContainer.appendChild(prevArrow);
      navContainer.appendChild(nextArrow);
      gallerySection.appendChild(navContainer);

      this.#galleryNavContainer = navContainer;
    }

    /**
     * Scroll gallery by direction
     * @private
     */
    #scrollGallery(gallery, direction, updateBounds, updateArrowStates, scrollStep) {
      const { gsap } = CardMorph.dependencies;

      const bounds = updateBounds();
      const currentX = gsap.getProperty(gallery, 'x');
      let newX = currentX + (direction * scrollStep);
      newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));

      gsap.to(gallery, {
        x: newX,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: updateArrowStates
      });
    }

    /**
     * Cleanup gallery resources
     * @private
     */
    #cleanupGallery() {
      // Remove keyboard handler
      if (this.#galleryKeyHandler) {
        document.removeEventListener('keydown', this.#galleryKeyHandler);
        this.#galleryKeyHandler = null;
      }

      // Kill draggable and reset creation flag
      if (this.#activeDraggable) {
        this.#activeDraggable.kill();
        this.#activeDraggable = null;
      }
      this.#draggableCreating = false;

      // Remove nav container
      if (this.#galleryNavContainer) {
        this.#galleryNavContainer.remove();
        this.#galleryNavContainer = null;
      }

      // Remove wheel handler
      if (this.#galleryWheelHandler && this.activeView) {
        const gallerySection = this.activeView.querySelector(this.options.gallerySectionSelector);
        gallerySection?.removeEventListener('wheel', this.#galleryWheelHandler, { capture: true });
        this.#galleryWheelHandler = null;
      }

      // Remove resize handler
      if (this.#resizeHandler) {
        window.removeEventListener('resize', this.#resizeHandler);
        this.#resizeHandler = null;
      }

      // Remove lightbox handlers
      if (this.#lightboxHandlers.length > 0) {
        this.#lightboxHandlers.forEach(({ item, handlers }) => {
          item.removeEventListener('click', handlers.handler);
          item.removeEventListener('mousedown', handlers.mouseDownHandler);
          item.removeEventListener('mousemove', handlers.mouseMoveHandler);
          item.removeEventListener('mouseup', handlers.mouseUpHandler);
          item.removeEventListener('keydown', handlers.keyHandler);
          item.removeAttribute('tabindex');
          item.removeAttribute('role');
          item.removeAttribute('aria-label');
        });
        this.#lightboxHandlers = [];
      }
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    /**
     * Check reduced motion preference
     * @returns {boolean}
     * @private
     */
    #isReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Refresh the component
     * @returns {CardMorph}
     */
    refresh() {
      const { ScrollTrigger } = CardMorph.dependencies;
      ScrollTrigger?.refresh();
      return this;
    }

    /**
     * Update options
     * @param {Partial<CardMorphOptions>} options
     * @returns {CardMorph}
     */
    setOptions(options) {
      this.options = mergeDeep(this.options, options);
      return this;
    }

    // ========================================================================
    // DESTROY
    // ========================================================================

    /**
     * Destroy the instance
     */
    destroy() {
      // Dispatch before event
      const beforeEvent = new CustomEvent('cardmorph:beforeDestroy', {
        cancelable: true,
        detail: { instance: this }
      });

      if (!this.container.dispatchEvent(beforeEvent)) return;

      // Close any open view
      if (this.activeView) {
        this.activeView.classList.remove('cm-view--active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('cm-no-scroll');
        window.scrollTo(0, this.scrollPosition);
      }

      // Abort all event listeners
      this.#abortController.abort();

      // Cleanup gallery
      this.#cleanupGallery();

      // Kill ScrollTriggers
      this.#scrollTriggers.forEach(st => st.kill());
      this.#scrollTriggers = [];

      // Destroy Lenis
      if (this.#lenis) {
        this.#lenis.destroy();
        this.#lenis = null;
      }

      // Remove escape handler
      if (this.#boundEscapeHandler) {
        document.removeEventListener('keydown', this.#boundEscapeHandler);
      }

      // Remove popstate handler for URL navigation
      if (this.#boundPopStateHandler) {
        window.removeEventListener('popstate', this.#boundPopStateHandler);
        this.#boundPopStateHandler = null;
      }

      // Remove initialized class
      this.container.classList.remove('cm-gallery--initialized');

      // Remove from registry
      CardMorph.#instances.delete(this.container);

      // Dispatch destroyed event
      this.container.dispatchEvent(new CustomEvent('cardmorph:destroyed', {
        detail: { container: this.container }
      }));

      // Callback
      this.options.onDestroy?.(this);

      console.log('CardMorph: Destroyed', this.container);
    }
  }

  // ==========================================================================
  // AUTO-INIT ON DOM READY
  // ==========================================================================

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Only auto-init if data-card-morph-auto attribute is present on any element
        if (document.querySelector('[data-card-morph-auto]')) {
          CardMorph.initAll('[data-card-morph-auto]');
        }
      });
    }
  }

  return CardMorph;
}));
