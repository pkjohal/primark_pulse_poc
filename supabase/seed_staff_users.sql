-- Fix: add missing user records for staff-3 to staff-10 and link them
-- Run this in the Supabase SQL editor

-- 1. Insert the missing users
INSERT INTO users (id, store_id, name, role, pin, is_active) VALUES
  ('user-11', 'store-1', 'Priya Shah',     'staff',      '1234', true),
  ('user-12', 'store-1', 'Tom Clarke',     'staff',      '1234', true),
  ('user-13', 'store-1', 'Lena Walker',    'staff',      '1234', true),
  ('user-14', 'store-1', 'Marcus Green',   'staff',      '1234', true),
  ('user-15', 'store-1', 'Sophie Turner',  'staff',      '1234', true),
  ('user-16', 'store-1', 'Ryan Patel',     'staff',      '1234', true),
  ('user-17', 'store-1', 'Olivia Brown',   'staff',      '1234', true),
  ('user-18', 'store-1', 'Jack Wilson',    'staff',      '1234', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Link staff members to their users
UPDATE staff_members SET user_id = 'user-11' WHERE id = 'staff-3';
UPDATE staff_members SET user_id = 'user-12' WHERE id = 'staff-4';
UPDATE staff_members SET user_id = 'user-13' WHERE id = 'staff-5';
UPDATE staff_members SET user_id = 'user-14' WHERE id = 'staff-6';
UPDATE staff_members SET user_id = 'user-15' WHERE id = 'staff-7';
UPDATE staff_members SET user_id = 'user-16' WHERE id = 'staff-8';
UPDATE staff_members SET user_id = 'user-17' WHERE id = 'staff-9';
UPDATE staff_members SET user_id = 'user-18' WHERE id = 'staff-10';
