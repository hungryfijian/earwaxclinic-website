/**
 * Scroll-triggered animations for the Earwax Clinic Network website
 * Handles intersection observer for fade-in and slide-in effects
 * Includes accessibility support and reduced motion preferences
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Only run if IntersectionObserver is supported and user hasn't requested reduced motion
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  // Options for the intersection observer
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation 50px before element comes into view
  };

  // Create intersection observer
  const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add 'in-view' class to trigger animation
        entry.target.classList.add('in-view');

        // Optionally unobserve after animation to improve performance
        // scrollAnimationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Function to initialize scroll animations
  function initScrollAnimations() {
    // Select all elements with scroll animation classes
    const animationElements = document.querySelectorAll(`
      .scroll-fade-in,
      .scroll-slide-left,
      .scroll-slide-right,
      .scroll-zoom-in
    `);

    // Observe each element
    animationElements.forEach((el) => {
      scrollAnimationObserver.observe(el);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // Re-initialize on navigation for SPAs (if needed)
  window.addEventListener('load', initScrollAnimations);
}

// Fallback for browsers without IntersectionObserver or users who prefer reduced motion
else {
  // Add 'in-view' class to all scroll animation elements immediately
  function fallbackScrollAnimations() {
    const animationElements = document.querySelectorAll(`
      .scroll-fade-in,
      .scroll-slide-left,
      .scroll-slide-right,
      .scroll-zoom-in
    `);

    animationElements.forEach((el) => {
      el.classList.add('in-view');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fallbackScrollAnimations);
  } else {
    fallbackScrollAnimations();
  }
}