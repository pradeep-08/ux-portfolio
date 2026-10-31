/**
 * Pradeep UX Portfolio - Projects page bento grid
 * Inserts the project cards after Framer's own project list and hides that list
 * (via body.has-project-grid). If this script fails, Framer's list stays visible.
 */

(function () {
  const PROJECTS = [
    { href: 'lomo-track.html', kicker: 'Enterprise IoT · Logistics', name: 'LOMO Track', img: 'assets/images/mockup-1.jpg', wide: true },
    { href: 'fitness-tracker.html', kicker: 'Redesign project', name: 'Fitness Tracker App', img: 'assets/images/fitness-cover.webp' },
    { href: 'social-dining.html', kicker: 'Internship project', name: 'Social Dining App', img: 'assets/images/social-dining-cover.webp' },
    { href: 'collaborative-learning.html', kicker: 'Graduation project', name: 'Collaborative Learning', img: 'assets/images/collaborative-cover.webp', wide: true },
  ];

  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

  function build() {
    const section = document.createElement('section');
    section.className = 'pgrid';
    section.setAttribute('aria-label', 'Selected projects');
    section.innerHTML = '<ul class="pgrid__list">' + PROJECTS.map(p => `
      <li class="pgrid__item${p.wide ? ' pgrid__item--wide' : ''}">
        <a class="pcard" href="${p.href}">
          <div class="pcard__media"><img src="${p.img}" alt="" loading="lazy" /></div>
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
    if (!framerList) return false;
    if (!grid) grid = build();
    if (grid.previousElementSibling !== framerList) framerList.after(grid);
    document.body.classList.add('has-project-grid');
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
