/**
 * Pradeep UX Portfolio - Case study view toggle (.ds-viewtoggle)
 * - Two views share one page: the case study (default) and Design decisions
 * - Tabs follow the ARIA pattern: click, or Left/Right/Home/End to move
 * - ?view=decisions or a #link into the second view opens it directly
 * - Tells js/case-study.js to rebuild the contents rail ('cs:viewchange')
 * Without JS both views stay visible, one after the other.
 */

(function () {
  const toggle = document.querySelector('.ds-viewtoggle');
  if (!toggle) return;

  const tabs = [...toggle.querySelectorAll('[role="tab"]')];
  const views = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  if (views.some(v => !v)) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = -1;

  function viewIndexFor(el) {
    return views.findIndex(v => v.contains(el));
  }

  function select(i, opts = {}) {
    if (i === current) return;
    const first = current === -1;
    current = i;

    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    views.forEach((v, k) => { v.hidden = k !== i; });

    if (!first && !reduceMotion) {
      const v = views[i];
      v.classList.remove('is-entering');
      void v.offsetWidth; // restart the animation
      v.classList.add('is-entering');
      v.addEventListener('animationend', () => v.classList.remove('is-entering'), { once: true });
    }

    // Keep the choice in the URL so the view can be shared or reloaded
    if (!first && opts.updateUrl !== false) {
      const url = new URL(window.location.href);
      if (i === 0) url.searchParams.delete('view');
      else url.searchParams.set('view', views[i].dataset.view);
      url.hash = '';
      history.replaceState(null, '', url);
    }

    document.dispatchEvent(new CustomEvent('cs:viewchange', { detail: { view: views[i].dataset.view } }));

    // Start the new view from its top rather than mid-page
    if (opts.scroll) {
      const top = views[i].getBoundingClientRect().top + window.scrollY - 96;
      if (window.scrollY > top) window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, { scroll: true }));
    tab.addEventListener('keydown', e => {
      const n = tabs.length;
      const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      tabs[next].focus();
      select(next, { scroll: true });
    });
  });

  // Links to a section in the other view (e.g. a shared #decision-2 URL) switch views first
  function openFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id && document.getElementById(id);
    const i = target ? viewIndexFor(target) : -1;
    if (i === -1 || i === current) return false;
    select(i, { updateUrl: false });
    target.scrollIntoView();
    return true;
  }

  window.addEventListener('hashchange', openFromHash);

  const param = new URL(window.location.href).searchParams.get('view');
  const fromParam = views.findIndex(v => v.dataset.view === param);
  if (!openFromHash()) select(fromParam > -1 ? fromParam : 0);

  /* --- First-visit nudge: "Short on time? See the 4 key design decisions" ---
     Shown on the case study view until it's used or dismissed (remembered per
     browser). Steps aside while the reader scrolls down, returns near the top. */
  const hint = document.querySelector('.ds-viewhint');
  // One flag per case study, so dismissing it on one page doesn't hide it on another
  const HINT_KEY = 'ds-decisions-hint:' + window.location.pathname.split('/').pop();
  const store = {
    get() { try { return localStorage.getItem(HINT_KEY); } catch (e) { return null; } },
    set() { try { localStorage.setItem(HINT_KEY, 'done'); } catch (e) { /* private mode */ } },
  };
  if (!hint || store.get() || current !== 0) return;

  let done = false;
  function retire() {
    if (done) return;
    done = true;
    store.set();
    window.removeEventListener('scroll', onScroll);
    if (reduceMotion) { hint.hidden = true; return; }
    hint.classList.add('is-leaving');
    setTimeout(() => { hint.hidden = true; }, 200);
  }
  function onScroll() {
    const away = window.scrollY > 240;
    hint.classList.toggle('is-leaving', away);
    hint.inert = away;
  }

  hint.hidden = false;
  hint.querySelector('.ds-viewhint__go').addEventListener('click', () => {
    retire();
    tabs[1].focus();
    select(1, { scroll: true });
  });
  hint.querySelector('.ds-viewhint__x').addEventListener('click', () => { retire(); tabs[0].focus(); });
  document.addEventListener('cs:viewchange', e => { if (e.detail.view !== views[0].dataset.view) retire(); });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
