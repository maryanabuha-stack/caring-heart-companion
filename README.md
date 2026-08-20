# CareNest — AI Product Designer Test Task

CareNest is a tablet-based healthcare assistant app designed for elderly patients and their caregivers. This project was built as a test task for the AI Product Designer position, with a focus on accessibility, simplicity, and an AI-native design-to-build workflow.

## Live prototype

[Add your deployed Lovable link here]

## Screens

- **Dashboard** — today's medications, tasks, reminders, and progress at a glance
- **Medications** — full medication list with mark-as-taken / undo actions
- **Symptom Tracking** — quick daily wellbeing log
- **Communication** — messaging and help requests to a caregiver/doctor
- **Reminders & Feedback** — notification states (upcoming, due, missed, taken, empty)

## Design focus

Built for an elderly, low-vision, low-dexterity audience:
- Minimum 56px tap targets, 18px+ body text
- Every status shown with color + icon + text — never color alone
- Calm, non-alarming warning states (amber instead of red for missed medications)
- No swipe/time-limited gestures — all actions have a stable, reversible undo

## Process (Think → Design → Prompt AI → Build → Test → Improve)

- **Think:** Defined the core user need — "what do I need to do right now" — and prioritized information hierarchy accordingly
- **Design:** Sketched low-fi wireframes for key screens and states before prompting, focusing on accessibility overrides on top of visual style references
- **Prompt AI:** Built with [Lovable](https://lovable.dev) — see `prompts.md` for the full set of prompts used
- **Build:** Generated via Lovable, connected to GitHub for version history
- **Test:** Reviewed on tablet viewport, checked tap targets and state transitions
- **Improve:** Iterated on sidebar alignment, reminder card states, and confirmation feedback placement based on review

## AI tools used

- Lovable (build)
- Claude (UX writing, prompt engineering, accessibility review)

## Prompts

See [`prompts.md`](./prompts.md) for the full set of prompts used to generate each screen and component.
