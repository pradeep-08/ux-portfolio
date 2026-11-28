# E-Seal case study: notes

Page: `e-seal.html`. Built the same way as Kriti, LOMO and GCC.

## What changed

- **Layout:** moved to the caseform layout.
- **Case study view (default):** the earlier copy, word for word. It's web-focused, as before. Eyebrows are dropped and the reflection quote is split into a quote plus a note. Screens are added: the dashboard, the transaction table, and a light/dark compare slider for decision 3.
- **Design decisions view:** covers both products, the web dashboard and the mobile field app. It has four stories, the scan-flow sequence, app-icon explorations, and a design system with a contrast check.
- **Navigation:** the toggle, the tip and the "4" badge work as on the other pages.
- **Meta:** "Platform" now reads "Web, plus a field app", because the user confirmed both files belong to this project.

## Shared files touched

| File | Change |
| --- | --- |
| `css/case-study-story.css` | `ds-media--web` (full-width web screenshot panel) and `ds-compare--web` (compare slider that shows two web screenshots whole) |
| Renderer (scratchpad, not in the repo) | Fixed a 64-bit varint bug that stopped the E-Seal Web file from decoding. Added the Outfit font |

## Sources

| Figma file | Used |
| --- | --- |
| `Ebaton(e-seal) Web(UI) App Design.fig` | "Admin (HI-FI)" and "Admin (Lo-FI)" sections |
| `Ebaton(e-seal) Mobile App Design.fig` | "User" section, plus the app-icon explorations on the Draft page |

The "Inspiration" pages in both files (third-party dashboards and apps) aren't used. Neither are the blank presentation frames ("Frame 68", "Frame 69", drafts "Final").

**Redaction:**
- Vehicle numbers swapped for demo values: MP09HH4167, PB65BB8897, PB65AT0547, PB11BU4254 and PB11CZ2764 → MP01AB1001 to PB01AB1005.
- Seal serial numbers (PS00000…) blurred.
- The mobile file only uses demo data ("Demo_user", dummy codes), so it's rendered without blur.

## Asset mapping

Folder: `assets/images/case-studies/e-seal/`

| File | Figma frame (node) |
| --- | --- |
| web-dashboard / web-dashboard-dark | Web › Dashboard (Hi-fi wireframe) light / Dark (111:332 / 74:77) |
| web-transactions | Web › Dashboard (Hi-fi wireframe) light, "Transaction" (111:561) |
| web-lofi-dashboard | Web › Dashboard (Lo-fi wireframe) light (104:314) |
| app-login | Mobile › Login (6:5) |
| app-home | Mobile › Home_Page (700:264) |
| app-scan-qr / app-scanned-qr | Mobile › Home_Page_with_scan (594:249 / 18:95) |
| app-rfid-not-connected / -devices / -connected / app-scanned-rfid | Mobile › Home_Page_with_scan (635:534 / 635:645 / 635:851 / 677:588) |
| app-nfc-scanning / app-scanned-nfc | Mobile › Home_Page_with_scan (675:490 / 677:642) |
| app-success / app-unseal | Mobile › Success (64:180) / Home_Page_with_scan (116:248) |
| icon-1, -2, -3, -5 | Mobile › Draft › Frame 15, 17, 18, 19 (541:223, 541:230, 541:235, 541:249) |

**Available but unused:**
- App forgot-password flow (6:115 → 169:231 → 170:299)
- Web login (160:34)
- The "Padlock Seal" login variant (213:8)
- Web dashboard card components (246:xx)

## Validation

| Check | Result |
| --- | --- |
| Both views at 1440, 768, 390, 320 px | Pass, no sideways overflow |
| Real-time behaviour via Chrome DevTools | Pass: toggle, tip, per-page flag, contents rail and bot narration |
| Console errors | None |
| Image references | All present, none unused |

## Open questions for Pradeep

1. **Is E-Seal live?** If so, I'll add the Live chip like the other three.
2. **Product name.** The files say "Ebaton (e-seal)", the web login says "Kritilabs E-Seal System", and there's a "Padlock Seal" variant. "Ebaton" is also the name of the RFID reader. Which name should the page use?
3. **Customer names.** PUNBUS and MG Oil appear in the dashboard and table. Keep them, or replace them with demo names?
4. **Two visual languages.** The web uses sage #657A61 with Outfit and Roboto; the app uses Inter with #80A256. Was that intentional (different teams or phases), or should the page present it as something to unify?
5. **Reasoning.** The rationales are reconstructed from the files. Edit them to match what you actually thought.
6. **Your role and the timeline.** The frames say "Last Updated: 5 Aug 2025 / 08 Sep 2025".

## Interview stories (not on the page)

- **05 · Seal and un-seal as two states of one record.** An existing seal shows "Checked" or "Un-Seal". Why both actions sit on the same card.
- **06 · Light and dark dashboards.** One hierarchy in two themes; what had to change beyond colour (cards, chart contrast).
- **07 · Password recovery in the app.** Generate code → Verify → New password (unused frames 6:115, 169:231, 170:299).
- **08 · App icon direction.** Purple padlock and QR icons, ending on a green padlock in scan brackets that matches the app.
