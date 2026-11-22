/**
 * Pradeep UX Portfolio - Project cards
 * - Projects page: inserts the bento grid after Framer's own project list and
 *   hides that list (via body.has-project-grid). If this script fails, Framer's
 *   list stays visible.
 * - Home page: Framer's phone layout has a "Selected work" intro but no projects,
 *   so the same cards are added under it (shown on phone only, see CSS).
 */

(function () {
  // Single source for project cards. `img` stays null until a verified Figma export
  // exists (see docs/missing-case-study-assets.md); cards then show a text cover.
  // `featured` projects also appear under "Selected work" on the phone home page.
  const PROJECTS = [
    { href: 'lomo-track.html', kicker: 'B2B · Logistics and IoT', name: 'LOMO Track', platform: 'Mobile · Office project', pitch: 'Making tanker trips easier to understand on the move', img: null, wide: true, featured: true },
    { href: 'curio-snap.html', kicker: 'EdTech · Robotics and AI', name: 'Curio Snap', platform: 'Web · Freelance', pitch: 'Helping learners connect visual code with real-world robotics', img: null, featured: true },
    { href: 'facility-management.html', kicker: 'B2B · Facility operations', name: 'Facility Management', platform: 'Mobile · Office project', pitch: 'Connecting facility tasks from assignment to completion', img: null, featured: true },
    { href: 'gcc-safe-subway.html', kicker: 'Public-sector operations', name: 'GCC Safe Subway', platform: 'Mobile · Office project', pitch: 'Making subway barrier operations clear and deliberate', img: null },
    { href: 'e-seal.html', kicker: 'B2B · Asset and seal operations', name: 'E-Seal', platform: 'Web · Office project', pitch: 'Bringing seal activity into one operational view', img: null },
    { href: 'kriti-attendance.html', kicker: 'Enterprise · B2E', name: 'Kriti Attendance', platform: 'Mobile · Office project', pitch: 'Making daily attendance clearer, from registration to check-out', img: null },
  ];

  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

  function media(p) {
    if (p.img) return `<div class="pcard__media"><img src="${p.img}" alt="" loading="lazy" /></div>`;
    return `<div class="pcard__media pcard__media--text"><span class="pcard__platform">${p.platform}</span><span class="pcard__pitch">${p.pitch}</span></div>`;
  }

  const ICON_GRID = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="5.5" height="7.5" rx="1.5"/><rect x="9" y="1.5" width="5.5" height="4.5" rx="1.5"/><rect x="1.5" y="11" width="5.5" height="3.5" rx="1.5"/><rect x="9" y="8" width="5.5" height="6.5" rx="1.5"/></svg>';
  const ICON_SHELF = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.5" y="2.5" width="7" height="11" rx="1.5"/><rect x="1" y="4" width="2" height="8" rx="1"/><rect x="13" y="4" width="2" height="8" rx="1"/></svg>';
  // Grid size slider: five fixed stages, left = smallest cards, right = largest.
  // The thumb always snaps to a stage; there are no in-between layouts.
  const COLS = [5, 4, 3, 2, 1];
  const DEFAULT_STAGE = 2; // centre of the slider: 3 per row
  const MIN_CARD = 210;    // a stage never squeezes cards narrower than this
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // quick start, soft landing
  const SIZE_KEY = 'pg-size-v2'; // new key so the centre default applies once

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { /* storage blocked: views still work, just not remembered */ }
    return null;
  }

  function cardHtml(p) {
    return `
      <li class="pgrid__item${p.wide ? ' pgrid__item--wide' : ''}">
        <a class="pcard" href="${p.href}">
          ${media(p)}
          <div class="pcard__foot">
            <h3 class="pcard__title"><span>${p.kicker}</span><strong>${p.name}</strong></h3>
            <span class="pcard__btn" aria-hidden="true">${ARROW}<span class="pcard__label">View case</span></span>
          </div>
        </a>
      </li>`;
  }

  // Shelf cover: the solution line sits under the card, so the text cover shows
  // the project name instead of repeating it.
  function shelfMedia(p) {
    if (p.img) return media(p);
    return `<div class="pcard__media pcard__media--text"><span class="pcard__platform">${p.platform}</span><span class="pcard__pitch">${p.name}</span></div>`;
  }

  function build(home) {
    const list = home ? PROJECTS.filter(p => p.featured) : PROJECTS;
    const section = document.createElement('section');
    section.className = 'pgrid';
    section.setAttribute('aria-label', home ? 'Featured projects' : 'All projects');
    const gridHtml = '<ul class="pgrid__list">' + list.map(cardHtml).join('') + '</ul>';
    if (home) {
      section.innerHTML = gridHtml;
      return section;
    }

    section.innerHTML = `
      <div class="pview">
        <div class="pview__toggle" role="group" aria-label="Layout">
          <span class="pview__glider" aria-hidden="true"></span>
          <button type="button" class="pview__btn" data-view="grid" aria-pressed="true">${ICON_GRID}<span>Grid</span></button>
          <button type="button" class="pview__btn" data-view="shelf" aria-pressed="false">${ICON_SHELF}<span>Shelf</span></button>
        </div>
        <div class="pview__size" role="slider" tabindex="0" aria-label="Card size" aria-valuemin="1" aria-valuemax="${COLS.length}">
          <span class="pview__rail" aria-hidden="true">
            <span class="pview__fill"></span>
            ${COLS.map((_, i) => `<i style="left:${(i / (COLS.length - 1)) * 100}%"></i>`).join('')}
            <span class="pview__thumb"></span>
          </span>
        </div>
      </div>
      ${gridHtml}
      <div class="pshelf" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Projects shelf. Use the left and right arrow keys to browse." hidden>
        <p class="pshelf__title" aria-live="polite"></p>
        <div class="pshelf__stage">
          ${list.map((p, i) => `<a class="pshelf__card" href="${p.href}" data-i="${i}" aria-label="${p.name}: ${p.pitch}" draggable="false">${shelfMedia(p)}<span class="pshelf__cta" aria-hidden="true">Click to read ${ARROW}</span></a>`).join('')}
        </div>
        <p class="pshelf__sub"></p>
      </div>`;

    setupViews(section, list);
    return section;
  }

  function setupViews(section, list) {
    const gridList = section.querySelector('.pgrid__list');
    const items = [...gridList.children];
    const shelf = section.querySelector('.pshelf');
    const stage = shelf.querySelector('.pshelf__stage');
    const cards = [...stage.children];
    const title = shelf.querySelector('.pshelf__title');
    const sub = shelf.querySelector('.pshelf__sub');
    const btns = [...section.querySelectorAll('.pview__btn')];
    const size = section.querySelector('.pview__size');
    const rail = size.querySelector('.pview__rail');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0;
    let view = null;
    let sizeStage = DEFAULT_STAGE;

    const canAnimate = () => !reduceMotion.matches && typeof Element.prototype.animate === 'function';

    // --- Grid: FLIP layout animation. Each item slides from its old box to its new
    //     one, and the card's own width/height animate too, so text reflows instead
    //     of being stretched by a scale transform. ---
    function morphGrid(change) {
      if (!canAnimate() || gridList.hidden) { change(); return; }
      const before = items.map(li => li.getBoundingClientRect());
      items.forEach(li => li.getAnimations({ subtree: true }).forEach(a => a.cancel()));
      change();
      items.forEach((li, i) => {
        const was = before[i];
        const now = li.getBoundingClientRect();
        if (!was.width || !now.width) return;
        const dx = was.left - now.left;
        const dy = was.top - now.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(was.width - now.width) < 1) return;
        const opts = { duration: 420, easing: EASE };
        li.style.zIndex = '1';
        li.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], opts)
          .finished.then(() => { li.style.zIndex = ''; }, () => {});
        li.firstElementChild.animate([
          { width: was.width + 'px', height: was.height + 'px' },
          { width: now.width + 'px', height: now.height + 'px' },
        ], opts);
      });
    }

    // Column count for a stage, capped so cards never get narrower than MIN_CARD
    function colsFor(stageIdx) {
      const w = gridList.clientWidth || 1240;
      const fit = Math.max(1, Math.floor((w + 20) / (MIN_CARD + 20)));
      return Math.min(COLS[stageIdx], fit);
    }

    function applyCols() {
      const cols = colsFor(sizeStage);
      gridList.style.setProperty('--pg-cols', cols);
      gridList.dataset.cols = cols;
    }

    function placeThumb(ratio) {
      size.style.setProperty('--pv-pos', ratio * 100 + '%');
    }

    function setSize(next, animate = true) {
      next = Math.max(0, Math.min(COLS.length - 1, Math.round(next)));
      const changed = next !== sizeStage;
      sizeStage = next;
      placeThumb(next / (COLS.length - 1));
      size.setAttribute('aria-valuenow', String(next + 1));
      const cols = COLS[next];
      size.setAttribute('aria-valuetext', cols === 1 ? '1 card per row' : cols + ' cards per row');
      if (changed && animate) morphGrid(applyCols); else applyCols();
      store(SIZE_KEY, String(next));
    }

    // Slider: while dragging the thumb follows the pointer and the layout jumps
    // stage by stage; on release the thumb settles onto the nearest stage.
    function ratioAt(clientX) {
      const r = rail.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    }
    let sliding = false;
    size.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      size.setPointerCapture(e.pointerId);
      sliding = true;
      size.classList.add('is-dragging');
      const ratio = ratioAt(e.clientX);
      setSize(ratio * (COLS.length - 1));
      placeThumb(ratio);
    });
    size.addEventListener('pointermove', e => {
      if (!sliding) return;
      const ratio = ratioAt(e.clientX);
      const next = Math.round(ratio * (COLS.length - 1));
      if (next !== sizeStage) setSize(next);
      placeThumb(ratio);
    });
    const endSlide = () => {
      if (!sliding) return;
      sliding = false;
      size.classList.remove('is-dragging');
      placeThumb(sizeStage / (COLS.length - 1));
    };
    size.addEventListener('pointerup', endSlide);
    size.addEventListener('pointercancel', endSlide);
    size.addEventListener('keydown', e => {
      const keys = {
        ArrowRight: sizeStage + 1, ArrowUp: sizeStage + 1,
        ArrowLeft: sizeStage - 1, ArrowDown: sizeStage - 1,
        Home: 0, End: COLS.length - 1,
      };
      if (e.key in keys) {
        e.preventDefault();
        setSize(keys[e.key]);
      }
    });

    // --- Toggle: a white pill glides under the chosen button ---
    const glider = section.querySelector('.pview__glider');
    function placeGlider() {
      const b = btns.find(x => x.getAttribute('aria-pressed') === 'true');
      if (!b || !b.offsetWidth) return;
      glider.style.width = b.offsetWidth + 'px';
      glider.style.transform = `translateX(${b.offsetLeft}px)`;
    }

    // --- View switch: the old view fades out quickly, then the new one comes in.
    //     Grid cards rise in one after another; shelf cards fan out from the centre.
    //     Entering the shelf always starts again at the first project. ---
    let swapToken = 0;
    function setView(v, animate = true) {
      if (v === view) return;
      const from = view;
      view = v;
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
      placeGlider();
      size.classList.toggle('is-off', v !== 'grid');
      size.setAttribute('aria-hidden', String(v !== 'grid'));
      size.tabIndex = v === 'grid' ? 0 : -1;
      // A folded-away slider must not keep focus, or it would swallow the arrow keys
      if (v !== 'grid' && size.contains(document.activeElement)) {
        btns.find(b => b.dataset.view === v).focus({ preventScroll: true });
      }
      section.dataset.layout = v;
      store('pg-view', v);

      const anim = animate && !!from && canAnimate();
      const token = ++swapToken;
      const show = () => {
        if (token !== swapToken) return;
        [gridList, shelf].forEach(el => el.getAnimations().forEach(a => a.cancel()));
        gridList.hidden = v !== 'grid';
        shelf.hidden = v !== 'shelf';
        if (v === 'shelf') {
          active = 0;
          enterShelf(anim);
        } else {
          applyCols();
          if (anim) items.forEach((li, i) => li.animate(
            [{ opacity: 0, transform: 'translateY(14px) scale(0.98)' }, { opacity: 1, transform: 'none' }],
            { duration: 340, delay: Math.min(i, 8) * 30, easing: EASE, fill: 'backwards' }
          ));
        }
      };
      if (!anim) { show(); return; }
      const out = from === 'grid' ? gridList : shelf;
      out.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.985)' }],
        // ease-out, not ease-in: the old view starts leaving the instant it's clicked
        { duration: 150, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' }
      ).finished.then(show, () => {});
    }
    btns.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

    function enterShelf(anim) {
      if (!anim) { layout(false); return; }
      // Start every card stacked in the centre, then let layout() fan them out
      cards.forEach(c => {
        c.style.transition = 'none';
        c.style.transform = 'translate(-50%, -50%) scale(0.92)';
        c.style.opacity = '0';
      });
      void stage.offsetWidth;
      cards.forEach((c, i) => {
        c.style.transition = '';
        c.style.transitionDelay = Math.abs(i - active) * 28 + 'ms';
      });
      layout(true);
      setTimeout(() => cards.forEach(c => { c.style.transitionDelay = ''; }), 700);
    }

    // --- Shelf: centre card flat, the others stacked on each side and turned toward it ---
    function layout(animCaption = true) {
      if (!stage.clientWidth) return;
      // Fitted to the reference: side cards are pushed back (z) and turned ~73deg so
      // their far edge stays tall and the edge next to the centre card recedes.
      // translateX is divided by the perspective shrink so screen offsets stay exact.
      const cw = cards[0].offsetWidth;
      const phone = stage.clientWidth < 700;
      const z = -0.92 * cw;
      const persp = 4 * cw;
      const shrink = persp / (persp - z);
      const first = (phone ? 0.64 : 0.7) * cw;
      const step = (phone ? 0.05 : 0.058) * cw;
      cards.forEach((card, i) => {
        const d = i - active;
        const n = Math.abs(d);
        const dir = Math.sign(d);
        card.style.transform = d === 0
          ? 'translate(-50%, -50%)'
          : `translate(-50%, -50%) translate3d(${(dir * (first + (n - 1) * step)) / shrink}px, 0, ${z}px) rotateY(${-dir * 73}deg)`;
        card.style.zIndex = String(100 - n);
        card.style.opacity = n > 7 ? '0' : '1';
        card.classList.toggle('is-active', d === 0);
        card.tabIndex = d === 0 ? 0 : -1;
      });
      // Heading above the card = project name, line below = the solution
      const p = list[active];
      if (title.textContent === p.name) return;
      title.textContent = p.name;
      sub.textContent = p.pitch;
      if (animCaption && canAnimate()) [title, sub].forEach(el => el.animate(
        [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: EASE }
      ));
    }

    function go(i) {
      const next = Math.max(0, Math.min(list.length - 1, i));
      if (next === active) return;
      active = next;
      layout();
    }

    // "Click to read" pill follows the pointer over the centre card
    stage.addEventListener('pointermove', e => {
      const card = e.target.closest('.pshelf__card.is-active');
      if (!card || e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    });

    // A side card click brings it to the centre; a centre card click opens the case study
    let dragged = false;
    stage.addEventListener('click', e => {
      const card = e.target.closest('.pshelf__card');
      if (!card) return;
      if (dragged || !card.classList.contains('is-active')) {
        e.preventDefault();
        if (!dragged) go(+card.dataset.i);
      }
    });

    // Arrow keys browse the shelf whenever it is showing and on screen; focus does
    // not have to be inside it. Home/End only act when focus is in the shelf, so
    // they keep scrolling the page otherwise.
    document.addEventListener('keydown', e => {
      if (view !== 'shelf' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"]')) return;
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const inShelf = shelf.contains(t);
      let next = null;
      if (e.key === 'ArrowRight') next = active + 1;
      else if (e.key === 'ArrowLeft') next = active - 1;
      else if (inShelf && e.key === 'Home') next = 0;
      else if (inShelf && e.key === 'End') next = list.length - 1;
      if (next === null) return;
      e.preventDefault();
      go(next);
      // Keep keyboard focus on the centre card so Enter opens it
      if (inShelf) cards[active].focus({ preventScroll: true });
    });

    // Horizontal trackpad swipe or shift+wheel; a plain vertical wheel keeps scrolling the page
    let wheelAcc = 0, wheelLock = 0;
    stage.addEventListener('wheel', e => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!dx) return;
      e.preventDefault();
      const now = Date.now();
      if (now < wheelLock) return;
      wheelAcc += dx;
      if (Math.abs(wheelAcc) > 40) {
        go(active + Math.sign(wheelAcc));
        wheelAcc = 0;
        wheelLock = now + 260;
      }
    }, { passive: false });

    // Drag (mouse) / swipe (touch)
    let startX = null, startActive = 0;
    stage.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      startX = e.clientX;
      startActive = active;
      dragged = false;
    });
    window.addEventListener('pointermove', e => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 8) dragged = true;
      const per = Math.max(50, cards[0].offsetWidth * 0.22);
      go(startActive - Math.round(dx / per));
    });
    const endDrag = () => {
      startX = null;
      setTimeout(() => { dragged = false; }, 0);
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // The section is built before Framer's page receives it, so measure once it is
    // in the document (the observer fires then) and again on every resize.
    const relayout = () => {
      placeGlider();
      if (view === 'shelf') layout(false);
      else applyCols();
    };
    if (typeof ResizeObserver === 'function') new ResizeObserver(relayout).observe(section);
    else window.addEventListener('resize', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeGlider);

    const saved = store(SIZE_KEY);
    setSize(saved === null ? DEFAULT_STAGE : +saved, false);
    // ?view=shelf|grid in the URL wins over the remembered choice (shareable link)
    // (projects.html briefly swaps the URL for Framer and keeps the real one in window.realUrl)
    const href = typeof window.realUrl === 'string' ? window.realUrl : location.href;
    const asked = new URL(href, location.href).searchParams.get('view');
    setView((asked || store('pg-view')) === 'shelf' ? 'shelf' : 'grid', false);
  }

  let grid = null;

  // Framer renders the page client-side, so wait for its list and re-insert the
  // grid if a re-render ever drops it.
  function mount() {
    const framerList = document.querySelector('.framer-6v64ie');
    const homeIntro = framerList ? null : document.querySelector('.framer-ufjqu5 > .framer-7kps5');
    const anchor = framerList || homeIntro;
    if (!anchor) return false;
    if (!grid) {
      grid = build(!!homeIntro);
      if (homeIntro) grid.classList.add('pgrid--home');
    }
    if (grid.previousElementSibling !== anchor) anchor.after(grid);
    if (framerList) document.body.classList.add('has-project-grid');
    return true;
  }

  function start() {
    mount();
    new MutationObserver(mount).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
