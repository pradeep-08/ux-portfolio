/**
 * Pradeep UX Portfolio - Case study page
 * - Builds the contents rail from sections ([data-toc] labels)
 * - Highlights the section currently being read
 * - Fills in the reading time from the article's word count
 */

(function () {
  const article = document.querySelector('.cs-article');
  if (!article) return;

  const sections = [...article.querySelectorAll('.cs-block[id]')];

  /* --- Reading time (~220 words per minute) --- */
  const readTime = document.querySelector('[data-read-time]');
  if (readTime) {
    const words = article.innerText.trim().split(/\s+/).length;
    readTime.textContent = Math.max(1, Math.round(words / 220)) + ' min read';
  }

  /* --- Reading progress ring (opens an "On this page" menu) --- */
  const progress = buildProgress();

  /* --- Contents rail --- */
  const list = document.querySelector('.cs-toc ol');
  if (!list || !sections.length) return;

  const links = sections.map(section => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.textContent = section.dataset.toc || section.querySelector('h2').textContent;
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  // Active = last section whose top has passed 35% of the viewport
  function update() {
    const line = window.innerHeight * 0.35;
    let active = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= line) active = i;
    });
    // At the very bottom, the last section is the one being read
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      active = sections.length - 1;
    }
    [...links, ...progress.links].forEach(a => {
      const on = a.hash === '#' + sections[active].id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    progress.update();
  }

  function buildProgress() {
    const R = 21;
    const C = 2 * Math.PI * R;
    const wrap = document.createElement('div');
    wrap.className = 'cs-progress';
    wrap.innerHTML = `
      <div class="cs-progress__menu" id="cs-progress-menu" hidden>
        <p class="cs-progress__title">On this page</p>
        <ol>${sections.map(s => `<li><a href="#${s.id}">${s.dataset.toc || s.querySelector('h2').textContent}</a></li>`).join('')}</ol>
      </div>
      <button class="cs-progress__btn" type="button" aria-expanded="false" aria-controls="cs-progress-menu">
        <svg class="cs-progress__ring" viewBox="0 0 52 52" aria-hidden="true">
          <circle class="cs-progress__track" cx="26" cy="26" r="${R}" />
          <circle class="cs-progress__bar" cx="26" cy="26" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C}" />
        </svg>
        <span class="cs-progress__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 8h12M6 12h12M6 16h12"/></svg>
        </span>
      </button>`;
    document.body.appendChild(wrap);

    const btn = wrap.querySelector('.cs-progress__btn');
    const bar = wrap.querySelector('.cs-progress__bar');
    const menu = wrap.querySelector('.cs-progress__menu');
    const menuLinks = [...menu.querySelectorAll('a')];

    function setOpen(open, returnFocus) {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      wrap.classList.toggle('is-open', open);
      if (open) menuLinks[0].focus();
      else if (returnFocus) btn.focus();
    }

    btn.addEventListener('click', () => setOpen(menu.hidden));
    menuLinks.forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) setOpen(false, true);
    });
    document.addEventListener('click', e => {
      if (!menu.hidden && !wrap.contains(e.target)) setOpen(false);
    });

    return {
      links: menuLinks,
      update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
        bar.style.strokeDashoffset = String(C * (1 - p));
        btn.setAttribute('aria-label', `Reading progress ${Math.round(p * 100)}%. Open the section list`);
        // On narrow screens the ring sits at the top and appears once the header scrolls away
        wrap.classList.toggle('is-scrolled', window.scrollY > 160);
      },
      align() {
        const toggle = document.getElementById('themeToggleBtn');
        if (!toggle) return;
        const t = toggle.getBoundingClientRect();
        const right = document.documentElement.clientWidth - (t.left + t.width / 2) - btn.offsetWidth / 2;
        wrap.style.setProperty('--ring-right', Math.max(16, right) + 'px');
      },
    };
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { progress.align(); update(); });
  progress.align();
  update();
})();
