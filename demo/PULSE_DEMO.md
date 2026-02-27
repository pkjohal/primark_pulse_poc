# Primark Pulse — Demo Script

> **Audience:** Internal stakeholders, product sponsors, or potential implementation partners
> **Duration:** ~20 minutes (full run); ~10 minutes (condensed — Scenes 1–5 only)
> **Last updated:** 2026-02-27

---

## Elevator Pitch

> "Primark Pulse replaces all the radios, paper checklists, WhatsApp groups, and manual spreadsheets that store teams currently juggle — and puts everything in one mobile app that every colleague carries on the shop floor. In this demo, I'll take you through a real shift at a Primark store, from the moment a manager spots a problem to the moment a colleague resolves it — and everything in between."

---

## Demo Personas

These accounts all exist in the seeded Birmingham Bull Ring store. All use PIN **1234**.

| Persona | Name | Store | Role | Used in |
|---------|------|-------|------|---------|
| Store Manager | Sarah Mitchell | Birmingham Bull Ring | `manager` | Scene 1, 2, 3, 4 |
| Floor Lead | Alex Thompson | Birmingham Bull Ring | `floor-lead` | Scene 3, 5, 6, 7 |
| Store Staff | Jamie Collins | Birmingham Bull Ring | `staff` | Scene 8, 9 |

> All personas use PIN **1234** at the Birmingham Bull Ring store.

---

## Demo Data Setup

Complete these checks before starting the demo.

### Required State

- [ ] Supabase project is live and `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are set in `.env`
- [ ] `supabase/schema.sql` has been run in the Supabase SQL editor (schema + seed data)
- [ ] Dev server is running: `npm run dev` → `http://localhost:3000`
- [ ] Browser is in incognito / logged out (so login flow plays from the start)
- [ ] Device or browser window is in portrait orientation (or use browser DevTools mobile emulation — iPhone 14 Pro is ideal)

### Useful seed records to reference

| What to show | Record |
|---|---|
| CRITICAL unassigned job | "Restock jeans wall - Slim Fit range" (job-1) — AI suggested, 15 min SLA |
| CRITICAL unassigned job | "Security tag check - High-value items" (job-6) — AI suggested, 20 min SLA |
| Product barcode to scan | `5054108123456` → Slim Fit Stretch Jeans, £17, Dark Blue, 32W 32L |
| Second product barcode | `5054108234567` → Oversized Hoodie, £14, Grey Marl, size M |
| Fitting room queue | Over threshold (12 people, threshold 8) |
| Store pressure | Medium — "Peak expected in 45 mins (lunch rush)" |
| AI suggestion on home | "Move 2 staff from Stockroom to Main Tills" |
| Critical alert | "Till 7 has been down for 15 minutes" |
| Closing checklist | Not started — good for live execution demo |
| Fire drill message | Requires acknowledgment — "Fire drill at 14:30" |
| Alex's shift today | 09:00–17:00, Womenswear, break at 13:00 |

---

## Scene Overview

| # | Scene | Route | Persona | What it shows |
|---|-------|-------|---------|---------------|
| 1 | PIN Login | `/login` | Sarah Mitchell | Frictionless 3-step login for shop floor |
| 2 | Home Dashboard — Manager | `/` | Sarah Mitchell | AI suggestion, live KPIs, store status, queue summary |
| 3 | Jobs — Triage & Assign | `/jobs` | Sarah Mitchell | CRITICAL unassigned jobs, SLA timers, AI badge, peer tip, assign to staff |
| 4 | Staff Roster | `/staff` | Sarah Mitchell | Live roster, zone filters, staff skills, reallocation |
| 5 | Stock Lookup | `/stock` | Alex Thompson | Barcode scan, live stock levels, floor location, basket |
| 6 | Compliance Checklist | `/compliance` | Alex Thompson | Checklist execution, flag issue, digital sign-off |
| 7 | Team Comms | `/team` | Alex Thompson | Message feed, fire drill acknowledgment, compose |
| 8 | My Schedule | `/schedule` | Jamie Collins | Shift view, progress, shift swap offer |
| 9 | Queues & Pressure | `/queues` | Alex Thompson | Queue thresholds, store pressure, peak forecast |

---

## Scene Scripts

---

### Scene 1 — PIN Login

**Screen:** `/login`
**Logged in as:** Starting fresh (no session)
**Goal:** Show that getting into the app takes seconds — no passwords, no forgotten credentials

**Actions:**
1. Open the app at `http://localhost:3000` — the login screen appears automatically
2. Select **Birmingham Bull Ring** from the store dropdown
3. Select **Sarah Mitchell** from the team member dropdown
4. Tap **1**, **2**, **3**, **4** on the PIN pad — app navigates straight to the dashboard

---

**Presenter script:**

> "The first thing to notice is how we've thought about who's actually using this. Store colleagues are on their feet, often with gloves on, handling stock — they don't have time to remember a username and password. So we've replaced that with something much simpler: select your store, select your name, enter your four-digit PIN, and you're in. The whole thing takes about five seconds.
>
> We're also not asking IT to provision accounts manually. The store list and every team member's profile come straight from the database — so when someone joins or moves stores, they're already in the system.
>
> Let's log in as Sarah Mitchell, our store manager today, and see what she sees the moment she opens Pulse."

**Highlight:** The PIN pad animation — dots fill as you type, and the app responds instantly on the 4th digit with no submit button needed.

---

### Scene 2 — Home Dashboard (Manager View)

**Screen:** `/`
**Logged in as:** Sarah Mitchell (manager)
**Goal:** Show that a manager has an instant, at-a-glance picture of the store's health the moment they open the app

**Actions:**
1. Note the store status badge in the top-right corner — currently **Amber / Needs attention**
2. Point to the AI Suggestion banner near the top: *"Move 2 staff from Stockroom to Main Tills"*
3. Walk through the four metric cards: **On the Floor**, **Open Jobs**, **Stock Level**, **Compliance**
4. Scroll down slightly to the **Queue Summary** section at the bottom
5. Tap the **Open Jobs** metric card to navigate to Jobs (optional — or proceed to Scene 3 directly)

---

**Presenter script:**

> "This is Sarah's home screen — her operational command centre for the shift. Before she's even spoken to anyone, she knows exactly what's happening.
>
> At the top right you can see a status badge — right now we're on Amber, which means the store needs attention. That badge is calculated automatically from real data: critical jobs, compliance progress, and open stock issues all feed into it. Green means all good, red means action required.
>
> Below the greeting, there's an AI-generated suggestion. The system has spotted that the queue at Main Tills is building ahead of the lunch rush, and it's recommending Sarah move two colleagues from the Stockroom. The explanation is right there — she doesn't have to figure out why, just decide if she agrees. She can act on it with one tap, or dismiss it and get a new one.
>
> The four cards give her the live pulse of the store. Nine colleagues are on the floor, two open jobs are CRITICAL, stock alerts have been flagged, and compliance is sitting at around 50% — the closing checklist hasn't been started yet. Everything has a colour: green is fine, amber is a nudge, red is urgent.
>
> And at the bottom, the queue summary shows every monitored area in the store. Fitting Rooms is already over threshold — twelve people waiting against a limit of eight. That's going to need attention soon."

**Highlight:** The AI suggestion banner — specifically the *explanation* text underneath the headline, which makes the recommendation trustworthy rather than opaque.

---

### Scene 3 — Jobs: Triage and Assign

**Screen:** `/jobs`
**Logged in as:** Sarah Mitchell (manager)
**Goal:** Show how jobs are surfaced, prioritised, and assigned — replacing radio calls and mental note-keeping

**Actions:**
1. Navigate to the Jobs page via the bottom navigation
2. Point to the **Today's Top Jobs** section at the top — two CRITICAL jobs with pulsing red SLA timers
3. Tap on **"Restock jeans wall - Slim Fit range"** to open the job detail sheet
4. Point to: the AI Suggested badge, the *"Why it matters"* text, and the peer tip from Store 42
5. Close the sheet; tap **Assign** on the job (or tap "Unassigned" filter to show only unassigned jobs first)
6. Select a staff member from the list; confirm assignment
7. Point to the SLA timer — it has changed to Pending and the countdown is now tracking

---

**Presenter script:**

> "This is the Jobs page — the engine room of the floor operation. Every job in the store is here, from critical restocking tasks to routine VM work.
>
> At the top, Pulse has already done the prioritisation for you. It looks at job severity, how much SLA time is left, and even the time of day — restocking zones matter more in the morning, customer-facing areas matter more at lunchtime — and it surfaces the three most urgent things right now. Both CRITICAL jobs are flashing red because they're already overdue or close to it.
>
> Let's look at this first one — 'Restock jeans wall, Slim Fit range.' You can see the AI badge, which means this job was flagged by the system, not a manager. The *Why it Matters* section explains it in plain English: size 10 and 12 are the most-asked-for sizes, and customers are leaving empty-handed. That's the kind of context a floor colleague needs to understand why something is genuinely urgent.
>
> And there's a peer tip — Store 42 figured out that moving size 14s to eye level makes them easier to find. That institutional knowledge would usually disappear the moment someone left the company. Here it travels with the job.
>
> Now let's assign it. The system shows us everyone available on the floor right now, with their skills and current zone. I'll assign this to someone with stock management experience — one tap, job is assigned, SLA clock is running, and the colleague gets it on their 'my jobs' screen immediately. No radio, no shouting across the floor."

**Highlight:** The **peer tip** section on the job detail — it's a genuinely novel UX element that tells a story about institutional knowledge.

---

### Scene 4 — Staff Roster

**Screen:** `/staff`
**Logged in as:** Sarah Mitchell (manager)
**Goal:** Show real-time visibility of who is where, with skills, and the ability to reassign instantly

**Actions:**
1. Navigate to the Staff page
2. Show the full roster — 10 staff members, with zone badges and status dots (green = active, amber = break, red = absent)
3. Tap the **Fitting Rooms** zone filter — the list narrows to show only colleagues in that zone
4. Tap on a staff member card to open their detail sheet — point to their skill tags and shift times
5. Tap **Reallocate** — select a new zone from the list (e.g. Main Tills) — confirm
6. Watch the staff card update with the new zone badge

---

**Presenter script:**

> "At the moment, if a manager wants to know where everyone is, they either walk the floor or call it out on the radio. With Pulse, the answer is right here.
>
> Each card shows where the colleague is right now, whether they're active, on break, or absent, and what shift they're working. The colour-coded status dots mean you can scan the whole roster in a second.
>
> The zone filters along the top are useful when you need to find coverage fast. Let's say the Fitting Rooms queue is building — I can filter to see exactly who's already there and whether they need backup.
>
> And if I need to move someone — maybe I want to act on that AI suggestion from the home screen and pull someone from the Stockroom to the Tills — I just tap their card, hit Reallocate, pick the new zone, and it's done. No form, no email to HR, no waiting. The change reflects immediately for everyone viewing the roster."

**Highlight:** The **Reallocate** action — it's simple enough that a floor lead can do it mid-conversation on the shop floor.

---

### Scene 5 — Stock Lookup

**Screen:** `/stock`
**Logged in as:** Alex Thompson (floor-lead)
**Goal:** Show a colleague getting instant stock information by scanning a product — no stockroom trip required

> Switch persona: log out as Sarah and log in as Alex Thompson (Floor Lead, PIN 1234)

**Actions:**
1. Navigate to the Stock page — camera view opens automatically
2. Point at the camera scanner area — explain it reads any product barcode in the store
3. Instead of scanning, tap **Enter manually** and type barcode `5054108123456`
4. Product card appears: **Slim Fit Stretch Jeans — £17.00, Dark Blue, 32W 32L**
5. Walk through the card: store stock / nearby stores / DC stock / click & collect tick
6. Point to the **Floor Location** section: Zone B, Aisle 4, Bay 3 — the exact spot on the shop floor
7. Scroll down to the **Variants** section — other sizes and their individual stock levels
8. Tap **Add to Basket** and adjust quantity to 2
9. Tap the basket icon — show the replenishment basket with the item; tap **Submit Request**
10. (Optional) Tap **Report Issue** — show the issue sheet with types: wrong location, damaged, count mismatch etc.

---

**Presenter script:**

> "Now let's step into Alex's world — he's a floor lead who's just had a customer ask for size 32 jeans in Dark Blue. Normally he'd have to walk to the stockroom, check the system on a shared computer, then walk back. With Pulse, he does it right here.
>
> The stock page opens straight to the camera scanner. If we were on device, you'd just hold it up to any barcode. Let me type one in to keep things moving — this is the barcode for the Slim Fit Stretch Jeans we saw on that CRITICAL job a moment ago.
>
> Instantly: product name, price, category, size and colour. And then the numbers that actually matter on the shop floor — seven in this store, fourteen at the nearby Oxford Street store, and forty-three at the distribution centre. If the size the customer wants isn't here, Alex can tell them in thirty seconds whether another store has it.
>
> More useful still — the floor location. Zone B, Aisle 4, Bay 3. No more vague 'try the back of menswear' — it's the exact shelf, right on screen.
>
> And if Alex spots that stock is low, he can add it to the replenishment basket right now, set the quantity, and submit the request — all without leaving the shop floor or logging into a separate system. The basket persists even if he closes the app and comes back later.
>
> If something looks wrong — say the stock count doesn't match what's physically on the shelf — he can report a stock issue and flag it for investigation with a single tap."

**Highlight:** The **floor location card** (Zone, Aisle, Bay, Shelf) — this is the detail that makes it genuinely useful in the moment.

---

### Scene 6 — Compliance Checklist

**Screen:** `/compliance`
**Logged in as:** Alex Thompson (floor-lead)
**Goal:** Show how paper-based compliance processes are replaced with a structured, auditable digital flow

**Actions:**
1. Navigate to the Compliance page — show two tabs: **Checklists** and **Incidents**
2. On the Checklists tab, point out the Opening Checklist is marked **Completed** (done by Emma T. earlier)
3. Tap the **Closing Checklist** — status: Not Started, 20 items across multiple sections
4. Tap **Start Checklist** — the execution sheet opens
5. Work through two or three items showing different input types:
   - A **checkbox** item (e.g. "All fitting room doors checked")
   - A **numeric** item (e.g. "Till float count" — enter a number)
6. On one item, tap **Flag Issue** — fill in a brief description and select severity **Medium** — submit
7. Skip ahead — tap **Complete Checklist** — the digital signature pad appears
8. Draw a signature on screen — tap **Sign Off**
9. The completion success screen appears — shows items completed and issues flagged
10. (Optional) Tap **Policy Search** — type "What is the returns policy for swimwear?" — show the mocked AI response with source citation

---

**Presenter script:**

> "Compliance is one of the areas where manual processes create the most risk. Closing checklists done on paper get lost, signatures get skipped, issues go unreported. Pulse turns this into a structured, auditable digital process.
>
> You can see the opening checklist was completed earlier this morning by Emma T. — timestamped, all items done, signature captured. That's a permanent record, instantly accessible. Now let's look at the closing checklist — it's not started yet, which matches what we saw on the dashboard.
>
> When Alex starts it, the items are organised into sections and each one has the right input type built in. Some are simple yes/no ticks. Some require a number — like confirming the till float — with validation so you can't enter something out of range. Some require a photo. The system knows what kind of answer to expect.
>
> If Alex spots something during the check — say a fire exit is partially blocked — he can flag it immediately, right on the item, with a severity level and description. That gets captured, tracked, and visible to the manager without anyone needing to remember to mention it at handover.
>
> Once all the required items are done, Alex signs off digitally — on screen, right here. The signature is stored against the checklist record. There's an unbroken chain of accountability.
>
> And if he's not sure about a policy — 'Can I exchange without a receipt?' — the policy search feature lets him ask in plain English and get an answer drawn from Primark's own SOPs, with a source citation so he can verify if he needs to."

**Highlight:** The **digital signature pad** — the moment the pen lifts from the screen and the completion record is confirmed. It's a visceral replacement for the paper process.

---

### Scene 7 — Team Communications

**Screen:** `/team`
**Logged in as:** Alex Thompson (floor-lead)
**Goal:** Show structured, tracked team communications replacing WhatsApp groups and notice boards

**Actions:**
1. Navigate to the Team page — the message feed is visible
2. Point to the **Fire drill at 14:30** announcement at the top — it has an URGENT badge and an acknowledgment progress bar: *"2 of 12 confirmed"*
3. Tap the message to open the detail — show the full text and the acknowledgment list
4. Tap **Acknowledge** — progress bar updates immediately
5. Go back to the feed and tap **Compose** (pencil icon)
6. Set scope to **Zone**, select **Fitting Rooms**, set priority to **Normal**
7. Type a short message: *"Queue building at fitting rooms — need an extra pair of hands please"*
8. Toggle **Requires acknowledgment** on
9. Tap **Send** — message appears in the feed

---

**Presenter script:**

> "Team communications in most stores run through WhatsApp or radio — which means critical information gets lost in group chat noise, and there's no way to know if everyone has actually read it.
>
> Here, Sarah sent a fire drill announcement and it sits at the top of the feed with an URGENT badge. But the key thing is this acknowledgment tracker — she can see in real time how many colleagues have confirmed they've seen it. Currently two out of twelve. That's accountability. If she sends a policy update that everyone needs to read before opening, she knows exactly who has and who hasn't.
>
> When Alex acknowledges — tap — the count updates immediately. And his name appears in the confirmed list.
>
> He can also compose messages with proper targeting. If the fitting room queue is getting critical, he can send a message directly to the Fitting Rooms zone, set it to require acknowledgment, and know it will reach the right people. Not the entire store on a group chat — the right zone, the right role, the right message."

**Highlight:** The **acknowledgment progress bar** on the fire drill message — the live counter updating as people confirm.

---

### Scene 8 — My Schedule (Staff View)

**Screen:** `/schedule`
**Logged in as:** Jamie Collins (staff)
**Goal:** Show the staff-facing schedule experience and the shift swap feature

> Switch persona: log out as Alex and log in as Jamie Collins (Staff, PIN 1234)

**Actions:**
1. Note the **home screen** for a staff user — the AI banner is replaced by a **shift banner** showing today's shift times and break
2. Navigate to the Schedule page
3. Point to the date strip navigator at the top — swipe to see the week ahead
4. Point to today's shift card — shows start/end time, zone, and a **progress bar** for how far through the shift Jamie is
5. Scroll to a future shift — one is marked **Pending Swap** (Alex's Friday shift is offered)
6. Tap **Offer for Swap** on one of Jamie's upcoming shifts — status changes to pending-swap
7. Scroll down to **Available Shifts** — show shifts offered by colleagues
8. Tap **Accept** on an available shift — it moves to Jamie's confirmed schedule

---

**Presenter script:**

> "Now let's switch to Jamie's perspective — a store colleague, not a manager. The first thing to notice is that the home screen is different. Where Sarah saw an AI suggestion, Jamie sees her shift for today — nine to five-thirty, Womenswear, break at one. The app knows who you are and shows you what's relevant to you.
>
> The schedule page shows the full week at a glance. Today's shift has a progress bar — Jamie is about a third of the way through her shift. It sounds small, but knowing how long you've got left without checking the clock is something colleagues actually appreciate.
>
> The shift swap feature handles something that currently happens entirely through text messages and manager approval chains. Jamie needs Friday off — she taps Offer for Swap, and the shift immediately shows as available to anyone in the same store with the same role. Her colleague who needs extra hours can accept it — one tap, both schedules update, the manager can see it happened. No back-and-forth, no missed messages."

**Highlight:** The **shift progress bar** on today's card — it's a small touch that makes the app feel genuinely personal rather than generic.

---

### Scene 9 — Queues & Store Pressure

**Screen:** `/queues`
**Logged in as:** Alex Thompson (floor-lead)
**Goal:** Show demand monitoring that helps managers get ahead of problems rather than react to them

> Switch back to Alex Thompson (or keep Jamie — queues are visible to all roles)

**Actions:**
1. Navigate to the Queues page
2. Point to the **Store Pressure** card at the top — currently **Medium**, with forecast text: *"Peak expected in 45 mins (lunch rush)"*
3. Point to the four queue cards below:
   - **Main Tills** — 8 people, threshold 10 — Normal (green)
   - **Fitting Rooms** — 12 people, threshold 8 — Over threshold (red)
   - **Customer Service** — 2 people, Normal
   - **Click & Collect** — 4 people, Normal
4. Point to the Fitting Rooms card fill bar — visibly past the threshold line
5. Reference back: "This is what the AI suggestion on the home screen was responding to — it saw the fitting room queue and the incoming pressure and recommended moving staff"

---

**Presenter script:**

> "The Queues page closes the loop on everything we've seen so far. This is the real-time demand picture for the store.
>
> At the top, the store pressure indicator gives a forward-looking view. Right now we're at Medium, but the system is flagging that a peak is expected in about forty-five minutes when the lunch rush hits. That's not reactive — that's proactive. It gives managers a window to act before customers start queuing out the door.
>
> The individual queue cards show each monitored area in the store. Main Tills are fine — eight people, threshold is ten. But Fitting Rooms are already over threshold — twelve people waiting, threshold is eight. That red fill bar is the visual signal that something needs to happen.
>
> And here's where it all connects: that's the exact trigger the AI on the home screen was responding to. It saw this queue, saw that colleagues were available in the Stockroom, and surfaced a specific recommendation to Sarah. The system isn't just showing you data — it's joining the dots and telling you what to do about it."

**Highlight:** The **threshold fill bar** on the Fitting Rooms card going past the red line — the visual makes the alert immediately legible without needing to read numbers.

---

## Closing

**What to say:**

> "That's Primark Pulse — one app, one shift, end to end.
>
> To recap what we've seen: a manager starts her shift with an instant picture of the whole store — jobs, staff, queues, compliance — all in one place, with AI surfacing what needs attention first. A floor lead assigns work, checks stock, and runs a compliance checklist without ever going back to a desktop. A colleague checks their schedule and swaps a shift without a single conversation. And throughout all of it, there's a complete digital record — who did what, when, and why.
>
> The shift from paper and radio to something like this isn't just about convenience. It's about accountability, speed, and not losing the institutional knowledge that walks out the door every time someone leaves.
>
> Happy to dig into any of these areas in more detail, talk about how this maps to a specific use case, or walk through the technical architecture if that's useful."

---

## Fallback Notes

| If this goes wrong | Do this |
|--------------------|---------|
| Login fails (PIN rejected) | Confirm the schema has been run in Supabase; all seed users use PIN `1234` |
| Supabase returns no data | Check `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set; check the project is not paused |
| Camera scanner doesn't activate | Use "Enter manually" and type barcode `5054108123456` — this is the designed fallback |
| Checklist items don't save | Confirm Supabase is reachable; demo the optimistic UI update visually and note that the database write is happening in the background |
| Jobs page is empty | Check the seed data includes jobs for `store-1` (Birmingham Bull Ring); confirm the logged-in user's `store_id` matches |
| App shows blank / white screen | Hard refresh (Ctrl+Shift+R); MSW service worker may need a re-register — open DevTools > Application > Service Workers > Unregister, then refresh |
| Signature pad unresponsive | Test with mouse click-drag on desktop; on a real device, use finger draw — it requires a pointer/touch event |

---

## Condensed 10-Minute Run

Skip Scenes 4, 7, 8, and 9. Run Scenes 1 → 2 → 3 → 5 → 6.

This covers: login, dashboard, jobs, stock, and compliance — the five highest-value flows for a time-constrained audience.

---

## Key Differentiators to Reinforce Throughout

These themes should surface naturally in the talk — return to them whenever there's a natural moment:

1. **Unified** — everything in one app; no switching between radios, paper, and terminals
2. **Role-aware** — staff see shifts, leads see jobs, managers see the whole picture; same app, different experience
3. **AI-assisted** — suggestions, auto-prioritised jobs, and AI-generated alerts all have explanations attached; transparent, not a black box
4. **Accountable** — digital checklists with timestamps and signatures; message acknowledgment tracking; nothing gets lost
5. **Connected** — peer tips on jobs, shift swaps, team messages; the app connects the team, not just the individual
