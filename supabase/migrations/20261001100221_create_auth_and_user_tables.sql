/*
# NomadCircle — User Auth, Trip Bookings, Cart Items, and Profiles

## Overview
Sets up the database schema for NomadCircle's multi-user features:
user authentication (handled by Supabase Auth), user profiles, trip bookings,
and rental cart items. All tables are owner-scoped with RLS.

## New Tables

### 1. profiles
- `id` (uuid, PK, references auth.users) — links to the Supabase auth user
- `full_name` (text) — user's display name
- `avatar_url` (text, nullable) — profile picture URL
- `bio` (text, nullable) — short user bio
- `home_base` (text, nullable) — user's home city
- `created_at` (timestamptz) — when the profile was created
- `updated_at` (timestamptz) — last profile update

### 2. trip_bookings
- `id` (uuid, PK) — booking ID
- `user_id` (uuid, FK to auth.users, defaults to auth.uid()) — owner
- `trip_id` (text) — the trip identifier from the trips data
- `trip_title` (text) — trip name at time of booking
- `destination` (text) — trip destination
- `dates` (text) — trip date range
- `price` (integer) — total price paid
- `payment_option` (text) — 'full' or 'split'
- `status` (text, default 'confirmed') — booking status
- `created_at` (timestamptz) — booking timestamp

### 3. cart_items
- `id` (uuid, PK) — cart item ID
- `user_id` (uuid, FK to auth.users, defaults to auth.uid()) — owner
- `item_id` (text) — the boutique/wardrobe item identifier
- `item_name` (text) — name of the selected variant or item
- `item_subtitle` (text) — category or parent item name
- `price` (integer) — item price
- `image` (text) — item image URL
- `created_at` (timestamptz) — when added to cart

## Security
- RLS enabled on all three tables.
- profiles: users can read/update only their own profile row.
- trip_bookings: users can CRUD only their own bookings.
- cart_items: users can CRUD only their own cart items.
- All policies scoped to `authenticated` role with `auth.uid()` ownership checks.
- Owner columns default to `auth.uid()` so inserts that omit user_id still pass RLS.

## Important Notes
1. The `profiles` table is auto-populated via a trigger when a new auth user signs up.
2. Email confirmation stays OFF (Supabase default for this project).
3. All user_id columns have `DEFAULT auth.uid()` so frontend inserts don't need to pass user_id.
*/

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  avatar_url text,
  bio text,
  home_base text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. TRIP_BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS trip_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id text NOT NULL,
  trip_title text NOT NULL,
  destination text NOT NULL,
  dates text NOT NULL,
  price integer NOT NULL,
  payment_option text NOT NULL DEFAULT 'full',
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trip_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON trip_bookings;
CREATE POLICY "select_own_bookings" ON trip_bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON trip_bookings;
CREATE POLICY "insert_own_bookings" ON trip_bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON trip_bookings;
CREATE POLICY "update_own_bookings" ON trip_bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON trip_bookings;
CREATE POLICY "delete_own_bookings" ON trip_bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 3. CART_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  item_name text NOT NULL,
  item_subtitle text NOT NULL,
  price integer NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cart_items" ON cart_items;
CREATE POLICY "select_own_cart_items" ON cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart_items" ON cart_items;
CREATE POLICY "insert_own_cart_items" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart_items" ON cart_items;
CREATE POLICY "update_own_cart_items" ON cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart_items" ON cart_items;
CREATE POLICY "delete_own_cart_items" ON cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 4. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 5. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_trip_bookings_user_id ON trip_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);