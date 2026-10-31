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
  ];

  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

  function media(p) {
    if (p.img) return `<div class="pcard__media"><img src="${p.img}" alt="" loading="lazy" /></div>`;
    return `<div class="pcard__media pcard__media--text"><span class="pcard__platform">${p.platform}</span><span class="pcard__pitch">${p.pitch}</span></div>`;
  }

  function build(home) {
    const list = home ? PROJECTS.filter(p => p.featured) : PROJECTS;
    const section = document.createElement('section');
    section.className = 'pgrid';
    section.setAttribute('aria-label', home ? 'Featured projects' : 'All projects');
    section.innerHTML = '<ul class="pgrid__list">' + list.map(p => `
      <li class="pgrid__item${p.wide ? ' pgrid__item--wide' : ''}">
        <a class="pcard" href="${p.href}">
          ${media(p)}
          <div class="pcard__foot">
            <h3 class="pcard__title"><span>${p.kicker}</span><strong>${p.name}</strong></h3>
            <span class="pcard__btn" aria-hidden="true">${ARROW}<span class="pcard__label">View case</span></span>
          </div>
        </a>
      </li>`).join('') + '</ul>';
    return section;
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
