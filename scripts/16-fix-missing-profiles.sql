-- Check if verification_status column exists, if not, skip job seeker profile creation
DO $$
BEGIN
    -- Check if verification_status column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_seeker_profiles' 
        AND column_name = 'verification_status'
    ) THEN
        RAISE NOTICE 'verification_status column does not exist. Please run script 15-add-verification-status.sql first.';
        RETURN;
    END IF;
END $$;

-- Fix missing profiles for existing users
-- This script will create profiles for any auth users who don't have them

-- First, let's see what we're working with
SELECT 'Auth users without profiles:' as status;
SELECT au.id, au.email, au.raw_user_meta_data
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Create user profiles for auth users who don't have them
INSERT INTO user_profiles (id, email, user_type, first_name, last_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'user_type', 'customer') as user_type,
  COALESCE(au.raw_user_meta_data->>'first_name', '') as first_name,
  COALESCE(au.raw_user_meta_data->>'last_name', '') as last_name
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Create customer profiles for customer users
INSERT INTO customer_profiles (id, newsletter_subscribed)
SELECT up.id, false
FROM user_profiles up
LEFT JOIN customer_profiles cp ON up.id = cp.id
WHERE up.user_type = 'customer' AND cp.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Create job seeker profiles for job seeker users (only if verification_status column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_seeker_profiles' 
        AND column_name = 'verification_status'
    ) THEN
        INSERT INTO job_seeker_profiles (id, job_alerts, verification_status, can_edit_application)
        SELECT up.id, false, 'unverified', true
        FROM user_profiles up
        LEFT JOIN job_seeker_profiles jsp ON up.id = jsp.id
        WHERE up.user_type = 'job_seeker' AND jsp.id IS NULL
        ON CONFLICT (id) DO NOTHING;
    ELSE
        -- Fallback for older schema
        INSERT INTO job_seeker_profiles (id, job_alerts)
        SELECT up.id, false
        FROM user_profiles up
        LEFT JOIN job_seeker_profiles jsp ON up.id = jsp.id
        WHERE up.user_type = 'job_seeker' AND jsp.id IS NULL
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Verify the fix
SELECT 'Verification - All users should now have profiles:' as status;
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(up.id) as users_with_profiles,
  COUNT(cp.id) as customer_profiles,
  COUNT(jsp.id) as job_seeker_profiles
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
LEFT JOIN customer_profiles cp ON up.id = cp.id AND up.user_type = 'customer'
LEFT JOIN job_seeker_profiles jsp ON up.id = jsp.id AND up.user_type = 'job_seeker';
