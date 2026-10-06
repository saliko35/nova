/**
 * Nova Landing Page - Main JavaScript Application Logic
 * Clean, semantic, modular and accessible ES6+ implementation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. DOM Elements Selection
  // -------------------------------------------------------------------------
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const siteHeader = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitSpinner = document.getElementById('submitSpinner');
  const toastNotification = document.getElementById('toastNotification');
  const toastCloseBtn = document.getElementById('toastCloseBtn');
  const currentYearSpan = document.getElementById('currentYear');

  // Set current year dynamically in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Theme Toggle (Dark & Light Mode) with LocalStorage
  // -------------------------------------------------------------------------
  const initTheme = () => {
    const savedTheme = localStorage.getItem('nova_theme');
    if (savedTheme) {
      htmlElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark mode or system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'dark'); // dark is default aesthetic
    }
  };

  const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nova_theme', newTheme);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer & Hamburger Menu
  // -------------------------------------------------------------------------
  const toggleMobileNav = () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    hamburgerBtn.classList.toggle('active');
    mainNav.classList.toggle('open');
  };

  const closeMobileNav = () => {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.classList.remove('active');
    mainNav.classList.remove('open');
  };

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside of nav
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Header Shadow & Back to Top on Scroll
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Header styling on scroll
    if (siteHeader) {
      if (scrollPos > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Active Nav Link on Scroll (Intersection Observer)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, sectionObserverOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // -------------------------------------------------------------------------
  // 6. Scroll Reveal Animations
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // -------------------------------------------------------------------------
  // 7. Toast Notification Handler
  // -------------------------------------------------------------------------
  let toastTimer = null;

  const showToast = (title, message) => {
    if (!toastNotification) return;

    const titleEl = document.getElementById('toastTitle');
    const descEl = document.getElementById('toastDesc');

    if (titleEl && title) titleEl.textContent = title;
    if (descEl && message) descEl.textContent = message;

    toastNotification.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 5000);
  };

  if (toastCloseBtn && toastNotification) {
    toastCloseBtn.addEventListener('click', () => {
      toastNotification.classList.remove('active');
      if (toastTimer) clearTimeout(toastTimer);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Contact Form Client-side Validation & Submission
  // -------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('userMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    const validateEmail = (email) => {
      // Standard robust email pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(email).toLowerCase());
    };

    const validateField = (input, errorEl, isValid) => {
      if (!isValid) {
        input.classList.add('input-error');
        if (errorEl) errorEl.classList.add('visible');
        return false;
      } else {
        input.classList.remove('input-error');
        if (errorEl) errorEl.classList.remove('visible');
        return true;
      }
    };

    // Live validation on blur & input
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('input-error')) {
        validateField(nameInput, nameError, nameInput.value.trim().length >= 2);
      }
    });

    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('input-error')) {
        validateField(emailInput, emailError, validateEmail(emailInput.value.trim()));
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('input-error')) {
        validateField(messageInput, messageError, messageInput.value.trim().length >= 10);
      }
    });

    // Form Submit Event
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, emailError, validateEmail(emailInput.value.trim()));
      const isMsgValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10);

      if (!isNameValid || !isEmailValid || !isMsgValid) {
        return; // Don't submit if invalid
      }

      // Enter loading state
      const submitText = submitBtn.querySelector('.btn-text');
      const sendIcon = submitBtn.querySelector('.send-icon');

      submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'იგზავნება...';
      if (submitSpinner) submitSpinner.classList.remove('hidden');
      if (sendIcon) sendIcon.style.display = 'none';

      // Simulate asynchronous API request (e.g. 1.2s delay)
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'შეტყობინების გაგზავნა';
        if (submitSpinner) submitSpinner.classList.add('hidden');
        if (sendIcon) sendIcon.style.display = 'block';

        // Show Toast Feedback
        showToast(
          'შეტყობინება წარმატებით გაიგზავნა!',
          `გმადლობთ ${nameInput.value.trim()}, ჩვენი გუნდი მალე დაგიკავშირდებათ.`
        );

        // Reset form inputs
        contactForm.reset();
        [nameInput, emailInput, messageInput].forEach(inp => inp.classList.remove('input-error'));
      }, 1200);
    });
  }
});
