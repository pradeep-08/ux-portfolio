# Missing case-study assets

Status: **image integration not done.** No Figma exports have been supplied yet, so
the five case-study pages are published text-only, with a clean text hero and no
figures. The project cards on the Projects and Home pages use text covers until
an image is added.

## How to add an export

1. Export the frame from Figma as PNG at 2x. Confirm it's the final variant, and
   replace any personal data, vehicle numbers, serial numbers, routes or
   credentials with demo values.
2. Save it as `assets/images/case-studies/<project-slug>/<filename>`. Use the
   filenames below.
3. Paste a figure into the matching section of the page:

   ```html
   <figure class="cs-figure">
     <img src="assets/images/case-studies/lomo-track/trip-info.png"
          alt="Trip information screen showing vehicle, journey endpoints, status and distance"
          width="2000" height="1250" loading="lazy" />
     <figcaption>Trip information establishes the vehicle and journey before the user opens detailed tracking.</figcaption>
   </figure>
   ```

   Add `cs-figure--wide` to let a figure extend past the text column on wide
   screens. Don't lazy-load the hero image.
4. For a card image, set `img` for that project in `js/projects-grid.js`.

The node IDs below come from the Figma file. They aren't URLs, and imported
copies may get different IDs.

## lomo-track

| File | Figma frame (node) | Section |
| --- | --- | --- |
| hero-list.png | Landing_page (2306:3437) | Hero: three-phone composition with trip list, trip info and route exceptions |
| trip-info.png | Trip info (625:982) | Design decisions 1: trip context |
| route-exceptions.png | Locate (2501:3376) | Design decisions 2: route and events |
| ticket-create.png | Ticket_Pop (1776:9577) | Design decisions 3: support |
| ticket-created.png | Ticket_Created (1795:2157) | Design decisions 3: support |
| empty-trip.png | No trip (2419:3925) | Design decisions 4: states |
| restricted-access.png | Access Restricted (2454:4252) | Design decisions 4: states |
| playback.png | Locate (2869:3267) | Optional supporting figure |

Before exporting, check that the no-trip variants don't still show stale trip
data alongside the empty-state message.

## curio-snap

| File | Figma frame (node) | Section |
| --- | --- | --- |
| workspace-light.png | Home — Light (91:2) | Hero and workspace decision |
| workspace-dark.png | Home — Dark (306:318) | Theme comparison |
| device-connection.png | Desktop - Connection — Light (328:736) | Connection decision |
| device-upload.png | Desktop - Upload — Light (930:4072) | Connection sequence |
| workspace-wireframe.png | Approved Wireframe (1828:18153) | Design exploration |
| board-selection.png | Desktop - User Guide - Light (3395:20426) | AI learning sequence |
| ai-onboarding.png | Ai/Onboarding/v3/final (3139:20255) | Hero inset and AI sequence |
| ai-input-data.png | AiLab/image/Step1 (4258:21090) | AI learning sequence |
| ai-add-examples.png | AiLab/image/Step2 (4258:21566) | AI learning sequence |
| ai-next-state.png | AiLab/image/Step3 (4258:22354) | Optional AI sequence |
| hardware-config.png | IR sensor (3118:32879) | Optional hardware configuration |

Before exporting, fix modality labels (e.g. "My image project" on pose and voice
screens) and the STM32 / SMT 32 spelling.

## facility-management

| File | Figma frame (node) | Section |
| --- | --- | --- |
| admin-dashboard.png | Home page (141:384) | Hero, administrator overview |
| user-tasks.png | User_dashboard_home (2641:5876) | Hero, field-user overview |
| task-checklist.png | after_scan_ page (2721:3481) | Design decisions 3: checklist |
| facility-mapping.png | Facility_view (2734:3597) | Design decisions 1: facility relationships |
| device-connected.png | pairng_connection_pop_up (2721:3781) | Design decisions 2: device recovery |
| device-disconnected.png | pairng Disconnect_pop_up (2721:3853) | Design decisions 2: device recovery |
| manual-fallback.png | User_dashboard_home_screen (2835:8422) | Design decisions 2: device recovery |
| task-started.png | Check-in (2908:4679) | Task sequence |
| task-completed.png | Check-out (2910:4796) | Task sequence |
| reassign-user.png | Muliti user swapping (2963:5254) | Design decisions 4: reassignment |
| complaint-confirmed.png | Help page (4020:6273) | Optional complaint figure |

Before exporting, fix the sample AM/PM times and the labels "In_active",
"Conneted", "Maintanence" and "Muliti user swapping".

## gcc-safe-subway

| File | Figma frame (node) | Section |
| --- | --- | --- |
| location-list.png | High-Fidelity ( Dashboard) (300:130) | Hero and location selection |
| location-control.png | HIgh-Fidelity ( Configuration) (416:178) | Hero and operation control |
| task-flow.png | User Flow (477:192) | Task flow |
| ui-flow.png | Ui flow (481:558) | Supporting UI sequence |

## e-seal

| File | Figma frame (node) | Section |
| --- | --- | --- |
| dashboard-light.png | Dashboard (Hi-fi wireframe) light (111:332) | Hero and overview |
| dashboard-dark.png | Dashboard (Hi-fi wireframe) Dark (74:77) | Design decisions 3: theme comparison |
| transactions.png | Datatable (348:18) | Design decisions 2: transactions |
| dashboard-wireframe.png | Dashboard(Lo-fi wireframe) light (104:314) | Optional, label it "Design exploration" |

Use only frames from the main Design page, not the Inspiration page.

## Facts to confirm before adding to the pages

These are hidden on the public pages until you confirm them:

- Your exact role, collaborators, duration and release status for each project
  (the old LOMO "3 months" timeline was removed).
- Client and product naming: LOMO Track vs TRACK INTELLI / ALS Tracker; Curio
  Snap vs Curio Labs / Curio Makers; GCC's full name, and whether it's the
  customer (only then call it B2G).
- Permission to show office work and client logos.
