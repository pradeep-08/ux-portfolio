# LOMO Track case study: notes

Page: `lomo-track.html`. Built the same way as Kriti Attendance (see `docs/attendance-case-study/`).

## What changed

- **Layout:** moved from the long-form layout to the caseform layout used by Kriti Attendance: centred column, colour panels, phone frames.
- **Case study view (default):** the earlier copy, word for word. Two small presentation changes: section eyebrows were dropped (the contents rail carries those labels), and the reflection quote is split into a quote plus a note. Screens are added where `docs/missing-case-study-assets.md` mapped them, plus one Administrator/User pair under "Who it serves".
- **Design decisions view:** four decision stories, an "original → lo-fi → final" comparison and the design system with a contrast check.
- **Navigation:** the top toggle, the "Short on time?" tip and the "4" badge work as on Kriti. `?view=decisions` opens the second view.

## Shared files touched

| File | Change |
| --- | --- |
| `css/case-study-story.css` | Teal panel, wide IA panel, centred-screen variant (`ds-screen--mid`), long-form footer inside the caseform column |
| `js/case-study-story.js` | The tip's "seen" flag is now stored per page, so dismissing it on one case study doesn't hide it on another |
| `js/bot-nav.js` | Seated narration skips sections in the hidden view, and reads decision stories by their title and hook. This also fixes the same issue on Kriti Attendance |

## Where the images come from

The images are rendered from `assets/images/fig/Lomo Track Mobile App Design.fig`, using the same decode-and-render process as Kriti, at 720 × 1600.

**Redaction:**
- Vehicle numbers swapped for demo values, as `docs/missing-case-study-assets.md` asks: JK02CR3278 → TN01AB1234, TN16KL2025 → TN02CD5678, TN07DE6062 → TN03EF9012, TN07BV7398 → TN04GH3456.
- Any text containing a 10-digit number (invoice and mobile numbers) is blurred.
- In the original-app screenshots, invoice and vehicle numbers are blurred.

**Excluded on purpose:**

| What | Why |
| --- | --- |
| A train-booking screenshot (3119:3734) | Third-party data, passenger names |
| Dashboard and web screenshots ("screen 1–10", "Plane (Web)", ResumeLayout, Gemini images) | Inspiration or other material |
| The two hi-fi "no trip assigned" home screens | They use a noise texture the renderer can't reproduce. The dedicated "No trip" frame shows that state instead |

## Validation

| Check | Result |
| --- | --- |
| Both views at 1440, 768, 390, 320 px | Pass. No sideways overflow (narrow widths checked in fixed-width iframes) |
| Real-time behaviour via Chrome DevTools | Pass: toggle, tip, per-page tip flag, contents rail rebuild and bot narration. Kriti Attendance re-checked with the same script |
| Console errors | None |
| Image references | All present, none unused |

## Open questions for Pradeep

1. **Release status. Confirmed live:** in use by logistics teams. The page shows a "Live" chip, and result labels read "Live · impact not yet measured". The built-app screenshots (Dec 2025, May 2026) could now be shown as "in production" evidence, once vehicle numbers are redacted. Real numbers would replace the labels.
2. **Product name.** The file uses LOMO Track, LOMO Tracker and INTELLI TRACK (on the login), and the original was "Tanker Lorry Locking System". Which name should the page use?
3. **Your role and the timeline.** The original screenshots are from Nov 2024 – Apr 2025 and the Figma file was exported Sep 2026. Confirm the duration and who you worked with.
4. **Lo-fi wireframes.** Their Figma IDs are newer than the hi-fi frames, so they may have been made afterwards for documentation. The page doesn't claim they came first; confirm before saying so.
5. **Reasoning.** The decision rationales are reconstructed from the file. Edit them to match what you actually thought.
6. **Customer and outlet names.** Terminal and outlet names (Panipat, Mahal Terminal, Adyar-RO, Shiv Enterprise…) appear on screens. Are they OK to show, or should they become demo values like the vehicle numbers?
7. **Permission** to show the client's app and the Kritilabs logo publicly.

## Asset mapping

Folder: `assets/images/case-studies/lomo-track/`. Frames are on page "06 . Hi-Fi Designs (Admin + User)" unless noted.

| File | Figma frame (node) |
| --- | --- |
| trip-list | Admin › Landing_page (2306:3437) |
| trip-info | User › Trip info (625:982) |
| driver-home | User › Home_screen_withTrip (842:1675) |
| route-forward / -reverse / -deviation | Admin › Locate (2469:2059 / 2516:4462 / 2516:4516) |
| route-summary / route-events | Admin › Locate (2523:5000 / 2501:3376) |
| playback | Admin › Locate (2869:3267) |
| ticket-empty / -create / -created | User › Ticket (1067:1879), Ticket_Pop (1776:9577), Ticket_Created (1795:2157) |
| no-trip, loading, access-restricted | Admin › No trip (2419:3925), Loading (2410:1931), Access Restricted (2454:4252) |
| update-mandatory | Admin › Landing_page (2999:4129) |
| secondary-otp | User › "Secondary OTP" (3560:10924) |
| lofi-trip-list / -home / -locate | 05 . Lo-Fi Wireframes (3160:12532 / 3160:10307 / 3160:10475) |
| ia-user | 01 . Information architecture (3127:293). The Admin IA (3121:14943) has the same 33 nodes |
| original-trips / original-trip-map | WhatsApp images 2024-11-06 (3119:5764 / 3119:5766), numbers blurred |
| original-open-lock | WhatsApp image 2025-03-26 (3555:10740) |
| original-trips-2025 | WhatsApp image 2025-04-18 (3119:7368), numbers blurred |

**Available but unused:**
- Login and reset-password screens
- Secondary OTP "sent" (3560:10824)
- Trip-card component v1 and v2 (3419:3004, 3418:2944). These contain a real outlet name, so redact before use
- Locate_full turn-by-turn view (1665:2411)
- Optional-update variant (2999:3899)
- Components (3160:5191), Handoff (3160:6579) and the style guide page
- Built-app and app-store screenshots: use only once release status is confirmed

## Interview stories (not on the page)

Same six-part structure as the public stories: hook, before, options, reasoning and trade-off, design, result.

- **05 · States beyond the active trip.**
  - Covers no trip, loading, unauthorized vs access restricted, and optional vs mandatory update.
  - Trade-off: each state is extra design and build work.
  - Talking point: why "Unauthorized" and "Access Restricted" are separate screens.
- **06 · Rethinking lock unlocking as "Secondary OTP".**
  - Before: the original "Open Lock" screen had "Step 1 Fetch OTP, Step 2 Input OTP" in boxes on a blank page.
  - After: vehicle and invoice, a map of the destination outlet (RO 1), "OTP Verification → Request", then a 5-digit OTP entry with Resend.
  - Ask yourself: why show the location here?
- **07 · Trip playback for reviewing recorded movement.**
  - Pause and Reset over the recorded route.
  - Trade-off: a playback mode against a static route.
- **08 · Iterating the trip card (v1 → v2 → final).**
  - v1 led with the full long outlet names. v2 moved the vehicle and status up. The final card shows short endpoint names with arrows, plus trip type.
