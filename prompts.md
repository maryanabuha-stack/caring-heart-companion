# CareNest. Приклади промптів

Це повний набір промптів, які використовувались для генерації та доопрацювання CareNest у Lovable, а також один промпт для Stitch. Промпти згруповані за екранами у хронологічному порядку, так, як вони реально писались під час роботи. Перед кожним промптом коротко описано, для чого він і яку правку вносить.
---
## Dashboard
### 1. Початковий промпт екрана
Перший детальний промпт для генерації головної панелі: структура, ієрархія інформації, вимоги доступності.
```
Build a single screen: the Dashboard for "CareNest", a tablet-based healthcare assistant app for elderly patients and their caregivers. This is one screen in a larger app (other screens: Medications, Symptom Tracking, Communication, Reminders), build only the Dashboard, but include the left sidebar navigation shared across the app.
CONTEXT & AUDIENCE
Primary users are elderly people, often with reduced vision, tremors, or slower The design must prioritize clarity and ease of use over density of information.
LAYOUT STRUCTURE
1. Left sidebar (persistent navigation)
- Fixed width sidebar, dark background, full height
- 5 nav items, each as icon + text label stacked vertically, ALWAYS visible - Active item highlighted with the accent blue background
- Minimum 64px height per nav item
2. Header
- Greeting text: "Good morning, [Name]"
3. Urgent action card
- Full-width card with a strong accent-blue background
- Clock icon + label "Next action" + instruction text: "Take your medication at
4. Today's progress card
- Text-based progress: "2 of 3 medications taken today" - A simple horizontal progress bar underneath
5. Today's medications list
- Each medication as its own card/row
- Status icon, name + time, action button or "Taken" label
6. Today's tasks / reminders
- Same card pattern: checkbox/status icon + task name in plain language
7. Quick access tiles
- 2 column grid: "How I'm feeling" and "Message my doctor"
reaction time. Secondary users are caregivers checking in.
ACCESSIBILITY REQUIREMENTS
- Base body text minimum 18px, headings 24-28px
- All interactive elements minimum 56px tap target height
- Color contrast WCAG AAA where possible
- Never communicate status through color alone
- Plain, direct language in imperative mood
- Confirmation after any action should be visually clear and not disappear instantly
DO NOT INCLUDE
- No percentage rings, no charts, no analytics - No dense data tables
- No hover-only or collapsed navigation states 
```
### 2. Стани нагадувань (промпт для Stitch) 
Окремий короткий промпт для Stitch, щоб швидко згенерувати всі п'ять станів картки нагадування і побачити загальну логіку.
```
Using the showing a
VARIATION VARIATION
VARIATION the card.
VARIATION VARIATION
attached CareNest Dashboard screenshot as the exact visual reference, generate 5 variations of this same Dashboard screen, each different state of the "Next action" reminder card at the top.
1: UPCOMING. Neutral gray card, outline clock, "Next reminder" label, no button.
2: DUE NOW. Light blue card, filled clock, "Next action" label, "Mark as taken" button.
3: MISSED. Soft amber background, NOT red, alert-triangle icon, "Missed" label, button "Mark as taken now" in amber tone matching
4: TAKEN. Neutral white card, filled green checkmark, "Taken" label, clickable "Tap to undo" text, no swipe or auto-expiring timer. 5: EMPTY. Centered content, large green checkmark, "All done for today", supporting text "Next reminder tomorrow at [time]".
2:00 PM"
 Never use color alone to signal state. Button height and card padding must match the reference exactly. 
```
### 3. Точкові правки після першої генерації в Lovable
Три зміни: банер стає інформаційним без кнопки, список ліків матиме єдиний фон і не дублюється, чекбокси щоденних задач отримують закреслення і час виконання.
```
Update the CareNest Dashboard screen with the following three changes.
CHANGE 1: TOP "NEXT ACTION" BANNER. Remove the "Mark as taken" button from this banner, soft light blue background, purely informational.
CHANGE 2: "MEDICATIONS TODAY" LIST. Light blue-gray tinted background for every row regardless of state. Pending shows "Mark as taken" button, taken shows plain tappable text "Taken - Tap to undo". Remove any duplicate reminder banner elsewhere on the screen.
CHANGE 3: "DAILY TASKS". Checkbox fills solid blue with white checkmark, strikethrough on completion, small gray "Completed at [time]" line appears below. Navigation tasks keep a right-facing arrow instead of a checkbox.
```
### 4. Позиція підтвердження
Банер підтвердження переноситься нагору і робиться м'яко-блакитним замість системного тосту знизу праворуч.
```
CHANGE: CONFIRMATION MESSAGE POSITION AND STYLE. Move the "medication marked as taken" confirmation toast to the TOP of the screen, below the header, full width or centered. Soft light blue background, checkmark icon, high contrast dark text. Include aria-live="polite". Apply consistently everywhere this pattern is used.
```
### 5. Вирівнювання сайдбару по лівому краю
```
CHANGE: SIDEBAR, left-align content instead of centered. Icons and labels flush left with consistent padding, not centered within the sidebar's width. Apply to every nav item and the profile row at the bottom.
```
### 6. Зведений майстер-промпт
Після кількох окремих правок, один цілісний промпт, який об'єднав усі попередні побажання разом (стилістика зі скріншотів-референсів, банер без кнопки, список ліків, щоденні задачі, підтвердження зверху, компонент нагадувань з п'ятьма станами).
```
Build/update the CareNest Dashboard screen. Use reference image 1 for overall visual style, reference images 2 and 3 as the exact target for structure and component behavior.
VISUAL STYLE: soft light blue-gray background, white cards with rounded corners, dark navy sidebar with blue pill active state, saturated blue accent. Remove decorative/promotional widgets.
ACCESSIBILITY BASELINE: minimum 18px body text, 56px tap targets, color plus icon plus text for every status, single column layout. SIDEBAR: left-aligned, labels always visible, no collapse state.
TOP BANNER: informational only, no button, soft blue tint.
TODAY'S PROGRESS: text-based "X of Y medications taken today" plus progress bar.
MEDICATIONS TODAY LIST: consistent light blue-gray background across all rows, pending shows button, taken shows "Taken - Tap to undo", upcoming shows lighter gray with "Next" label.
DAILY TASKS: self-contained tasks use checkbox with strikethrough and completion time, navigation tasks use an arrow instead. QUICK ACCESS TILES: two tiles, "How I'm feeling" and "Message my doctor".
REMINDER CARD COMPONENT with 5 states: Upcoming, Due Now, Missed (amber, never red), Taken (with permanent tappable undo and confirmation dialog), Empty.
CONFIRMATION: two layers together, card changes state AND a fixed top banner appears with aria-live announcement.
DO NOT INCLUDE promotional banners, charts, red color anywhere except explicitly critical actions. 
```
---
## Medications
### 1. Початковий промпт екрана
```
Build the CareNest Medications screen, full medication list. Match the existing Dashboard's visual style and sidebar exactly.
CONTEXT: shows the patient's COMPLETE medication list grouped by time of day, reuses the same Reminder card component already built for Dashboard.
LAYOUT: header "Medications", empty-state banner if all taken today, three sections "Morning"/"Afternoon"/"Evening", each row uses the existing 5-state Reminder component, every row is tappable and opens a detail modal.
DETAIL MODAL: dimmed overlay, dismissible by tapping outside, close button top-right, content shows name, dosage, schedule card, "what it's

 for" card, same action control as the row it was opened from.
Tapping "Mark as taken" inside the modal updates the row, closes the modal, triggers the confirmation banner.
DO NOT INCLUDE editing/adding/removing medications, no historical log of past doses. 
```
### 2. Підзаголовок, індикатор клікабельності, контраст кнопки, іконки часу доби
```
Update the CareNest Medications screen with four changes.
CHANGE 1: ADD A SUBTITLE explaining the screen's purpose.
CHANGE 2: MAKE TAPPABILITY VISIBLE. Add a chevron icon at the far right of every medication row.
CHANGE 3: FIX THE MISSED-STATE BUTTON COLOR. Deep burnt-orange, not blue, not bright orange, dark enough for white text contrast.
CHANGE 4: ADD TIME-OF-DAY ICONS to section labels, sun for Morning, sun-with-cloud for Afternoon, moon for Evening, icon supplements the text, never replaces it.
```
### 3. Виправлення контрасту кольору Missed-кнопки
```
Update the Medications screen: the Missed button color still appears too dark, close to brown or maroon. Adjust to a clearly orange tone, e.g. #C2410C, dark enough for white text contrast but still reading unambiguously as orange, not brown.
```
### 4. Іконка трикутника оклику, розмір іконок часу доби
```
Fix two remaining issues on the Medications screen.
FIX 1: THE MISSED ICON HAS NO EXCLAMATION MARK. Use the standard alert-triangle icon from the existing icon library instead of a custom triangle shape, so the "!" mark is included by default.
FIX 2: INCREASE THE SIZE of the sun, sun-with-cloud, and moon icons next to section labels, they are currently too small. ```
```
### 5. Виправлення обвідки навколо іконки трикутника
```
Fix the Missed state's alert-triangle icon rendering. Remove any separate stroke or border color around the triangle's outer edge, the outline should be the same color as the fill. The only white element should be the exclamation mark itself.
```
### 6. Сортування, outline іконки, повернення до реального часу
```
Fix three remaining issues on the "Medications today" list.
FIX 1: CORRECT SORT ORDER. Required order: MISSED, then DUE NOW, then UPCOMING, then TAKEN last.
FIX 2: OUTLINE STYLE for the clock icon in the Due Now state, matching the outline treatment already used for Upcoming. Filled icons remain reserved only for Taken and Missed.
FIX 3: MAKE MEDICATION STATES REFLECT ACTUAL CURRENT TIME, comparing scheduled time against the real device time rather than static mock values.
```
### 7. Відкат ширини кнопок і прибрана іконка таблетки
```
Revert two recent changes on the Medications screen, they made the rows feel bulky and cluttered.
REVERT 1: BUTTON WIDTH BACK TO NATURAL SIZING, let each button size to fit its own text.
REVERT 2: REMOVE THE PILL ICON that was added next to each medication name. 
```
---
## Symptom Tracking
### 1. Початковий промпт екрана
```
Build the CareNest Symptom Tracking screen, a quick daily wellbeing check-in.
CONTEXT: 10-15 second check-in, only mood selection is required, everything else optional.
LAYOUT: header "How are you feeling today?", mood selector with 5 large buttons (icon plus text label, single select, minimum 64px), optional symptom chips (multi-select, no selection required), optional note field, one large Save button disabled until a mood is chosen, recent entries list in plain language, no charts.
CONFIRMATION: reuse the same top banner pattern already used elsewhere, "Your check-in for today has been saved". DO NOT INCLUDE trend charts, multiple check-ins per day, required fields beyond mood, red color anywhere.

 ```
### 2. Логіка повторного відвідування в той самий день
```
Update the Symptom Tracking screen with the following logic for returning to the screen after already checking in today.
If an entry already exists for today, show a banner: "You already checked in today, here's what you shared. Feel free to update it." Pre-fill the mood selector, symptom chips, and note field with today's values. Save button becomes active immediately. Saving overwrites today's entry rather than creating a duplicate.
If no entry exists yet, the screen behaves as before, blank form, Save disabled until a mood is selected. 
```
### 3. Виправлення кольору банера
```
Fix the "You already checked in today" banner. Change the background from light gray to the same soft blue tint already used for the Dashboard's "Next action" informational banner, reuse the exact color token rather than introducing a new one.
```
---
## Сайдбар (наскрізні правки)
### 1. Ширина сайдбару та прибирання зайвого тексту
```
Make two small adjustments.
CHANGE 1: WIDEN THE SIDEBAR SLIGHTLY so that "Symptom Tracking" fits on a single line without wrapping.
CHANGE 2: REMOVE THE "Selected" TEXT from mood cards on Symptom Tracking, the filled blue background and white selection clearly enough.
```
### 2. Фіксований профіль користувача внизу
```
Fix the sidebar's user profile row positioning. Pin it to a FIXED position at the bottom of the sidebar, so it
regardless of viewport height, rather than sitting at the end of the natural content flow with a large empty gap above it. 
```
---
## Communication
### 1. Початковий промпт екрана
```
Build the CareNest Communication screen, a simple contact channel with a caregiver or doctor.
CONTEXT: minimal single-thread contact channel, not a full messaging app.
LAYOUT: header "Contact your care team", three quick action tiles ("Call my caregiver", "Message my doctor", "Request help now" in saturated blue, never red, with a confirmation dialog before sending), recent messages list as simple cards, quick reply buttons ("I'm okay", "I have a question", "I need help"), compose field with Send button at the bottom.
DO NOT INCLUDE group messaging, read receipts, typing indicators, file attachments, real VoIP integration, red color anywhere. 
```
### 2. Модель спільного inbox
```
Update the Communication screen to make the shared care-team inbox model explicit and consistent.
FIX 1: RENAME "Message my doctor" to "Message care team" to accurately reflect that any message goes to everyone on the care team.
FIX 2: CLARIFY THIS IN THE SUBTITLE, mentioning that the whole care team can see messages here.
FIX 3: ADD AN EMPTY STATE for "Recent messages" if there are none yet.
FIX 4: confirm quick replies and the compose field both send into the same single shared thread, no per-contact targeting anywhere. 
```
### 3. Логіка кнопки дзвінка через реальний tel: лінк
```
Update the "Call my caregiver" tile's behavior. Wire it to trigger an actual phone call using a standard tel: link with a placeholder mock phone number.
Tapping opens a confirmation first: "Call Sarah at [phone number]?" with "Yes, call" and "Cancel". If confirmed, trigger the tel: link and also show the confirmation banner pattern, "Opening your phone to call Sarah". Do not build any custom calling animation or ringing state. 
```
### 4. Аватари відправника та об'єднання Quick replies з Write a message
```
Make two updates to the Communication screen.
always remains visible

 UPDATE 1: ADD SENDER-INITIAL AVATARS to each row in Recent messages, small circular avatar with initials, neutral muted background.
UPDATE 2: MERGE "Quick replies" and "Write a message" above the chips, then the chips, then the input field 
```
### 5. Колір аватарів на блакитний
```
Change the sender-initial avatar circles from gray to text in darker blue or navy for contrast.
```
### 6. Обмеження списку повідомлень до п'яти останніх
into ONE unified card, header "Write a message", small subdued "Quick replies" label and Send button below with light separation.
a soft blue tone, slightly more saturated than the message card's background, initials
```
Fix the "Recent messages" list to prevent it from growing indefinitely long over time. Limit the visible list to the 5 most recent messages by default. Below them, add a simple text link "View earlier messages".
```
---
## Reminders
### 1. Початковий промпт екрана
```
Build the CareNest "Today's reminders" screen. Header "Today's reminders". Main list combines ALL reminder types for today, medications and daily tasks together, using the existing Reminder card component's states.
SORT ORDER: Missed first, then Due Now, then Upcoming, then Taken last, regardless of scheduled time.
EMPTY STATE: same centered pattern already used elsewhere.
TOMORROW PREVIEW: below the main list, a card listing ALL of tomorrow's scheduled items, name and time, preview only, not actionable.
CONFIRMATION BANNER: reuse the exact same fixed-position banner already implemented. 
```
### 2. Диференціація іконок годинника та прибирання кругових підкладок
```
Apply two icon updates across the app.
UPDATE 1: DIFFERENTIATE CLOCK ICONS BY SHAPE. Plain clock face for Upcoming, alarm-clock icon for Due Now, both outline style.
UPDATE 2: REMOVE CIRCULAR BADGE BACKGROUNDS from all status icons, icons sit directly on the card's own background again. 
```
### 3. Групування та збільшення відступів між картками
```
Fix the visual hierarchy and grouping on the Reminders screen.
FIX 1: INCREASE SPACING AND ADD CARD SEPARATION between individual reminder cards.
FIX 2: ADD SUBTLE GROUP SECTION LABELS above the list: "Needs attention" (Missed and Due Now together), "Later today" (Upcoming), "Completed" (Taken), without changing the underlying sort logic.
```
### 4. Прибирання обвідки картки
```
Remove the border added to reminder cards on the Reminders screen. Cards should rely only on background color and spacing, consistent with the rest of the app.
```
### 5. Консистентність стилю картки з Medications
```
Fix inconsistent card styling on the Reminders screen. Remove the drop shadow and reduce spacing between cards to match the exact same style already used on Dashboard and Medications.
```
### 6. Об'єднання груп в окремі картки, як на Medications
```
Update the Reminders screen's grouping structure to match the exact same container pattern already used on Medications. Each group, "Needs attention", "Later today", "Completed", becomes its own separate white card, matching the per-time-of-day card style on Medications.
```
### 7. Заголовки груп: іконки та типографіка
```
Fix the section header styling on Reminders to match the exact same header style used on Medications for "Morning"/"Afternoon"/"Evening", same size, weight, color, with an icon prefix.
```

 Пізніше іконки на заголовках груп було вирішено прибрати повністю, оскільки вони дублювали статус-іконки в самих картках нижче:
```
Remove the icons from the group section headers on the Reminders screen, "Needs attention", "Later today", "Completed". Keep the header text styling, only remove the icon.
```
### 8. Групування Tomorrow за часом доби
```
Improve the visual presentation of the "Tomorrow" preview section. Group items into "Morning", "Afternoon", "Evening" using the exact same time-of-day header style already established on Medications. Replace the single-line "Name, Time" dash format with the same stacked format used everywhere else in the app.
```
### 9. Фон рядків Tomorrow
```
Add background weight to each item row in the background, remove the thin divider lines now 
```
### 10. Уніфікація кольору позначок виконання
```
Unify all "completed/done" checkmarks to green across the entire app, remove the blue checkmark variant used for Daily Tasks. After this change: green means completed/done/taken in any context, blue means primary action needed now, amber means missed, gray means upcoming. 
```
### 11. Логіка Missed для щоденних задач і її відкат
Спочатку було вирішено дати задачам той самий повний цикл станів, що й лікам:
```
Extend the same time-based state logic already used for medications to daily tasks, both on Dashboard and Reminders, including a Missed state with the same amber treatment.
```
Але після повторного обдумування це рішення відкликано, оскільки застосування тривожного помаранчевого сигналу до побутових задач розмиває його значення для реально пропущених ліків:
```
Revert the recent change that gave daily tasks a time-based Missed/Due Now state. Daily tasks go back to a simple two-state model: pending and done, without any due-time tracking or Missed treatment. Tasks now only appear in "Later today" or "Completed" on Reminders, never in "Needs attention".
```
Також додано порожній стан для груп без жодного елемента:
```
On the Reminders screen, if any group has zero items, keep the group's header visible and show a short message "Nothing here" inside its card instead of leaving it empty or hiding it.
```
---
## Наскрізні візуальні покращення (Dashboard, Medications)
```
Apply the following four polish improvements across the app.
POLISH 1: REPLACE THE APP LOGO ICON, currently a bell icon duplicating the Reminders nav icon. Use a "C" monogram or a nest-themed icon instead.
POLISH 2: INCREASE SPACING before major section headers like "Daily tasks" and "Quick access" on Dashboard.
POLISH 3: ADD A SUBTLE TRANSITION on state change when a card moves between states, 200 to 300 milliseconds on background color.
POLISH 4: NORMALIZE ICON STROKE WIDTH across all outline icons so none appears thinner or thicker than another. 
```
---
## Фінальний раунд редизайну
Цей раунд почався після усвідомлення, що інтерфейс виглядав перевантажено кольором, і незрозуміло було, що саме клікабельне. Це призвело до серії правок, які змінили саму візуальну мову застосунку.
### 1. Спроба обмежити колір лише станами Missed і Due Now
```
Simplify the color usage across all reminder cards. Reserve colored backgrounds ONLY for states that genuinely need attention, MISSED and DUE NOW. Change UPCOMING and TAKEN to a plain white/neutral card background, relying only on icon and text.
```
Це рішення не спрацювало добре на практиці і було відкликано:
```
Revert the recent change that removed background colors from Upcoming and Taken states. Restore the reminder card backgrounds to how they

 were before, Missed amber, Due Now blue, Upcoming light gray, Taken light blue, Daily Tasks light blue. 
 ```
### 2. Значний напрямок зміни стилю, за референсом
```
Apply a significant visual direction shift across the entire app, moving to a lighter, flatter style, using the attached reference image as the target aesthetic.
CHANGE 1: Remove card backgrounds, use flat rows with thin dividers instead, status communicated through small icon in a soft tint circle, status label text, and button style.
CHANGE 2: Light, collapsible sidebar. Change from dark navy to light background, active item shown with light blue background and blue accent. Add a collapse/expand toggle (this reverses an earlier decision to keep it always expanded).
CHANGE 3: Primary vs secondary button styles, solid filled for the single most urgent action, outline style with colored border for secondary actions further down the list.
CHANGE 4: Softer color saturation for decorative fills, while text and icon contrast against background level.
CHANGE 5: Redesign the medication tracker following the new flat row style, small status icon in a soft label inline, appropriate button per Change 3.
Sort order, icon shapes, undo behavior, and confirmation banners stay exactly as currently implemented. ```
stays at the same accessibility circular tint, name, time and status
Also add slightly smaller corner rounding everywhere, roughly 8-10px radius instead of full pill shapes, applied consistently across all screens.
```
### 3. Точне звірення з референсом після першої спроби
```
Fine-tune the visual style of the Dashboard to more closely match the reference image, without changing the existing button fill logic.
FIX 1: Reduce heading font weight from heavy bold to medium/semi-bold.
FIX 2: Change Dashboard nav icon to a house icon, Symptom Tracking to a heart icon.
FIX 3: Reduce corner rounding on buttons and the active nav state to a moderately rounded rectangle, roughly 8-10px. FIX 4: Reduce the shadow on the "Today's progress" card so it sits closer to flush with the page background.
FIX 5: Remove the outline from "Undo", it becomes plain clickable text with no border.
```
### 4. Точна структура картки, кольорова палітра, синій замість зеленого
```
CHANGE 1: Restore the "Next action" card layout exactly, label "Next medication", bold the right.
medication name, time below, single solid button to
blue background, #FAFAFC page background, #B14319
CHANGE 2: Reduce progress bar segment height to 8px.
CHANGE 3: All status icons become outline/stroke style only, no filled variants.
CHANGE 4: Set button border radius to exactly 14px.
CHANGE 5: Use this exact color palette throughout: #1449DE primary blue, #E7EDFB orange for Missed, #FDEBD9 light orange background.
CHANGE 6: Taken medications use the blue color family instead of green for their
light
CHANGE 7: Checkboxes filled in blue (#1449DE) when checked, light blue outline when unchecked. 
```
### 5. Відступи, неактивна кнопка, колір кнопки в модалці, сайдбар, стрілка
```
FIX 1: Increase spacing between medication rows to match the spacing already used in Daily tasks.
FIX 2: The "Mark as taken" button for UPCOMING items must be genuinely non-interactive, not just styled gray.
FIX 3: The action button inside the detail modal must match the row's own status color, orange for Missed, blue for Due Now, not always blue.
FIX 4: Sidebar collapse state must persist across navigation, only expanding again when the user explicitly taps the toggle.
FIX 5: Change the chevron next to "Log how you're feeling today" to muted gray. 
```
### 6. Плитки Communication, структура й текст
```
Each of the three action tiles: icon inside a small circular colored background (light blue for Call, light green for Message), bold title, short one-line subtitle. The third tile, "Request help now", has a solid blue fill as its whole background instead of a small icon circle. ```
```
Наступні уточнення:
```
FIX 1: Remove hover effect entirely.
FIX 2: Remove the arrow icon from "Request help now".
FIX 3: Reduce title font size so "Message care team" fits on one line.
icon and accent.
FIX 4: Update subtitle text under each tile, "Talk to your caregiver by phone.", "Send a quick message anytime.", "Ask your care team for help."

```
### 7. Іконки в Reminders, спроба і відкат
```
Replace the generic status icon with a small icon inside a circular colored background chosen by content, pill icon for medications, water glass for "Drink a glass of water", walking-person for "Take a short walk". Tapping the icon toggles an accordion-style expand within the row.
```
Це застосували на весь екран, але потім звузили лише до прев'ю завтрашнього дня:
```
Revert the main lists back to generic status icons. Add contextual icons ONLY to the "Tomorrow" preview section. Remove the border added around group cards. Make the "Tomorrow" section collapsible.
```
І ще раз спростили:
```
FIX 1: Rename "Tomorrow" to a clearer heading, e.g. "Tomorrow's schedule".
FIX 2: Remove the collapse/expand behavior just added, section stays always visible.
FIX 3: Remove the circular background behind the contextual icons, keep the icons plain.
FIX 4: Remove all white card backgrounds across the whole Reminders screen, rows sit directly on the page background with thin dividers. 
```
### 8. Білий простір між групами, повернення фону іконок
```
UPDATE 1: Add clear white space between Morning, Afternoon, Evening groups on Medications.
UPDATE 2: Restore the circular colored background behind icons in "Tomorrow's schedule", and increase spacing between its time-of-day groups. 
```
### 9. Прив'язка до реального часу на Дашборді
```
Fix the "Next medication" card on Dashboard so it reflects the actual current time, not a static hardcoded value. Calculate it dynamically based on the real current device time compared against today's medication schedule, using the same real-time logic already implemented elsewhere for Missed/Due Now/Upcoming.
```
### 10. Кнопка екстреного виклику в сайдбарі
```
Add an Emergency contact button to the sidebar, positioned above the user profile row. Phone icon plus "Emergency" and "Call 911" text, red color, the one deliberate exception to the no-red rule reserved specifically for genuine emergencies.
Tapping opens a confirmation dialog, "Call emergency services?", with "Yes, call now" and "Cancel", before triggering a tel: link, consistent with how "Call my caregiver" already works.
```
