/**
 * Pradeep UX Portfolio - Bot Nav
 * Floating bottom navigation with a little bot that peeks over the bar.
 * - Follows the reader: slides along the bar with scroll progress
 * - Hover / focus: jumps to the item and says what it does
 * - Tells the page's story in short lines as sections scroll by
 * - Blinks, follows the cursor, looks in the scroll direction
 * - Mail icon copies the email address
 * - Theme-aware: Framer pages (body[toggle-theme]) and case studies (html[data-theme])
 */

(function () {
  const EMAIL = 'pradeep.tasp.0802@gmail.com';
  const LINKEDIN = 'https://www.linkedin.com/in/pradeep-t-1b97491aa/';
  const RESUME_PDF = 'https://framerusercontent.com/assets/leYzq3yJ71NjjhqCAEeSTh7vr0.pdf';
  const CASE_STUDIES = ['lomo-track', 'social-dining', 'fitness-tracker', 'collaborative-learning'];

  /* --- Story lines per page: [scroll progress 0-1 where the line starts, text] --- */
  const STORIES = {
    home: [
      [0, "Hey 👋 I'm Pradeep's bot. Scroll, I'll show you around."],
      [0.12, 'Pradeep makes complex enterprise products easy to use.'],
      [0.25, 'These are the skills he brings to every project.'],
      [0.42, 'Some of his selected work. Tap one to dive in.'],
      [0.62, 'This is how he solves product problems, step by step.'],
      [0.85, "Like what you see? Let's build something together ✉️"],
    ],
    about: [
      [0, 'Meet Pradeep: UX designer, 3+ years in enterprise SaaS & IoT.'],
      [0.25, 'What he cares about: simple over complicated.'],
      [0.5, 'A few snapshots from beyond the screen 📷'],
      [0.7, 'His R&D and QA background shapes how he designs.'],
      [0.88, 'Want to chat? Copy his email from the bar 👇'],
    ],
    work: [
      [0, "Here's Pradeep's selected work."],
      [0.25, 'Each project shows the problem, the decisions and the outcome.'],
      [0.6, 'Tap any project to read the full case study.'],
      [0.88, 'Want the full picture? Grab his resume ⤓'],
    ],
    resume: [
      [0, "Pradeep's resume at a glance."],
      [0.2, '3+ years designing enterprise and IoT products.'],
      [0.45, 'Impact: +27% task completion, 40% faster onboarding.'],
      [0.65, 'Core skills across UX, UI and collaboration.'],
      [0.85, 'Need a copy? Hit Resume to download the PDF ⤓'],
    ],
    caseStudy: [
      [0, "Let's walk through {name} together."],
      [0.15, 'First, the problem he set out to solve.'],
      [0.4, "Here's how the design decisions came together."],
      [0.75, 'The takeaways: what this project changed.'],
      [0.92, "Next project's just below. Or say hi 👋"],
    ],
  };

  const ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><line x1="8" y1="11" x2="8" y2="16"/><line x1="8" y1="8" x2="8" y2="8.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 0 0-4 0"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l1.3-3.9A8 8 0 1 1 7.6 19.4L3 20"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>',
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (document.querySelector('.botnav')) return;

    const page = detectPage();
    const nav = buildNav(page);
    document.body.appendChild(nav);

    const bar = nav.querySelector('.botnav__bar');
    const bot = nav.querySelector('.botnav__bot');
    const eyes = nav.querySelectorAll('.botnav__eye');
    const bubble = nav.querySelector('.botnav__bubble');
    const bubbleText = nav.querySelector('.botnav__bubble-text');
    const live = nav.querySelector('.botnav__sr');
    const items = [...nav.querySelectorAll('[data-tip]')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let hoverItem = null;
    let bubbleTimer = null;
    let lastStoryIndex = -1;
    let lastSaidAt = 0;
    let pendingStory = null;

    syncTheme(nav);
    watchTheme(nav);

    /* --- Bot position --- */
    function headWidth() {
      return bot.offsetWidth;
    }

    // Keep the head and its fillets over the bar's flat top; over the rounded ends
    // the fillets would hang in the air and show a spike.
    function clampX(x) {
      const fillet = parseFloat(getComputedStyle(nav).getPropertyValue('--bn-fillet')) || 12;
      const endRadius = bar.offsetHeight / 2;
      const min = endRadius + fillet;
      const max = bar.offsetWidth - endRadius - fillet - headWidth();
      return Math.max(min, Math.min(max, x));
    }

    function centerOf(el) {
      return el.offsetLeft + el.offsetWidth / 2;
    }

    function moveTo(x) {
      nav.style.setProperty('--bn-x', clampX(x - headWidth() / 2) + 'px');
    }

    function scrollProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }

    function moveWithScroll() {
      if (hoverItem) return;
      const first = items[0];
      const last = items[items.length - 1];
      const start = centerOf(first);
      const end = centerOf(last);
      moveTo(start + (end - start) * scrollProgress());
    }

    /* --- Speech bubble --- */
    function say(text, duration, success) {
      clearTimeout(bubbleTimer);
      bubbleText.textContent = text;
      bubble.classList.remove('is-multiline');
      bubble.classList.toggle('is-success', !!success);
      bubble.style.setProperty('--bubble-shift', '0px');
      bubble.classList.add('is-visible');
      lastSaidAt = Date.now();

      requestAnimationFrame(() => {
        bubble.classList.toggle('is-multiline', bubbleText.offsetHeight > 24);
        keepBubbleOnScreen();
      });

      if (duration) {
        bubbleTimer = setTimeout(hideBubble, duration);
      }
    }

    function hideBubble() {
      clearTimeout(bubbleTimer);
      bubble.classList.remove('is-visible');
    }

    // Wait for the bot's slide to settle before measuring, then nudge the bubble inside the viewport
    function keepBubbleOnScreen() {
      setTimeout(() => {
        bubble.style.setProperty('--bubble-shift', '0px');
        const rect = bubble.getBoundingClientRect();
        const margin = 8;
        let shift = 0;
        if (rect.left < margin) shift = margin - rect.left;
        if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right;
        bubble.style.setProperty('--bubble-shift', shift + 'px');
      }, reduceMotion ? 0 : 320);
    }

    /* --- Story while scrolling --- */
    const story = (STORIES[page.key] || []).map(([at, text]) => [at, text.replace('{name}', page.name)]);

    function tellStory() {
      if (!story.length || hoverItem) return;
      const progress = scrollProgress();
      let index = 0;
      story.forEach(([at], i) => { if (progress >= at) index = i; });
      if (index === lastStoryIndex) return;
      lastStoryIndex = index;

      // Space lines out so fast scrolling doesn't flicker through every message
      const wait = Math.max(0, 1200 - (Date.now() - lastSaidAt));
      clearTimeout(pendingStory);
      pendingStory = setTimeout(() => {
        if (!hoverItem) say(story[index][1], 3600);
      }, wait);
    }

    /* --- Eyes --- */
    function lookAt(dx, dy) {
      eyes.forEach(eye => {
        eye.style.setProperty('--ex', dx + 'px');
        eye.style.setProperty('--ey', dy + 'px');
      });
    }

    function blink() {
      bot.classList.add('is-blinking');
      setTimeout(() => bot.classList.remove('is-blinking'), 140);
      setTimeout(blink, 2600 + Math.random() * 2800);
    }

    function smile(ms) {
      bot.classList.add('is-happy');
      setTimeout(() => bot.classList.remove('is-happy'), ms);
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', e => {
        const r = bot.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        lookAt(Math.max(-1, Math.min(1, dx * 4)) * 3, Math.max(-1, Math.min(1, dy * 4)) * 3);
      }, { passive: true });
    }

    /* --- Scroll reactions --- */
    let lastY = window.scrollY;
    let scrollIdle = null;

    window.addEventListener('scroll', () => {
      const goingDown = window.scrollY > lastY;
      lastY = window.scrollY;

      moveWithScroll();
      tellStory();

      if (!reduceMotion) {
        bot.classList.add('is-bobbing');
        lookAt(0, goingDown ? 3 : -3);
      }
      clearTimeout(scrollIdle);
      scrollIdle = setTimeout(() => {
        bot.classList.remove('is-bobbing');
        lookAt(0, 0);
      }, 220);
    }, { passive: true });

    window.addEventListener('resize', moveWithScroll);

    /* --- Hover & focus on items --- */
    items.forEach(item => {
      const enter = () => {
        hoverItem = item;
        clearTimeout(pendingStory);
        moveTo(centerOf(item));
        say(item.dataset.tip);
      };
      const leave = () => {
        if (hoverItem !== item) return;
        hoverItem = null;
        hideBubble();
        moveWithScroll();
      };
      item.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') enter(); });
      item.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') leave(); });
      // Keyboard focus only: a tap also focuses the item, which would pin the bot there
      item.addEventListener('focus', () => { if (item.matches(':focus-visible')) enter(); });
      item.addEventListener('blur', leave);
    });

    /* --- Copy email --- */
    nav.querySelector('[data-action="copy-email"]').addEventListener('click', e => {
      const btn = e.currentTarget;
      copyText(EMAIL).then(ok => {
        moveTo(centerOf(btn));
        say(ok ? 'Email copied! ✓' : EMAIL, 2200, ok);
        if (!hoverItem) setTimeout(moveWithScroll, 2200);
        live.textContent = ok ? 'Email address copied' : EMAIL;
        if (ok) smile(1400);
      });
    });

    nav.querySelector('.botnav__resume').addEventListener('click', () => smile(900));

    /* --- Start --- */
    moveWithScroll();
    setTimeout(blink, 1800);
    setTimeout(() => {
      smile(900);
      tellStory();
    }, 900);
  }

  /* --- Page detection (Framer pages rewrite the URL to /about, /projects, ...) --- */
  function detectPage() {
    const path = window.location.pathname.toLowerCase();
    const caseStudy = CASE_STUDIES.find(slug => path.includes(slug));
    if (caseStudy) {
      const name = (document.title.split(/[—|-]/)[0] || 'this project').trim();
      return { key: 'caseStudy', active: 'work', name };
    }
    if (path.includes('projects')) return { key: 'work', active: 'work' };
    if (path.includes('about')) return { key: 'about', active: 'about' };
    if (path.includes('resume')) return { key: 'resume', active: '' };
    return { key: 'home', active: 'home' };
  }

  function buildNav(page) {
    const nav = document.createElement('nav');
    nav.className = 'botnav';
    nav.setAttribute('aria-label', 'Quick navigation');

    const link = (key, href, label, tip) =>
      `<a class="botnav__link${page.active === key ? ' is-active' : ''}" href="${href}" data-tip="${tip}"${page.active === key ? ' aria-current="page"' : ''}>${label}</a>`;

    nav.innerHTML = `
      <div class="botnav__bar">
        <div class="botnav__bot" aria-hidden="true">
          <div class="botnav__bubble"><span class="botnav__bubble-text"></span></div>
          <div class="botnav__head">
            <div class="botnav__face"><span class="botnav__eye"></span><span class="botnav__eye"></span></div>
          </div>
        </div>
        ${link('home', 'index.html', 'Home', 'Back to home')}
        ${link('work', 'projects.html', 'Work', 'See my work')}
        ${link('about', 'about.html', 'About', 'A bit about me')}
        <span class="botnav__divider" aria-hidden="true"></span>
        <a class="botnav__icon" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-tip="Connect on LinkedIn">${ICONS.linkedin}</a>
        <a class="botnav__icon" href="mailto:${EMAIL}?subject=Hi%20Pradeep" aria-label="Send me a message" data-tip="Send me a message">${ICONS.chat}</a>
        <button class="botnav__icon" type="button" data-action="copy-email" aria-label="Copy my email" data-tip="Copy my email">${ICONS.mail}</button>
        <a class="botnav__resume" href="${RESUME_PDF}" target="_blank" rel="noopener noreferrer" aria-label="Download resume (PDF)" data-tip="Download my resume">
          <span class="botnav__resume-label">Resume</span>${ICONS.download}
        </a>
      </div>
      <div class="botnav__sr" aria-live="polite"></div>`;
    return nav;
  }

  /* --- Theme sync --- */
  function isDark() {
    const framerTheme = document.body.getAttribute('toggle-theme') || document.documentElement.getAttribute('toggle-theme');
    if (framerTheme) return framerTheme === 'dark';
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function syncTheme(nav) {
    nav.setAttribute('data-bn-theme', isDark() ? 'dark' : 'light');
  }

  function watchTheme(nav) {
    const observer = new MutationObserver(() => syncTheme(nav));
    const opts = { attributes: true, attributeFilter: ['toggle-theme', 'data-theme'] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    area.remove();
    return ok;
  }
})();
