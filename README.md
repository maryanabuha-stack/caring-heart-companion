# CareNest Dashboard

Build/update the CareNest Dashboard screen — a tablet healthcare assistant app for elderly patients and caregivers. Use reference image 1 for the overall visual style (colors, typography, corner radius, card structure), but reference images 2 and 3 as the EXACT target for structure, spacing, and component behavior on this screen — match those two closely.

=== VISUAL STYLE (from reference image 1, adapted) ===

- Soft light blue-gray background, white cards with 16-20px rounded corners, no harsh borders

- Dark navy sidebar, full height, icon-based navigation with active item highlighted as a solid blue rounded pill

- Primary accent: clean, saturated blue (matching image 1's blue pill/buttons)

- Clean modern sans-serif typography, medium/semi-bold headings

- No decorative/promotional widgets — remove anything like image 1's "25% off premium" banner or "Quote of the Day" card, these add irrelevant visual noise for this audience

=== ACCESSIBILITY BASELINE (applies everywhere, overrides style ref where they conflict) ===

- Base body text minimum 18px, headings 24-28px, never smaller than 16px

- All buttons, nav items, and tappable rows: minimum 56px height

- Every status shown with color + icon + text together, never color alone

- Single-column, top-to-bottom scrolling layout, no dense multi-widget grids

=== SIDEBAR ===

- Fixed dark navy sidebar, full height

- Items: Dashboard, Medications, Symptom Tracking, Communication, Reminders — icon + text label, always visible (no icon-only or hover-to-expand state)

- All content LEFT-ALIGNED (icons and labels flush left with consistent padding, e.g. 20-24px from the left edge) — not centered

- Active item (Dashboard) highlighted with a blue rounded pill, icon+label inside it also left-aligned, not centered within the pill

- User profile row at the bottom (avatar + name + "Settings") follows the same left-alignment and padding

=== TOP "NEXT ACTION" BANNER — informational only, no button ===

- Soft, calm light blue tint background (not the saturated button-blue)

- Small label "Next action" above, bold main text below with the medication name and time (e.g. "Take Blood Pressure Medication")

- No button here — this card is purely informational. The actual action lives only in the "Medications today" list below, so the same action never appears twice on screen

=== "TODAY'S PROGRESS" CARD ===

- Text-based progress, not a percentage ring: "X of Y medications taken today" + a horizontal progress bar (blue fill, gray track)

- Small supportive line underneath, e.g. "Keep it up"

=== "MEDICATIONS TODAY" LIST — match reference image 2 exactly ===

- Section header: "Medications today"

- Every row has a light blue-gray tinted background (consistent across all rows, whether pending, due, or taken — not plain white)

- Row layout: status icon (left) → medication name (bold) + time (below) → right-aligned action area

- Right-aligned action area:

  - Pending/due: solid blue "Mark as taken" button, rounded, same style across all rows

  - Taken: plain tappable text "Taken - Tap to undo", right-aligned, no button styling — matches image 2's "Vitamin D" row exactly

  - Upcoming (not yet due): lighter gray background variant, "Next" label, outline clock icon, no button — matches the "Next — Atorvastatin at 6:00 PM" row style

- This list is the single source of truth for medication actions — do not duplicate the same reminder elsewhere on the screen

=== "DAILY TASKS" — match reference image 3 exactly ===

- Each task is a checkbox row

- Two task types, visually distinct:

  - Self-contained tasks (e.g. "Drink a glass of water"): plain checkbox. On tap — checkbox fills solid blue with a white checkmark, task label gets a strikethrough, and a small gray "Completed at [time]" line appears below the label, using the actual time of the tap

  - Navigation tasks (e.g. "Log how you're feeling today"): right-facing arrow instead of a checkbox — tapping opens Symptom Tracking; this task only marks itself complete once the user actually logs something there, never just from the tap itself

- Keep this distinction minimal and lightweight — this is intentionally a small feature, not a full task-management system (per the brief's focus on a small, polished product)

=== "QUICK ACCESS" TILES ===

- 2-column grid, large square tiles, icon + label centered

- Tile 1: "How I'm feeling" → Symptom Tracking

- Tile 2: "Message my doctor" → Communication

=== REMINDER/MEDICATION CARD — reusable component with 5 states ===

Build this as one component (accepts a state prop), reused across Dashboard and Medications screen:

1. UPCOMING — neutral gray background, outline clock icon, "Next" label + medication/time text, no button

2. DUE NOW — light blue background, filled clock icon, "Next action" label + bold instruction, "Mark as taken" button

3. MISSED — soft amber/warning background, NOT red (deliberate accessibility choice: prompt calmly, don't alarm), alert-triangle icon, "Missed" label + text, button labeled "Mark as taken now"

4. TAKEN — neutral/white background, filled green checkmark icon, "Taken" label + time, tappable "Tap to undo" text (not time-limited, not a swipe gesture — stays available indefinitely; tapping opens a confirmation dialog "Undo marking [medication] as taken?" with "Yes, undo" / "Cancel" buttons, each min 56px tall)

5. EMPTY — centered layout, large green checkmark icon, "All done for today" + "Next reminder tomorrow at [time]"

=== CONFIRMATION AFTER "MARK AS TAKEN" ===

- Two layers of feedback required together, never just one:

  1. The row/card transitions to the TAKEN state immediately (icon, color, text change)

  2. A confirmation banner appears at the TOP of the screen, just below the header greeting — NOT bottom-right. Soft light blue background (same tone as the top "Next action" banner), checkmark icon + text (e.g. "Lisinopril marked as taken"), 16-18px text, visible 3-4 seconds before fading

- Include an aria-live="polite" region so screen readers announce the same message

- Apply this same confirmation pattern everywhere "Mark as taken" or similar actions occur

=== SHARED RULES ===

- Never rely on color alone for any status — always pair with icon and text

- No swipe, shake, or time-limited undo gestures anywhere

- No icon-only controls without a text label

- Flat design, no gradients or shadows, rounded corners 12-20px throughout

DO NOT INCLUDE

- No promotional banners, upsell cards, or "quote of the day" widgets (as seen in reference image 1 — ignore that part of it)

- No percentage rings, charts, or dense analytics

- No red color anywhere except explicitly critical/destructive confirmations (not used on this screen)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/208b0c3d-4645-4c86-a99c-0e171a6d909b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
