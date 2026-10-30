/**
 * Pradeep UX Portfolio - Phone theme toggle (Framer pages)
 * Framer's phone header only shows its theme toggle inside the hamburger menu,
 * which is hidden now that navigation lives in the bottom bot nav. This adds a
 * standalone toggle; css/framer-responsive.css shows it on phone widths only.
 * It flips the same toggle-theme attribute Framer's own toggle uses.
 */

(function () {
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (document.querySelector('.phone-theme-toggle')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'phone-theme-toggle';
    document.body.appendChild(btn);

    const isDark = () => document.body.getAttribute('toggle-theme') === 'dark';

    function render() {
      // Sun in light mode, moon in dark mode, matching Framer's toggle
      btn.innerHTML = isDark() ? MOON : SUN;
      btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    }

    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('toggle-theme', next);
      document.body.setAttribute('toggle-theme', next);
    });

    // Stay in sync if Framer changes the theme (e.g. its own toggle on wider screens)
    new MutationObserver(render).observe(document.body, { attributes: true, attributeFilter: ['toggle-theme'] });
    render();
  }
})();
