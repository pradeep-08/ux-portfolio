/**
 * Pradeep UX Portfolio - Experience & Skills (home page)
 * Adds the last section above the footer. Content is taken from the resume
 * (Resume.pdf). Framer renders the page client-side, so the section is inserted
 * once the footer exists and re-inserted if a re-render drops it.
 */

(function () {
  const EXPERIENCE = [
    {
      company: 'KritiLabs Technologies',
      role: 'UX/UI Designer',
      dates: 'Nov 2022 – Present',
      summary: 'Designed end-to-end user-centered interfaces for IoT dashboards and enterprise SaaS tools using Figma. User research, usability testing, wireframing, and prototyping. Optimized workflows improving task completion rate by 27% and reducing onboarding time by 40%. Validated designs with 10+ users and partnered with PMs and engineers to deliver seamless handoff.',
      meta: [['Tools', 'Figma'], ['Methods', 'User Interviews, Wireframes, Prototypes, IA, Journey Maps']],
    },
    {
      company: 'Perfect Electronics',
      role: 'RnD (NATS)',
      dates: 'Jul 2021 – Nov 2022',
      summary: 'Developing product samples based on customer needs, testing and measuring product parameters, and preparing specifications, quality plans, product release reports, and BOM using AutoCAD, Google Sheets, and Google Docs.',
    },
    {
      company: 'Leo Prime Comp',
      role: 'Quality Assurance',
      dates: 'Aug 2020 – Jul 2021',
      summary: 'Inspects and approves incoming materials by confirming specifications, conducting visual & measurement tests and rejecting & returning unacceptable materials.',
    },
  ];

  const SKILLS = [
    ['UX Research', ['User Research', 'Persona Creation', 'Usability Testing', 'Heuristic Evaluation', 'Journey Mapping', 'Task Analysis', 'User Flows', 'Problem Definition', 'User Interviews', 'Surveys', 'Contextual Inquiry', 'Research Synthesis', 'Affinity Mapping']],
    ['UX Design / Interaction Design', ['Wireframing', 'Prototyping (Low-Fi & High-Fi)', 'Interaction Design', 'Information Architecture', 'Navigation Design', 'Flow Mapping', 'Design Systems', 'Component Libraries', 'Accessibility (WCAG)', 'Usability Heuristics', 'User-Centered Design (UCD)', 'Design Thinking', 'Problem Solving', 'UX Documentation', 'Stakeholder Alignment', 'Cross-Functional Collaboration', 'Agile/Scrum Workflow']],
    ['UI Design', ['High-Fidelity UI Design', 'Responsive Layouts', 'Visual Hierarchy', 'Color Theory', 'Typography', 'UI Components & Patterns', 'Layout / Grid Systems', 'Interaction Patterns', 'UI Specifications', 'Responsive Prototyping']],
    ['Design Tools', ['Figma', 'FigJam', 'Adobe XD', 'Illustrator', 'Miro', 'Canva', 'Notion', 'Google Workspace']],
    ['Collaboration', ['Developer Handoff', 'Design Documentation', 'Stakeholder Communication', 'Agile/Scrum Workflow', 'Cross-Functional Collaboration', 'Problem Solving', 'Critical Thinking', 'Requirements Analysis', 'Analytical Thinking', 'Communication', 'Empathy-driven design']],
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
          <ol class="xp__list">
            ${EXPERIENCE.map(job => `
              <li class="xp__job">
                <p class="xp__dates">${esc(job.dates)}</p>
                <div class="xp__body">
                  <h3 class="xp__company">${esc(job.company)} <span>${esc(job.role)}</span></h3>
                  <p class="xp__summary">${esc(job.summary)}</p>
                  ${job.meta ? `<dl class="xp__meta">${job.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
                </div>
              </li>`).join('')}
          </ol>
        </div>

        <div class="xp__block">
          <p class="xp__pill">Skills</p>
          <h2 class="xp__title">What I work with</h2>
          <div class="xp__skills">
            ${SKILLS.map(([group, items]) => `
              <div class="xp__group">
                <h3 class="xp__group-title">${esc(group)}</h3>
                <ul class="xp__chips">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
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
    if (!section) section = build();
    if (section.nextElementSibling !== footer) footer.before(section);
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
