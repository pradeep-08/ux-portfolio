# GCC Safe Subway case study: notes

Page: `gcc-safe-subway.html`. Built the same way as Kriti Attendance and LOMO Track (see `docs/attendance-case-study/` and `docs/lomo-track-case-study/`).

## What changed

- **Layout:** moved from the long-form layout to the caseform layout: centred column, colour panels, phone frames.
- **Case study view (default):** the earlier copy, word for word. Eyebrows are dropped (the contents rail carries those labels) and the reflection quote is split into a quote plus a note. Screens are added where `docs/missing-case-study-assets.md` mapped them: location list, location control, user flow and UI flow. The confirmation prompt is also shown under decision 2.
- **Design decisions view:** four stories, a "wireframe → draft → approved" comparison and the design system with a contrast check.
- **Navigation:** the top toggle, the tip and the "4" badge work as on the other two pages.

The only shared file changed is `css/case-study-story.css`, which gains the `ds-media--tall` panel for the flow diagrams.

## Where the images come from

The images are rendered from `assets/images/fig/GCC Boom Barrier Design.fig`:

| Source | Shown as |
| --- | --- |
| "Approved ✅" section | Approved (final) |
| "Draft" and "wireframe" pages | Draft / Wireframe / Lo-fi explorations |

There are no screenshots of an earlier live app in this file, so the "before" in each story is the draft work, labelled as such.

**Redaction:** operator names in the draft history rows ("Manual (Operated by …)") are blurred.

**Not used:**
- The AI-generated illustration images on the Design page ("ChatGPT Image …")
- The 973 px tile frames, which look like marketing or social tiles
- The "Frame" flow sketch generated from JSON text (477:277)
- The admin profile screen

## Asset mapping

Folder: `assets/images/case-studies/gcc-safe-subway/`

| File | Figma frame (node) |
| --- | --- |
| login | Approved › High-Fidelity (Login) (260:68) |
| forgot / forgot-reset | Approved › High-Fidelity (Forgot password) (260:86 / 402:321) |
| dashboard | Approved › High-Fidelity (Dashboard) (300:130) |
| control / control-confirm | Approved › HIgh-Fidelity (Configuration) (260:666 / 416:178) |
| draft-dashboard | Draft › HIgh-Fidelity (Dashboard) (321:336) |
| draft-barriers | Draft › HIgh-Fidelity (Configuration) "Barrier List" (321:609) |
| draft-detail / draft-detail-b | Draft › HIgh-Fidelity (Configuration) (321:864 / 321:948), operator names blurred |
| draft-login / draft-forgot | Draft › High-Fidelity (Login / Forgot password) (321:250 / 321:285) |
| lofi-dashboard | Draft › Low-Fidelity (Dashboard) (321:299) |
| wf-onboarding / wf-forgot | wireframe › High-Fidelity (Onboarding) / Forgot password (12:44 / 12:66) |
| user-flow | Design file › User Flow, styled version (481:253) |
| ui-flow | Design file › Ui flow (481:558) |

## Validation

| Check | Result |
| --- | --- |
| Both views at 1440, 768, 390, 320 px | Pass, no sideways overflow |
| Real-time behaviour via Chrome DevTools | Pass: toggle, tip, per-page tip flag, contents rail rebuild and bot narration |
| Console errors | None |
| Image references | All present, none unused |

## Open questions for Pradeep

1. **The GCC emblem.** GCC is confirmed as the government client, so the sector now reads B2G. The login screens show the Greater Chennai Corporation emblem; still confirm you may show it publicly.
2. **Profile photo.** A photo sits in the header avatar. Confirm it's a stock image and not a real colleague.
3. **Why the scope was cut.** The draft had analytics, water level, per-barrier control and operator history; the approved design removed them. Was that your call, a client decision or a phase-1 scope cut? The stories present it as a design decision with trade-offs; adjust the wording if it was scope.
4. **The "heavy rain" framing** in Story 01 assumes subways are closed for flooding, based on the water-level field in the draft. Confirm.
5. **Release status. Confirmed live** as a government deployment; the page shows a "Live · Government deployment" chip. Still open: your role and the timeline (the file was exported Sep 2026; the draft history shows Nov 2024 dates).
6. **Copy fix:** "Do want to manually operate…" is missing "you". Fix it in Figma before re-exporting if you like.
7. **Reasoning.** The rationales are reconstructed from the file. Edit them to match what you actually thought.

## Interview stories (not on the page)

- **05 · Status always paired with a word.**
  - "Open" in green and "Closed" in red, so status never relies on colour alone.
  - The red contrast still fails AA, so the colour needs fixing.
- **06 · The acknowledgement gap.**
  - What happens after "Yes": the request is sent, then pending, then confirmed by the device, or it fails or times out.
  - A good "what I'd do next" answer.
- **07 · Six typefaces to one.**
  - Inter, Montserrat, Poppins, Figtree, Karla and K2D appear across the approved screens.
  - How you'd consolidate them, and why it matters for a small operations tool.
- **08 · Flow before polish.**
  - The user flow exists in a plain version and a styled version (477:192 → 481:253), plus a UI-screens board.
  - Shows that the invalid-login path was thought through before the screens.
