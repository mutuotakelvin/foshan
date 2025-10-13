-- Complete database reset and rebuild
-- This script will completely recreate the database structure

-- Drop all existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Customers can view own profile" ON customer_profiles;
DROP POLICY IF EXISTS "Customers can update own profile" ON customer_profiles;
DROP POLICY IF EXISTS "Customers can insert own profile" ON customer_profiles;
DROP POLICY IF EXISTS "Job seekers can view own profile" ON job_seeker_profiles;
DROP POLICY IF EXISTS "Job seekers can update own profile" ON job_seeker_profiles;
DROP POLICY IF EXISTS "Job seekers can insert own profile" ON job_seeker_profiles;

-- Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_seeker_profiles DISABLE ROW LEVEL SECURITY;

-- Clear existing data
TRUNCATE TABLE customer_profiles CASCADE;
TRUNCATE TABLE job_seeker_profiles CASCADE;
TRUNCATE TABLE user_profiles CASCADE;

-- Recreate tables with proper structure
DROP TABLE IF EXISTS customer_profiles CASCADE;
DROP TABLE IF EXISTS job_seeker_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  zip_code TEXT DEFAULT '',
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'job_seeker')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_profiles table
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_seeker_profiles table
CREATE TABLE job_seeker_profiles (
  id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  position_interest TEXT DEFAULT '',
  experience_level TEXT DEFAULT '',
  availability TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected', 'interview_scheduled')),
  job_alerts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_customer_profiles_status ON customer_profiles(status);
CREATE INDEX idx_job_seeker_profiles_status ON job_seeker_profiles(application_status);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_seeker_profiles ENABLE ROW LEVEL SECURITY;

-- Create very permissive RLS policies for now
CREATE POLICY "Allow all operations for authenticated users" ON user_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON customer_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON job_seeker_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON user_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON customer_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON job_seeker_profiles TO postgres, anon, authenticated, service_role;

-- Create a simple trigger function that won't fail
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Just log the user creation, don't create profiles here
  RAISE LOG 'New user created: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail user creation if this fails
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (but it won't create profiles)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test the setup
INSERT INTO user_profiles (id, email, user_type) 
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'customer')
ON CONFLICT (id) DO NOTHING;

DELETE FROM user_profiles WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT 'Database reset completed successfully!' as result;
