/**
 * Pradeep UX Portfolio - Phone theme toggle (Framer pages)
 * Framer's phone header only shows its theme toggle inside the hamburger menu,
 * which is hidden now that navigation lives in the bottom bot nav. This adds a
 * standalone toggle; css/framer-responsive.css shows it on phone widths only.
 * It flips the same toggle-theme attribute Framer's own toggle uses.
 *
 * It also persists the theme across pages. Framer's toggle always starts as
 * "light" and writes that to localStorage (currentToggleState) and the
 * toggle-theme attribute every time a page loads, so the visitor's real choice
 * lives in our own key, pradeep_theme (js/main.js reads it too). When Framer
 * resets the theme on load, we click Framer's toggle once so its own state,
 * icon and the page all match the saved theme again.
 */

(function () {
  const KEY = 'pradeep_theme';

  function readTheme() {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(KEY, theme);
      localStorage.setItem('currentToggleState', theme);
    } catch (e) {}
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('toggle-theme', theme);
    if (document.body) document.body.setAttribute('toggle-theme', theme);
  }

  // A theme change right after the visitor clicks a theme toggle is their choice.
  // Clicks on links (e.g. "Work" in the bot nav) don't count: the next page's
  // Framer reset must not be mistaken for a choice.
  let lastInteraction = 0;
  let syncing = false;
  ['pointerdown', 'click', 'keydown'].forEach((type) =>
    window.addEventListener(type, (e) => {
      if (syncing) return;
      if (e.target && e.target.closest && e.target.closest('a[href]')) return;
      lastInteraction = Date.now();
    }, true)
  );

  // Framer's own toggle: its "Light"/"Dark" variant element carries the click handler.
  function framerToggle() {
    const variants = [...document.querySelectorAll('[data-framer-name="Light"], [data-framer-name="Dark"]')]
      .filter((el) => !el.closest('a') && el.parentElement && el.parentElement.getAttribute('tabindex') === '0');
    return variants.find((el) => el.getBoundingClientRect().width > 0) || variants[0] || null;
  }

  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (document.querySelector('.phone-theme-toggle')) return;

    setTheme(readTheme());

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
      saveTheme(next);
      // Go through Framer's toggle when it exists so its own state stays in step
      const toggle = framerToggle();
      syncing = true;
      if (toggle) toggle.click();
      syncing = false;
      if ((isDark() ? 'dark' : 'light') !== next) setTheme(next);
    });

    // Stay in sync with Framer: keep the visitor's change, undo Framer's load-time reset.
    let restoreQueued = false;
    let framerSynced = false;
    new MutationObserver(() => {
      const current = isDark() ? 'dark' : 'light';
      const saved = readTheme();
      if (current !== saved) {
        if (!syncing && Date.now() - lastInteraction < 1500) {
          saveTheme(current);
        } else if (!restoreQueued) {
          restoreQueued = true;
          // Put the saved theme back right away (observer callbacks run before
          // the next paint), so Framer's load-time reset never shows a light frame.
          setTheme(saved);
          setTimeout(() => {
            restoreQueued = false;
            const want = readTheme();
            // Framer's own toggle still thinks it is light: flip it once so its
            // state and icon match. It sets the attributes itself.
            if (!framerSynced) {
              const toggle = framerToggle();
              if (toggle) {
                framerSynced = true;
                syncing = true;
                toggle.click();
                syncing = false;
              }
            }
            if ((isDark() ? 'dark' : 'light') !== want) setTheme(want);
            saveTheme(want);
          }, 0);
          return;
        }
      }
      if (document.documentElement.getAttribute('toggle-theme') !== current) {
        document.documentElement.setAttribute('toggle-theme', current);
      }
      render();
    }).observe(document.body, { attributes: true, attributeFilter: ['toggle-theme'] });
    render();
  }
})();
