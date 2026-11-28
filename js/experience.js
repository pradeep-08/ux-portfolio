/**
 * Pradeep UX Portfolio - Experience & Skills (home page)
 * Adds the last section above the footer. Content is taken from the resume
 * (Resume.pdf). Framer renders the page client-side, so the section is inserted
 * once the footer exists and re-inserted if a re-render drops it.
 */

(function () {
  // Newest first. Each company lists its roles newest first; `end: null` means
  // the role is current. Dates are [year, month]; durations are worked out from
  // them (and from today for a current role). `logo` can point at an image file
  // later; until then the badge shows the company initial in `color`.
  const EXPERIENCE = [
    {
      company: 'KritiLabs Technologies', initial: 'K', color: '#1f9d8f',
      roles: [{
        title: 'UX/UI Designer', start: [2022, 11], end: null, place: 'Chennai, India',
        summary: 'Designed end-to-end user-centered interfaces for IoT dashboards and enterprise SaaS tools using Figma. User research, usability testing, wireframing, and prototyping. Optimized workflows improving task completion rate by 27% and reducing onboarding time by 40%. Validated designs with 10+ users and partnered with PMs and engineers to deliver seamless handoff.',
        meta: [['Tools', 'Figma'], ['Methods', 'User Interviews, Wireframes, Prototypes, IA, Journey Maps']],
      }],
    },
    {
      company: 'Perfect Electronics', initial: 'P', color: '#3b6cf6',
      roles: [{
        title: 'RnD (NATS)', start: [2021, 7], end: [2022, 11],
        summary: 'Developing product samples based on customer needs, testing and measuring product parameters, and preparing specifications, quality plans, product release reports, and BOM using AutoCAD, Google Sheets, and Google Docs.',
      }],
    },
    {
      company: 'Leo Prime Comp', initial: 'L', color: '#f26b3a',
      roles: [{
        title: 'Quality Assurance', start: [2020, 8], end: [2021, 7],
        summary: 'Inspects and approves incoming materials by confirming specifications, conducting visual & measurement tests and rejecting & returning unacceptable materials.',
      }],
    },
  ];

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = ([y, m]) => `${MONTHS[m - 1]} ${y}`;

  // "1 yr, 4 m" style, like LinkedIn
  function duration(start, end) {
    const now = new Date();
    const [ey, em] = end || [now.getFullYear(), now.getMonth() + 1];
    const months = Math.max(0, (ey - start[0]) * 12 + (em - start[1]));
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (!y) return `${m} m`;
    return m ? `${y} yr, ${m} m` : `${y} yr`;
  }

  // Verified seal, as in the reference
  const BADGE = '<svg class="xp__badge" viewBox="0 0 24 24" aria-hidden="true"><path class="xp__badge-seal" d="M12 1.5l2.6 1.9 3.2-.2 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.2z"/><path class="xp__badge-tick" d="M8 12.3l2.7 2.7L16.2 9.5"/></svg>';

  function roleHtml(r) {
    const range = `${fmtDate(r.start)} - ${r.end ? fmtDate(r.end) : 'Present'} (${duration(r.start, r.end)})`;
    const rest = [r.place, r.type].filter(Boolean).map(esc);
    return `
      <li class="xp__role${r.end ? '' : ' is-current'}">
        <h4 class="xp__role-title">${esc(r.title)}${BADGE}</h4>
        <p class="xp__role-meta"><strong>${esc(range)}</strong>${rest.map(t => `<span>${t}</span>`).join('')}</p>
        ${r.summary ? `<p class="xp__summary">${esc(r.summary)}</p>` : ''}
        ${r.meta ? `<dl class="xp__meta">${r.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      </li>`;
  }

  function companyHtml(c, i) {
    const logo = c.logo
      ? `<img class="xp__logo" src="${c.logo}" alt="" width="40" height="40">`
      : `<span class="xp__logo" style="--logo:${c.color}" aria-hidden="true">${esc(c.initial)}</span>`;
    return `
      <li class="xp__co" style="--xp-fade:${[1, 0.72, 0.5][i] ?? 0.5}">
        <div class="xp__co-head">${logo}<h3 class="xp__co-name">${esc(c.company)}</h3></div>
        <ol class="xp__roles">${c.roles.map(roleHtml).join('')}</ol>
      </li>`;
  }

  // One row per group: name, a one-line description, then the skills. Each skill
  // appears once; team and working-style skills live under Collaboration.
  const SKILLS = [
    {
      group: 'UX Research',
      note: 'Understanding people and the problem before designing anything.',
      items: ['User Research', 'User Interviews', 'Usability Testing', 'Heuristic Evaluation', 'Contextual Inquiry', 'Surveys', 'Persona Creation', 'Journey Mapping', 'Task Analysis', 'User Flows', 'Problem Definition', 'Research Synthesis', 'Affinity Mapping'],
    },
    {
      group: 'UX & Interaction Design',
      note: 'Structuring flows, navigation and behaviour for complex products.',
      items: ['Wireframing', 'Prototyping (Low-Fi & High-Fi)', 'Interaction Design', 'Information Architecture', 'Navigation Design', 'Flow Mapping', 'Design Systems', 'Component Libraries', 'Accessibility (WCAG)', 'Usability Heuristics', 'User-Centered Design (UCD)', 'Design Thinking', 'UX Documentation'],
    },
    {
      group: 'UI Design',
      note: 'Turning structure into clear, consistent screens.',
      items: ['High-Fidelity UI Design', 'Visual Hierarchy', 'Typography', 'Color Theory', 'Layout / Grid Systems', 'UI Components & Patterns', 'Interaction Patterns', 'Responsive Layouts', 'Responsive Prototyping', 'UI Specifications'],
    },
    {
      group: 'Design Tools',
      note: 'Where the work gets designed, shared and documented.',
      items: ['Figma', 'FigJam', 'Adobe XD', 'Illustrator', 'Miro', 'Canva', 'Notion', 'Google Workspace'],
    },
    {
      group: 'Collaboration',
      note: 'Working with product, engineering and stakeholders to ship.',
      items: ['Developer Handoff', 'Design Documentation', 'Stakeholder Communication', 'Stakeholder Alignment', 'Cross-Functional Collaboration', 'Agile/Scrum Workflow', 'Requirements Analysis', 'Problem Solving', 'Critical Thinking', 'Analytical Thinking', 'Communication', 'Empathy-driven Design'],
    },
  ];

  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function build() {
    const section = document.createElement('section');
    section.className = 'xp';
    section.setAttribute('aria-labelledby', 'xp-title');
    section.innerHTML = `
      <div class="xp__inner">
        <div class="xp__block">
          <p class="xp__pill">Experience</p>
          <h2 class="xp__title" id="xp-title">Where I’ve worked</h2>
          <ol class="xp__list">${EXPERIENCE.map(companyHtml).join('')}</ol>
        </div>

        <div class="xp__block">
          <p class="xp__pill">Skills</p>
          <h2 class="xp__title">What I work with</h2>
          <div class="xp__skills">
            ${SKILLS.map((s, i) => `
              <div class="xp__group" style="--i:${i}">
                <div class="xp__group-head">
                  <h3 class="xp__group-title">${esc(s.group)} <span class="xp__group-count">${s.items.length}</span></h3>
                  <p class="xp__group-note">${esc(s.note)}</p>
                </div>
                <ul class="xp__chips">${s.items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
    return section;
  }

  let section = null;

  function mount() {
    const footer = document.querySelector('.framer-17x7weh-container');
    if (!footer) return;
    if (!section) {
      section = build();
      revealSkills(section);
    }
    if (section.nextElementSibling !== footer) footer.before(section);
  }

  // Skill rows fade up once, staggered, the first time they scroll into view
  function revealSkills(root) {
    const skills = root.querySelector('.xp__skills');
    if (!('IntersectionObserver' in window)) return;
    skills.classList.add('is-waiting');
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      skills.classList.remove('is-waiting');
      skills.classList.add('is-in');
      io.disconnect();
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(skills);
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
