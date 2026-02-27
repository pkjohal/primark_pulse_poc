# Primark Pulse — Presenter Script

> Speaking notes only. For full demo actions and setup, see `PULSE_DEMO.md`.
> Slide numbers reference the deck in order of delivery.

---

## Opening / Title Slide

Primark Pulse replaces all the radios, paper checklists, WhatsApp groups, and manual spreadsheets that store teams currently juggle — and puts everything in one mobile app that every colleague carries on the shop floor.

In the next twenty minutes, I'm going to take you through a real shift at a Primark store — from the moment a manager spots a problem, to the moment a colleague resolves it. And everything in between.

---

## Slide 1 — The Problem

Before I show you the app, it's worth being clear about what we're replacing.

Right now, a store manager starts their shift with a radio call, a paper handover sheet, and a group chat. Jobs get assigned by walking the floor or shouting across it. Compliance checklists are paper forms that get filed — or lost. Stock checks mean a trip to the stockroom and a shared desktop. Shift swaps happen over text and take days to sort out.

None of it is connected. None of it leaves a record. And every time someone experienced leaves the company, the knowledge they built up goes with them.

Pulse is built specifically to fix that.

---

## Slide 2 — Who Uses It (The Three Personas)

The app is designed for three types of people in the store, and each one gets a different experience.

Sarah Mitchell is our store manager — she needs the big picture: is the store running well, what needs her attention, where are her people.

Alex Thompson is a floor lead — he's operational. He's assigning jobs, moving staff, checking stock, running compliance checks.

And Jamie Collins is a store colleague — she needs to know what she's working on, where she needs to be, and when her break is.

Same app. One login. Completely different view depending on who you are.

All three accounts are live in the system. The PIN for all of them is 1234.

---

## Slide 3 — Login (PIN Screen)

The first thing to notice is how we've thought about who's actually using this. Store colleagues are on their feet, often with gloves on, handling stock — they don't have time to remember a username and password.

So we've replaced that with something much simpler: select your store, select your name, enter your four-digit PIN, and you're in. The whole thing takes about five seconds.

We're also not asking IT to provision accounts manually. The store list and every team member's profile come straight from the database — so when someone joins or moves stores, they're already in the system.

Let's log in as Sarah Mitchell and see what she sees the moment she opens Pulse.

---

## Slide 4 — Home Dashboard (Manager View)

This is Sarah's home screen — her operational command centre for the shift. Before she's even spoken to anyone, she knows exactly what's happening.

At the top right you can see a status badge — right now we're on Amber, which means the store needs attention. That badge is calculated automatically from real data: critical jobs, compliance progress, and open stock issues all feed into it. Green means all good, red means action required.

Below the greeting, there's an AI-generated suggestion. The system has spotted that the queue at Main Tills is building ahead of the lunch rush, and it's recommending Sarah move two colleagues from the Stockroom. The explanation is right there — she doesn't have to figure out why, just decide if she agrees. She can act on it with one tap, or dismiss it and move on.

The four cards give her the live pulse of the store. Nine colleagues are on the floor, two open jobs are CRITICAL, stock alerts have been flagged, and compliance is sitting at around 50% — the closing checklist hasn't been started yet. Everything has a colour: green is fine, amber is a nudge, red is urgent.

And at the bottom, the queue summary shows every monitored area in the store. Fitting Rooms is already over threshold — twelve people waiting against a limit of eight. That's going to need attention soon.

---

## Slide 5 — Jobs: Triage and Assign

This is the Jobs page — the engine room of the floor operation. Every job in the store is here, from critical restocking tasks to routine VM work.

At the top, Pulse has already done the prioritisation for you. It looks at job severity, how much SLA time is left, and even the time of day — restocking zones matter more in the morning, customer-facing areas matter more at lunchtime — and it surfaces the three most urgent things right now. Both CRITICAL jobs are flashing red because they're already overdue or close to it.

Let's look at this first one — 'Restock jeans wall, Slim Fit range.' You can see the AI badge, which means this job was flagged by the system, not a manager. The *Why it Matters* section explains it in plain English: size 10 and 12 are the most-asked-for sizes, and customers are leaving empty-handed. That's the kind of context a floor colleague needs to understand why something is genuinely urgent.

And there's a peer tip — Store 42 figured out that moving size 14s to eye level makes them much easier for customers to find. That institutional knowledge would usually disappear the moment someone left the company. Here it travels with the job.

Now let's assign it. The system shows us everyone available on the floor right now, with their skills and current zone. I'll assign this to someone with stock management experience — one tap, job is assigned, SLA clock is running, and the colleague gets it on their 'my jobs' screen immediately. No radio, no shouting across the floor.

---

## Slide 6 — Staff Roster

At the moment, if a manager wants to know where everyone is, they either walk the floor or call it out on the radio. With Pulse, the answer is right here.

Each card shows where the colleague is right now, whether they're active, on break, or absent, and what shift they're working. The colour-coded status dots mean you can scan the whole roster in a second.

The zone filters along the top are useful when you need to find coverage fast. Let's say the Fitting Rooms queue is building — I can filter to see exactly who's already there and whether they need backup.

And if I need to move someone — maybe I want to act on that AI suggestion from the home screen and pull someone from the Stockroom to the Tills — I just tap their card, hit Reallocate, pick the new zone, and it's done. No form, no email to HR, no waiting. The change reflects immediately for everyone viewing the roster.

---

## Slide 7 — Stock Lookup

Now let's step into Alex's world — he's a floor lead who's just had a customer ask for size 32 jeans in Dark Blue. Normally he'd have to walk to the stockroom, check the system on a shared computer, then walk back. With Pulse, he does it right here.

The stock page opens straight to the camera scanner. If we were on device, you'd just hold it up to any barcode. Let me type one in to keep things moving — this is the barcode for the Slim Fit Stretch Jeans we saw on that CRITICAL job a moment ago.

Instantly: product name, price, category, size and colour. And then the numbers that actually matter on the shop floor — seven in this store, fourteen at the nearby Oxford Street store, and forty-three at the distribution centre. If the size the customer wants isn't here, Alex can tell them in thirty seconds whether another store has it.

More useful still — the floor location. Zone B, Aisle 4, Bay 3. No more vague 'try the back of menswear' — it's the exact shelf, right on screen.

And if Alex spots that stock is low, he can add it to the replenishment basket right now, set the quantity, and submit the request — all without leaving the shop floor or logging into a separate system. The basket persists even if he closes the app and comes back later.

If something looks wrong — say the stock count doesn't match what's physically on the shelf — he can report a stock issue and flag it for investigation with a single tap.

---

## Slide 8 — Compliance

Compliance is one of the areas where manual processes create the most risk. Closing checklists done on paper get lost, signatures get skipped, issues go unreported. Pulse turns this into a structured, auditable digital process.

You can see the opening checklist was completed earlier this morning by Emma T. — timestamped, all items done, signature captured. That's a permanent record, instantly accessible. Now let's look at the closing checklist — it's not started yet, which matches what we saw on the dashboard.

When Alex starts it, the items are organised into sections and each one has the right input type built in. Some are simple yes/no ticks. Some require a number — like confirming the till float — with validation so you can't enter something out of range. Some require a photo. The system knows what kind of answer to expect.

If Alex spots something during the check — say a fire exit is partially blocked — he can flag it immediately, right on the item, with a severity level and description. That gets captured, tracked, and visible to the manager without anyone needing to remember to mention it at handover.

Once all the required items are done, Alex signs off digitally — on screen, right here. The signature is stored against the checklist record. There's an unbroken chain of accountability.

And if he's not sure about a policy — 'Can I exchange without a receipt?' — the policy search feature lets him ask in plain English and get an answer drawn from Primark's own SOPs, with a source citation so he can verify if he needs to.

---

## Slide 9 — Team Communications

Team communications in most stores run through WhatsApp or radio — which means critical information gets lost in group chat noise, and there's no way to know if everyone has actually read it.

Here, Sarah sent a fire drill announcement and it sits at the top of the feed with an URGENT badge. But the key thing is this acknowledgment tracker — she can see in real time how many colleagues have confirmed they've seen it. Currently two out of twelve. That's accountability. If she sends a policy update that everyone needs to read before opening, she knows exactly who has and who hasn't.

When Alex acknowledges — tap — the count updates immediately. And his name appears in the confirmed list.

He can also compose messages with proper targeting. If the fitting room queue is getting critical, he can send a message directly to the Fitting Rooms zone, set it to require acknowledgment, and know it will reach the right people. Not the entire store on a group chat — the right zone, the right role, the right message.

---

## Slide 10 — Schedule

Now let's switch to Jamie's perspective — a store colleague, not a manager. The first thing to notice is that the home screen is different. Where Sarah saw an AI suggestion, Jamie sees her shift for today — nine to five-thirty, Womenswear, break at one. The app knows who you are and shows you what's relevant to you.

The schedule page shows the full week at a glance. Today's shift has a progress bar — Jamie is about a third of the way through her shift. It sounds small, but knowing how long you've got left without checking the clock is something colleagues actually appreciate.

The shift swap feature handles something that currently happens entirely through text messages and manager approval chains. Jamie needs Friday off — she taps Offer for Swap, and the shift immediately shows as available to anyone in the same store with the same role. Her colleague who needs extra hours can accept it — one tap, both schedules update, the manager can see it happened. No back-and-forth, no missed messages.

---

## Slide 11 — Queues & Store Pressure

The Queues page closes the loop on everything we've seen so far. This is the real-time demand picture for the store.

At the top, the store pressure indicator gives a forward-looking view. Right now we're at Medium, but the system is flagging that a peak is expected in about forty-five minutes when the lunch rush hits. That's not reactive — that's proactive. It gives managers a window to act before customers start queuing out the door.

The individual queue cards show each monitored area in the store. Main Tills are fine — eight people, threshold is ten. But Fitting Rooms are already over threshold — twelve people waiting, threshold is eight. That red fill bar is the visual signal that something needs to happen.

And here's where it all connects: that's the exact trigger the AI on the home screen was responding to. It saw this queue, saw that colleagues were available in the Stockroom, and surfaced a specific recommendation to Sarah. The system isn't just showing you data — it's joining the dots and telling you what to do about it.

---

## Slide 12 — Summary / Close

That's Primark Pulse — one app, one shift, end to end.

To recap what we've seen: a manager starts her shift with an instant picture of the whole store — jobs, staff, queues, compliance — all in one place, with AI surfacing what needs attention first. A floor lead assigns work, checks stock, and runs a compliance checklist without ever going back to a desktop. A colleague checks her schedule and swaps a shift without a single conversation. And throughout all of it, there's a complete digital record — who did what, when, and why.

The shift from paper and radio to something like this isn't just about convenience. It's about accountability, speed, and not losing the institutional knowledge that walks out the door every time someone leaves.

Happy to dig into any of these areas in more detail, talk about how this maps to a specific use case, or walk through the technical architecture if that's useful.

---

## Key Themes to Return to

These are the five ideas that run through the whole demo. If you get a question or have a quiet moment, anchor back to one of these:

**One app.** Everything that currently lives across radios, paper, WhatsApp, and shared desktops — in one place.

**Role-aware.** The same app gives a completely different experience to a manager, a floor lead, and a store colleague. Relevant by default.

**AI with explanations.** Every AI suggestion says *why* it's recommending something. It's not a black box — it's a colleague making a suggestion you can agree with or override.

**Nothing gets lost.** Timestamped checklists, digital signatures, acknowledgment tracking, job history. A permanent record of every shift, every decision.

**Knowledge that stays.** Peer tips on jobs, policy search, shift history. The things that walk out the door when someone leaves — captured and shared.
