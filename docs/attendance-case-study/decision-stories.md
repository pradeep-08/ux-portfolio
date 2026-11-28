# Decision stories: inventory and interview prep

This uses the Decision Stories method: **collect** candidate decisions, **build** stories, then **assemble** the strongest four for the public page. The rest are for interviews.

**Evidence key:** **F** = visible in the final frames · **I** = visible in the archived iterations (v1–v4) · **O** = a contrast with the original Kriti AMS app · **R** = reasoning reconstructed from the evidence, to be confirmed by Pradeep

## 1. Collect: 25 candidate decisions

| # | Decision | Type | Evidence |
| --- | --- | --- | --- |
| 1 | Prioritise daily attendance marking on the home screen | Strategic | F, O |
| 2 | Design around explicit states (Not Marked, Checked In, Checked Out) | Strategic | F, I |
| 3 | Support office, WFH and On duty on one screen | Strategic | F, O |
| 4 | Make GPS readiness understandable, not raw | Strategic | F, I, O |
| 5 | Confirm employee identity during registration | Strategic | F, O |
| 6 | Keep recent records on the home screen (Attendance Summary) | Strategic | F, I |
| 7 | Design failure and recovery states | Tactical | F |
| 8 | Separate one-time onboarding from daily attendance | Tactical | F |
| 9 | Collect name, employee ID and mobile number | Tactical | F, O |
| 10 | Add a "verify your details" step with "Not your details? Go back" | Tactical | F |
| 11 | Use an SMS verification code | Tactical | F |
| 12 | Explain the processing wait with a countdown | Tactical | F, O |
| 13 | Show a success state with automatic redirect | Tactical | F |
| 14 | Recover from SMS delivery failure (re-send, contact HR/admin) | Tactical | F |
| 15 | Group information into cards: employee/status, location, summary, actions | Tactical | F, I |
| 16 | Explore a map thumbnail in the GPS card (not kept) | Tactical | I |
| 17 | Rate GPS accuracy (Low, Good) | Micro | F |
| 18 | Rename "Last Fix Time" to "Last location update" | Micro | I (v3→v4) |
| 19 | Make refresh a round icon button with a "Refreshing…" state | Micro | F, I |
| 20 | Rename "History" to "Attendance Summary" and bring it on screen | Tactical | I (v1→v4) |
| 21 | Use explicit status labels and badges (red calendar, green shield) | Micro | F |
| 22 | Location-permission dialog that names the fix ("Enable") | Micro | F |
| 23 | Tag check-ins and records with the work mode (Office, WFH) | Micro | F |
| 24 | Use one dark primary button across registration and attendance | Micro | F |
| 25 | Explore attendance-specific app icons | Micro | Archive frames |

The original brief listed a map-based location screen, a GPS health check and bottom navigation. None of these is in the final frames. A map card exists only as an archived exploration (#16), and the health check and bottom navigation exist only in the unconfirmed "insp" HTML frame.

## 2. Build: eight stories

### Public (on the page)

| # | Title | Type | Why it was chosen |
| --- | --- | --- | --- |
| 01 | Attendance status over attendance actions | Strategic | The clearest before/after; the strongest single idea |
| 02 | Explaining GPS instead of hiding it | Strategic | A genuine three-way alternative, with the original app as a real option |
| 03 | Staged employee verification | Tactical | The fullest flow evidence: five screens and a failure path |
| 04 | One experience for office and remote work | Strategic | Business and policy trade-off, with an archived v4 exploration |

The full text of these four is on the page (Design decisions view).

### Interview prep (not on the page)

Same six-part structure. Rehearse these in your own words, and correct anything that doesn't match what actually happened.

#### Story 05: Turning location and connectivity errors into recoverable moments

- **Hook:** A failed check-in at 9:58 AM is worse than no app at all if it doesn't say why.
- **Before:** The original app showed no dedicated error states in the available screenshots. (Confirm: what happened when location was off?)
- **Turning point:**
  - Option A: a generic toast ("Something went wrong").
  - Option B: a full-screen error page.
  - Chosen: a modal over the dimmed attendance screen. It names the cause, shows an illustration, offers one fix ("Enable", or "Try Wifi" / "Try Mobile") and an exit. The context stays visible behind it.
  - Trade-off: a modal interrupts, but the task can't continue anyway.
- **What I designed:** Location/Not Enabled v1 (177:3232) and "You're offline" (177:3712). Copy follows the pattern of problem, then action: "Turn on location on your phone, then try again."
- **Result:** Design outcome only. Measure with the GPS error recovery rate and support tickets.
- **Possible follow-up question:** "Why 'exit' in red?" Be ready to discuss whether a quieter secondary style would be better.

#### Story 06: Keeping attendance history next to the daily action

- **Hook:** "Did yesterday's check-out go through?" is the second most common question after "Have I marked today?"
- **Before:** The original app had no records view. v1 put History behind a header button (174:1612).
- **Turning point:** The iterations show the progression. v1 had a History button. v2 added a History section with cards. v3 used horizontally scrolling day cards. v4 renamed it Attendance Summary. The final design shows two days (today and yesterday).
  - Trade-off: on-screen records add scroll length; a separate tab would hide them.
- **What I designed:** The day record card in five variants: today, completed, WFH, not marked, and incomplete (4.10 hrs, no check-out).
- **Evidence:** Strong, because the versioned frames show the change directly.
- **Open:** Was a full history screen planned? None exists in the file.

#### Story 07: Using processing and success feedback to show system progress

- **Hook:** Seventeen seconds feels like a minute when you don't know what's happening.
- **Before:** The original app showed a plain "Loading… Seconds remaining: 17" box (original-loading).
- **Turning point:**
  - Option A: a spinner only.
  - Option B: a countdown in text.
  - Chosen: a stopwatch illustration, "17 seconds remaining…", an explanation ("We're sending a confirmation message…") and "Please don't close this screen".
  - The file also has three stopwatch animation explorations (Elastic, Magnetic, Fluid; 490:249/270/291) and a timer text component (107:1544).
- **What I designed:** Processing (91:700), processing with code (607:320), and success with auto-redirect (107:1567).
- **Trade-off:** An illustration adds visual weight to a transient screen.

#### Story 08: Creating recognisable attendance app iconography

- **Hook:** The icon is the one piece of the product employees see every day before they open it.
- **Explorations in the file:**
  - Lettermarks (K, KA, hand-drawn KA)
  - Calendar with a tick (lilac and blue versions)
  - Calendar with people (coral)
  - An isometric clipboard (V1–V3)
  - A checklist card (v5)
  - Layered ID cards (V6, V7 and variants, with and without the Kritilabs logo)
  - A line-art minimal version
- **Turning point:** Abstract lettermarks are distinctive but don't say "attendance". Calendar and tick metaphors are clear but generic. Layered cards suggest an employee ID while using brand colours.
- **Open:** Which icon was chosen or shipped? None is marked final. Several directions reuse an isometric illustration (image hash 46cb71a5); confirm its source and licence before showing it publicly.

## 3. Assemble: why these four go public

- **Strategic weight first:** Stories 01, 02 and 04 are product-level choices; 03 shows flow craft.
- **Real alternatives:** Each public story has at least one real comparison point: the original app or an archived exploration. Conceptual options are labelled as conceptual.
- **Visual evidence:** Each has three or more real screens.
- Stories 05–08 are strong but rely more on micro-decisions or need confirmation (08), so they suit a conversation better.
