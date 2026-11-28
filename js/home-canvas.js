/**
 * Pradeep UX Portfolio - Home "drag around" canvas: my projects
 *
 * Framer's desktop home page has a draggable canvas (data-framer-name="Canvas")
 * with two CMS project cards from the template (Cryptix, Novera). This puts my
 * own projects on that canvas in the exact same card design, each linking to
 * its case study.
 *
 * How: once Framer has rendered its first project card, that card is cloned
 * (so the image frame, shadow, title style and badge pill match exactly) and
 * one copy is placed per project. Copies are plain DOM, outside React, so
 * Framer's routing never touches them. Framer's own cards are hidden only
 * while html.hc-on is set; if no card appears, the class is removed again and
 * the original canvas stays as it was.
 *
 * The template's contract widgets are swapped for real UI pieces from my
 * projects (assets/images/canvas/), each draggable on its own.
 *
 * Project data comes from js/projects-grid.js (window.PORTFOLIO_PROJECTS).
 */

(function () {
  const root = document.documentElement;
  root.classList.add('hc-on');

  // Where each project sits on the 2963 x 947 canvas (centre point, % of the
  // canvas) and its tilt. The first two reuse the template's own card spots.
  const SLOTS = [
    { x: 33, y: 44, r: -3 },    // template "Work 1" spot, left of the intro card
    { x: 66, y: 37, r: 2 },     // template "Work 2" spot, next to the "Projects" cursor
    { x: 18.9, y: 31.7, r: 3 },
    { x: 81, y: 67.6, r: -1.5 },
    { x: 20.9, y: 73.9, r: -2 },
    { x: 84, y: 24, r: 2.5 },
  ];
  // Order on the canvas, and the short category shown in the badge pill.
  const ORDER = ['lomo-track.html', 'kriti-attendance.html', 'gcc-safe-subway.html',
    'facility-management.html', 'e-seal.html'];
  const BADGE = {
    'lomo-track.html': 'Logistics & IoT',
    'kriti-attendance.html': 'Enterprise App',
    'gcc-safe-subway.html': 'Government',
    'facility-management.html': 'Facility Ops',
    'e-seal.html': 'Web + Mobile',
  };

  // Real UI pieces cut from each project (assets/images/canvas/), replacing the
  // template's contract widgets. Each one drags on its own, like Framer's did,
  // and a plain click opens its project's case study.
  // x, y: centre on the canvas in px; w: shown width; src/srcW/radius: the
  // image, its pixel width and its corner radius in image pixels.
  // cutout: an irregular shape (notches, a badge breaking the edge), so the
  // shadow follows the image's outline instead of a rounded box.
  const IMG = 'assets/images/canvas/';
  const LOMO = 'lomo-track.html';
  const FACILITY = 'facility-management.html';
  const COMPONENTS = [
    { href: LOMO, src: IMG + 'lomo-access-restricted.webp', srcW: 554, radius: 34, w: 210, x: 1080, y: 118, r: -3,
      alt: 'LOMO Track: Access Restricted dialog' },
    { href: 'gcc-safe-subway.html', src: IMG + 'gcc-warning-dialog.webp', srcW: 556, radius: 18, w: 260, x: 1170, y: 700, r: 2,
      alt: 'GCC Safe Subway: manual operation warning' },
    { href: 'e-seal.html', src: IMG + 'eseal-sealed.webp', srcW: 590, radius: 40, w: 250, x: 1505, y: 610, r: -1.5,
      alt: 'E-Seal: sealed scan result' },
    { href: 'kriti-attendance.html', src: IMG + 'kriti-gps-card.webp', srcW: 646, radius: 22, w: 340, x: 1745, y: 785, r: 1.5,
      alt: 'Kriti Attendance: GPS accuracy card' },
    { href: FACILITY, src: IMG + 'facility-low-battery.webp', srcW: 700, radius: 56, w: 200, x: 2385, y: 225, r: 2,
      alt: 'Facility Management: low battery sheet' },
    { href: FACILITY, src: IMG + 'facility-in-progress.webp', srcW: 358, radius: 8, w: 200, x: 2400, y: 860, r: -2,
      alt: 'Facility Management: In-Progress task status' },
    { href: FACILITY, src: IMG + 'facility-device-card.webp', srcW: 384, radius: 20, w: 190, x: 2700, y: 380, r: 3,
      alt: 'Facility Management: connected eBaton device, 45% battery' },
    { href: LOMO, src: IMG + 'lomo-via-route.webp', srcW: 721, radius: 26, w: 320, x: 1480, y: 120, r: 1,
      alt: 'LOMO Track: route via Velachery Rd' },
    { href: LOMO, src: IMG + 'lomo-trip-ticket.webp', srcW: 729, cutout: true, w: 280, x: 2060, y: 630, r: -2,
      alt: 'LOMO Track: trip source, destination and 437 km actual distance' },
    { href: LOMO, src: IMG + 'lomo-invoice.webp', srcW: 328, cutout: true, w: 150, x: 260, y: 600, r: 3,
      alt: 'LOMO Track: invoice tile' },
  ];

  const CANVAS = '.framer-11ixlot';
  const ORIGINALS = ['.framer-1ksv5u5', '.framer-49ihvo']; // template Work 1, Work 2
  let template = null;

  function projects() {
    const all = window.PORTFOLIO_PROJECTS || [];
    return all
      .filter((p) => (p.shots || p.web) && ORDER.includes(p.href))
      .sort((a, b) => ORDER.indexOf(a.href) - ORDER.indexOf(b.href))
      .slice(0, SLOTS.length);
  }

  // Deepest element with text, e.g. the <p> inside Framer's text layer
  function textLeaf(el) {
    if (!el) return null;
    const leaves = [...el.querySelectorAll('*')].filter((n) => !n.children.length && n.textContent.trim());
    return leaves[0] || null;
  }

  // A rendered Framer project card, ready to copy
  function findTemplate(canvas) {
    for (const sel of ORIGINALS) {
      const work = canvas.querySelector(':scope > ' + sel);
      if (!work || !work.querySelector('a')) continue;
      if (!work.querySelector('[data-framer-name="Image"]')) continue;
      if (!textLeaf(work.querySelector('[data-framer-name="Title"]'))) continue;
      return work;
    }
    return null;
  }

  function media(p) {
    const img = (src, cls) =>
      `<span class="hc-shot ${cls}"><img src="${src}" alt="" decoding="async" draggable="false"></span>`;
    let shots;
    if (p.web) {
      shots = img(p.web, 'hc-shot--web') + (p.shots ? img(p.shots[0], 'hc-shot--over') : '');
    } else {
      const [centre, left, right] = p.shots;
      shots = (left ? img(left, 'hc-shot--left') : '') + img(centre, 'hc-shot--centre') +
        (right ? img(right, 'hc-shot--right') : '');
    }
    return `<span class="hc-media" data-tint="${p.tint || 'neutral'}">${shots}</span>`;
  }

  function makeCard(p, slot, i) {
    const card = template.cloneNode(true);
    // Drop Framer's ids and animation hooks so nothing else targets the copy
    [card, ...card.querySelectorAll('*')].forEach((el) => {
      el.removeAttribute('id');
      el.removeAttribute('data-framer-appear-id');
    });
    card.classList.add('hc-card');
    card.setAttribute('data-framer-name', 'Project');
    card.removeAttribute('style');
    card.style.left = slot.x + '%';
    card.style.top = slot.y + '%';
    card.style.transform = `translate(-50%, -50%) rotate(${slot.r}deg)`;
    card.style.animationDelay = (0.15 + i * 0.08).toFixed(2) + 's';

    const link = card.querySelector('a');
    link.removeAttribute('style');
    link.classList.add('hc-link');
    link.setAttribute('href', p.href);
    link.setAttribute('aria-label', `${p.name}: ${p.pitch}`);
    link.setAttribute('draggable', 'false');

    const image = card.querySelector('[data-framer-name="Image"]');
    image.innerHTML = media(p);

    // Title and badge pill sit side by side in one row
    const titleBox = card.querySelector('[data-framer-name="Title"]');
    const title = textLeaf(titleBox);
    if (title) title.textContent = p.name;

    const badgeBox = titleBox && titleBox.parentElement
      ? [...titleBox.parentElement.children].find((el) => el !== titleBox)
      : null;
    const badge = textLeaf(badgeBox);
    if (badge) badge.textContent = BADGE[p.href] || p.platform;

    return card;
  }

  // The canvas drags with the mouse: a press that turns into a drag must not
  // open the case study when the button is released over a card.
  let downX = 0;
  let downY = 0;
  function guardClicks(canvas) {
    if (canvas.dataset.hcGuard) return;
    canvas.dataset.hcGuard = '1';
    canvas.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; }, true);
    canvas.addEventListener('click', (e) => {
      const link = e.target.closest && e.target.closest('.hc-link');
      if (!link) return;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    // Native link/image dragging would fight the canvas drag
    canvas.addEventListener('dragstart', (e) => {
      if (e.target.closest && e.target.closest('.hc-card')) e.preventDefault();
    }, true);
  }

  // Drag one component around the canvas. The press is kept from the canvas,
  // so the canvas stays put while a component moves. A press that barely
  // moves is a click, and the link opens the case study.
  let topZ = 10;
  function makeDraggable(el) {
    let start = null;
    let moved = false;
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      moved = false;
      start = { x: e.clientX, y: e.clientY, dx: +el.dataset.dx || 0, dy: +el.dataset.dy || 0 };
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      el.style.zIndex = ++topZ; // the one picked up sits on top
    });
    el.addEventListener('pointermove', (e) => {
      if (!start) return;
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) moved = true;
      const dx = start.dx + e.clientX - start.x;
      const dy = start.dy + e.clientY - start.y;
      el.dataset.dx = dx;
      el.dataset.dy = dy;
      el.style.translate = `${dx}px ${dy}px`;
    });
    const end = () => {
      start = null;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('mousedown', (e) => e.stopPropagation());
    el.addEventListener('click', (e) => {
      if (moved) e.preventDefault();
      moved = false;
    });
    el.addEventListener('dragstart', (e) => e.preventDefault());
  }

  function mountComponents(canvas) {
    if (canvas.querySelector(':scope > .hc-comp')) return;
    const frag = document.createDocumentFragment();
    COMPONENTS.forEach((c, i) => {
      const el = document.createElement('a');
      el.className = 'hc-comp' + (c.cutout ? ' hc-comp--cutout' : '');
      el.href = c.href;
      el.setAttribute('draggable', 'false');
      el.setAttribute('aria-label', `${c.alt}. Open the case study`);
      el.style.width = c.w + 'px';
      el.style.left = c.x + 'px';
      el.style.top = c.y + 'px';
      if (!c.cutout) el.style.borderRadius = ((c.radius * c.w) / c.srcW).toFixed(1) + 'px';
      el.style.setProperty('--hc-r', c.r + 'deg');
      el.style.animationDelay = (0.3 + i * 0.08).toFixed(2) + 's';
      el.innerHTML = `<img src="${c.src}" alt="" decoding="async" draggable="false">`;
      makeDraggable(el);
      frag.appendChild(el);
    });
    canvas.appendChild(frag);
    root.classList.add('hc-comps');
  }

  function mount() {
    const canvas = document.querySelector(CANVAS);
    if (!canvas) return false;
    mountComponents(canvas);
    if (canvas.querySelector(':scope > .hc-card')) return true;
    if (!template) {
      const live = findTemplate(canvas);
      if (!live) return false;
      template = live.cloneNode(true);
    }
    const list = projects();
    if (!list.length) return false;
    const frag = document.createDocumentFragment();
    list.forEach((p, i) => frag.appendChild(makeCard(p, SLOTS[i], i)));
    canvas.appendChild(frag);
    guardClicks(canvas);
    root.classList.add('hc-on', 'hc-ready');
    return true;
  }

  function start() {
    let queued = false;
    const check = () => {
      queued = false;
      mount();
    };
    mount();
    new MutationObserver(() => {
      if (!queued) { queued = true; requestAnimationFrame(check); }
    }).observe(document.body, { childList: true, subtree: true });

    // Fail safe: if Framer never renders a card to copy, show its own canvas again
    setTimeout(() => {
      if (!root.classList.contains('hc-ready')) root.classList.remove('hc-on');
    }, 12000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
