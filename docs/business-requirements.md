# Business Requirements — Primark Pulse.ai

**Version:** 1.0
**Date:** 2026-02-25
**Source:** Reverse-engineered from codebase

---

## 1. Project Overview

Primark Pulse.ai is a mobile-first store operations platform designed for Primark retail staff. It consolidates fragmented, manual store processes — task management, staff coordination, stock checking, compliance, and team communications — into a single Progressive Web App that runs on Android devices carried by staff on the shop floor. The system is currently a Proof of Concept, with two modules (Stock and Compliance) fully functional and the remaining six rendered with mock data to demonstrate the intended user experience.

---

## 2. Stakeholders and Users

| Role | Description |
|------|-------------|
| Store Manager | Monitors overall store health, views KPIs, assigns or overrides tasks, reviews compliance completion, and manages incidents |
| Floor Lead | Coordinates day-to-day operations: assigns jobs, reallocates staff to zones, tracks task SLAs, and sends team communications |
| Store Staff | Executes assigned jobs, scans stock barcodes, completes compliance checklists, views their shift schedule, and reads team messages |

---

## 3. Functional Requirements

### 3.1 Authentication

- **FR-01:** The system shall present a login screen requiring email and password. — `src/pages/Login/LoginPage.tsx`
- **FR-02:** The system shall redirect unauthenticated users to the login screen when they attempt to access any protected route. — `src/App.tsx:22`
- **FR-03:** The system shall persist authentication state across browser sessions so users do not need to log in again after closing the app. — `src/stores/authStore.ts`
- **FR-04:** The system shall allow users to log out, clearing their session. — `src/stores/authStore.ts:36`

### 3.2 Live Store Overview (Home)

- **FR-05:** The system shall display a real-time dashboard showing active staff count, open jobs, tills status, and compliance progress as metric cards. — `src/pages/Home/HomePage.tsx`
- **FR-06:** The system shall display a feed of operational alerts with severity indicators (critical/warning/info), zone context, relative timestamps, and AI-generated badges. — `src/components/composed/alert-feed.tsx`
- **FR-07:** The system shall display an AI suggestion banner with an explanation of the recommended action; the banner must be dismissible. — `src/components/composed/ai-banner.tsx`
- **FR-08:** The system shall display the logged-in user's current shift times and break schedule. — `src/components/composed/shift-info-card.tsx`
- **FR-09:** The system shall display a live queue summary on the home dashboard. — `src/components/composed/queue-summary-card.tsx`

### 3.3 Job Management

- **FR-10:** The system shall display a list of operational jobs filterable by: all jobs, my jobs, and unassigned jobs. — `src/pages/Jobs/JobsPage.tsx`
- **FR-11:** Each job shall display its priority (CRITICAL/HIGH/MEDIUM/LOW), status, zone, assignee, and remaining SLA time. — `src/pages/Jobs/components/JobListItem.tsx`
- **FR-12:** The system shall display a live SLA countdown timer on each job, visually escalating colour when approaching or past the deadline. — `src/pages/Jobs/components/SLATimer.tsx`
- **FR-13:** Users shall be able to assign a job to a staff member from a filterable staff list. — `src/pages/Jobs/components/AssignJobDialog.tsx`
- **FR-14:** Users shall be able to create new jobs specifying title, priority, zone, SLA, and optional assignee. — `src/pages/Jobs/components/CreateJobSheet.tsx`
- **FR-15:** Users shall be able to escalate a job to the store manager or regional manager with a reason and optional notes. — `src/pages/Jobs/components/EscalationSheet.tsx`
- **FR-16:** The system shall display AI-suggested jobs with a distinct "AI Suggested" badge. — `src/types/index.ts:47`
- **FR-17:** The system shall display peer tips from other stores on job detail cards to aid execution. — `src/pages/Jobs/components/PeerTipCard.tsx`
- **FR-18:** The system shall surface today's most important jobs at the top of the jobs view. — `src/pages/Jobs/components/TodaysTopJobs.tsx`

### 3.4 Staff & Workforce Management

- **FR-19:** The system shall display a live roster of staff members with name, current zone, status (active/break/absent), and skill tags. — `src/pages/Staff/StaffPage.tsx`
- **FR-20:** The system shall allow filtering the staff list by zone. — `src/pages/Staff/components/ZoneFilters.tsx`
- **FR-21:** Users shall be able to reallocate a staff member to a different zone. — `src/pages/Staff/components/ReallocateDialog.tsx`
- **FR-22:** Users shall be able to view a staff member's full skill profile and shift details. — `src/pages/Staff/components/StaffDetailSheet.tsx`

### 3.5 Stock & Availability (Fully Functional)

- **FR-23:** Users shall be able to scan a product barcode using the device camera to retrieve product information. — `src/pages/Stock/components/BarcodeScanner.tsx`
- **FR-24:** Users shall be able to manually enter a barcode or search by product name as a fallback to camera scanning. — `src/pages/Stock/components/OmniSearch.tsx`
- **FR-25:** The system shall display the scanned product's name, price, category, size, colour, and stock levels across store, nearby stores, distribution centre, and click & collect availability. — `src/pages/Stock/components/ProductCard.tsx`
- **FR-26:** The system shall display the product's physical floor location (zone, aisle, bay, shelf) when available. — `src/pages/Stock/components/ZoneLocationDisplay.tsx`
- **FR-27:** Users shall be able to add products to a replenishment basket with quantity selection. — `src/pages/Stock/StockPage.tsx:43`
- **FR-28:** The replenishment basket shall persist across app sessions. — `src/hooks/useBasket.ts:73`
- **FR-29:** Users shall be able to submit the replenishment basket as a stock request. — `src/pages/Stock/components/ReplenishmentBasket.tsx`
- **FR-30:** Users shall be able to report a stock issue (wrong location, damaged, count mismatch, missing tag, display issue) for any scanned product. — `src/pages/Stock/components/StockIssueSheet.tsx`

### 3.6 Compliance & Operational Controls (Fully Functional)

- **FR-31:** The system shall display a list of operational checklists (opening, closing, safety, ad-hoc) with their completion status and progress percentage. — `src/pages/Compliance/components/ChecklistsHome.tsx`
- **FR-32:** Users shall be able to execute a checklist, responding to each item using the appropriate input type (checkbox, numeric entry, photo capture, text notes, or digital signature). — `src/pages/Compliance/components/ChecklistExecutionSheet.tsx`
- **FR-33:** Completed checklist items shall be time-stamped and attributed to the completing user. — `src/types/index.ts:211`
- **FR-34:** Users shall be able to flag an issue against any checklist item with a severity level and optional photo. — `src/pages/Compliance/components/IssueFlagSheet.tsx`
- **FR-35:** Checklists shall be completed with a digital signature captured on-screen. — `src/pages/Compliance/components/SignaturePad.tsx`
- **FR-36:** The system shall provide a natural language policy search feature (GenAI) that returns concise answers sourced from Primark SOPs. — `src/pages/Compliance/components/PolicySearchSheet.tsx`
- **FR-37:** Users shall be able to submit formal incident reports (slip/fall, customer complaint, theft, equipment failure, injury) with location, time, description, severity, and photo. — `src/pages/Compliance/components/IncidentReportSheet.tsx`

### 3.7 Queues & Demand

- **FR-38:** The system shall display live queue lengths for key areas (main tills, fitting rooms) with threshold indicators. — `src/pages/Queues/components/QueueCard.tsx`
- **FR-39:** The system shall display a store pressure indicator (Low/Medium/High) with a peak forecast message. — `src/pages/Queues/components/StorePressureCard.tsx`

### 3.8 Team Communications

- **FR-40:** The system shall display a feed of team messages filterable by all, announcements, and my zone. — `src/pages/Team/TeamPage.tsx`
- **FR-41:** Messages that require acknowledgment shall display acknowledgment progress (e.g., "4 of 18 confirmed"). — `src/pages/Team/components/AcknowledgmentProgress.tsx`
- **FR-42:** Users shall be able to acknowledge a message to confirm they have read it. — `src/pages/Team/components/AcknowledgmentCard.tsx`
- **FR-43:** Users shall be able to compose and send a new message scoped to store, zone, role, or individual. — `src/pages/Team/components/ComposeMessageSheet.tsx`
- **FR-44:** Messages shall be linkable to a specific job. — `src/types/index.ts:387`

### 3.9 Schedule

- **FR-45:** The system shall display the current user's weekly shift schedule with a date strip navigator. — `src/pages/Schedule/SchedulePage.tsx`
- **FR-46:** The system shall show a daily shift progress card indicating how far through the current shift the user is. — `src/pages/Schedule/components/ShiftProgressCard.tsx`
- **FR-47:** Users shall be able to offer a shift for swapping and accept available shifts from colleagues. — `src/pages/Schedule/components/SwapShiftCard.tsx`

---

## 4. User Stories

### Store Overview

- As a **floor lead**, I can view the live dashboard so that I can immediately see if anything needs my attention when I start my shift.
- As a **floor lead**, I can dismiss AI suggestion banners so that I can focus on what is most relevant to me right now.
- As a **manager**, I can see compliance progress as a percentage so that I know if closing procedures are on track before end of day.

### Jobs

- As a **floor lead**, I can view unassigned jobs so that I can quickly allocate work to available staff.
- As a **staff member**, I can filter to "my jobs" so that I only see the tasks I need to complete.
- As a **floor lead**, I can escalate a job to the store manager so that I can get help with situations I cannot resolve alone.
- As a **staff member**, I can view a peer tip on a job so that I can benefit from advice from colleagues in other stores.

### Stock

- As a **staff member**, I can scan a product barcode so that I can instantly see its stock levels without visiting the stockroom.
- As a **staff member**, I can add multiple products to a replenishment basket so that I can submit a single stock request for all items I need.
- As a **staff member**, I can report a stock issue so that the right person can investigate a discrepancy or damaged item.

### Compliance

- As a **floor lead**, I can execute the store closing checklist on my phone so that I do not need to use paper-based processes.
- As a **staff member**, I can flag an issue against a checklist item so that problems are formally captured and tracked.
- As a **floor lead**, I can search store policies in natural language so that I can quickly find the answer to an operational question without consulting a manual.
- As a **floor lead**, I can file an incident report digitally so that safety events are formally recorded immediately.

### Communications

- As a **manager**, I can send a store-wide announcement requiring acknowledgment so that I can confirm all staff have received critical information.
- As a **staff member**, I can filter messages to my zone so that I only see communications relevant to where I am working.

### Schedule

- As a **staff member**, I can view my weekly schedule so that I know my upcoming shifts.
- As a **staff member**, I can offer a shift for swap so that I can find cover when I am unable to work.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Security | All routes except `/login` require authentication; auth state checked via `useAuthStore().isAuthenticated` on every navigation |
| Security | No sensitive data is transmitted to a real server in the PoC; all API calls are intercepted by MSW in-browser |
| Performance | Pages are lazy-loaded via `React.lazy` to minimise initial bundle load time — `src/App.tsx:7` |
| Performance | API data cached for 5 minutes via React Query `staleTime`; task list auto-refreshes every 30 seconds |
| Performance | Skeleton screens are shown during data loading rather than spinners for better perceived performance |
| Availability | App is installable as a PWA on Android; service worker provides offline access to previously loaded content |
| Offline | Replenishment basket is persisted to `localStorage` and remains available without connectivity |
| Offline | Service worker caches all JS/CSS/HTML assets; API responses cached with NetworkFirst strategy (24-hour fallback) |
| Usability | All interactive elements meet 44px minimum touch target size for gloved or hurried in-store use |
| Usability | Bottom navigation is positioned at thumb-reach with a maximum of 5 items |
| Usability | App is locked to portrait orientation for handheld mobile use |
| Accessibility | Navigation uses `aria-current="page"` on the active nav item |
| Scalability | All TypeScript interfaces are defined in a single shared `src/types/index.ts` to enable seamless transition from mock data to real APIs |

---

## 6. Business Rules

- **BR-01:** A job with no assignee must have status `unassigned`; assigning a staff member automatically sets the status to `pending`.
- **BR-02:** SLA timers are calculated from the job's `createdAt` timestamp plus the `sla` field (minutes). At ≤25% remaining time the SLA enters "warning" state; at ≤10% or past deadline it enters "critical" state.
- **BR-03:** AI-generated alerts and jobs must always be badged with an "AI Suggested" label; the AI engine's actions must be transparent to users.
- **BR-04:** The policy search feature must always cite its source (e.g., "Primark SOP — SharePoint") and display a confidence level.
- **BR-05:** Checklist completion requires a digital signature from the completing staff member.
- **BR-06:** Incident reports are assigned status `reported` on creation; they progress through `investigating` to `resolved`.
- **BR-07:** Messages requiring acknowledgment track per-user confirmation; progress is visible as a count (e.g., "4 of 18 confirmed").
- **BR-08:** Shift status transitions: `confirmed` → `pending-swap` when offered for swap; `available` when posted for any taker; back to `confirmed` when accepted.
- **BR-09:** The replenishment basket merges items — adding a product already in the basket increments its quantity rather than creating a duplicate entry.

---

## 7. Out of Scope

- Real backend API or database — all data is mocked and resets on service worker restart
- Role-based access control enforcement — all authenticated users have access to all screens regardless of role
- Real AI/ML model — AI suggestions and policy search responses are hardcoded mock responses
- Real-time WebSocket updates — data is polled on intervals (30 seconds for tasks), not pushed
- Performance Insights page (`/insights`) — rendered as a placeholder with no functional content
- Push notifications — notification count is a mock initial value; no real push subscription
- Multi-store management — the app is scoped to a single store (Manchester Arndale in the demo)
- Payroll or earned wage access integration
- Customer-facing features
