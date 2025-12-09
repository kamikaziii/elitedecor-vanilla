/**
 * Elite Decor - Card Morph Prototype (Option 2)
 *
 * Uses GSAP FLIP plugin for seamless card-to-fullscreen morphing
 * Based on 2025 best practices from:
 * - https://gsap.com/docs/v3/Plugins/Flip/
 * - https://ryanmulligan.dev/blog/gsap-flip-cart/
 * - https://css-tricks.com/gsap-flip-plugin-for-animation/
 *
 * Note: InertiaPlugin is a premium plugin - we use manual momentum instead
 */

(function() {
  'use strict';

  // Register GSAP plugins (InertiaPlugin is premium, so we don't use inertia: true)
  gsap.registerPlugin(ScrollTrigger, Flip, Draggable);

  // ==========================================================================
  // Configuration
  // ==========================================================================

  const CONFIG = {
    morphDuration: 0.8,
    morphEase: 'power3.inOut',
    galleryDragEase: 'power2.out',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // ==========================================================================
  // Collection Morph Controller
  // ==========================================================================

  class CollectionMorph {
    constructor() {
      this.collectionCards = document.querySelectorAll('.collection-card');
      this.collectionViews = document.querySelectorAll('.collection-view');
      this.activeView = null;
      this.originalState = null;
      this.scrollPosition = 0;
      this.activeDraggable = null; // Track current gallery's draggable instance

      this.init();
    }

    init() {
      // Bind card click events
      this.collectionCards.forEach(card => {
        card.addEventListener('click', () => this.openCollection(card));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openCollection(card);
          }
        });
      });

      // Bind close events
      this.collectionViews.forEach(view => {
        const closeBtn = view.querySelector('.collection-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.closeCollection());
        }

        // Close on Escape key
        view.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.closeCollection();
          }
        });
      });

      // Note: Draggable galleries are initialized when view opens (not here)
      // because dimensions are 0 when views are hidden
    }

    openCollection(card) {
      const collectionId = card.dataset.collection;
      const view = document.getElementById(`${collectionId}-view`);

      if (!view) return;

      // Save scroll position
      this.scrollPosition = window.scrollY;

      // Store reference
      this.activeView = view;
      this.activeCard = card;

      // Stop Lenis smooth scroll to allow native scroll in collection view
      // Using stop() per best practices - Lenis's prevent option handles the rest
      stopLenis();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';

      // Reset view scroll position to top
      view.scrollTop = 0;

      // Show the collection view
      view.classList.add('active');
      view.setAttribute('aria-hidden', 'false');

      // Add global escape key listener
      this.boundEscapeHandler = (e) => {
        if (e.key === 'Escape') {
          this.closeCollection();
        }
      };
      document.addEventListener('keydown', this.boundEscapeHandler);

      // Get card and hero positions for FLIP animation
      const cardImg = card.querySelector('img');
      const heroImg = view.querySelector('.collection-hero-bg img');

      // Animate the card morphing into the view
      if (!CONFIG.reducedMotion && cardImg && heroImg) {
        // Capture card state
        const cardState = Flip.getState(cardImg);

        // Temporarily position hero image to match card
        gsap.set(heroImg, {
          position: 'fixed',
          zIndex: 3000
        });

        // Animate entrance with FLIP
        const tl = gsap.timeline({
          onComplete: () => {
            // Reset hero image positioning
            gsap.set(heroImg, {
              clearProps: 'position,zIndex,top,left,width,height'
            });
          }
        });

        // Fade in view background
        tl.fromTo(view,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        // Animate hero content
        tl.fromTo(view.querySelector('.collection-hero-content'),
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );

        // Animate info section
        const infoElements = view.querySelectorAll('.collection-info > *');
        if (infoElements.length > 0) {
          tl.fromTo(infoElements,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
            '-=0.3'
          );
        }
      } else {
        // No animation for reduced motion
        gsap.set(view, { opacity: 1 });
      }

      // Initialize draggable gallery AFTER view is visible (so dimensions are correct)
      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        this.initGalleryForView(view);
        view.querySelector('.collection-close')?.focus();
      });

      announce(`Opened ${collectionId} collection view`);
    }

    closeCollection() {
      if (!this.activeView) return;

      const view = this.activeView;

      if (!CONFIG.reducedMotion) {
        // Animate exit
        gsap.to(view, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            this.finalizeClose(view);
          }
        });
      } else {
        this.finalizeClose(view);
      }
    }

    finalizeClose(view) {
      view.classList.remove('active');
      view.setAttribute('aria-hidden', 'true');

      // Remove global escape key listener
      if (this.boundEscapeHandler) {
        document.removeEventListener('keydown', this.boundEscapeHandler);
        this.boundEscapeHandler = null;
      }

      // Remove gallery keyboard handler
      if (this.galleryKeyHandler) {
        document.removeEventListener('keydown', this.galleryKeyHandler);
        this.galleryKeyHandler = null;
      }

      // Kill the active draggable instance
      if (this.activeDraggable) {
        this.activeDraggable.kill();
        this.activeDraggable = null;
      }

      // Remove gallery navigation container (which contains the arrows)
      if (this.galleryNavContainer) {
        this.galleryNavContainer.remove();
        this.galleryNavContainer = null;
        this.galleryArrows = null;
      }

      // Remove gallery wheel handler
      if (this.galleryWheelHandler) {
        const gallerySection = view.querySelector('.horizontal-gallery-section');
        if (gallerySection) {
          // Must match the capture: true option used when adding
          gallerySection.removeEventListener('wheel', this.galleryWheelHandler, { capture: true });
        }
        this.galleryWheelHandler = null;
      }

      // Remove resize handler
      if (this.activeResizeHandler) {
        window.removeEventListener('resize', this.activeResizeHandler);
        this.activeResizeHandler = null;
      }

      // Reset body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      window.scrollTo(0, this.scrollPosition);

      // Resume Lenis smooth scroll
      startLenis();

      // Return focus to the card
      if (this.activeCard) {
        this.activeCard.focus();
      }

      this.activeView = null;
      this.activeCard = null;

      // Reset view opacity for next open
      gsap.set(view, { opacity: 0 });

      // Reset gallery position
      const gallery = view.querySelector('.horizontal-gallery-wrapper');
      if (gallery) {
        gsap.set(gallery, { x: 0 });
      }

      announce('Collection view closed');
    }

    // Initialize draggable gallery for a specific view (called when view opens)
    // Best practice: Wait for images to load before calculating bounds
    initGalleryForView(view) {
      const gallery = view.querySelector('.horizontal-gallery-wrapper');
      if (!gallery) return;

      const images = gallery.querySelectorAll('img');
      if (images.length === 0) return;

      // Reset gallery position first
      gsap.set(gallery, { x: 0 });

      // Wait for images to load before calculating bounds (best practice per GSAP docs)
      let loadedCount = 0;
      const totalImages = images.length;

      const onImageReady = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          this.createDraggable(gallery);
        }
      };

      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          onImageReady();
        } else {
          img.addEventListener('load', onImageReady);
          img.addEventListener('error', onImageReady); // Count errors too to not block
        }
      });

      // Fallback: Initialize after 2 seconds even if images haven't loaded
      setTimeout(() => {
        if (loadedCount < totalImages && !this.activeDraggable) {
          console.log('Gallery: Fallback initialization (some images not loaded)');
          this.createDraggable(gallery);
        }
      }, 2000);
    }

    // Create the draggable instance (called after images load)
    createDraggable(gallery) {
      if (this.activeDraggable) return; // Already created

      const gallerySection = gallery.parentElement;
      const scrollStep = 400; // Pixels to scroll per arrow click/key press

      // Track velocity for manual momentum
      let lastX = 0;
      let lastTime = 0;
      let velocity = 0;

      // Calculate bounds (now that images are loaded, dimensions are accurate)
      const updateBounds = () => {
        const containerWidth = gallerySection.offsetWidth;
        const galleryWidth = gallery.scrollWidth;
        const maxDrag = Math.max(0, galleryWidth - containerWidth + 40); // 40px padding
        return { minX: -maxDrag, maxX: 0 };
      };

      // Create draggable without inertia (InertiaPlugin is premium)
      // zIndexBoost: false prevents GSAP from messing with z-index during drag
      this.activeDraggable = Draggable.create(gallery, {
        type: 'x',
        bounds: updateBounds(),
        edgeResistance: 0.85,
        zIndexBoost: false, // Prevents z-index changes that break our stacking context
        cursor: 'grab',
        activeCursor: 'grabbing',
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

      const draggable = this.activeDraggable;

      // =======================================================================
      // Arrow Navigation (Desktop)
      // Uses isolated stacking context (2025 best practice for z-index issues)
      // =======================================================================

      // Create navigation container with isolated stacking context
      // This ensures arrows are ALWAYS above the gallery, regardless of transforms
      const navContainer = document.createElement('div');
      navContainer.className = 'gallery-navigation';

      // Create arrow buttons
      const leftArrow = document.createElement('button');
      leftArrow.className = 'gallery-arrow gallery-arrow-left';
      leftArrow.setAttribute('aria-label', 'Previous images');
      leftArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"></polyline></svg>';

      const rightArrow = document.createElement('button');
      rightArrow.className = 'gallery-arrow gallery-arrow-right';
      rightArrow.setAttribute('aria-label', 'Next images');
      rightArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,6 15,12 9,18"></polyline></svg>';

      // Append arrows to navigation container, then container to section
      navContainer.appendChild(leftArrow);
      navContainer.appendChild(rightArrow);
      gallerySection.appendChild(navContainer);

      // Store references for cleanup
      this.galleryNavContainer = navContainer;
      this.galleryArrows = [leftArrow, rightArrow];

      // Update arrow visibility based on scroll position
      const updateArrowStates = () => {
        const bounds = updateBounds();
        const currentX = gsap.getProperty(gallery, 'x');

        // Hide left arrow at start, right arrow at end
        leftArrow.classList.toggle('hidden', currentX >= 0);
        rightArrow.classList.toggle('hidden', currentX <= bounds.minX);
      };

      // Scroll gallery function (used by arrows and keyboard)
      const scrollGallery = (direction) => {
        const bounds = updateBounds();
        const currentX = gsap.getProperty(gallery, 'x');
        let newX = currentX + (direction * scrollStep);

        // Clamp to bounds
        newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));

        gsap.to(gallery, {
          x: newX,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: updateArrowStates
        });
      };

      // Arrow click handlers
      leftArrow.addEventListener('click', () => scrollGallery(1)); // Positive = scroll left (show earlier)
      rightArrow.addEventListener('click', () => scrollGallery(-1)); // Negative = scroll right (show later)

      // =======================================================================
      // Keyboard Navigation
      // =======================================================================

      // Store reference to instance for keyboard handler
      const self = this;

      this.galleryKeyHandler = (e) => {
        // Only handle when collection view is active
        if (!self.activeView) return;

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          scrollGallery(1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          scrollGallery(-1);
        }
      };
      document.addEventListener('keydown', this.galleryKeyHandler);

      // =======================================================================
      // Horizontal Wheel/Touchpad Scroll
      // (2025 best practice: Safari doesn't respect overscroll-behavior for navigation)
      // We ALWAYS capture horizontal gestures to prevent browser back/forward
      // =======================================================================

      this.galleryWheelHandler = (e) => {
        // Only handle horizontal scrolling (touchpad two-finger swipe)
        const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);

        if (!isHorizontalScroll || Math.abs(e.deltaX) < 2) {
          // Let vertical scrolling happen normally
          return;
        }

        // ALWAYS prevent default for horizontal gestures in gallery
        // This stops browser back/forward navigation (Chrome & Safari)
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Extra insurance for Chrome

        const bounds = updateBounds();
        const currentX = gsap.getProperty(gallery, 'x');

        // Calculate new position with bounds clamping
        const newX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX - e.deltaX));

        // Only update if position actually changes (avoids unnecessary repaints)
        if (Math.abs(newX - currentX) > 0.1) {
          gsap.set(gallery, { x: newX });
          updateArrowStates();
        }
      };
      // Use capture phase (true) to intercept event BEFORE it bubbles - critical for Chrome
      gallerySection.addEventListener('wheel', this.galleryWheelHandler, { passive: false, capture: true });

      // =======================================================================
      // Resize Handler
      // =======================================================================

      let resizeTimeout;
      this.activeResizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          draggable.applyBounds(updateBounds());
          updateArrowStates();
        }, 150);
      };
      window.addEventListener('resize', this.activeResizeHandler);

      // Initial arrow state
      updateArrowStates();

      console.log('Gallery initialized with bounds:', updateBounds());
    }
  }

  // ==========================================================================
  // Standard Flip Card (for non-collection cards)
  // ==========================================================================

  class FlipCard {
    constructor(element) {
      this.el = element;
      this.isFlipped = false;
      this.bindEvents();
    }

    bindEvents() {
      this.el.addEventListener('click', () => this.toggle());
      this.el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
        if (e.key === 'Escape' && this.isFlipped) {
          this.close();
        }
      });
    }

    toggle() {
      this.isFlipped = !this.isFlipped;
      this.el.classList.toggle('flipped', this.isFlipped);
      this.el.setAttribute('aria-pressed', this.isFlipped);
    }

    close() {
      if (this.isFlipped) {
        this.isFlipped = false;
        this.el.classList.remove('flipped');
        this.el.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // ==========================================================================
  // Smart Header
  // ==========================================================================

  function initSmartHeader() {
    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= scrollThreshold) {
        document.body.classList.remove('header-hidden');
        lastScroll = currentScroll;
        return;
      }

      if (currentScroll > lastScroll) {
        document.body.classList.add('header-hidden');
      } else if (currentScroll < lastScroll) {
        document.body.classList.remove('header-hidden');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==========================================================================
  // Card Stacking (from original)
  // ==========================================================================

  function initCardStacking() {
    const cards = gsap.utils.toArray('.collection-card, .flip-card');

    if (cards.length === 0) return;

    const lastCard = cards[cards.length - 1];

    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1;

      if (!isLast) {
        ScrollTrigger.create({
          trigger: card,
          start: 'center center',
          endTrigger: lastCard,
          end: 'center center',
          pin: true,
          pinSpacing: false
        });
      }
    });
  }

  // ==========================================================================
  // Text Splitter
  // ==========================================================================

  class TextSplitter {
    constructor(element) {
      this.el = element;
      this.originalText = element.textContent;
      this.split();
    }

    split() {
      const text = this.originalText;
      const words = text.split(' ');
      let charIndex = 0;

      this.el.innerHTML = '';

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        [...word].forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';
          charSpan.textContent = char;
          charSpan.style.setProperty('--char-index', charIndex);
          wordSpan.appendChild(charSpan);
          charIndex++;
        });

        this.el.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          const space = document.createTextNode(' ');
          this.el.appendChild(space);
        }
      });
    }
  }

  // ==========================================================================
  // Lenis Smooth Scroll
  // ==========================================================================

  let lenisInstance = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Prevent Lenis from handling scroll inside collection views
      prevent: (node) => node.closest('.collection-view')
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return lenisInstance;
  }

  // Stop/start Lenis (best practice per Lenis docs - don't use destroy for modals)
  // https://github.com/darkroomengineering/lenis/discussions/292
  function stopLenis() {
    if (lenisInstance) {
      lenisInstance.stop();
    }
  }

  function startLenis() {
    if (lenisInstance) {
      lenisInstance.start();
    }
  }

  // ==========================================================================
  // Accessibility Announcer
  // ==========================================================================

  function announce(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => { announcer.textContent = ''; }, 1000);
    }
  }

  // ==========================================================================
  // Scroll Animations
  // ==========================================================================

  function initScrollAnimations() {
    // Hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.classList.add('animated');

    // What We Do section
    const whatWeDo = document.querySelector('.what-we-do');
    if (whatWeDo) {
      const splitText = whatWeDo.querySelector('.split-text');
      ScrollTrigger.create({
        trigger: whatWeDo,
        start: 'top 80%',
        onEnter: () => {
          if (splitText) splitText.classList.add('animated');
        }
      });
    }

    // Cards hint
    const cardsHint = document.querySelector('.cards-hint');
    const cardsSection = document.querySelector('.flip-cards-section');
    if (cardsHint && cardsSection) {
      ScrollTrigger.create({
        trigger: cardsSection,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => cardsHint.classList.add('visible'),
        onLeave: () => cardsHint.classList.remove('visible'),
        onEnterBack: () => cardsHint.classList.add('visible'),
        onLeaveBack: () => cardsHint.classList.remove('visible')
      });
    }

    // Steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      gsap.fromTo(step,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          delay: index * 0.1
        }
      );
    });
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    // Smart header
    initSmartHeader();

    // Split text
    document.querySelectorAll('[data-split="chars"]').forEach(el => {
      new TextSplitter(el);
    });

    // Initialize collection morph controller
    new CollectionMorph();

    // Initialize standard flip cards
    document.querySelectorAll('.flip-card').forEach(el => new FlipCard(el));

    // Lenis smooth scroll
    initLenis();

    // Card stacking
    initCardStacking();

    // Scroll animations
    initScrollAnimations();

    // Close cards on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.flip-card') && !e.target.closest('.collection-card')) {
        document.querySelectorAll('.flip-card.flipped').forEach(card => {
          card.classList.remove('flipped');
          card.setAttribute('aria-pressed', 'false');
        });
      }
    });

    console.log('Card Morph Prototype initialized (GSAP FLIP + Draggable)');
  });

})();
