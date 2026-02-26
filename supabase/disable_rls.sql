-- Run this in the Supabase SQL editor to allow the anon key to read all tables.
-- Required for the PoC since no auth policies are configured.
DO $$ DECLARE t TEXT; BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(t) || ' DISABLE ROW LEVEL SECURITY';
  END LOOP;
END $$;
