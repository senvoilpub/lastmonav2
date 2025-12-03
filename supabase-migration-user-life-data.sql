-- Create tables for user life data: education, certifications, skills, hobbies
-- This extends the user profile to include all personal information

-- Education table
CREATE TABLE IF NOT EXISTS user_education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree TEXT,
  institution TEXT,
  period TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Certifications table
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  issuer TEXT,
  date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Skills table (simple list)
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Hobbies table (simple list)
CREATE TABLE IF NOT EXISTS user_hobbies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for education
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_created_at ON user_education(created_at DESC);

-- Indexes for certifications
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_created_at ON user_certifications(created_at DESC);

-- Indexes for skills
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_created_at ON user_skills(created_at DESC);

-- Indexes for hobbies
CREATE INDEX IF NOT EXISTS idx_user_hobbies_user_id ON user_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_created_at ON user_hobbies(created_at DESC);

-- Enable Row Level Security for education
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own education" ON user_education
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education" ON user_education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education" ON user_education
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education" ON user_education
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Row Level Security for certifications
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certifications" ON user_certifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certifications" ON user_certifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certifications" ON user_certifications
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certifications" ON user_certifications
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Row Level Security for skills
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" ON user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON user_skills
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Row Level Security for hobbies
ALTER TABLE user_hobbies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hobbies" ON user_hobbies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hobbies" ON user_hobbies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hobbies" ON user_hobbies
  FOR DELETE USING (auth.uid() = user_id);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_education_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_certifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_education_updated_at
  BEFORE UPDATE ON user_education
  FOR EACH ROW
  EXECUTE FUNCTION update_user_education_updated_at();

CREATE TRIGGER update_user_certifications_updated_at
  BEFORE UPDATE ON user_certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_user_certifications_updated_at();

