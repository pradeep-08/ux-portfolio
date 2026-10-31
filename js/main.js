/**
 * Pradeep UX Portfolio - Main Interactions
 * Features:
 * - Theme switcher (Dark / Light) with system sync & local persistence
 * - Interactive Draggable Canvas Cards (Drag & Explore)
 * - Mobile Navigation Toggle
 * - Category Filter for Projects Page
 * - Active Navigation Link Detection
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initDraggableCards();
  initProjectFilters();
  initPrintResume();
  initRotatingWord();
});

/* --- Theme Management --- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  // Light by default, whatever the system setting. A choice made here or on the
  // Framer pages (saved as currentToggleState) carries over between pages.
  const storedTheme = localStorage.getItem('currentToggleState') || localStorage.getItem('pradeep_theme');

  const currentTheme = storedTheme === 'dark' ? 'dark' : 'light';
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('pradeep_theme', nextTheme);
      localStorage.setItem('currentToggleState', nextTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        // Show Sun icon to switch to light
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        // Show Moon icon to switch to dark
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }
}

/* --- Mobile Navigation --- */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const header = document.querySelector('.site-header');

  if (mobileBtn && header) {
    mobileBtn.addEventListener('click', () => {
      header.classList.toggle('mobile-nav-active');
      const isExpanded = header.classList.contains('mobile-nav-active');
      mobileBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('mobile-nav-active');
      });
    });
  }
}

/* --- Interactive Draggable Canvas Cards --- */
function initDraggableCards() {
  const cards = document.querySelectorAll('.canvas-card, .floating-badge');
  if (!cards.length) return;

  cards.forEach(card => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons or links inside the card
      if (e.target.closest('button, a, input')) return;
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      card.style.transition = 'none';
      card.style.zIndex = '20';

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      card.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px)`;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
      currentX += (clientX - startX);
      currentY += (clientY - startY);
      card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      card.style.zIndex = '5';

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    card.addEventListener('pointerdown', onPointerDown);
  });
}

/* --- Project Category Filter (for projects.html) --- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --- Resume Print Helper --- */
function initPrintResume() {
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }
}

/* --- Rotating Word in Footer (create -> design -> build) --- */
function initRotatingWord() {
  const rotatingElements = document.querySelectorAll('.rotating-word');
  if (!rotatingElements.length) return;

  const words = ['create', 'design', 'build'];
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % words.length;
    rotatingElements.forEach(el => {
      el.classList.add('fade-out');
      setTimeout(() => {
        el.textContent = words[currentIndex];
        el.classList.remove('fade-out');
        el.classList.add('fade-in');
        setTimeout(() => {
          el.classList.remove('fade-in');
        }, 300);
      }, 300);
    });
  }, 2400);
}

/* --- Remove Any Stray Framer Badges or Edit Content Floating Overlays --- */
(function removeFramerBadges() {
  function cleanup() {
    const badge = document.getElementById('__framer-badge-container');
    if (badge) badge.style.setProperty('display', 'none', 'important');
    const editor = document.getElementById('__framer-editorbar');
    if (editor) editor.remove();
    document.querySelectorAll('#__framer-badge-container, .__framer-badge, #__framer-editorbar, [data-framer-name="Edit Content"]').forEach(el => {
      el.remove();
    });
  }
  cleanup();
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', cleanup);
    window.addEventListener('load', cleanup);
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(cleanup).observe(document.documentElement, { childList: true, subtree: true });
    }
  }
})();

