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
  const CASE_STUDIES = ['lomo-track', 'curio-snap', 'facility-management', 'gcc-safe-subway', 'e-seal', 'social-dining', 'fitness-tracker', 'collaborative-learning'];

  /* --- Story lines per page: [scroll progress 0-1 where the line starts, text] --- */
  const STORIES = {
    home: [
      [0, "Hey 👋 I'm Pradeep's bot. Scroll, I'll show you around."],
      [0.12, 'Pradeep makes complex enterprise products easy to use.'],
      [0.25, 'These are the skills he brings to every project.'],
      [0.42, 'Some of his selected work. Tap one to dive in.'],
      [0.5, 'This is how he solves product problems, step by step.'],
      [0.66, "Here's where he's worked, and the skills he brings."],
      [0.92, "Like what you see? Let's build something together ✉️"],
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

    const bubbleLabel = nav.querySelector('.botnav__bubble-label');
    const bubbleActions = nav.querySelector('.botnav__bubble-actions');

    let hoverItem = null;
    let bubbleTimer = null;
    let typeTimer = null;
    let lastStoryIndex = -1;
    let lastSaidAt = 0;
    let pendingStory = null;
    let free = false; // true while the bot is off the bar (dragging or seated)
    let asking = false; // the "shall I take a seat?" question is on screen
    let seated = false;

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
      if (free) return;
      nav.style.setProperty('--bn-x', clampX(x - headWidth() / 2) + 'px');
      if (bubble.classList.contains('is-visible')) keepBubbleOnScreen();
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
    function say(text, duration, success, label) {
      endAsk();
      clearTimeout(bubbleTimer);
      clearInterval(typeTimer);
      bubbleText.textContent = text;
      bubbleLabel.textContent = label || '';
      bubbleLabel.hidden = !label;
      bubble.classList.remove('is-multiline');
      bubble.classList.toggle('is-success', !!success);
      bubble.style.setProperty('--bubble-shift', '0px');
      bubble.classList.add('is-visible');
      lastSaidAt = Date.now();

      bubble.classList.toggle('is-multiline', bubbleText.offsetHeight > 24);
      keepBubbleOnScreen();

      // Seated narration types itself out like the bot is telling the story.
      // The bubble is sized with the full text first so it doesn't grow while typing.
      if (seated && !reduceMotion) {
        bot.classList.add('is-talking');
        const h = bubbleText.offsetHeight;
        bubbleText.style.minHeight = h + 'px';
        let i = 0;
        bubbleText.textContent = '';
        typeTimer = setInterval(() => {
          i += 2;
          bubbleText.textContent = text.slice(0, i);
          if (i >= text.length) {
            clearInterval(typeTimer);
            bot.classList.remove('is-talking');
            bubbleText.style.minHeight = '';
          }
        }, 18);
      }

      if (duration) {
        bubbleTimer = setTimeout(hideBubble, duration);
      }
    }

    function hideBubble() {
      clearTimeout(bubbleTimer);
      bubble.classList.remove('is-visible');
      endAsk();
    }

    // A question with buttons in the bubble. The bot is aria-hidden as decoration,
    // so it's exposed to assistive tech while the question is up.
    function ask(text, actions) {
      say(text, 0);
      asking = true;
      bubbleActions.innerHTML = '';
      actions.forEach(({ label, primary, run }) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'botnav__bubble-btn' + (primary ? ' is-primary' : '');
        b.textContent = label;
        b.addEventListener('click', () => { endAsk(); run(); });
        bubbleActions.appendChild(b);
      });
      bubbleActions.hidden = false;
      bubble.classList.add('has-actions');
      bubble.setAttribute('role', 'dialog');
      bubble.setAttribute('aria-label', 'Story mode');
      bot.removeAttribute('aria-hidden');
      keepBubbleOnScreen();
    }

    function endAsk() {
      if (!asking) return;
      asking = false;
      bubbleActions.hidden = true;
      bubbleActions.innerHTML = '';
      bubble.classList.remove('has-actions');
      bubble.removeAttribute('role');
      bubble.removeAttribute('aria-label');
      bot.setAttribute('aria-hidden', 'true');
    }

    // Nudge the bubble inside the viewport. Computed from the bot's target position
    // (--bn-x) and layout sizes rather than measured, so slide/scale animations
    // in progress can't skew the result.
    function keepBubbleOnScreen() {
      if (free) {
        bubble.style.setProperty('--bubble-shift', '0px');
        return;
      }
      const margin = 8;
      const botX = parseFloat(nav.style.getPropertyValue('--bn-x')) || 0;
      const center = bar.getBoundingClientRect().left + botX + headWidth() / 2;
      const half = bubble.offsetWidth / 2;
      let shift = 0;
      if (center - half < margin) shift = margin - (center - half);
      if (center + half > window.innerWidth - margin) shift = window.innerWidth - margin - (center + half);
      bubble.style.setProperty('--bubble-shift', shift + 'px');
    }

    /* --- Story while scrolling --- */
    const story = (STORIES[page.key] || []).map(([at, text]) => [at, text.replace('{name}', page.name)]);

    function tellStory() {
      if (seated) {
        narrate();
        return;
      }
      if (asking) {
        if (scrollProgress() < 0.25) return;
        hideBubble(); // reader has moved on without answering
      }
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

      if (!reduceMotion && !free) {
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
        if (free || asking) return; // the bot is on the stool, or waiting for an answer
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

    /* --- Seated narration ---
       Case studies: one line per section, taken from the page's own text, spoken
       when that section is being read. Other pages: the regular story lines. */
    const narration = buildNarration(page);
    let lastNarrated = -1;

    function narrate() {
      if (narration.length) {
        const line = window.innerHeight * 0.35;
        let index = 0;
        narration.forEach((n, i) => { if (n.el.getBoundingClientRect().top <= line) index = i; });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) index = narration.length - 1;
        if (index === lastNarrated) return;
        lastNarrated = index;
        clearTimeout(pendingStory);
        const wait = Math.max(0, 700 - (Date.now() - lastSaidAt));
        pendingStory = setTimeout(() => say(narration[index].text, 0, false, narration[index].label), wait);
        return;
      }
      // Pages without sections: reuse the scroll story, kept on screen
      const progress = scrollProgress();
      let index = 0;
      story.forEach(([at], i) => { if (progress >= at) index = i; });
      if (index === lastNarrated) return;
      lastNarrated = index;
      clearTimeout(pendingStory);
      pendingStory = setTimeout(() => say(story[index][1], 0), Math.max(0, 700 - (Date.now() - lastSaidAt)));
    }

    /* --- Drag to the stool (desktop) --- */
    const canSeat = window.matchMedia('(min-width: 810px) and (hover: hover) and (pointer: fine)');
    const seat = document.createElement('div');
    seat.className = 'botseat';
    seat.setAttribute('aria-hidden', 'true');
    seat.innerHTML = '<div class="botseat__stool"><span class="botseat__seat"></span><span class="botseat__leg"></span><span class="botseat__leg"></span><span class="botseat__rest"></span></div>';
    document.body.appendChild(seat);
    syncTheme(seat);
    watchTheme(seat);

    const head = bot.querySelector('.botnav__head');
    let drag = null;
    // Off the bar the bot grows stick arms and legs, on case-study pages only
    if (page.key === 'caseStudy') bot.classList.add('has-limbs');

    // Over the bar (with some slack above it): a release here means "go home"
    function overBar(x, y) {
      const r = bar.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top - 50 && y <= r.bottom + 10;
    }

    function placeAt(x, y) {
      bot.style.left = (x - drag.dx) + 'px';
      bot.style.top = (y - drag.dy) + 'px';
    }

    // Viewport position the bot occupies when sitting on the stool
    function stoolSpot() {
      const r = seat.getBoundingClientRect();
      return { x: r.left + r.width / 2 - headWidth() / 2, y: r.bottom - 62 - bot.offsetHeight };
    }

    // Viewport position of the bot's slot on the bar (follows scroll progress)
    function barSpot() {
      const r = bar.getBoundingClientRect();
      const first = items[0];
      const last = items[items.length - 1];
      const center = centerOf(first) + (centerOf(last) - centerOf(first)) * scrollProgress();
      return { x: r.left + clampX(center - headWidth() / 2), y: r.top - bot.offsetHeight + 1 };
    }

    // Hop along an arc from wherever the bot is now to a viewport spot
    let flying = false;
    function flyTo(spot, then) {
      flying = true;
      const from = bot.getBoundingClientRect();
      if (bot.parentElement !== seat) seat.appendChild(bot);
      bot.classList.remove('is-seated', 'is-dragging');
      bot.classList.add('is-free', 'is-flying');
      bot.style.left = from.left + 'px';
      bot.style.top = from.top + 'px';
      const ms = reduceMotion ? 0 : Math.min(900, 380 + Math.hypot(spot.x - from.left, spot.y - from.top) * 0.45);
      bot.style.setProperty('--fly-ms', ms + 'ms');
      void bot.offsetWidth; // commit the start position before transitioning
      bot.style.left = spot.x + 'px';
      bot.style.top = spot.y + 'px';
      setTimeout(() => {
        bot.classList.remove('is-flying');
        flying = false;
        then();
      }, ms + 20);
    }

    function sitDown() {
      free = true;
      seated = true;
      clearTimeout(pendingStory);
      bot.classList.remove('is-dragging', 'is-bobbing', 'is-flying');
      bot.classList.add('is-free', 'is-seated');
      bot.style.left = bot.style.top = '';
      seat.appendChild(bot);
      seat.classList.remove('is-open');
      seat.classList.add('is-seated');
      lookAt(0, 0);
      smile(900);
      lastNarrated = -1;
      finished = false;
      say(narration.length ? 'Thanks for the seat! Let me tell you the story as you read.' : 'Comfy! I’ll walk you through this page from here.', 0);
      setTimeout(narrate, 2400);
    }

    function backToBar() {
      clearTimeout(finishTimer);
      free = false;
      seated = false;
      clearTimeout(pendingStory);
      clearInterval(typeTimer);
      bubbleText.style.minHeight = '';
      bot.classList.remove('is-talking');
      hideBubble();
      bot.classList.remove('is-free', 'is-seated', 'is-dragging', 'is-flying');
      bot.style.left = bot.style.top = '';
      bar.insertBefore(bot, bar.firstChild);
      seat.classList.remove('is-open', 'is-seated');
      lastStoryIndex = -1;
      bot.classList.add('is-returning');
      setTimeout(() => bot.classList.remove('is-returning'), 450);
      moveWithScroll();
      smile(700);
    }

    function goToStool() {
      seat.classList.add('is-open');
      flyTo(stoolSpot(), sitDown);
    }

    function jumpHome() {
      clearTimeout(pendingStory);
      hideBubble();
      flyTo(barSpot(), backToBar);
    }

    // Case study read to the end: say goodbye, then hop back onto the bar.
    // Uses its own timer: section narration keeps firing during smooth scrolling
    // and would otherwise cancel the goodbye.
    let finished = false;
    let finishTimer = null;
    function checkFinished() {
      if (!seated || finished || !narration.length || flying) return;
      const end = document.querySelector('.cs-end');
      if (!end || end.getBoundingClientRect().top > window.innerHeight * 0.85) return;
      finished = true;
      // Give the last section's line time to be read before signing off
      finishTimer = setTimeout(() => {
        if (!seated) return;
        clearTimeout(pendingStory);
        say('That’s the story! Back to the bar I go 👋', 0);
        finishTimer = setTimeout(() => { if (seated) jumpHome(); }, 2600);
      }, 4200);
    }

    head.addEventListener('pointerdown', e => {
      if (!canSeat.matches || e.button !== 0 || flying) return;
      const r = bot.getBoundingClientRect();
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
      e.preventDefault();
    });

    // Move/up are tracked on the window: re-parenting the bot into the stool layer
    // mid-drag would drop a pointer capture set on the head itself.
    window.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 5) return;
        // Start dragging: lift the bot out into the stool layer so it can move freely
        drag.moved = true;
        clearTimeout(finishTimer);
        free = true;
        seated = false;
        clearTimeout(pendingStory);
        clearInterval(typeTimer);
        bot.classList.remove('is-talking');
        hideBubble();
        bot.classList.remove('is-seated', 'is-bobbing');
        bot.classList.add('is-free', 'is-dragging');
        seat.appendChild(bot);
        seat.classList.remove('is-seated');
        seat.classList.add('is-open');
      }
      placeAt(e.clientX, e.clientY);
    });

    // Released anywhere: the bot walks to the stool by itself. Released on the bar: home.
    const endDrag = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) {
        if (!seated) say('Psst… drag me out and I’ll tell you the story from my stool.', 3200);
        return;
      }
      if (overBar(e.clientX, e.clientY)) flyTo(barSpot(), backToBar);
      else goToStool();
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('scroll', checkFinished, { passive: true });

    // Leaving the desktop layout sends the bot home
    canSeat.addEventListener('change', () => { if (!canSeat.matches && free) backToBar(); });

    /* --- Start: the bot always begins on the bar; only a drag sends it to the stool --- */
    moveWithScroll();
    setTimeout(blink, 1800);
    setTimeout(() => {
      smile(900);
      // Case studies on desktop: offer to sit on the stool and tell the story
      if (narration.length && canSeat.matches && !free) {
        ask('Hi! Shall I take a seat and walk you through this case study? I\u2019ll hop back when we\u2019re done.', [
          { label: 'Sure, take a seat', primary: true, run: goToStool },
          { label: 'No thanks', run: () => say('No problem, I\u2019ll be right here.', 2200) },
        ]);
        return;
      }
      // Phones: once per visit, suggest desktop for the full experience
      if (window.matchMedia('(max-width: 809.98px)').matches && !seenDesktopTip()) {
        say('Psst! I look my best on desktop 💻 Open this on a bigger screen for the full experience.', 5000);
        lastSaidAt += 3800; // hold the story until the tip has been read
        return;
      }
      tellStory();
    }, 900);

    function seenDesktopTip() {
      try {
        if (sessionStorage.getItem('pradeep_desktop_tip')) return true;
        sessionStorage.setItem('pradeep_desktop_tip', '1');
      } catch (e) { /* storage blocked: show the tip anyway */ }
      return false;
    }
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

  // One narration line per case-study section, built from the page's own copy:
  // the section's first sentence, its decision headings, or its closing quote.
  function buildNarration(page) {
    if (page.key !== 'caseStudy') return [];
    const article = document.querySelector('.cs-article');
    if (!article) return [];
    const firstSentence = text => {
      const t = (text || '').trim().replace(/\s+/g, ' ');
      const m = t.match(/^.+?[.!?](?=\s|$)/);
      return m ? m[0] : t;
    };
    const lines = [];
    const header = article.querySelector('header');
    const summary = article.querySelector('.cs-summary');
    if (header && summary) {
      lines.push({ el: header, label: page.name, text: summary.textContent.trim() });
    }
    article.querySelectorAll('.cs-block').forEach(block => {
      const label = block.dataset.toc || (block.querySelector('h2') || {}).textContent || '';
      const steps = block.querySelectorAll('.cs-flowgroup');
      const decisions = block.querySelectorAll('h3');
      const quote = block.querySelector('.cs-quote');
      const para = block.querySelector('p:not(.cs-eyebrow):not(.cs-flowgroup-label)');
      let text = '';
      if (steps.length) {
        const roles = [...steps].map(g => {
          const name = g.querySelector('.cs-flowgroup-label').textContent.trim();
          return name + ' (' + g.querySelectorAll('li').length + ' steps)';
        });
        text = (steps.length > 1 ? 'Two paths here: ' : 'One clear path: ') + roles.join(' and ') + '.';
      } else if (decisions.length) {
        text = [...decisions].map(h => h.textContent.trim()).join(' ');
      } else if (quote) {
        text = quote.textContent.trim();
      } else if (para) {
        text = firstSentence(para.textContent);
      }
      if (text) lines.push({ el: block, label: label.trim(), text });
    });
    return lines;
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
          <div class="botnav__bubble"><span class="botnav__bubble-label" hidden></span><span class="botnav__bubble-text"></span><span class="botnav__bubble-actions" hidden></span></div>
          <div class="botnav__head">
            <div class="botnav__face"><span class="botnav__eye"></span><span class="botnav__eye"></span></div>
          </div>
          <span class="botnav__limb botnav__limb--arm-l"></span><span class="botnav__limb botnav__limb--arm-r"></span>
          <span class="botnav__limb botnav__limb--leg-l"></span><span class="botnav__limb botnav__limb--leg-r"></span>
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
