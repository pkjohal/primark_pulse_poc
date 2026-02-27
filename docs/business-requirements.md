# Business Requirements — Primark Pulse

**Version:** 2.0
**Date:** 2026-02-27
**Source:** Reverse-engineered from codebase

---

## 1. Project Overview

Primark Pulse is a mobile-first store operations platform designed for Primark retail staff. It consolidates fragmented, manual store processes — task management, staff coordination, stock checking, compliance, and team communications — into a single Progressive Web App that runs on Android devices carried by staff on the shop floor. The system is a Proof of Concept backed by a live Supabase (PostgreSQL) database, with all core modules fully wired to real data.

---

## 2. Stakeholders and Users

| Role | Description |
|------|-------------|
| Store Manager | Monitors overall store health, views KPIs, assigns or overrides jobs, reviews compliance completion, and manages incidents |
| Floor Lead | Coordinates day-to-day operations: assigns jobs, reallocates staff to zones, tracks job SLAs, and sends team communications |
| Store Staff | Executes assigned jobs, scans stock barcodes, completes compliance checklists, views their shift schedule, and reads team messages |

---

## 3. Functional Requirements

### 3.1 Authentication

- **FR-01:** The login flow shall present a three-step selection: choose store location → choose team member → enter 4-digit PIN. — `src/pages/Login/LoginPage.tsx`
- **FR-02:** The system shall fetch available store locations from the `locations` table in Supabase on the login screen. — `src/pages/Login/LoginPage.tsx:38`
- **FR-03:** The system shall fetch active staff members for the selected store from the `users` table and verify the entered PIN against the stored value. — `src/pages/Login/LoginPage.tsx:62`
- **FR-04:** The system shall redirect unauthenticated users to the login screen when they attempt to access any protected route. — `src/App.tsx:23`
- **FR-05:** The system shall persist authentication state (user id, name, store, store_id, role) across browser sessions so users do not need to log in again after closing the app. — `src/stores/authStore.ts`
- **FR-06:** The system shall allow users to log out, clearing their session. — `src/stores/authStore.ts:36`

### 3.2 Live Store Overview (Home)

- **FR-07:** The system shall display a real-time dashboard showing active staff count, open jobs, stock alerts, and compliance progress as metric cards derived from live Supabase data. — `src/pages/Home/HomePage.tsx`, `src/hooks/useStoreMetrics.ts`
- **FR-08:** The system shall display a time-of-day greeting and an overall store status badge (All good / Needs attention / Action required) based on job criticality and compliance progress. — `src/pages/Home/HomePage.tsx:107`
- **FR-09:** Staff users shall see their current or next upcoming shift on the home dashboard; managers and floor leads shall see an AI suggestion banner. — `src/pages/Home/HomePage.tsx:157`
- **FR-10:** The system shall display an AI suggestion banner (for manager/lead roles) with action and explanation; the banner shall be dismissible. — `src/hooks/useAISuggestion.ts`
- **FR-11:** The system shall display a live queue summary card on the home dashboard. — `src/components/composed/queue-summary-card.tsx`

### 3.3 Job Management

- **FR-12:** The system shall display a list of operational jobs filterable by: all open jobs, my jobs, unassigned jobs, done, and my completed jobs. — `src/pages/Jobs/JobsPage.tsx`
- **FR-13:** Each job shall display its priority (CRITICAL/HIGH/MEDIUM/LOW), status, zone, assignee, and remaining SLA time. — `src/pages/Jobs/components/JobListItem.tsx`
- **FR-14:** The system shall display a live SLA countdown timer on each job, visually escalating colour when approaching or past the deadline. — `src/pages/Jobs/components/SLATimer.tsx`
- **FR-15:** Users shall be able to assign a job to a staff member from a filterable staff list. — `src/pages/Jobs/components/AssignJobDialog.tsx`
- **FR-16:** Users shall be able to create new jobs specifying title, priority, zone, SLA, and optional assignee. — `src/pages/Jobs/components/CreateJobSheet.tsx`
- **FR-17:** Users shall be able to escalate a job to the store manager or regional manager with a reason and optional notes. — `src/pages/Jobs/components/EscalationSheet.tsx`
- **FR-18:** The system shall display AI-suggested jobs with a distinct "AI Suggested" badge. — `src/hooks/useJobs.ts`
- **FR-19:** The system shall display peer tips from other stores on job detail cards to aid execution. — `src/pages/Jobs/components/PeerTipCard.tsx`
- **FR-20:** The system shall surface today's top-priority jobs using a composite score based on priority weight, SLA urgency, and time-of-day zone relevance. — `src/hooks/useJobs.ts:260`

### 3.4 Staff & Workforce Management

- **FR-21:** The system shall display a live roster of staff members with name, current zone, status (active/break/absent), and skill tags. — `src/pages/Staff/StaffPage.tsx`
- **FR-22:** The system shall allow filtering the staff list by zone. — `src/pages/Staff/components/ZoneFilters.tsx`
- **FR-23:** Users shall be able to reallocate a staff member to a different zone. — `src/pages/Staff/components/ReallocateDialog.tsx`
- **FR-24:** Users shall be able to view a staff member's full skill profile and shift details. — `src/pages/Staff/components/StaffDetailSheet.tsx`

### 3.5 Stock & Availability

- **FR-25:** Users shall be able to scan a product barcode using the device camera to retrieve product information. — `src/pages/Stock/components/BarcodeScanner.tsx`
- **FR-26:** Users shall be able to manually enter a barcode or search by product name as a fallback to camera scanning. — `src/pages/Stock/components/OmniSearch.tsx`
- **FR-27:** The system shall display the scanned product's name, price, category, size, colour, and stock levels across store, nearby stores, distribution centre, and click & collect availability from Supabase. — `src/hooks/useProductLookup.ts`
- **FR-28:** The system shall display the product's physical floor location (zone, aisle, bay, shelf) when available. — `src/pages/Stock/components/ZoneLocationDisplay.tsx`
- **FR-29:** Users shall be able to add products to a replenishment basket with quantity selection. — `src/pages/Stock/StockPage.tsx`
- **FR-30:** The replenishment basket shall persist across app sessions. — `src/hooks/useBasket.ts`
- **FR-31:** Users shall be able to submit the replenishment basket as a stock request. — `src/pages/Stock/components/ReplenishmentBasket.tsx`
- **FR-32:** Users shall be able to report a stock issue (wrong location, damaged, count mismatch, missing tag, display issue) for any scanned product. — `src/pages/Stock/components/StockIssueSheet.tsx`
- **FR-33:** The system shall provide a dedicated scan-only stock page (`/scan-stock`) optimised for rapid barcode scanning. — `src/pages/ScanStock/ScanStockPage.tsx`

### 3.6 Compliance & Operational Controls

- **FR-34:** The system shall display a list of operational checklists (opening, closing, safety, ad-hoc) with their completion status and progress percentage sourced from Supabase. — `src/pages/Compliance/components/ChecklistsHome.tsx`
- **FR-35:** Users shall be able to execute a checklist, responding to each item using the appropriate input type (checkbox, numeric entry, photo capture, text notes). — `src/pages/Compliance/components/ChecklistExecutionSheet.tsx`
- **FR-36:** Completed checklist item responses shall be time-stamped and attributed to the completing user and persisted to the `checklist_responses` table. — `src/hooks/useChecklists.ts:202`
- **FR-37:** Users shall be able to flag an issue against any checklist item with a severity level and optional photo, persisted to `flagged_issues`. — `src/pages/Compliance/components/IssueFlagSheet.tsx`
- **FR-38:** Checklists shall be completed with a digital signature captured on-screen, stored in the `checklists` table as `signature_data`. — `src/pages/Compliance/components/SignaturePad.tsx`
- **FR-39:** The system shall provide a natural language policy search feature (GenAI) that returns concise answers sourced from Primark SOPs. — `src/pages/Compliance/components/PolicySearchSheet.tsx`
- **FR-40:** Users shall be able to submit formal incident reports (slip/fall, customer complaint, theft, equipment failure, injury) persisted to the `incident_reports` table. — `src/hooks/useChecklists.ts:374`

### 3.7 Queues & Demand

- **FR-41:** The system shall display live queue lengths for key areas (main tills, fitting rooms) with threshold indicators sourced from the `queue_statuses` table. — `src/pages/Queues/components/QueueCard.tsx`
- **FR-42:** The system shall display a store pressure indicator (Low/Medium/High) with a peak forecast message from the `store_pressure` table. — `src/pages/Queues/components/StorePressureCard.tsx`

### 3.8 Team Communications

- **FR-43:** The system shall display a feed of team messages filterable by all, announcements, and my zone, sourced from Supabase. — `src/pages/Team/TeamPage.tsx`
- **FR-44:** Messages that require acknowledgment shall display acknowledgment progress (e.g., "4 of 18 confirmed") persisted via `message_acknowledgments`. — `src/pages/Team/components/AcknowledgmentProgress.tsx`
- **FR-45:** Users shall be able to acknowledge a message to confirm they have read it. — `src/hooks/useMessages.ts:97`
- **FR-46:** Users shall be able to compose and send a new message scoped to store, zone, role, or individual. — `src/pages/Team/components/ComposeMessageSheet.tsx`
- **FR-47:** Messages shall be linkable to a specific job via `linked_job_id`. — `src/hooks/useMessages.ts:19`

### 3.9 Schedule

- **FR-48:** The system shall display the current user's weekly shift schedule with a date strip navigator, sourced from Supabase. — `src/pages/Schedule/SchedulePage.tsx`
- **FR-49:** The system shall show a daily shift progress card indicating how far through the current shift the user is. — `src/pages/Schedule/components/ShiftProgressCard.tsx`
- **FR-50:** Users shall be able to offer a shift for swap (setting status to `available`) and cancel their offer. — `src/hooks/useSchedule.ts:86`
- **FR-51:** Users shall be able to accept an available shift offered by a colleague, reassigning `user_id` on the shift row. — `src/hooks/useSchedule.ts:144`

---

## 4. User Stories

### Store Overview

- As a **floor lead**, I can view the live dashboard so that I can immediately see if anything needs my attention when I start my shift.
- As a **floor lead**, I can dismiss AI suggestion banners so that I can focus on what is most relevant to me right now.
- As a **manager**, I can see compliance progress as a percentage so that I know if closing procedures are on track before end of day.
- As a **staff member**, I can see my shift times on the home screen so that I know when my break is without asking a manager.

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
- As a **staff member**, I can accept an available shift from a colleague so that I can pick up extra hours.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Security | All routes except `/login` require authentication; auth state checked via `useAuthStore().isAuthenticated` on every navigation |
| Security | PIN codes stored as plain text in Supabase for PoC; production must use hashed PINs |
| Security | Row Level Security disabled on all tables for PoC; production must enable RLS |
| Performance | Pages are lazy-loaded via `React.lazy` to minimise initial bundle load time — `src/App.tsx:7` |
| Performance | API data cached for 5 minutes via React Query `staleTime`; store metrics and jobs auto-refresh every 30 seconds |
| Performance | Skeleton screens are shown during data loading rather than spinners for better perceived performance |
| Availability | App is installable as a PWA on Android; service worker provides offline access to previously loaded content |
| Offline | Replenishment basket is persisted to `localStorage` and remains available without connectivity |
| Offline | Service worker caches all JS/CSS/HTML assets; API responses cached with NetworkFirst strategy (24-hour fallback) |
| Usability | All interactive elements meet 44px minimum touch target size for gloved or hurried in-store use |
| Usability | Bottom navigation is positioned at thumb-reach with a maximum of 5 items |
| Usability | App is locked to portrait orientation for handheld mobile use |
| Accessibility | Navigation uses `aria-current="page"` on the active nav item |
| Scalability | Multi-store support is built into the schema; all queries filter by `store_id` derived from the authenticated user |

---

## 6. Business Rules

- **BR-01:** A job with no assignee must have status `unassigned`; assigning a staff member automatically sets the status to `pending`. — `src/hooks/useJobs.ts:122`
- **BR-02:** SLA timers are calculated from the job's `createdAt` timestamp plus the `sla` field (minutes). At ≤25% remaining time the SLA enters "warning" state; at ≤10% or past deadline it enters "critical" state. — `src/hooks/useJobs.ts:295`
- **BR-03:** AI-generated alerts and jobs must always be badged with an "AI Suggested" label; the AI engine's actions must be transparent to users.
- **BR-04:** The policy search feature must always cite its source (e.g., "Primark SOP — SharePoint") and display a confidence level.
- **BR-05:** Checklist completion requires a digital signature from the completing staff member; `signature_data` is stored on the checklist row.
- **BR-06:** Incident reports are assigned status `open` on creation; they progress through `investigating` to `resolved`.
- **BR-07:** Messages requiring acknowledgment track per-user confirmation via `message_acknowledgments`; progress is visible as a count (e.g., "4 of 18 confirmed").
- **BR-08:** Shift status transitions: `confirmed` → `available` when offered for swap via `useOfferShift`; back to `confirmed` and `user_id` reassigned when accepted via `useAcceptShift`.
- **BR-09:** The replenishment basket merges items — adding a product already in the basket increments its quantity rather than creating a duplicate entry.
- **BR-10:** Store status (green/amber/red) on the home dashboard is computed from: critical job count, open job count, compliance progress %, and open stock issue count — `src/hooks/useStoreMetrics.ts:69`.

---

## 7. Out of Scope

- Role-based access control enforcement — all authenticated users have access to all screens regardless of role
- Real AI/ML model — AI suggestions and policy search responses remain mocked
- Real-time WebSocket updates — data is polled on intervals, not pushed
- Performance Insights page (`/insights`) — rendered as a placeholder with no functional content
- Push notifications — not yet implemented
- Payroll or earned wage access integration
- Customer-facing features
- Tills monitoring — `tillsOpen` and `tillsTotal` fields in `StoreMetrics` are hard-coded to 0 pending integration
