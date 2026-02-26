-- ============================================================
-- Primark Pulse — Supabase Schema + Seed Data
-- Run this in the Supabase SQL editor
-- ============================================================

-- ============================================================
-- DISABLE ROW LEVEL SECURITY (PoC — allows anon key to read)
-- If tables already exist, run this block first on its own.
-- ============================================================
DO $$ DECLARE t TEXT; BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(t) || ' DISABLE ROW LEVEL SECURITY';
  END LOOP;
END $$;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS locations (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  store_id    TEXT NOT NULL REFERENCES locations(id),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('staff', 'floor-lead', 'manager')),
  pin         TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zones (
  id          TEXT PRIMARY KEY,
  store_id    TEXT NOT NULL REFERENCES locations(id),
  name        TEXT NOT NULL,
  type        TEXT
);

CREATE TABLE IF NOT EXISTS staff_members (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  store_id    TEXT NOT NULL REFERENCES locations(id),
  zone_id     TEXT REFERENCES zones(id),
  status      TEXT NOT NULL CHECK (status IN ('active', 'break', 'absent')),
  skills      TEXT[] NOT NULL DEFAULT '{}',
  shift_start TEXT,
  shift_end   TEXT
);

CREATE TABLE IF NOT EXISTS jobs (
  id               TEXT PRIMARY KEY,
  store_id         TEXT NOT NULL REFERENCES locations(id),
  title            TEXT NOT NULL,
  description      TEXT,
  priority         TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  status           TEXT NOT NULL CHECK (status IN ('unassigned', 'pending', 'in-progress', 'complete', 'escalated')),
  zone_id          TEXT REFERENCES zones(id),
  assignee_id      TEXT REFERENCES staff_members(id),
  sla_minutes      INTEGER NOT NULL,
  ai_suggested     BOOLEAN NOT NULL DEFAULT false,
  why_it_matters   TEXT,
  success_criteria TEXT[] DEFAULT '{}',
  peer_tip_store   TEXT,
  peer_tip_text    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  completed_in     INTEGER
);

CREATE TABLE IF NOT EXISTS escalations (
  id            TEXT PRIMARY KEY,
  job_id        TEXT NOT NULL REFERENCES jobs(id),
  escalated_by  TEXT,
  reason        TEXT,
  notes         TEXT,
  escalated_to  TEXT,
  status        TEXT,
  escalated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id           TEXT PRIMARY KEY,
  store_id     TEXT NOT NULL REFERENCES locations(id),
  title        TEXT NOT NULL,
  description  TEXT,
  priority     TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  status       TEXT NOT NULL CHECK (status IN ('unassigned', 'pending', 'in-progress', 'complete')),
  zone_id      TEXT REFERENCES zones(id),
  assignee_id  TEXT REFERENCES staff_members(id),
  sla_minutes  INTEGER NOT NULL,
  ai_suggested BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  completed_in INTEGER
);

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  barcode       TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  price         NUMERIC(10,2) NOT NULL,
  category      TEXT,
  subcategory   TEXT,
  size          TEXT,
  color         TEXT,
  click_collect BOOLEAN NOT NULL DEFAULT false,
  image_url     TEXT
);

CREATE TABLE IF NOT EXISTS stock_levels (
  id            TEXT PRIMARY KEY,
  product_id    TEXT NOT NULL REFERENCES products(id),
  store_id      TEXT NOT NULL REFERENCES locations(id),
  store_stock   INTEGER NOT NULL DEFAULT 0,
  nearby_stock  INTEGER NOT NULL DEFAULT 0,
  dc_stock      INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_variants (
  id         TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  size       TEXT,
  color      TEXT,
  quantity   INTEGER NOT NULL DEFAULT 0,
  sku        TEXT
);

CREATE TABLE IF NOT EXISTS stock_locations (
  id         TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  store_id   TEXT NOT NULL REFERENCES locations(id),
  zone       TEXT,
  aisle      TEXT,
  bay        TEXT,
  shelf      TEXT
);

CREATE TABLE IF NOT EXISTS stock_issues (
  id           TEXT PRIMARY KEY,
  product_id   TEXT NOT NULL REFERENCES products(id),
  store_id     TEXT NOT NULL REFERENCES locations(id),
  issue_type   TEXT,
  notes        TEXT,
  reported_by  TEXT,
  zone_id      TEXT REFERENCES zones(id),
  status       TEXT NOT NULL DEFAULT 'open',
  reported_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS replenishment_baskets (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES users(id),
  store_id   TEXT NOT NULL REFERENCES locations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS replenishment_basket_items (
  id         TEXT PRIMARY KEY,
  basket_id  TEXT NOT NULL REFERENCES replenishment_baskets(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL DEFAULT 1,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checklists (
  id             TEXT PRIMARY KEY,
  store_id       TEXT NOT NULL REFERENCES locations(id),
  type           TEXT NOT NULL CHECK (type IN ('opening', 'closing', 'safety', 'custom')),
  name           TEXT NOT NULL,
  description    TEXT,
  scheduled_for  TEXT,
  status         TEXT NOT NULL CHECK (status IN ('not-started', 'in-progress', 'completed')),
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  completed_by   TEXT,
  signature_data TEXT
);

CREATE TABLE IF NOT EXISTS checklist_sections (
  id           TEXT PRIMARY KEY,
  checklist_id TEXT NOT NULL REFERENCES checklists(id),
  name         TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id            TEXT PRIMARY KEY,
  section_id    TEXT NOT NULL REFERENCES checklist_sections(id),
  category      TEXT NOT NULL,
  item          TEXT NOT NULL,
  description   TEXT,
  input_type    TEXT NOT NULL CHECK (input_type IN ('boolean', 'numeric', 'text', 'photo')),
  required      BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  numeric_min   NUMERIC,
  numeric_max   NUMERIC,
  numeric_unit  TEXT
);

CREATE TABLE IF NOT EXISTS checklist_responses (
  id           TEXT PRIMARY KEY,
  item_id      TEXT NOT NULL REFERENCES checklist_items(id),
  user_id      TEXT REFERENCES users(id),
  value_bool   BOOLEAN,
  value_numeric NUMERIC,
  value_text   TEXT,
  photo_url    TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes        TEXT
);

CREATE TABLE IF NOT EXISTS flagged_issues (
  id          TEXT PRIMARY KEY,
  item_id     TEXT NOT NULL REFERENCES checklist_items(id),
  description TEXT NOT NULL,
  severity    TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  photo_url   TEXT,
  flagged_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  flagged_by  TEXT,
  status      TEXT NOT NULL DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS incident_reports (
  id                 TEXT PRIMARY KEY,
  store_id           TEXT NOT NULL REFERENCES locations(id),
  type               TEXT NOT NULL,
  location           TEXT,
  occurred_at        TIMESTAMPTZ,
  reported_by        TEXT,
  description        TEXT,
  severity           TEXT,
  status             TEXT NOT NULL DEFAULT 'open',
  follow_up_required BOOLEAN NOT NULL DEFAULT false,
  witnesses          TEXT[],
  photo_url          TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id                     TEXT PRIMARY KEY,
  store_id               TEXT NOT NULL REFERENCES locations(id),
  type                   TEXT NOT NULL CHECK (type IN ('announcement', 'update', 'alert', 'chat')),
  scope                  TEXT NOT NULL CHECK (scope IN ('store', 'zone', 'role', 'job')),
  priority               TEXT NOT NULL CHECK (priority IN ('critical', 'normal', 'low')),
  title                  TEXT,
  body                   TEXT NOT NULL,
  target_zones           TEXT[],
  target_roles           TEXT[],
  linked_job_id          TEXT,
  sender_id              TEXT REFERENCES users(id),
  sent_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at             TIMESTAMPTZ,
  requires_acknowledgment BOOLEAN NOT NULL DEFAULT false,
  total_recipients       INTEGER,
  has_photo              BOOLEAN NOT NULL DEFAULT false,
  photo_url              TEXT
);

CREATE TABLE IF NOT EXISTS message_acknowledgments (
  id              TEXT PRIMARY KEY,
  message_id      TEXT NOT NULL REFERENCES messages(id),
  user_id         TEXT NOT NULL REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
  read        BOOLEAN NOT NULL DEFAULT false,
  action_path TEXT
);

CREATE TABLE IF NOT EXISTS shifts (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES users(id),
  store_id            TEXT NOT NULL REFERENCES locations(id),
  date                TEXT NOT NULL,
  start_time          TEXT NOT NULL,
  end_time            TEXT NOT NULL,
  break_start         TEXT,
  break_duration_mins INTEGER,
  zone_id             TEXT REFERENCES zones(id),
  role                TEXT,
  status              TEXT NOT NULL CHECK (status IN ('confirmed', 'pending-swap', 'available')),
  offered_by          TEXT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS shift_swap_requests (
  id           TEXT PRIMARY KEY,
  shift_id     TEXT NOT NULL REFERENCES shifts(id),
  requester_id TEXT NOT NULL REFERENCES users(id),
  reason       TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queue_statuses (
  id            TEXT PRIMARY KEY,
  store_id      TEXT NOT NULL REFERENCES locations(id),
  name          TEXT NOT NULL,
  current_count INTEGER NOT NULL DEFAULT 0,
  threshold     INTEGER NOT NULL DEFAULT 10,
  max_count     INTEGER NOT NULL DEFAULT 20,
  status        TEXT NOT NULL CHECK (status IN ('normal', 'over-threshold', 'critical')),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_pressure (
  id             TEXT PRIMARY KEY,
  store_id       TEXT NOT NULL REFERENCES locations(id),
  level          TEXT NOT NULL CHECK (level IN ('low', 'medium', 'high', 'critical')),
  peak_forecast  TEXT,
  suggested_task TEXT,
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id           TEXT PRIMARY KEY,
  store_id     TEXT NOT NULL REFERENCES locations(id),
  type         TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info')),
  message      TEXT NOT NULL,
  zone_id      TEXT REFERENCES zones(id),
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  dismissed    BOOLEAN NOT NULL DEFAULT false,
  dismissed_by TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_suggestions (
  id              TEXT PRIMARY KEY,
  store_id        TEXT NOT NULL REFERENCES locations(id),
  suggestion_text TEXT NOT NULL,
  explanation     TEXT,
  primary_action  TEXT,
  action_path     TEXT,
  dismissible     BOOLEAN NOT NULL DEFAULT true,
  dismissed_by    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_metrics (
  id                  TEXT PRIMARY KEY,
  store_id            TEXT NOT NULL REFERENCES locations(id),
  store_status        TEXT NOT NULL CHECK (store_status IN ('green', 'amber', 'red')),
  staff_active        INTEGER NOT NULL DEFAULT 0,
  staff_total         INTEGER NOT NULL DEFAULT 0,
  tills_open          INTEGER NOT NULL DEFAULT 0,
  tills_total         INTEGER NOT NULL DEFAULT 0,
  open_tasks          INTEGER NOT NULL DEFAULT 0,
  critical_tasks      INTEGER NOT NULL DEFAULT 0,
  compliance_progress INTEGER NOT NULL DEFAULT 0,
  recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Stores
INSERT INTO locations (id, name, is_active) VALUES
  ('store-1', 'Birmingham Bull Ring', true),
  ('store-2', 'London Oxford Street', true),
  ('store-3', 'Manchester Arndale', true),
  ('store-4', 'Leeds White Rose', true)
ON CONFLICT (id) DO NOTHING;

-- Users (PIN is plain text for PoC)
INSERT INTO users (id, store_id, name, role, pin, is_active) VALUES
  ('user-1', 'store-1', 'Alex Thompson',  'floor-lead', '1234', true),
  ('user-2', 'store-1', 'Jamie Collins',  'staff',      '1234', true),
  ('user-3', 'store-1', 'Sarah Mitchell', 'manager',    '1234', true),
  ('user-4', 'store-2', 'Chris Patel',    'staff',      '1234', true),
  ('user-5', 'store-2', 'Emma Davies',    'floor-lead', '1234', true),
  ('user-6',  'store-3', 'Marcus Johnson', 'staff',      '1234', true),
  ('user-7',  'store-3', 'Priya Shah',     'manager',    '1234', true),
  ('user-8',  'store-4', 'Tom Williams',   'floor-lead', '1234', true),
  ('user-9',  'store-4', 'Lisa Brown',     'staff',      '1234', true),
  -- Birmingham shop-floor staff (linked to staff-3 through staff-10)
  ('user-11', 'store-1', 'Priya Shah',     'staff',      '1234', true),
  ('user-12', 'store-1', 'Tom Clarke',     'staff',      '1234', true),
  ('user-13', 'store-1', 'Lena Walker',    'staff',      '1234', true),
  ('user-14', 'store-1', 'Marcus Green',   'staff',      '1234', true),
  ('user-15', 'store-1', 'Sophie Turner',  'staff',      '1234', true),
  ('user-16', 'store-1', 'Ryan Patel',     'staff',      '1234', true),
  ('user-17', 'store-1', 'Olivia Brown',   'staff',      '1234', true),
  ('user-18', 'store-1', 'Jack Wilson',    'staff',      '1234', true)
ON CONFLICT (id) DO NOTHING;

-- Zones (for store-1)
INSERT INTO zones (id, store_id, name, type) VALUES
  ('zone-main-tills',    'store-1', 'Main Tills',    'service'),
  ('zone-stockroom',     'store-1', 'Stockroom',     'stock'),
  ('zone-womenswear',    'store-1', 'Womenswear',    'retail'),
  ('zone-menswear',      'store-1', 'Menswear',      'retail'),
  ('zone-childrenswear', 'store-1', 'Childrenswear', 'retail'),
  ('zone-fitting-rooms', 'store-1', 'Fitting Rooms', 'service'),
  ('zone-home',          'store-1', 'Home',          'retail'),
  ('zone-entrance',      'store-1', 'Entrance',      'entrance')
ON CONFLICT (id) DO NOTHING;

-- Staff members (store-1)
INSERT INTO staff_members (id, user_id, store_id, zone_id, status, skills, shift_start, shift_end) VALUES
  ('staff-1', 'user-1', 'store-1', 'zone-main-tills',    'active', ARRAY['Till Trained','Supervisor','First Aid'],          '09:00', '17:30'),
  ('staff-2', 'user-2', 'store-1', 'zone-stockroom',     'active', ARRAY['Stock Management','Forklift'],                    '06:00', '14:30'),
  ('staff-3', 'user-11','store-1', 'zone-womenswear',    'active', ARRAY['Visual Merchandising','Till Trained'],             '10:00', '18:30'),
  ('staff-4', 'user-12','store-1', 'zone-menswear',      'break',  ARRAY['Till Trained','Customer Service'],                 '08:00', '16:30'),
  ('staff-5', 'user-13','store-1', 'zone-fitting-rooms', 'active', ARRAY['Fitting Room','Security Aware'],                   '11:00', '19:30'),
  ('staff-6', 'user-14','store-1', 'zone-main-tills',    'active', ARRAY['Till Trained','Cash Office'],                     '09:00', '17:30'),
  ('staff-7', 'user-15','store-1', 'zone-childrenswear', 'active', ARRAY['Till Trained','Visual Merchandising'],             '10:00', '18:30'),
  ('staff-8', 'user-16','store-1', 'zone-stockroom',     'active', ARRAY['Stock Management','Delivery'],                    '05:00', '13:30'),
  ('staff-9', 'user-17','store-1', 'zone-entrance',      'active', ARRAY['Security Aware','Customer Service'],              '09:00', '17:30'),
  ('staff-10','user-18','store-1', 'zone-home',          'absent', ARRAY['Till Trained','Heavy Lifting'],                   '08:00', '16:30')
ON CONFLICT (id) DO NOTHING;

-- Jobs (store-1)
INSERT INTO jobs (id, store_id, title, priority, status, zone_id, assignee_id, sla_minutes, ai_suggested, why_it_matters, success_criteria, peer_tip_store, peer_tip_text, created_at, started_at, completed_at, completed_in) VALUES
  ('job-1', 'store-1', 'Restock jeans wall - Slim Fit range',   'CRITICAL', 'unassigned', 'zone-menswear',      NULL,       15,  true,  'Size 10 & 12 are our most-asked-for — customers keep leaving empty-handed',                     ARRAY['All sizes back on the wall','Folded to visual merchandising standard','Price tickets visible'],     'Store 42', 'We moved size 14s to eye-level — much easier for customers to find',          now() - interval '10 minutes', NULL,                         NULL,                         NULL),
  ('job-2', 'store-1', 'Clear fitting room backlog',            'HIGH',     'in-progress','zone-fitting-rooms', 'staff-5',  30,  false, 'Queue is building up — customers waiting to try things on',                                        ARRAY['All items returned to correct departments','Fitting rooms ready for next customers','Hangers sorted and restocked'], NULL,       NULL,                                                                    now() - interval '25 minutes', now() - interval '15 minutes', NULL,                         NULL),
  ('job-3', 'store-1', 'Replace faulty till roll - Till 4',     'MEDIUM',   'pending',    'zone-main-tills',    'staff-1',  45,  false, 'Till 4 can''t print receipts — customers asking for them',                                         ARRAY['New roll installed','Test receipt printed','Till back in service'],                                  'Store 18', 'Keep a spare roll under each till — saves walking to stockroom',            now() - interval '5 minutes',  NULL,                         NULL,                         NULL),
  ('job-4', 'store-1', 'Process delivery - Womenswear',         'HIGH',     'in-progress','zone-stockroom',     'staff-2',  60,  false, 'New stock for the weekend rush — needs to be on floor before Saturday',                            ARRAY['All boxes opened and sorted','Items allocated to correct zones','Delivery paperwork signed off'],  NULL,       NULL,                                                                    now() - interval '45 minutes', now() - interval '40 minutes', NULL,                         NULL),
  ('job-5', 'store-1', 'VM refresh - Front window display',     'LOW',      'pending',    'zone-entrance',      'staff-3',  120, false, 'Current display is a week old — time for something fresh',                                         ARRAY['New outfits styled on mannequins','Lighting adjusted','Props positioned per VM guide'],            NULL,       NULL,                                                                    now() - interval '2 hours',    NULL,                         NULL,                         NULL),
  ('job-6', 'store-1', 'Security tag check - High-value items', 'CRITICAL', 'unassigned', 'zone-womenswear',    NULL,       20,  true,  'Some coats on the rail are missing tags — easy target for theft',                                  ARRAY['All coats checked for security tags','Missing tags replaced','Report any damaged items'],           'Store 31', 'Start from the back of the rail — that''s where tags get missed most',     now() - interval '3 minutes',  NULL,                         NULL,                         NULL),
  ('job-7', 'store-1', 'Help customer with complaint',          'HIGH',     'pending',    'zone-main-tills',    'staff-1',  15,  false, 'Customer has been waiting — they''re not happy about a faulty zip',                               ARRAY['Listen to the customer''s issue','Offer exchange or refund','Log the complaint if needed'],         NULL,       NULL,                                                                    now() - interval '8 minutes',  NULL,                         NULL,                         NULL),
  ('job-8', 'store-1', 'Replenish carrier bags',                'MEDIUM',   'complete',   'zone-main-tills',    'staff-6',  30,  false, 'Running low at all tills — busy period coming up',                                                 ARRAY['All sizes restocked at each till','Backup stock brought from stockroom'],                           NULL,       NULL,                                                                    now() - interval '60 minutes', NULL,                         now() - interval '45 minutes', 12),
  ('job-9', 'store-1', 'Tidy kidswear tables',                  'MEDIUM',   'unassigned', 'zone-childrenswear', NULL,       25,  true,  'Tables are a mess after the school-run rush — hard for customers to find sizes',                   ARRAY['All items refolded','Sizes grouped together','Signage visible'],                                    'Store 27', 'Put smallest sizes at the front — parents grab those first',              now() - interval '15 minutes', NULL,                         NULL,                         NULL),
  ('job-10','store-1', 'Restock beauty testers',                'LOW',      'pending',    NULL,                 'staff-4',  45,  false, 'Popular testers are empty — customers want to try before they buy',                               ARRAY['Check all tester units','Replace empty or damaged testers','Clean display area'],                   NULL,       NULL,                                                                    now() - interval '30 minutes', NULL,                         NULL,                         NULL)
ON CONFLICT (id) DO NOTHING;

-- Tasks (store-1)
INSERT INTO tasks (id, store_id, title, priority, status, zone_id, assignee_id, sla_minutes, ai_suggested, created_at, completed_at, completed_in) VALUES
  ('task-1', 'store-1', 'Restock jeans wall - Slim Fit range low',    'CRITICAL', 'unassigned', 'zone-menswear',      NULL,      15,  true,  now() - interval '10 minutes', NULL,                         NULL),
  ('task-2', 'store-1', 'Clear fitting room backlog',                  'HIGH',     'in-progress','zone-fitting-rooms', 'staff-5', 30,  false, now() - interval '25 minutes', NULL,                         NULL),
  ('task-3', 'store-1', 'Replace faulty till roll - Till 4',           'MEDIUM',   'pending',    'zone-main-tills',    'staff-1', 45,  false, now() - interval '5 minutes',  NULL,                         NULL),
  ('task-4', 'store-1', 'Process delivery - Womenswear allocation',    'HIGH',     'in-progress','zone-stockroom',     'staff-2', 60,  false, now() - interval '45 minutes', NULL,                         NULL),
  ('task-5', 'store-1', 'VM refresh - Front window display',           'LOW',      'pending',    'zone-entrance',      'staff-3', 120, false, now() - interval '2 hours',    NULL,                         NULL),
  ('task-6', 'store-1', 'Security tag check - High-value items',       'CRITICAL', 'unassigned', 'zone-womenswear',    NULL,      20,  true,  now() - interval '3 minutes',  NULL,                         NULL),
  ('task-7', 'store-1', 'Customer complaint - Product quality',        'HIGH',     'pending',    'zone-main-tills',    'staff-1', 15,  false, now() - interval '8 minutes',  NULL,                         NULL),
  ('task-8', 'store-1', 'Replenish carrier bags',                      'MEDIUM',   'complete',   'zone-main-tills',    'staff-6', 30,  false, now() - interval '60 minutes', now() - interval '45 minutes', 12)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, barcode, name, price, category, subcategory, size, color, click_collect) VALUES
  ('prod-1', '5054108123456', 'Slim Fit Stretch Jeans',    17.00, 'Menswear',      'Denim',      '32W 32L',   'Dark Blue',          true),
  ('prod-2', '5054108234567', 'Oversized Hoodie',          14.00, 'Womenswear',    'Tops',       'M',         'Grey Marl',          true),
  ('prod-3', '5054108345678', 'Kids Character T-Shirt',    6.00,  'Childrenswear', 'Tops',       '5-6 Years', 'Navy',               false),
  ('prod-4', '5054108456789', 'Leather-Look Belt',         4.50,  'Accessories',   'Belts',      'M/L',       'Black',              true),
  ('prod-5', '5054108567890', 'Fleece Throw Blanket',      8.00,  'Home',          'Bedding',    '150x200cm', 'Cream',              true),
  ('prod-6', '5054108678901', 'High-Waisted Leggings',     9.00,  'Womenswear',    'Activewear', 'S',         'Black',              true),
  ('prod-7', '5054108789012', 'Chunky Knit Cardigan',      20.00, 'Womenswear',    'Knitwear',   'L',         'Oatmeal',            true),
  ('prod-8', '5054108890123', 'Basic Cotton T-Shirt 3-Pack',10.00,'Menswear',      'Basics',     'XL',        'White/Grey/Black',   true)
ON CONFLICT (id) DO NOTHING;

-- Stock levels
INSERT INTO stock_levels (id, product_id, store_id, store_stock, nearby_stock, dc_stock) VALUES
  ('sl-1', 'prod-1', 'store-1', 18,  45,  450),
  ('sl-2', 'prod-2', 'store-1', 24,  56,  890),
  ('sl-3', 'prod-3', 'store-1', 0,   5,   234),
  ('sl-4', 'prod-4', 'store-1', 15,  42,  1200),
  ('sl-5', 'prod-5', 'store-1', 4,   18,  560),
  ('sl-6', 'prod-6', 'store-1', 32,  67,  2100),
  ('sl-7', 'prod-7', 'store-1', 5,   8,   145),
  ('sl-8', 'prod-8', 'store-1', 18,  35,  980)
ON CONFLICT (id) DO NOTHING;

-- Stock variants
INSERT INTO stock_variants (id, product_id, size, color, quantity, sku) VALUES
  ('sv-1-1', 'prod-1', '30W 30L', 'Dark Blue', 5, 'JN-DB-3030'),
  ('sv-1-2', 'prod-1', '32W 32L', 'Dark Blue', 3, 'JN-DB-3232'),
  ('sv-1-3', 'prod-1', '34W 32L', 'Dark Blue', 0, 'JN-DB-3432'),
  ('sv-1-4', 'prod-1', '30W 30L', 'Black',     4, 'JN-BK-3030'),
  ('sv-1-5', 'prod-1', '32W 32L', 'Black',     6, 'JN-BK-3232'),
  ('sv-1-6', 'prod-1', '34W 32L', 'Black',     0, 'JN-BK-3432'),
  ('sv-2-1', 'prod-2', 'XS',      'Grey Marl', 2, 'HD-GM-XS'),
  ('sv-2-2', 'prod-2', 'S',       'Grey Marl', 5, 'HD-GM-S'),
  ('sv-2-3', 'prod-2', 'M',       'Grey Marl', 8, 'HD-GM-M'),
  ('sv-2-4', 'prod-2', 'L',       'Grey Marl', 4, 'HD-GM-L'),
  ('sv-2-5', 'prod-2', 'XL',      'Grey Marl', 0, 'HD-GM-XL'),
  ('sv-3-1', 'prod-3', '3-4 Years','Navy',      0, 'KT-NV-34'),
  ('sv-3-2', 'prod-3', '5-6 Years','Navy',      0, 'KT-NV-56'),
  ('sv-3-3', 'prod-3', '7-8 Years','Navy',      0, 'KT-NV-78'),
  ('sv-4-1', 'prod-4', 'S/M',     'Black',     8, 'BT-BK-SM'),
  ('sv-4-2', 'prod-4', 'M/L',     'Black',     5, 'BT-BK-ML'),
  ('sv-4-3', 'prod-4', 'L/XL',    'Black',     2, 'BT-BK-LX'),
  ('sv-5-1', 'prod-5', '150x200cm','Cream',     4, 'BL-CR-150'),
  ('sv-5-2', 'prod-5', '150x200cm','Grey',      2, 'BL-GY-150'),
  ('sv-5-3', 'prod-5', '150x200cm','Navy',      1, 'BL-NV-150'),
  ('sv-6-1', 'prod-6', 'XS',      'Black',     4, 'LG-BK-XS'),
  ('sv-6-2', 'prod-6', 'S',       'Black',     8, 'LG-BK-S'),
  ('sv-6-3', 'prod-6', 'M',       'Black',     12,'LG-BK-M'),
  ('sv-6-4', 'prod-6', 'L',       'Black',     6, 'LG-BK-L'),
  ('sv-6-5', 'prod-6', 'XL',      'Black',     2, 'LG-BK-XL'),
  ('sv-7-1', 'prod-7', 'S',       'Oatmeal',   1, 'CD-OT-S'),
  ('sv-7-2', 'prod-7', 'M',       'Oatmeal',   2, 'CD-OT-M'),
  ('sv-7-3', 'prod-7', 'L',       'Oatmeal',   2, 'CD-OT-L'),
  ('sv-8-1', 'prod-8', 'S',       'Multi',     3, 'TS-MU-S'),
  ('sv-8-2', 'prod-8', 'M',       'Multi',     6, 'TS-MU-M'),
  ('sv-8-3', 'prod-8', 'L',       'Multi',     5, 'TS-MU-L'),
  ('sv-8-4', 'prod-8', 'XL',      'Multi',     4, 'TS-MU-XL')
ON CONFLICT (id) DO NOTHING;

-- Stock locations
INSERT INTO stock_locations (id, product_id, store_id, zone, aisle, bay, shelf) VALUES
  ('loc-1', 'prod-1', 'store-1', 'A', '12', '3', 'Middle'),
  ('loc-2', 'prod-2', 'store-1', 'B', '5',  '7', 'Top'),
  ('loc-3', 'prod-3', 'store-1', 'C', '2',  '1', 'Bottom'),
  ('loc-4', 'prod-4', 'store-1', 'A', '8',  '2', NULL),
  ('loc-5', 'prod-5', 'store-1', 'D', '3',  '5', 'Top'),
  ('loc-6', 'prod-6', 'store-1', 'B', '9',  '4', 'Middle'),
  ('loc-7', 'prod-7', 'store-1', 'B', '6',  '2', 'Top'),
  ('loc-8', 'prod-8', 'store-1', 'A', '4',  '6', 'Bottom')
ON CONFLICT (id) DO NOTHING;

-- Queue statuses (store-1)
INSERT INTO queue_statuses (id, store_id, name, current_count, threshold, max_count, status) VALUES
  ('queue-1', 'store-1', 'Main Tills',       8,  10, 20, 'normal'),
  ('queue-2', 'store-1', 'Fitting Rooms',    12, 8,  15, 'over-threshold'),
  ('queue-3', 'store-1', 'Customer Service', 2,  5,  10, 'normal'),
  ('queue-4', 'store-1', 'Click & Collect',  4,  6,  10, 'normal')
ON CONFLICT (id) DO NOTHING;

-- Store pressure (store-1)
INSERT INTO store_pressure (id, store_id, level, peak_forecast, suggested_task) VALUES
  ('pressure-1', 'store-1', 'medium', 'Peak expected in 45 mins (lunch rush)', 'Consider opening additional tills')
ON CONFLICT (id) DO NOTHING;

-- Alerts (store-1)
INSERT INTO alerts (id, store_id, type, message, zone_id, ai_generated, dismissed, created_at) VALUES
  ('alert-1', 'store-1', 'critical', 'Till 7 has been down for 15 minutes',      'zone-main-tills',    false, false, now() - interval '2 minutes'),
  ('alert-2', 'store-1', 'warning',  'Fitting room queue exceeds threshold',      'zone-fitting-rooms', true,  false, now() - interval '5 minutes'),
  ('alert-3', 'store-1', 'info',     'Delivery received: 45 cartons processed',   'zone-stockroom',     false, false, now() - interval '12 minutes'),
  ('alert-4', 'store-1', 'warning',  'Break coverage needed in 10 minutes',       'zone-menswear',      true,  false, now() - interval '18 minutes')
ON CONFLICT (id) DO NOTHING;

-- AI suggestions (store-1)
INSERT INTO ai_suggestions (id, store_id, suggestion_text, explanation, primary_action, action_path, dismissible, created_at) VALUES
  ('suggestion-1', 'store-1',
   'Move 2 staff from Stockroom to Main Tills',
   'Queue pressure is building at main tills (8 customers waiting) while stockroom is fully staffed. Reallocating Sarah M. and James K. could reduce wait times by ~3 minutes.',
   'Reallocate Staff', '/staff', true, now())
ON CONFLICT (id) DO NOTHING;

-- Store metrics (store-1)
INSERT INTO store_metrics (id, store_id, store_status, staff_active, staff_total, tills_open, tills_total, open_tasks, critical_tasks, compliance_progress, recorded_at) VALUES
  ('metrics-1', 'store-1', 'green', 24, 28, 8, 14, 12, 2, 85, now())
ON CONFLICT (id) DO NOTHING;

-- Messages (store-1)
INSERT INTO messages (id, store_id, type, scope, priority, title, body, target_zones, target_roles, requires_acknowledgment, total_recipients, has_photo, sent_at) VALUES
  ('msg-1', 'store-1', 'announcement', 'store', 'critical', 'Fire drill at 14:30',
   'All staff to assembly point B at rear of store. Please ensure all customers are guided to the nearest exit. The drill will last approximately 15 minutes.',
   NULL, NULL, true, 18, false, now() - interval '8 minutes'),
  ('msg-2', 'store-1', 'announcement', 'store', 'normal',   'Delivery arriving early',
   'Delivery arriving early today — need 2 people at dock by 14:30. Reply here if available.',
   NULL, NULL, false, NULL, false, now() - interval '45 minutes'),
  ('msg-3', 'store-1', 'update',       'zone',  'normal',   NULL,
   'Restocked the jeans wall, all sizes now available. The XS-S sizes were running low since morning.',
   ARRAY['Menswear'], NULL, false, NULL, false, now() - interval '1 hour'),
  ('msg-4', 'store-1', 'alert',        'store', 'critical', 'Till 3 offline',
   'Till 3 is currently down. IT has been notified. Please direct customers to tills 1, 2, or 4.',
   NULL, NULL, false, NULL, false, now() - interval '2 hours'),
  ('msg-5', 'store-1', 'update',       'zone',  'normal',   'New display setup',
   'Set up the new summer collection display near entrance. Please direct customers here for the new arrivals.',
   ARRAY['Womenswear'], NULL, false, NULL, true, now() - interval '3 hours'),
  ('msg-6', 'store-1', 'chat',         'job',   'normal',   NULL,
   'Started on this - should be done in about 20 mins. The fitting room queue is backing up a bit.',
   NULL, NULL, false, NULL, false, now() - interval '15 minutes'),
  ('msg-7', 'store-1', 'announcement', 'role',  'normal',   'Floor leads: End of day meeting',
   'Quick sync at 17:45 in the break room to discuss tomorrow''s promotional setup. Should take 10 mins max.',
   NULL, ARRAY['Floor Lead','Supervisor'], true, 4, false, now() - interval '4 hours'),
  ('msg-8', 'store-1', 'update',       'store', 'low',      'WiFi maintenance tonight',
   'Store WiFi will be unavailable from 21:00-22:00 for scheduled maintenance. Mobile data will still work.',
   NULL, NULL, false, NULL, false, now() - interval '5 hours'),
  ('msg-9', 'store-1', 'update',       'zone',  'normal',   NULL,
   'Cleared the backlog in fitting rooms. All clear now - 2 rooms available.',
   ARRAY['Fitting Rooms'], NULL, false, NULL, false, now() - interval '30 minutes'),
  ('msg-10','store-1', 'announcement', 'store', 'normal',   'Great feedback from regional visit',
   'Regional manager was impressed with our store presentation today. Thanks everyone for the hard work!',
   NULL, NULL, false, NULL, false, now() - interval '6 hours')
ON CONFLICT (id) DO NOTHING;

-- Message acknowledgments
INSERT INTO message_acknowledgments (id, message_id, user_id, acknowledged_at) VALUES
  ('ack-1-1',  'msg-1', 'user-1', now() - interval '7 minutes'),
  ('ack-1-2',  'msg-1', 'user-2', now() - interval '6 minutes'),
  ('ack-1-3',  'msg-7', 'user-1', now() - interval '3 hours 30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Shifts (store-1, all users)
INSERT INTO shifts (id, user_id, store_id, date, start_time, end_time, break_start, break_duration_mins, zone_id, role, status) VALUES
  -- Alex Thompson (user-1, floor-lead)
  ('u1-shift-0', 'user-1', 'store-1', CURRENT_DATE::TEXT,            '09:00', '17:00', '13:00', 30, 'zone-womenswear',    'Sales Associate',        'confirmed'),
  ('u1-shift-1', 'user-1', 'store-1', (CURRENT_DATE + 1)::TEXT,      '10:00', '18:00', '14:00', 30, 'zone-main-tills',    'Cashier',                'confirmed'),
  ('u1-shift-3', 'user-1', 'store-1', (CURRENT_DATE + 3)::TEXT,      '08:00', '16:00', '12:00', 45, 'zone-stockroom',     'Stock Associate',        'confirmed'),
  ('u1-shift-4', 'user-1', 'store-1', (CURRENT_DATE + 4)::TEXT,      '11:00', '19:00', '15:00', 30, 'zone-fitting-rooms', 'Fitting Room Attendant', 'pending-swap'),
  ('u1-shift-6', 'user-1', 'store-1', (CURRENT_DATE + 6)::TEXT,      '09:00', '17:00', '13:00', 30, 'zone-menswear',      'Sales Associate',        'confirmed'),

  -- Jamie Collins (user-2, staff)
  ('u2-shift-0', 'user-2', 'store-1', CURRENT_DATE::TEXT,            '06:00', '14:30', '10:00', 30, 'zone-stockroom',     'Stock Associate',        'confirmed'),
  ('u2-shift-1', 'user-2', 'store-1', (CURRENT_DATE + 1)::TEXT,      '06:00', '14:30', '10:00', 30, 'zone-stockroom',     'Stock Associate',        'confirmed'),
  ('u2-shift-2', 'user-2', 'store-1', (CURRENT_DATE + 2)::TEXT,      '12:00', '16:00', NULL,    NULL,'zone-stockroom',    'Stock Associate',        'available'),
  ('u2-shift-4', 'user-2', 'store-1', (CURRENT_DATE + 4)::TEXT,      '08:00', '16:00', '12:00', 30, 'zone-menswear',      'Sales Associate',        'confirmed'),
  ('u2-shift-5', 'user-2', 'store-1', (CURRENT_DATE + 5)::TEXT,      '09:00', '17:00', '13:00', 30, 'zone-main-tills',    'Cashier',                'confirmed'),
  ('u2-shift-6', 'user-2', 'store-1', (CURRENT_DATE + 6)::TEXT,      '06:00', '14:30', '10:00', 30, 'zone-stockroom',     'Stock Associate',        'confirmed'),

  -- Sarah Mitchell (user-3, manager)
  ('u3-shift-0', 'user-3', 'store-1', CURRENT_DATE::TEXT,            '08:00', '16:30', '12:00', 45, 'zone-main-tills',    'Supervisor',             'confirmed'),
  ('u3-shift-1', 'user-3', 'store-1', (CURRENT_DATE + 1)::TEXT,      '08:00', '16:30', '12:00', 45, 'zone-main-tills',    'Supervisor',             'confirmed'),
  ('u3-shift-2', 'user-3', 'store-1', (CURRENT_DATE + 2)::TEXT,      '09:00', '17:30', '13:00', 30, 'zone-womenswear',    'Supervisor',             'confirmed'),
  ('u3-shift-5', 'user-3', 'store-1', (CURRENT_DATE + 5)::TEXT,      '14:00', '20:00', NULL,    NULL,'zone-main-tills',   'Cashier',                'available'),
  ('u3-shift-6', 'user-3', 'store-1', (CURRENT_DATE + 6)::TEXT,      '08:00', '16:30', '12:00', 45, 'zone-entrance',      'Supervisor',             'confirmed')
ON CONFLICT (id) DO NOTHING;

-- Checklists (store-1)
INSERT INTO checklists (id, store_id, type, name, description, scheduled_for, status, started_at, completed_at, completed_by) VALUES
  ('checklist-opening', 'store-1', 'opening', 'Opening Checklist', 'Complete before store opens at 09:00', '08:00', 'completed', now() - interval '2 hours', now() - interval '90 minutes', 'Emma T.'),
  ('checklist-closing', 'store-1', 'closing', 'Closing Checklist', 'Complete before leaving the store',    '20:00', 'not-started', NULL, NULL, NULL),
  ('checklist-safety',  'store-1', 'safety',  'Safety Walkthrough', 'Mid-day safety inspection',           '14:00', 'in-progress', now() - interval '50 minutes', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Checklist sections
INSERT INTO checklist_sections (id, checklist_id, name, sort_order) VALUES
  ('sec-open-safety',    'checklist-opening', 'Safety Checks',   1),
  ('sec-open-cash',      'checklist-opening', 'Cash & Tills',    2),
  ('sec-open-readiness', 'checklist-opening', 'Store Readiness', 3),
  ('sec-close-cash',     'checklist-closing', 'Cash & Tills',    1),
  ('sec-close-security', 'checklist-closing', 'Security',        2),
  ('sec-close-floor',    'checklist-closing', 'Floor Standards', 3),
  ('sec-safety-fire',    'checklist-safety',  'Fire Safety',     1),
  ('sec-safety-general', 'checklist-safety',  'General Safety',  2)
ON CONFLICT (id) DO NOTHING;

-- Checklist items
INSERT INTO checklist_items (id, section_id, category, item, description, input_type, required, sort_order, numeric_min, numeric_max, numeric_unit) VALUES
  ('open-1',  'sec-open-safety',    'Safety Checks',   'Fire exits clear and accessible',  'Check all 3 fire exits are unobstructed', 'boolean', true,  1, NULL, NULL, NULL),
  ('open-2',  'sec-open-safety',    'Safety Checks',   'Emergency lighting tested',         NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('open-3',  'sec-open-safety',    'Safety Checks',   'First aid kit checked',             'Verify all supplies are stocked',         'boolean', true,  3, NULL, NULL, NULL),
  ('open-4',  'sec-open-safety',    'Safety Checks',   'Floor condition (no hazards)',       NULL,                                      'boolean', true,  4, NULL, NULL, NULL),
  ('open-5',  'sec-open-cash',      'Cash & Tills',    'Cash float counted and verified',   'Enter the total float amount',            'numeric', true,  1, 0,    1000, 'GBP'),
  ('open-6',  'sec-open-cash',      'Cash & Tills',    'All tills powered on',              NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('open-7',  'sec-open-cash',      'Cash & Tills',    'Card readers tested',               NULL,                                      'boolean', true,  3, NULL, NULL, NULL),
  ('open-8',  'sec-open-cash',      'Cash & Tills',    'Receipt printers loaded',           NULL,                                      'boolean', true,  4, NULL, NULL, NULL),
  ('open-9',  'sec-open-readiness', 'Store Readiness', 'Mannequins and displays checked',   NULL,                                      'boolean', true,  1, NULL, NULL, NULL),
  ('open-10', 'sec-open-readiness', 'Store Readiness', 'Lighting all working',              NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('open-11', 'sec-open-readiness', 'Store Readiness', 'Entrance area photo',               'Capture photo of entrance display',       'photo',   false, 3, NULL, NULL, NULL),
  ('open-12', 'sec-open-readiness', 'Store Readiness', 'Additional notes',                  'Any observations or concerns',            'text',    false, 4, NULL, NULL, NULL),
  ('close-1', 'sec-close-cash',     'Cash & Tills',    'All tills balanced and closed',     NULL,                                      'boolean', true,  1, NULL, NULL, NULL),
  ('close-2', 'sec-close-cash',     'Cash & Tills',    'Cash office secured and locked',    NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('close-3', 'sec-close-cash',     'Cash & Tills',    'Final cash count',                  'Enter the closing cash total',            'numeric', true,  3, 0,    10000,'GBP'),
  ('close-4', 'sec-close-cash',     'Cash & Tills',    'Float verified for tomorrow',       NULL,                                      'boolean', true,  4, NULL, NULL, NULL),
  ('close-5', 'sec-close-security', 'Security',        'All fire exits clear and accessible',NULL,                                     'boolean', true,  1, NULL, NULL, NULL),
  ('close-6', 'sec-close-security', 'Security',        'CCTV recording confirmed',          NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('close-7', 'sec-close-security', 'Security',        'All external doors locked',         NULL,                                      'boolean', true,  3, NULL, NULL, NULL),
  ('close-8', 'sec-close-security', 'Security',        'Alarm system activated',            NULL,                                      'boolean', true,  4, NULL, NULL, NULL),
  ('close-9', 'sec-close-floor',    'Floor Standards', 'Fitting rooms cleared and reset',   NULL,                                      'boolean', true,  1, NULL, NULL, NULL),
  ('close-10','sec-close-floor',    'Floor Standards', 'All rails merchandised and sized',  NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('close-11','sec-close-floor',    'Floor Standards', 'Floor swept and clear of debris',   NULL,                                      'boolean', true,  3, NULL, NULL, NULL),
  ('close-12','sec-close-floor',    'Floor Standards', 'Closing floor photo',               'Capture photo of main floor area',        'photo',   false, 4, NULL, NULL, NULL),
  ('safety-1','sec-safety-fire',    'Fire Safety',     'Fire extinguishers accessible',     NULL,                                      'boolean', true,  1, NULL, NULL, NULL),
  ('safety-2','sec-safety-fire',    'Fire Safety',     'Emergency exits unobstructed',      NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('safety-3','sec-safety-fire',    'Fire Safety',     'Assembly point signage visible',    NULL,                                      'boolean', true,  3, NULL, NULL, NULL),
  ('safety-4','sec-safety-fire',    'Fire Safety',     'Fire alarm test date verified',     NULL,                                      'boolean', true,  4, NULL, NULL, NULL),
  ('safety-5','sec-safety-general', 'General Safety',  'Trip hazards identified and cleared',NULL,                                     'boolean', true,  1, NULL, NULL, NULL),
  ('safety-6','sec-safety-general', 'General Safety',  'Wet floor signs available',         NULL,                                      'boolean', true,  2, NULL, NULL, NULL),
  ('safety-7','sec-safety-general', 'General Safety',  'First aid kit location marked',     NULL,                                      'boolean', true,  3, NULL, NULL, NULL),
  ('safety-8','sec-safety-general', 'General Safety',  'Safety observations',               'Note any additional safety concerns',     'text',    false, 4, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Checklist responses (opening checklist — all completed)
INSERT INTO checklist_responses (id, item_id, user_id, value_bool, value_numeric, value_text, completed_at) VALUES
  ('resp-1',  'open-1',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-2',  'open-2',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-3',  'open-3',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-4',  'open-4',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-5',  'open-5',  'user-3', NULL,  200,   NULL, now() - interval '100 minutes'),
  ('resp-6',  'open-6',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-7',  'open-7',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-8',  'open-8',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-9',  'open-9',  'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-10', 'open-10', 'user-3', true,  NULL,  NULL, now() - interval '100 minutes'),
  ('resp-11', 'open-12', 'user-3', NULL,  NULL,  '',   now() - interval '100 minutes')
ON CONFLICT (id) DO NOTHING;

-- Safety checklist responses (partial — 4 of 8 done)
INSERT INTO checklist_responses (id, item_id, user_id, value_bool, completed_at) VALUES
  ('resp-s1', 'safety-1', 'user-3', true,  now() - interval '45 minutes'),
  ('resp-s2', 'safety-2', 'user-3', false, now() - interval '40 minutes'),
  ('resp-s3', 'safety-3', 'user-3', true,  now() - interval '35 minutes'),
  ('resp-s4', 'safety-4', 'user-3', true,  now() - interval '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Flagged issues
INSERT INTO flagged_issues (id, item_id, description, severity, flagged_at, flagged_by, status) VALUES
  ('issue-1', 'safety-2', 'Exit 2 partially blocked by delivery boxes', 'medium', now() - interval '40 minutes', 'Sarah M.', 'open')
ON CONFLICT (id) DO NOTHING;

-- Incident reports (store-1)
INSERT INTO incident_reports (id, store_id, type, location, occurred_at, reported_by, description, severity, status, follow_up_required) VALUES
  ('incident-1', 'store-1', 'slip-fall',         'Entrance', now() - interval '2 hours',  'Sarah M.', 'Customer slipped on wet floor near entrance. No injury reported. Floor was wet due to rain tracked in from outside.', 'low',    'resolved',      false),
  ('incident-2', 'store-1', 'equipment-failure',  'Tills',    now() - interval '24 hours', 'James K.', 'Till 3 card reader stopped working intermittently. IT notified.',                                                    'medium', 'investigating', true)
ON CONFLICT (id) DO NOTHING;
