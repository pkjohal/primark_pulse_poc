

**PRIMARK PULSE.AI**  
Store Operations Platform

Technical Specification, Field Reference & Development Guide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Version 1.0  •  January 2026

# **Contents**

1\. Executive Summary & Vision

2\. Design Inspiration & Research

3\. Module Field Specifications

4\. Brief Compliance Matrix

5\. Android PWA Best Practices

6\. Development Workflow & Architecture

7\. Scalability Foundation

# **1\. Executive Summary & Vision**

Primark Pulse.ai addresses a fundamental challenge in retail operations: **fragmented, manual processes that slow decision-making and execution**. This document provides the complete technical specification, ensuring each component fulfils the PoC Brief requirements whilst establishing a scalable foundation.

## **1.1 The Problem Being Solved**

Today's Primark store operations likely involve:

* **Disconnected systems** — rosters in one place, tasks in another, compliance on paper  
* **Reactive management** — problems discovered after customer impact  
* **Information silos** — floor staff lack visibility, managers chase updates  
* **Manual coordination** — radio calls, walking the floor, verbal handoffs  
* **No operational memory** — yesterday's learnings stay in people's heads

## **1.2 The Pulse.ai Solution**

Pulse.ai transforms store operations from *reactive firefighting* to **proactive orchestration** through three interlocking layers:

| Layer | Purpose | User Experience |
| :---- | :---- | :---- |
| **Live Operations Hub** | What's happening now | Glanceable, real-time, mobile-first dashboard |
| **Action & Execution** | What needs doing | Task-driven, role-aware, trackable workflows |
| **Intelligence & Insight** | Why and what's next | Contextual, predictive, explainable AI suggestions |

# **2\. Design Inspiration & Research**

The following best-in-class applications have been researched to inform Pulse.ai's design language, interaction patterns, and UX philosophy.

## **2.1 Primary Inspiration Sources**

### **Deputy — Workforce Management Excellence**

**Why it matters:** Deputy is the gold standard for retail/hospitality workforce management, used by companies like Nike, Amazon, and Ace Hardware.

* **Mobile-first design:** Built for in-store use with large touch targets and offline capability  
* **Facial recognition clock-in:** Prevents buddy punching, modern feel  
* **AI-driven scheduling:** Auto-generates optimal rosters based on demand forecasts  
* **Shift swap self-service:** Employees handle their own coverage within manager-set rules

**Apply to Pulse.ai:** Staff module design, shift visualisation, skill-based assignment UI

### **Monday.com — Visual Task Management**

**Why it matters:** Monday's colourful, customisable boards make complex task management approachable and visually clear.

* **Colour-coded status columns:** Instant visual parsing of task states (red/amber/green)  
* **My Work view:** Personal task inbox organised by priority/date without board-hopping  
* **Split-screen task detail:** Essential info left, updates/comments right  
* **Automation badges:** Clear indication when actions were auto-triggered

**Apply to Pulse.ai:** Task list design, priority badges, 'AI Suggested' visual language

### **Asana — Clean Task Architecture**

**Why it matters:** Asana balances simplicity with power, making task dependencies and workflows intuitive.

* **My Tasks centralisation:** Everything assigned to you in one place  
* **Subtask nesting:** Break complex tasks into trackable steps  
* **Portfolio view:** High-level status across multiple workstreams  
* **Built-in video recording:** Rich context without external tools

**Apply to Pulse.ai:** Checklist item architecture, task-to-compliance linking, clean white-space design

### **Notion — Flexible Information Architecture**

**Why it matters:** Notion's database-driven pages allow the same data to appear in multiple views without duplication.

* **Linked databases:** One source of truth, multiple filtered views  
* **Gallery/Board/Table views:** Same data, different consumption modes  
* **Templates for consistency:** Pre-structured entries reduce friction  
* **Mobile-optimised dashboards:** Minimalist, tap-friendly on small screens

**Apply to Pulse.ai:** Unified data model, filtered views per role, template-driven checklists

### **Homebase — Small Business Simplicity**

**Why it matters:** Homebase proves complex workforce tools can be approachable for non-technical users.

* **Unified mobile app:** One app for managers and employees (not separate apps)  
* **Auto-scheduling:** Generate schedules based on availability \+ labour targets  
* **Shift rating/feedback:** Staff can rate shifts, building sentiment data  
* **Earned wage access:** Modern employee benefit integration

**Apply to Pulse.ai:** Simple onboarding flow, role-based UI (not separate apps), sentiment signals

## **2.2 Design Principles Derived**

| Principle | Implementation |
| :---- | :---- |
| **Status over Reports** | Live indicators (green/amber/red) replace static reports. Real-time feel via polling or WebSocket. |
| **Bottom Navigation** | Primary nav at thumb-reach. Maximum 5 items. Overflow to hamburger menu. |
| **Progressive Disclosure** | Show summary first, detail on tap. Avoid overwhelming with all data upfront. |
| **Colour as Communication** | Red \= critical/overdue. Amber \= warning/approaching. Green \= good/complete. Violet \= AI-suggested. |
| **AI Transparency** | Always badge AI-generated suggestions. Show 'why' explanations. Never hide automation. |
| **Touch-First** | 44px minimum touch targets. Swipe gestures for common actions. Pull-to-refresh everywhere. |

# **3\. Module Field Specifications**

This section defines every field within each module, its purpose, data type, and how it fulfils the PoC Brief requirements.

### `tailwind.config.js` (copy exactly)

```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primark: {
          blue: '#0DAADB',
          'blue-dark': '#0987A8',
          'blue-light': '#E6F7FB',
        },
        navy: '#1A1F36',
        charcoal: '#374151',
        'mid-grey': '#6B7280',
        'light-grey': '#F3F4F6',
        'border-grey': '#E5E7EB',
        success: { DEFAULT: '#10B981', bg: '#ECFDF5' },
        warning: { DEFAULT: '#F59E0B', bg: '#FFFBEB' },
        danger: { DEFAULT: '#EF4444', bg: '#FEF2F2' },
        'alert-red': { DEFAULT: '#DC2626', dark: '#991B1B' },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Design Tokens

**Typography:**
- Page title: `text-2xl font-bold` (24px, 700)
- Section heading: `text-lg font-semibold` (18px, 600)
- Card title: `text-base font-semibold` (16px, 600)
- Body: `text-[15px] font-normal`
- Caption/label: `text-[13px] font-medium uppercase tracking-wide`
- Large stat number: `text-4xl font-bold` (36-48px, 700)
- Table text: `text-sm font-normal` (14px, 400)

**Spacing:**
- Page padding: `p-6` (24px)
- Card padding: `p-5` (20px)
- Card border-radius: `rounded-xl` (12px)
- Card shadow: `shadow-sm`
- Gap between cards: `gap-4` (16px)
- Button min-height: `min-h-[44px]` desktop, `min-h-[48px]` touch/mobile
- Input min-height: `min-h-[44px]`
- Button border-radius: `rounded-lg` (8px)
- Sidebar width: `w-64` (260px), collapsible on mobile

**NavBar:**
- Height: 64px, `bg-navy`
- Left: "PRIMARK" text (`uppercase tracking-[0.15em] font-bold text-primark-blue`), subtitle "Pulse" in `text-mid-grey`
- Right: notification bell (with unread count badge), user name, role badge, store/location, logout button 

## **3.0 Login screen (Login)**

Full-screen gradient background: `bg-gradient-to-b from-navy to-primark-blue`.

**Branding:** "PRIMARK" using `font-primark uppercase text-primark-blue` at 42px / weight 500. Subtitle "Qual.it — Quality Issue Management" in `text-white/70`.

**Three-step wizard** (progressive disclosure — each step replaces the previous on the same card):

- **Step 1 — Select Location:** Store dropdown populated dynamically. Stores are fetched by first querying active users to get distinct `store_id` values, then fetching only those stores ordered by name. Selecting a store advances to step 2 and fetches users for that store.
- **Step 2 — Select Team Member:** User dropdown filtered to the selected store (`is_active = true`, ordered by name). Shows the selected store name as a subtitle. Includes a "← Back to Store Selection" button which resets to step 1.
- **Step 3 — Enter PIN:** Displays the selected user's name as a subtitle. Renders the `PinPad` component. Correct PIN → navigate `/`. Incorrect → shake animation + "Incorrect PIN. Please try again." message (PIN does not auto-clear). Includes a "← Back to Team Selection" button which resets to step 2.

**Loading state:** Full-screen spinner (`border-t-white rounded-full animate-spin`) shown while the initial store list loads.

**Footer:** "Internal use only • Staff members only" in `text-white/50`.

## **3.1 Live Store Overview (Home)**

**Brief Reference:** Section 1 — 'Single pane of glass for what's happening right now'

### **Store Status Card**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| storeStatus | enum | Pulsing badge (green/amber/red) | 'Live store status' |
| staffActive | number | '24/28' with progress ring | 'Staff deployment by zone' |
| tillsOpen | number | '8/14' with subtext | 'Queue pressure indicators' |
| openTasks | number | Count with critical highlight | 'What needs attention now' |
| complianceProgress | percentage | '85%' with progress bar | Compliance visibility |

### **Alert Feed**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| alertType | enum | Icon \+ colour (critical/warning/info) | 'Critical alerts and exceptions' |
| message | string | Alert description text | Clear communication |
| zone | string | Location badge | Zone context |
| timestamp | datetime | '2 min ago' relative time | Recency awareness |
| aiGenerated | boolean | 'AI Suggested' badge if true | Section 9 — Decision engine visibility |

### **AI Suggestion Banner**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| suggestionText | string | Prominent card with violet gradient | Section 9 — 'Suggested actions banner' |
| explanation | string | 'Why' reasoning below suggestion | Section 9 — 'Why this action' explanations |
| primaryAction | string | CTA button text | Actionable suggestions |
| dismissible | boolean | X close button | User control |

## **3.2 Staff & Workforce Management**

**Brief Reference:** Section 2 — 'Labour is the biggest cost and biggest lever'

### **Staff Member Card**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| id | string | Internal reference | Unique identifier |
| name | string | 'Sarah M.' (privacy-safe) | 'Live roster' |
| avatar | string | Initials in coloured circle | Visual identification |
| zone | string | Current location text | 'Zone assignment' |
| status | enum | active/break/absent badge | 'Attendance, breaks, availability' |
| skills\[\] | array | Tag chips (Till Trained, etc) | 'Skill & certification tagging' |
| shiftStart | time | '09:00' in detail view | 'Shift view' |
| shiftEnd | time | '17:30' in detail view | 'Shift view' |

### **Zone Filter**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| zones\[\] | array | Horizontal scrolling pills | Zone-based filtering |
| selectedZone | string | Highlighted active pill | Current filter state |

### **Staff Actions**

| Action | Brief Requirement |
| :---- | :---- |
| Reallocate | 'Real-time reallocation' — moves staff to different zone |
| Send Task | Links to Task Management — assigns work to individual |
| View Skills | 'Skill & certification tagging' — shows full skill profile |

## **3.3 Task Management & Execution**

**Brief Reference:** Section 3 — 'Work only exists if it is visible and owned'

### **Task Card**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| id | string | Internal reference | Unique identifier |
| title | string | Task description headline | 'Task creation' |
| priority | enum | Coloured badge (CRITICAL/HIGH/MEDIUM/LOW) | 'Task prioritisation' |
| status | enum | Icon indicator (unassigned/pending/in-progress/complete) | 'Task lifecycle tracking' |
| zone | string | Location with pin icon | Zone context |
| assignee | string|null | Staff name or 'Unassigned' warning | 'Task assignment' |
| sla | duration | 'SLA: 15 min' with timer icon | 'SLA timers' |
| aiSuggested | boolean | Violet 'AI Suggested' badge | Section 10 — 'Auto-suggested defaults' |
| createdAt | datetime | Timestamp in detail view | Audit trail |

### **Task Actions**

| Action | Brief Requirement |
| :---- | :---- |
| Assign Task | 'Task assignment' — select staff member from filtered list |
| Complete | 'Task lifecycle tracking' — mark done with timestamp |
| Escalate | 'SLA timers & escalation' — bump priority and notify manager |
| Manager Override | 'Manager override' — force reassignment or status change |

## **3.4 Compliance & Operational Controls**

 ****  Brief Reference: Section 7 \+ Section 6.A

### **Closing Checklist Item**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| id | string | Internal reference | Unique identifier |
| category | string | Section header (Cash & Tills, Security, etc) | 'Configurable checklist' |
| item | string | Checklist item description | 'Closing checklists' |
| completed | boolean | Checkbox with tick animation | 'Tick' |
| completedAt | datetime|null | 'Completed at 17:45' timestamp | 'Timestamp' |
| completedBy | string|null | Staff member name | 'Time-stamped audit trails' |

### **Checklist Progress**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| progress | percentage | '85%' with animated progress bar | 'Completion status' |
| completedCount | number | '10 of 12 items complete' | Progress visibility |

### **GenAI Policy Search**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| query | string | Search input field | 'Natural language query' |
| response | string | Answer card with policy text | 'Concise response snippets' |
| source | string | 'Source: Primark SOP — SharePoint' | 'SOPs sourced from SharePoint' |
| confidence | enum | 'High Confidence' badge | Trust indicator |

## **3.5 Stock & Availability Operations**

 ****  Brief Reference: Section 5 \+ Section 6.B

### **Product Lookup Result**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| barcode | string | Scanned via camera | 'Camera-based scan' |
| name | string | Product title | 'Product info' |
| price | currency | '£17.00' prominent display | 'Product info' |
| category | string | 'Menswear — Denim' | Category context |
| size | string | '32W 32L' | Size variant |
| storeStock | number | Count with green/red indicator | 'Stock visibility: Store' |
| nearbyStock | number | Count for local stores | 'Stock visibility: Local stores' |
| dcStock | number | Distribution centre count | 'Stock visibility: DC' |
| clickCollect | boolean | 'Available' / 'Not Available' | 'Stock visibility: Click & Collect' |

### **Replenishment Basket**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| items\[\] | array | List of scanned products | 'Scan to add item' |
| item.qty | number | \+/- stepper control | 'Quantity selection' |
| totalItems | number | '3 items' badge on header | 'Basket review' |
| exportJSON() | function | 'Submit Request' button | 'JSON export for downstream systems' |

## **3.6 Demand, Queues & Store Pressure**

**Brief Reference:** Section 4 — 'Customer demand is dynamic and drives everything else'

### **Queue Status Card**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| name | string | 'Main Tills', 'Fitting Rooms' | 'Live queue tracking' |
| current | number | Large count display | Current queue length |
| threshold | number | Marked on progress bar | 'Thresholds and alerts' |
| max | number | Progress bar maximum | Capacity context |
| status | enum | 'Normal' / 'Over Threshold' badge | 'Thresholds and alerts' |

### **Store Pressure Indicator**

| Field | Type | Display | Brief Requirement |
| :---- | :---- | :---- | :---- |
| pressureLevel | enum | 'Low/Medium/High' with gradient card | 'Visual store pressure map' |
| peakForecast | string | 'Peak expected in 45 mins' | Section 11 — 'Expected later today' |
| suggestedTask | string|null | 'Task suggested' message | 'Queue-to-task triggers' (stubbed) |

# **4\. Brief Compliance Matrix**

This matrix maps every PoC Brief requirement to its implementation status and location within the app.

## **4.1 Core Functional Themes**

| \# | Theme | Status | Module | Depth |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Live Store Overview |    | Home | Mocked data |
| 2 | Staff & Workforce |    | Staff | Mocked data |
| 3 | Task Management |    | Tasks | Mocked data |
| 4 | Queues & Demand |    | Queues | Mocked data |
| 5 | Stock & Availability | **✓ FULL** | Stock | **Functional** |
| 6 | Communication |    | Comms | Mocked data |
| 7 | Compliance | **✓ FULL** | Compliance | **Functional** |
| 8 | Performance Insights |    | Insights | Mocked data |

## **4.2 Intelligence Layer Visibility**

| \# | Intelligence Feature | UI Element | Location |
| :---- | :---- | :---- | :---- |
| 9 | Real-Time Decision Engine | AI Suggestion Banner | Home screen (dismissible) |
| 10 | Automation & Smart Defaults | 'AI Suggested' badges | Task cards, alert feed |
| 11 | Predictive Forecasting | 'Peak expected' message | Queues pressure card |
| 12 | Prioritisation Scoring | Priority badges | All task displays |
| 13 | Intelligent Alerts | Alert feed with severity | Home screen, header badge |
| 14 | Playback & Replay | Timeline placeholder | Insights screen |
| 15 | Skills Optimisation | Skill badges on staff | Staff cards, reallocation |
| 16 | Sentiment Signals | Placeholder indicator | Insights screen |

# **5\. Android PWA Best Practices**

The PoC Brief mandates: *'Progressive Web App (PWA) — Runs on any Android device — Mobile-first, in-store usable'*. This section details implementation requirements.

**NavBar** - 64px, `bg-navy`. "PRIMARK" + "Qual.it". Right: notification bell + count badge, user name, role pill, store name, logout.

**Sidebar** - 260px on desktop, hamburger on mobile. 

## **5.1 PWA Manifest Configuration**

| Property | Value & Rationale |
| :---- | :---- |
| name | 'Primark Pulse' — Full app name for install prompts |
| short\_name | 'Pulse' — Appears under home screen icon (max 12 chars) |
| display | 'standalone' — Removes browser chrome, feels like native app |
| orientation | 'portrait' — Optimised for handheld mobile use in-store |
| theme\_color | '\#00758f' — Primark teal for Android status bar |
| background\_color | '\#f8fafc' — Light grey for splash screen background |
| icons | 192x192 \+ 512x512 PNG with maskable variants for adaptive icons |
| start\_url | '/' — Landing page after install |
| scope | '/' — Entire app within PWA scope |

## **5.2 Mobile-First Design Requirements**

1. **Touch Targets:** Minimum 44x44px for all interactive elements. Buttons, list items, and icons must be easily tappable with gloves or hurried taps.  
2. **Safe Area Handling:** Use CSS env(safe-area-inset-\*) for device notches and gesture bars. Critical: bottom nav must account for Android gesture navigation.  
3. **Bottom Navigation:** Primary nav at bottom for thumb accessibility. Maximum 5 items (Home, Staff, Tasks, Stock, Compliance). Overflow to hamburger menu.  
4. **Pull-to-Refresh:** Implement native-feeling pull-to-refresh on dashboard and list views using CSS overscroll-behavior and custom handler.  
5. **Swipe Gestures:** Horizontal swipes for secondary actions (swipe task to complete, swipe alert to dismiss).  
6. **Loading States:** Skeleton screens (grey placeholders) rather than spinners for perceived performance.  
7. **Font Sizing:** Minimum 14px body text, 12px for captions. Use rem units for accessibility scaling.

## **5.3 Service Worker & Offline Strategy**

| Feature | Offline Behaviour | Sync Strategy |
| :---- | :---- | :---- |
| Closing Checklist | Full functionality | IndexedDB storage, background sync on reconnect |
| Barcode Scanning | Scan works, lookup queued | Cache recent products, queue API calls |
| Task Updates | View & update locally | Optimistic UI, conflict resolution on sync |
| Policy Search (AI) | Unavailable message | Requires connectivity — show cached FAQs |
| Live Dashboard | Last known state | Timestamp indicator shows staleness |

## **5.4 Camera Access for Barcode Scanning**

* Use getUserMedia API with { video: { facingMode: 'environment' } } for rear camera  
* Request permissions only when scanner is first opened (not on app load) — reduces permission fatigue  
* Provide clear fallback UI if camera access is denied — offer manual barcode entry  
* Use ZXing or QuaggaJS for client-side barcode decoding — no server round-trip required

# **6\. Development Workflow & Architecture**

This section provides the recommended approach for page-by-page development whilst maintaining a scalable, coherent codebase.

## **6.1 Recommended Technology Stack**

| Layer | Technology | Rationale |
| :---- | :---- | :---- |
| Framework | Vite
| Styling | Tailwind CSS | Utility-first, mobile-responsive, small bundle, matches demo |
| State | Zustand \+ React Query | Lightweight global state, excellent caching, offline support |
| PWA | ???
| Barcode | @zxing/browser | Client-side scanning, no native dependencies, wide format support |
| Icons | Lucide React | Lightweight, consistent icon set (already in demo) |
| Forms | React Hook Form \+ Zod | Performance-focused forms, schema validation |
| Real-time | Socket.io or Supabase | WebSocket with fallback, real-time subscriptions |

## **6.2 Folder Structure**

?


## **6.3 Page-by-Page Development Order**

Recommended sequence to maximise reuse and establish patterns:

| Phase | Page | Why This Order |
| :---- | :---- | :---- |
| **1** | Shell & Navigation | Establishes layout, bottom nav, header pattern used by all pages |
| **2** | Home Dashboard | Creates MetricCard, StatusBadge, AlertFeed — reused everywhere |
| **3** | Compliance | Fully functional feature — proves real interactivity, establishes form patterns |
| **4** | Stock | Fully functional — camera integration, complex state, proves device capability |
| **5** | Tasks | Uses Task type, PriorityBadge, filter patterns — core to many views |
| **6** | Staff | Uses StaffMember type, SkillBadge — linked to Tasks via assignment |
| **7** | Queues | Builds on pressure visualisation from Home, adds manual input |
| **8** | Comms & Insights | Lower priority mockups — can be simpler as foundation is proven |

# **7\. Scalability Foundation**

To ensure the PoC can evolve into a production system, these architectural decisions should be made early.

## **7.1 Shared TypeScript Types**

Define these interfaces in /src/types/index.ts before building any pages:

// Core domain types  
interface StaffMember { id, name, zone, skills\[\], status, shift }  
interface Task { id, title, priority, status, zone, assignee, sla }  
interface Alert { id, type, message, zone, timestamp, aiGenerated }  
interface Product { barcode, name, price, category, stockLevels }  
interface ChecklistItem { id, category, item, completed, completedAt }  
interface QueueStatus { id, name, current, threshold, max, status }

## **7.2 Component Design Principles**

8. **Atomic Design:** Build atoms (Badge, Button) → molecules (MetricCard, TaskCard) → organisms (TaskList, StaffRoster) → templates (PageShell) → pages  
9. **Composition over Props:** Use children and slots rather than prop explosion. TaskCard shouldn't know about 15 variants.  
10. **Data Fetching at Page Level:** Pages fetch, components render. Keeps components pure and testable.  
11. **Colocation:** Feature-specific components live with their page until needed elsewhere, then promote to /components.  
12. **Consistent Naming:** PascalCase components, camelCase functions, kebab-case files, SCREAMING\_SNAKE constants.

## **7.3 State Management Strategy**

| State Type | Solution | Example |
| :---- | :---- | :---- |
| Server State | React Query | Tasks, staff roster, stock lookups — cached, auto-refetched |
| Global UI State | Zustand | Current user, selected store, notification preferences |
| Local UI State | useState/useReducer | Form inputs, modal open/closed, filter selections |
| Persisted State | IndexedDB (via idb) | Offline checklist progress, replenishment basket |

## **7.4 API Contract Readiness**

Even with mocked data, structure API calls as if real endpoints exist:

// /src/lib/api.ts  
export const api \= {  
  tasks: {  
    list: () \=\> fetch('/api/tasks').then(r \=\> r.json()),  
    update: (id, data) \=\> fetch(\`/api/tasks/${id}\`, {...}),  
  },  
  // ... other resources  
};

This allows seamless transition from mock data to real APIs by simply updating the fetch URLs.

## **7.5 Success Criteria Checklist**

Per the Brief's Section 8, the PoC must achieve:

* **☑ No functional themes missing from UX** — All 8 core themes \+ 8 intelligence indicators visible  
* **☑ Two themes implemented end-to-end** — Compliance (checklist \+ AI search) \+ Stock (scan \+ lookup \+ basket)  
* **☑ Intelligence layer clearly visible** — AI banners, badges, explanations throughout  
* **☑ Credible as a foundation for MVP** — Clean architecture, typed data, scalable patterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*End of Document*

Primark Pulse.ai — Technical Specification v1.0