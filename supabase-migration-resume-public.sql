-- Add is_public field to resumes table for public resume sharing feature
-- When is_public is true, the resume can be viewed via a public URL without authentication

ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false NOT NULL;

-- Create index for efficient querying of public resumes
CREATE INDEX IF NOT EXISTS idx_resumes_is_public ON resumes(is_public) WHERE is_public = true;

-- RLS Policy: Allow anyone to read public resumes (for public resume sharing)
-- This allows unauthenticated users to view resumes where is_public = true
CREATE POLICY "Public resumes are viewable by everyone" ON resumes
  FOR SELECT
  USING (is_public = true);

-- Note: Existing RLS policies should already allow:
-- 1. Users to read their own resumes (should exist)
-- 2. Users to update their own resumes (should exist)
-- 3. Users to insert their own resumes (should exist)

