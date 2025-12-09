/**
 * Elite Decor - Chapters Prototype (Option 4)
 *
 * Single-page experience with scroll-triggered chapter transitions
 * and horizontal scrolling galleries for collections.
 *
 * Based on 2025 best practices from:
 * - https://gsap.com/docs/v3/Plugins/ScrollTrigger/
 * - https://gsapify.com/gsap-scrolltrigger
 * - https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/
 * - https://webdesign.tutsplus.com/create-horizontal-scroll-animations-with-gsap-scrolltrigger--cms-108881t
 */

(function() {
  'use strict';

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ==========================================================================
  // Configuration
  // ==========================================================================

  const CONFIG = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    horizontalScrollMultiplier: 1, // How much vertical scroll = horizontal movement
    chapterRevealThreshold: 0.3
  };

  // ==========================================================================
  // Chapter Navigation Controller
  // ==========================================================================

  class ChapterNavigation {
    constructor() {
      this.dots = document.querySelectorAll('.chapter-dot');
      this.chapters = document.querySelectorAll('[data-chapter]');
      this.activeChapter = 'hero';

      this.init();
    }

    init() {
      // Bind click events
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const targetChapter = dot.dataset.chapter;
          this.scrollToChapter(targetChapter);
        });
      });

      // Set up scroll tracking for each chapter
      this.chapters.forEach(chapter => {
        const chapterId = chapter.dataset.chapter;

        ScrollTrigger.create({
          trigger: chapter,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => this.setActiveChapter(chapterId),
          onEnterBack: () => this.setActiveChapter(chapterId)
        });
      });
    }

    setActiveChapter(chapterId) {
      if (this.activeChapter === chapterId) return;

      this.activeChapter = chapterId;

      this.dots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.chapter === chapterId);
      });
    }

    scrollToChapter(chapterId) {
      const chapter = document.querySelector(`[data-chapter="${chapterId}"]`);
      if (!chapter) return;

      // Use GSAP for smooth scroll
      gsap.to(window, {
        scrollTo: { y: chapter, offsetY: 0 },
        duration: 1,
        ease: 'power3.inOut'
      });
    }
  }

  // ==========================================================================
  // Horizontal Scroll Gallery
  // Based on GSAP's recommended containerAnimation pattern (2025)
  // ==========================================================================

  class HorizontalScrollGallery {
    constructor(section) {
      this.section = section;
      this.wrapper = section.querySelector('.horizontal-scroll-wrapper');
      this.track = section.querySelector('.horizontal-scroll-track');
      this.progressFill = section.querySelector('.scroll-progress-fill');

      if (!this.wrapper || !this.track) return;

      this.init();
    }

    init() {
      // Wait for images to load to get accurate dimensions
      const images = this.track.querySelectorAll('img');
      let loadedCount = 0;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          this.setupScrollTrigger();
        }
      };

      images.forEach(img => {
        if (img.complete) {
          onImageLoad();
        } else {
          img.addEventListener('load', onImageLoad);
          img.addEventListener('error', onImageLoad);
        }
      });

      // Fallback if images don't load
      setTimeout(() => {
        if (loadedCount < images.length) {
          this.setupScrollTrigger();
        }
      }, 3000);
    }

    setupScrollTrigger() {
      // Calculate scroll distance
      const trackWidth = this.track.scrollWidth;
      const viewportWidth = this.wrapper.offsetWidth;
      const scrollDistance = trackWidth - viewportWidth;

      if (scrollDistance <= 0) return;

      // Set section height to create scroll space
      // Using 100vh + scroll distance equivalent
      const scrollHeight = scrollDistance * CONFIG.horizontalScrollMultiplier;
      this.section.style.height = `${viewportWidth + scrollHeight}px`;

      // Create the horizontal scroll animation
      const tween = gsap.to(this.track, {
        x: -scrollDistance,
        ease: 'none' // Critical: must be linear for scrubbing
      });

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: this.section,
        start: 'top top',
        end: `+=${scrollHeight}`,
        pin: this.wrapper,
        animation: tween,
        scrub: 1, // 1 second "catch-up" for smooth motion
        invalidateOnRefresh: true, // Recalculate on resize
        onUpdate: (self) => {
          // Update progress indicator
          if (this.progressFill) {
            this.progressFill.style.width = `${self.progress * 100}%`;
          }
        }
      });
    }
  }

  // ==========================================================================
  // Collection Chapter Animations
  // ==========================================================================

  class CollectionChapter {
    constructor(chapter) {
      this.chapter = chapter;
      this.hero = chapter.querySelector('.collection-chapter-hero');
      this.infoSection = chapter.querySelector('.collection-info-section');

      this.init();
    }

    init() {
      // Hero reveal animation
      if (this.hero) {
        ScrollTrigger.create({
          trigger: this.hero,
          start: 'top 80%',
          onEnter: () => {
            this.chapter.classList.add('in-view');
          }
        });

        // Parallax effect on hero background
        if (!CONFIG.reducedMotion) {
          const bg = this.hero.querySelector('.collection-chapter-bg img');
          if (bg) {
            gsap.to(bg, {
              yPercent: 20,
              ease: 'none',
              scrollTrigger: {
                trigger: this.hero,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            });
          }
        }
      }

      // Info section reveal
      if (this.infoSection && !CONFIG.reducedMotion) {
        const storyElements = this.infoSection.querySelectorAll('.collection-story > *');
        const detailBlocks = this.infoSection.querySelectorAll('.detail-block');

        gsap.fromTo(storyElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.infoSection,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(detailBlocks,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.infoSection,
              start: 'top 60%',
              toggleActions: 'play none none none'
            }
          }
        );
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

  function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  // ==========================================================================
  // General Scroll Animations
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

    // Steps animation
    const steps = document.querySelectorAll('.step');
    if (!CONFIG.reducedMotion) {
      steps.forEach((step, index) => {
        gsap.fromTo(step,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
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

    // Footer reveal
    const footer = document.querySelector('.site-footer');
    if (footer && !CONFIG.reducedMotion) {
      gsap.fromTo(footer,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
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

    // Initialize Lenis smooth scroll
    initLenis();

    // Initialize chapter navigation
    new ChapterNavigation();

    // Initialize collection chapters
    document.querySelectorAll('.chapter-collection').forEach(chapter => {
      new CollectionChapter(chapter);
    });

    // Initialize horizontal scroll galleries
    document.querySelectorAll('.horizontal-scroll-section').forEach(section => {
      new HorizontalScrollGallery(section);
    });

    // General scroll animations
    initScrollAnimations();

    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();

    console.log('Chapters Prototype initialized (GSAP ScrollTrigger Horizontal Scroll)');
  });

  // Refresh on resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

})();
