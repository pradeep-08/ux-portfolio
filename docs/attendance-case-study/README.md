# Kriti Attendance case study: notes

Page: `kriti-attendance.html`

## How the page works

The page has two views, switched by the pill at the top centre.

| View | What it is | Default |
| --- | --- | --- |
| **Case study** | The previous case study, unchanged except for one image (see below) | Yes |
| **Design decisions** | Four decision stories, the iteration timeline, app icon explorations and the design system | No |

- Link straight to the second view with `kriti-attendance.html?view=decisions`, or with an anchor such as `#decision-2`.
- The contents rail and the reading-progress menu rebuild for whichever view is showing.
- Without JavaScript, both views show one after the other.

## Files

| File | Change |
| --- | --- |
| `kriti-attendance.html` | Previous case study wrapped as view 1; Design decisions added as view 2; top toggle |
| `css/case-study-story.css` | New. Toggle, decision-story blocks, timeline, icon grid, design-system cards, table. Uses the existing `--cf-*` tokens |
| `css/case-study-caseform.css` | `.ds-wide` blocks join the wide media column on screens ≥1240px |
| `js/case-study-story.js` | New. View toggle (ARIA tabs, keyboard, `?view=` and anchor support) |
| `js/case-study.js` | Rail and progress menu skip hidden views and rebuild on a `cs:viewchange` event. Other case studies behave as before |
| `assets/images/case-studies/kriti-attendance/` | New screens, crops and icons (see [asset-mapping.md](asset-mapping.md)); `verify-details.webp` removed |

Also fixed: on screens ≥1240px the header tagline sat to the left of the title. It's now aligned (`css/case-study-story.css`).

## Where the images come from

No Figma export or Figma connection was available. The images were produced from `assets/images/fig/Attanance App Redesign.fig`:

1. The `.fig` file is a zip. Its `canvas.fig` was decoded (kiwi format, zstd-compressed) into the node tree: frame names, layout, text, vectors, effects and embedded images.
2. Each frame was rebuilt as HTML/SVG from that data and captured at 2× (720 × 1600) in headless Chrome.
3. Fidelity was checked against the earlier real Figma export (`attendance-after.webp`). Layout, type, colour, icons and the logo match. The only differences are copy edits made in Figma since that export (for example "Last Location Update" became "Last location update").

The "original-*" images are the screenshots of the earlier Kriti AMS app stored on the file's Design page.

**Redaction:** mobile numbers, employee IDs and the third-party name "Ajith Kumar" are blurred in every new image. "Pradeep" is left visible because the previous page already showed it.

**Excluded on purpose:**
- Thirteen screenshots of third-party apps on the Archive page (ride-hailing, UPI payments, transit tickets). They contain other people's personal data.
- The `Html → Body` frame on the "insp" page (bottom navigation, Health Check, map). Its source is unclear; see open questions.
- "Edit Location", which belongs to a different product (an I-KENDRIT admin web screen).

## Validation

| Check | Result |
| --- | --- |
| Both views render at 1440, 1280, 1024, 768, 390 and 320 px | Pass. 320/390/768 were checked in fixed-width iframes, because headless Chrome won't lay out narrower than about 500px |
| Horizontal overflow | None found |
| Light and dark theme | Pass |
| Console errors | None |
| Broken image references | None (scripted check of every `src`) |
| Toggle keyboard support | Arrow keys, Home and End move between tabs; focus ring visible |
| Reduced motion | The view fade and the compare-slider sweep are skipped |

There's no build, lint or test tooling in this repository (plain static HTML), so none was run.

## Open questions for Pradeep

These are deliberately kept off the public page until confirmed:

1. **Role and title.** The page says "UX and UI design" work, based on the existing copy and the Figma file. Confirm your title, and whether anyone else contributed (PM, developers, reviewers).
2. **Timeline.** The original screenshots are dated 27 May – 3 June 2026 and the Figma edits run to about 13 July 2026. Confirm the project duration before stating one.
3. **Release status. Confirmed live:** in use by Kritilabs employees. The page shows a "Live" chip, and result labels read "Live · impact not yet measured". If you have real numbers (adoption, completion time, support tickets), they can replace those labels.
4. **"v4 – Approved".** The frame name suggests a stakeholder sign-off. Confirm before mentioning approval publicly.
5. **Reasoning.** The decision rationales are reconstructed from the evidence in the file. Edit them so they match what you actually thought at the time.
6. **Work-mode rules.** Do office, WFH and On duty follow different verification rules (for example GPS for office only)? Story 04 avoids assuming either way.
7. **Draft confirmation copy.** The Archive page has "Your attendance will be marked as Work from Home for today." and "You're checked in from office." Was a WFH confirmation step designed or built?
8. **The "insp" HTML frame.** Is it your own early prototype or a captured third-party reference? If it's yours, it's good evidence for Stories 02 and 06.
9. **Final app icon.** No icon is marked final in the file, so the page shows them only as explorations.
10. **Permission.** Confirm Kritilabs is happy for the internal app and its logo to appear in a public portfolio.
