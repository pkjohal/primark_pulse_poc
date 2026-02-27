# Architecture — Primark Pulse

**Version:** 2.0
**Date:** 2026-02-27
**Source:** Reverse-engineered from codebase

---

## 1. System Overview

Primark Pulse is a **single-page application (SPA)** delivered as a **Progressive Web App (PWA)**. It is a fully client-side React application that communicates directly with a **Supabase (PostgreSQL) backend** via the Supabase JS client. MSW (Mock Service Worker) is still initialised on startup but all custom hooks bypass it, querying Supabase directly. The app is designed to run in-store on Android mobile devices and be installable from the browser.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | 18.3.1 |
| Language | TypeScript | 5.4.3 |
| Build tool | Vite | 5.4.2 |
| Routing | React Router DOM | 6.22.3 |
| Server state | TanStack Query (React Query) | 5.28.4 |
| Global client state | Zustand | 4.5.2 |
| Styling | Tailwind CSS | 3.4.1 |
| UI components | Radix UI (shadcn/ui pattern) | Various |
| Backend / BaaS | Supabase (PostgreSQL) | 2.98.0 |
| API mocking (legacy) | Mock Service Worker (MSW) | 2.2.13 |
| PWA | vite-plugin-pwa (Workbox) | 0.19.7 |
| Barcode scanning | @zxing/browser | 0.1.5 |
| Offline storage | idb (IndexedDB) | 8.0.0 |
| Icons | Lucide React | 0.363.0 |
| Form validation | React Hook Form + Zod | 7.51.1 / 3.22.4 |

---

## 3. System Context Diagram

```mermaid
graph LR
  Manager["Store Manager"]
  FloorLead["Floor Lead"]
  Staff["Store Staff"]

  App["Primark Pulse PWA\nReact SPA on Android Browser"]
  Supabase["Supabase\nPostgreSQL + REST API"]
  LS["localStorage\nAuth + Basket state"]
  SW["Service Worker\nOffline cache + PWA install"]
  MSW["MSW Worker\nInitialised but bypassed"]

  Manager --> App
  FloorLead --> App
  Staff --> App
  App -->|"Direct table queries\nvia supabase-js"| Supabase
  Supabase -->|"JSON rows"| App
  App --> LS
  App --> SW
  App -->|"onUnhandledRequest: bypass"| MSW
```

> Note: MSW is still started in `src/main.tsx` with `onUnhandledRequest: 'bypass'`. All hooks call Supabase directly; MSW no longer intercepts any requests.

---

## 4. Component Diagram

```mermaid
graph TD
  subgraph Presentation["Presentation Layer — src/pages/"]
    Login["LoginPage\n/login"]
    Home["HomePage\n/"]
    Staff["StaffPage\n/staff"]
    Jobs["JobsPage\n/jobs"]
    Stock["StockPage\n/stock"]
    ScanStock["ScanStockPage\n/scan-stock"]
    Compliance["CompliancePage\n/compliance"]
    Queues["QueuesPage\n/queues"]
    Team["TeamPage\n/team"]
    Schedule["SchedulePage\n/schedule"]
    Insights["InsightsPage\n/insights (placeholder)"]
  end

  subgraph Shell["App Shell — src/components/templates/"]
    PageShell["PageShell\nHeader + BottomNav wrapper"]
  end

  subgraph Hooks["Custom Hooks — src/hooks/"]
    useStoreMetrics["useStoreMetrics"]
    useAlerts["useAlerts"]
    useAISuggestion["useAISuggestion"]
    useJobs["useJobs / useCreateJob /\nuseUpdateJob / useEscalateJob"]
    useStaff["useStaff"]
    useChecklists["useChecklists / useChecklistDetail /\nuseSubmitChecklistItem"]
    useProductLookup["useProductLookup"]
    useProducts["useProducts"]
    useBasket["useBasket (Zustand)"]
    useMessages["useMessages / useSendMessage /\nuseAcknowledgeMessage"]
    useSchedule["useSchedule / useOfferShift /\nuseAcceptShift"]
    useQueues["useQueues"]
    useCurrentShift["useCurrentShift"]
  end

  subgraph Stores["Global State — src/stores/"]
    authStore["authStore\nZustand + persist\nuser id, name, store_id, role"]
    uiStore["uiStore\nZustand"]
    toastStore["toastStore\nZustand"]
  end

  subgraph DataLayer["Data Layer"]
    SupabaseClient["src/lib/supabase.ts\nSupabase JS Client"]
    SupabaseDB[("Supabase\nPostgreSQL")]
  end

  subgraph MockLayer["Legacy Mock Layer — src/mocks/"]
    MSWWorker["MSW Browser Worker\n(initialised, not intercepting)"]
    Handlers["handlers.ts\n(bypassed by hooks)"]
  end

  Home --> Hooks
  Staff --> Hooks
  Jobs --> Hooks
  Stock --> Hooks
  ScanStock --> Hooks
  Compliance --> Hooks
  Queues --> Hooks
  Team --> Hooks
  Schedule --> Hooks
  Login --> SupabaseClient

  Hooks --> Stores
  Hooks --> SupabaseClient
  SupabaseClient --> SupabaseDB
  PageShell --> Shell
```

---

## 5. Key Modules

| Module | Location | Responsibility |
|--------|----------|----------------|
| App Router | `src/App.tsx` | Route definitions, protected route guard, lazy loading |
| App Bootstrap | `src/main.tsx` | React Query setup, MSW initialisation, React DOM mount |
| Supabase Client | `src/lib/supabase.ts` | Supabase JS client initialised with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| PageShell | `src/components/templates/PageShell/` | Header + BottomNav layout wrapper for all authenticated pages |
| Auth Store | `src/stores/authStore.ts` | Zustand store; persists `id`, `name`, `store`, `store_id`, `role` to localStorage |
| UI Store | `src/stores/uiStore.ts` | Zustand store; active nav, notification count, modal state |
| Basket Store | `src/hooks/useBasket.ts` | Zustand + persist; replenishment basket persisted to localStorage |
| Type Definitions | `src/types/index.ts` | All shared TypeScript interfaces and enums |
| DB Schema | `supabase/schema.sql` | Full PostgreSQL schema + seed data for Supabase |
| Home Page | `src/pages/Home/` | Live dashboard: metrics, AI banner / shift banner, queue summary |
| Jobs Page | `src/pages/Jobs/` | Job list, SLA timers, assignment, escalation, job creation |
| Stock Page | `src/pages/Stock/` | Barcode scan/manual entry, product lookup, basket, issue reporting |
| ScanStock Page | `src/pages/ScanStock/` | Dedicated rapid-scan view (no basket/product details layout) |
| Compliance Page | `src/pages/Compliance/` | Enhanced checklists, policy search, incident reporting |
| Staff Page | `src/pages/Staff/` | Roster, zone filters, reallocation, staff detail |
| Team Page | `src/pages/Team/` | Messaging, acknowledgment tracking, compose |
| Schedule Page | `src/pages/Schedule/` | Weekly shift view, shift swap offer/accept |
| Queues Page | `src/pages/Queues/` | Queue monitoring, store pressure indicator |

---

## 6. Data Flow — Barcode Stock Lookup (Supabase)

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant UI as StockPage
  participant Scanner as BarcodeScanner
  participant Hook as useProductLookup
  participant SB as Supabase
  participant Cache as React Query Cache

  User->>UI: Opens Stock page
  UI->>Scanner: Renders camera view
  User->>Scanner: Points camera at barcode
  Scanner->>UI: onScan(barcode) via @zxing/browser
  UI->>Hook: useProductLookup(barcode)
  Hook->>Cache: Check cache for ['product', barcode]
  alt Cache miss
    Hook->>SB: SELECT * FROM products WHERE barcode = ?
    SB-->>Hook: Product row
    Hook->>SB: SELECT store_stock, nearby_stock, dc_stock FROM stock_levels
    Hook->>SB: SELECT size, color, quantity, sku FROM stock_variants
    Hook->>SB: SELECT zone, aisle, bay, shelf FROM stock_locations
    SB-->>Hook: Combined product data
    Hook-->>Cache: Store result (5 min staleTime)
  end
  Hook-->>UI: Product object with stock levels
  UI-->>User: ProductCard rendered

  User->>UI: Adjusts quantity, taps "Add to Basket"
  UI->>Hook: useBasket.addItem(product, qty)
  Hook->>Hook: Merge or add to localStorage basket
  UI-->>User: Basket count updates
```

---

## 7. Data Flow — Checklist Completion (Supabase)

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant UI as CompliancePage
  participant Hooks as useChecklists
  participant SB as Supabase
  participant Cache as React Query Cache

  User->>UI: Opens Compliance, views checklists
  UI->>Hooks: useChecklists()
  Hooks->>SB: SELECT from checklists + sections + items + responses
  SB-->>Hooks: ChecklistSummary[] with progress counts
  UI-->>User: Checklist list with progress bars

  User->>UI: Taps a checklist to open
  UI->>Hooks: useStartChecklist(id)
  Hooks->>SB: UPDATE checklists SET status='in-progress'
  SB-->>Hooks: OK

  loop For each checklist item
    User->>UI: Ticks item / enters value / captures photo
    UI->>Hooks: useSubmitChecklistItem({ itemId, response })
    Hooks->>Cache: Optimistic update (immediate UI change)
    Hooks->>SB: UPSERT checklist_responses
    alt Success
      SB-->>Hooks: OK
      Hooks->>Cache: Invalidate + refetch
    else Failure
      Hooks->>Cache: Rollback to previous state
    end
  end

  User->>UI: Taps "Complete Checklist" + signs
  UI->>Hooks: useCompleteChecklist({ checklistId, signature })
  Hooks->>SB: UPDATE checklists SET status='completed', signature_data=...
  SB-->>Hooks: OK
  UI-->>User: Completion success sheet shown
```

---

## 8. Authentication and Authorisation

**Mechanism:** Three-step PIN-based login using Supabase for store and user lookup. No Supabase Auth is used — identity is stored only in the Zustand auth store.

**Flow:**
1. User visits `/login`; app fetches active stores from `locations` table via Supabase
2. User selects their store; app fetches active users for that store from `users` table
3. User selects their name; app shows a 4-digit PIN pad
4. On 4th digit entered, app fetches `pin` from `users` for the selected user and compares in-browser
5. On match, `setAuth({ id, name, store, store_id, role }, token)` is called on the Zustand `authStore`
6. Auth state is persisted to `localStorage` under key `primark-pulse-auth` (version 1)
7. All routes except `/login` are wrapped in `ProtectedRoute` (`src/App.tsx:23`) which redirects to `/login` if `isAuthenticated` is false

**Roles defined:** `staff` | `floor-lead` | `manager`

> Note: Role-based access control (RBAC) is declared in types but **not enforced** in routing or component logic. All authenticated users have access to all pages. PIN codes are stored as plain text — this is acceptable for PoC only.

---

## 9. Deployment and Infrastructure

**Build:** `tsc -b && vite build` compiles TypeScript and bundles via Vite with tree-shaking and code splitting.

**Environment variables required:**
```
VITE_SUPABASE_URL=<supabase project url>
VITE_SUPABASE_ANON_KEY=<supabase anon key>
```

**Database:** `supabase/schema.sql` contains the full DDL and seed data. Run this in the Supabase SQL editor to initialise the database. All tables have Row Level Security **disabled** for the PoC.

**PWA Configuration** (`vite.config.ts`):
- `registerType: 'autoUpdate'` — service worker updates automatically in background
- `display: 'standalone'` — removes browser chrome; feels native on Android
- `theme_color: '#00758f'` — Primark teal in Android status bar
- `orientation: 'portrait'` — locked to portrait for in-store handheld use
- **Workbox runtime caching:** `NetworkFirst` strategy for `/api/*` URLs with 24-hour cache, 100-entry limit

**Dev server:** Runs on port 3000, accessible on all network interfaces (`host: true`) for mobile device testing on local network.

**Path aliases:** `@/` maps to `src/` for all imports.

**Hosting:** Not identifiable from codebase — no deployment config files present.
