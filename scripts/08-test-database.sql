-- Test database connectivity and table structure
SELECT 'Testing user_profiles table...' as test_step;
SELECT COUNT(*) as user_profiles_count FROM user_profiles;

SELECT 'Testing customer_profiles table...' as test_step;
SELECT COUNT(*) as customer_profiles_count FROM customer_profiles;

SELECT 'Testing job_seeker_profiles table...' as test_step;
SELECT COUNT(*) as job_seeker_profiles_count FROM job_seeker_profiles;

-- Test RLS policies
SELECT 'Testing RLS policies...' as test_step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'customer_profiles', 'job_seeker_profiles');

-- Test trigger function
SELECT 'Testing trigger function...' as test_step;
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

SELECT 'Database test completed!' as result;
