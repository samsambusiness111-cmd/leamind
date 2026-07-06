-- Run this in the Supabase SQL Editor to set up the database

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by TEXT NOT NULL UNIQUE,
  enrolled BOOLEAN DEFAULT false,
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  current_module TEXT DEFAULT 'deepseek',
  current_lesson INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_expires TIMESTAMPTZ,
  last_payment_id TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_progress_payment_id
  ON user_progress (last_payment_id)
  WHERE last_payment_id IS NOT NULL;

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (created_by = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (created_by = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (created_by = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (created_by = (auth.jwt() ->> 'email'));

CREATE OR REPLACE FUNCTION check_payment_id_used(p_id TEXT, user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_progress
    WHERE last_payment_id = p_id AND created_by IS DISTINCT FROM user_email
  );
$$;

GRANT EXECUTE ON FUNCTION check_payment_id_used(TEXT, TEXT) TO authenticated;
