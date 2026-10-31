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
    links.forEach((a, i) => {
      a.classList.toggle('is-active', i === active);
      if (i === active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
