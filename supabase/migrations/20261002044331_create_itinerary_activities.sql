/*
# NomadCircle — Itinerary Activities & Votes

## Overview
Creates shared tables for the Cohort Lounge's Day-by-Day Itinerary Builder.
All authenticated travelers on a trip can view, suggest, and vote on activities.
This is intentionally shared (not owner-scoped) because the itinerary is a
collaborative cohort space — every crew member participates.

## New Tables

### 1. itinerary_activities
- `id` (uuid, PK) — activity ID
- `trip_id` (text, not null) — identifier linking to the trip (e.g. 'london-imperial')
- `day` (integer, not null) — which day of the trip (1-7+)
- `title` (text, not null) — activity name
- `category` (text, not null) — tag: Food, Culture, Shopping, Nightlife, Sightseeing, Adventure
- `cost` (integer, not null, default 0) — approximate cost in USD
- `suggested_by` (text, not null) — name of the traveler who suggested it
- `votes` (integer, not null, default 0) — net vote count
- `created_at` (timestamptz) — when the activity was suggested

### 2. itinerary_votes
- `id` (uuid, PK) — vote record ID
- `activity_id` (uuid, FK to itinerary_activities, ON DELETE CASCADE) — which activity was voted on
- `user_id` (uuid, not null, default auth.uid()) — who cast the vote
- `direction` (text, not null) — 'up' or 'down'
- `created_at` (timestamptz) — when the vote was cast
- Unique constraint on (activity_id, user_id) — one vote per user per activity

## Security
- RLS enabled on both tables.
- itinerary_activities: any authenticated user can SELECT, INSERT, and UPDATE
  (shared cohort space — all crew members collaborate on the same itinerary).
- itinerary_votes: any authenticated user can SELECT, INSERT, and DELETE
  their own votes. Users can only delete their own vote records.
- All policies scoped to `authenticated` role.

## Important Notes
1. The `votes` column on itinerary_activities is maintained by the application
   layer — the frontend reads votes, computes net count, and updates the column.
2. The itinerary_votes table prevents duplicate voting via a unique constraint.
3. Both tables are shared across all authenticated users (no user_id ownership
   filter on activities) because the itinerary is a group collaboration space.
*/

-- ============================================================
-- 1. ITINERARY_ACTIVITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id text NOT NULL,
  day integer NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  cost integer NOT NULL DEFAULT 0,
  suggested_by text NOT NULL,
  votes integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE itinerary_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_itinerary_activities" ON itinerary_activities;
CREATE POLICY "select_itinerary_activities" ON itinerary_activities FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_itinerary_activities" ON itinerary_activities;
CREATE POLICY "insert_itinerary_activities" ON itinerary_activities FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_itinerary_activities" ON itinerary_activities;
CREATE POLICY "update_itinerary_activities" ON itinerary_activities FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_itinerary_activities" ON itinerary_activities;
CREATE POLICY "delete_itinerary_activities" ON itinerary_activities FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. ITINERARY_VOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES itinerary_activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  direction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (activity_id, user_id)
);

ALTER TABLE itinerary_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_itinerary_votes" ON itinerary_votes;
CREATE POLICY "select_itinerary_votes" ON itinerary_votes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_itinerary_votes" ON itinerary_votes;
CREATE POLICY "insert_itinerary_votes" ON itinerary_votes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_itinerary_votes" ON itinerary_votes;
CREATE POLICY "delete_itinerary_votes" ON itinerary_votes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_trip_id ON itinerary_activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_day ON itinerary_activities(day);
CREATE INDEX IF NOT EXISTS idx_itinerary_votes_activity_id ON itinerary_votes(activity_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_votes_user_id ON itinerary_votes(user_id);
