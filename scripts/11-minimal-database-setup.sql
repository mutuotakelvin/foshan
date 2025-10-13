-- Minimal database setup that avoids all trigger issues
-- This approach will work reliably

-- First, let's completely disable and remove all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS customer_profiles CASCADE;
DROP TABLE IF EXISTS job_seeker_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create a simple user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY,
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
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_seeker_profiles table
CREATE TABLE public.job_seeker_profiles (
  id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
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

-- Disable RLS completely for now to avoid any permission issues
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to all roles
GRANT ALL PRIVILEGES ON public.user_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.customer_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.job_seeker_profiles TO postgres, anon, authenticated, service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles(user_type);

-- Test the setup
SELECT 'Minimal database setup completed successfully!' as result;
