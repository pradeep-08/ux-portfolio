# Facility Management case study: notes

Page: `facility-management.html`. Built the same way as Kriti Attendance, LOMO Track and GCC Safe Subway.

## What changed

- **Layout:** moved from the long-form layout to the caseform layout: centred column, colour panels, phone frames.
- **Case study view (default):** the earlier copy, word for word. Eyebrows are dropped (the contents rail carries those labels) and the reflection quote is split into a quote plus a note. Screens are added where `docs/missing-case-study-assets.md` mapped them: admin and field-user overview, facility view, device connected/disconnected, manual fallback, task started/checklist/completed, reassignment and complaint.
- **Design decisions view:** four stories, an iteration comparison and the design system with a contrast check.
- **Navigation:** the top toggle, the tip and the "4" badge work as on the other pages.
- **Release status:** no Live chip, because release isn't confirmed (see open questions). Result labels say "Intended outcome · not measured".
- **Shared files:** no shared CSS or JS was changed; the page uses only existing classes.

## Where the images come from

The images are rendered from `assets/images/fig/Facility management App design.fig`, page "06 . Hi-Fi Designs (Admin + User)", plus the component-library page for the "before" wireframes. Screens are 720 × 1600.

**Redaction:**
- Blurred: phone numbers (any 10-digit number) and eBaton Bluetooth MAC addresses on the device screens.
- People names (Jenny Wilson, Cameron Williamson, Esther Howard and so on) are standard Figma UI-kit placeholders, so they're left as is.

**Typo fixes on screen** (same-length substitutions only):
- "Maintanence" → "Maintenance"
- "In_active" → "Inactive"

**Typos not fixed:**
- "Conneted" (in an unrelated frame, Frame 236 › Step-2; not shown on the page)
- The frame names "Muliti user swapping", "pairng…" and "Bluetooth paring Screen". These are layer names, not visible text.

**Not used:**
- The FITS user manuals (embedded screenshots of a built app). Release status is unconfirmed.
- Cover-page images
- "Frame 235/236" boards
- The hidden "after_scan_ page" frames

## Asset mapping

Folder: `assets/images/case-studies/facility-management/`

| File | Figma frame (node) |
| --- | --- |
| admin-dashboard / admin-dashboard-v2 / admin-dashboard-filter | Admin › Home page (141:384), daft v2 (3187:5409), Home page (2199:10149) |
| advance-filter | Admin › Home page, Advance Filter (2199:10403) |
| facility-overview / facility-list / facility-view | Admin › Facility_list_page (180:287), Facility - List / Search (308:335), Facility_view (2734:3597) |
| swap-select / swap-assign / swap-confirm | Admin › Muliti user swapping popup (2954:7235), Muliti user swapping (2963:5254), Swapping pop up (2970:6146) |
| user-dashboard / manual-fallback | User › User_dashboard_home (2641:5876), User_dashboard_home_screen (2835:8422) |
| ebaton-record / manual-record | User › Ebaton_home_ page (1561:3150), manual_record_page (453:715) |
| device-connected / device-disconnected | User › pairng_connection_pop_up (677:2160), pairng Disconnect_pop_up (682:2260) |
| low-battery | Admin › Lowbattery_pop_up (2721:3989) |
| check-in / task-started / task-checklist / task-completed / task-done | User › Check-in (2875:4416, 2908:4679), Check-out (2879:5223), Completed (2885:8672), Check-out (2910:4796) |
| complaint | User › Help page (4020:6273) |
| wf-company / wf-location | Component Library › "Ebaton_home_ page_before" (4148:10423 / 4148:10538) |

**Available but unused:**
- Splash screens, login and password screens
- Facility mapping (640:1574)
- Schedule screens (1729:5769, 1627:2142)
- Reconnect sheet (2721:3925)
- Language and profile screens
- User manuals (4148:7612, 4148:7848, 4148:8083)

## Validation

| Check | Result |
| --- | --- |
| Both views at 1440, 768, 390, 320 px | Pass, no sideways overflow |
| Real-time behaviour via Chrome DevTools | Pass: toggle, tip, per-page tip flag, contents rail rebuild and bot narration |
| Console errors | None |
| Image references | All present, none unused |

## Open questions for Pradeep

1. **Is it live?** The file contains "FITS_User_Manual v1.0" (Record Manual, NFC and eBaton editions) built from real app screenshots. If FITS is the shipped product, the page could carry a Live chip and the name could be confirmed.
2. **Product name.** The file uses "Facility Management Tracking" in the app header and FITS in the manual. Which should the page use?
3. **Which dashboard is final?** There are three admin dashboard variants (141:384, "daft v2" 3187:5409, and the filter version 2199:10149). The page labels them as variants and doesn't claim an order.
4. **Earlier vs later recording.** The page presents the eBaton "Record data" and manual record screens as earlier than the check-in flow, based on their Figma IDs and layout. Confirm.
5. **Reasoning.** The rationales are reconstructed from the file. Edit them to match what you actually thought.
6. **Role, timeline and client.** Confirm all three, plus permission to show the work.

## Interview stories (not on the page)

- **05 · Complaints with evidence.**
  - Category, asset, message and up to two photos.
  - A confirmed repair request keeps the scheduled time.
- **06 · Five device states.**
  - Searching, connected, disconnected (Re-connect), reconnecting and low battery.
  - Why each needs its own message.
- **07 · Advance filter.**
  - Location, building, floor and type with search chips.
  - Trade-off: a modal filter against inline chips on the dashboard.
- **08 · Designing for two roles.**
  - The admin's teal dashboard with a gauge and counts, against the field user's task-first home with the device banner.
