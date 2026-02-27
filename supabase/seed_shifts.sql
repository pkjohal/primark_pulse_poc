-- Replaces all store-1 shift data with a full week for every user.
-- Safe to re-run — deletes first, then inserts.

DELETE FROM shifts WHERE store_id = 'store-1';

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
  ('u2-shift-2', 'user-2', 'store-1', (CURRENT_DATE + 2)::TEXT,      '12:00', '16:00', NULL,    NULL, 'zone-stockroom',   'Stock Associate',        'available'),
  ('u2-shift-4', 'user-2', 'store-1', (CURRENT_DATE + 4)::TEXT,      '08:00', '16:00', '12:00', 30, 'zone-menswear',      'Sales Associate',        'confirmed'),
  ('u2-shift-5', 'user-2', 'store-1', (CURRENT_DATE + 5)::TEXT,      '09:00', '17:00', '13:00', 30, 'zone-main-tills',    'Cashier',                'confirmed'),
  ('u2-shift-6', 'user-2', 'store-1', (CURRENT_DATE + 6)::TEXT,      '06:00', '14:30', '10:00', 30, 'zone-stockroom',     'Stock Associate',        'confirmed'),

  -- Sarah Mitchell (user-3, manager)
  ('u3-shift-0', 'user-3', 'store-1', CURRENT_DATE::TEXT,            '08:00', '16:30', '12:00', 45, 'zone-main-tills',    'Supervisor',             'confirmed'),
  ('u3-shift-1', 'user-3', 'store-1', (CURRENT_DATE + 1)::TEXT,      '08:00', '16:30', '12:00', 45, 'zone-main-tills',    'Supervisor',             'confirmed'),
  ('u3-shift-2', 'user-3', 'store-1', (CURRENT_DATE + 2)::TEXT,      '09:00', '17:30', '13:00', 30, 'zone-womenswear',    'Supervisor',             'confirmed'),
  ('u3-shift-5', 'user-3', 'store-1', (CURRENT_DATE + 5)::TEXT,      '14:00', '20:00', NULL,    NULL, 'zone-main-tills',  'Cashier',                'available'),
  ('u3-shift-6', 'user-3', 'store-1', (CURRENT_DATE + 6)::TEXT,      '08:00', '16:30', '12:00', 45, 'zone-entrance',      'Supervisor',             'confirmed');
