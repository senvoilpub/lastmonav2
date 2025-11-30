-- Create table for storing anonymous user prompts (data collection only)
-- This table stores prompts from non-authenticated users for analytics purposes
-- Maximum 100 records - oldest records are automatically deleted when limit is reached

CREATE TABLE IF NOT EXISTS anonymous_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on created_at for efficient ordering and deletion
CREATE INDEX IF NOT EXISTS idx_anonymous_prompts_created_at ON anonymous_prompts(created_at);

-- Optional: Add RLS (Row Level Security) if you want to restrict access
-- For now, we'll use service role key for all operations, so RLS is not needed
-- But if you want to add it:
-- ALTER TABLE anonymous_prompts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Service role can manage anonymous_prompts" ON anonymous_prompts
--   FOR ALL USING (true);

-- Note: This table is managed entirely by the backend API using service role key
-- No client-side access is needed or provided
