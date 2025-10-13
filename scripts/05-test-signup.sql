-- Test data insertion (this simulates what happens during signup)
-- DO NOT RUN THIS IN PRODUCTION - This is just for testing the schema

-- Test inserting a job seeker profile manually
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- Insert into user_profiles
    INSERT INTO user_profiles (
        id, 
        email, 
        first_name, 
        last_name, 
        phone, 
        address, 
        city, 
        zip_code, 
        user_type
    ) VALUES (
        test_user_id,
        'test@example.com',
        'Test',
        'User',
        '555-1234',
        '123 Test St',
        'Test City',
        '12345',
        'job_seeker'
    );

    -- Insert into job_seeker_profiles
    INSERT INTO job_seeker_profiles (
        id,
        position_interest,
        experience_level,
        availability,
        bio,
        job_alerts
    ) VALUES (
        test_user_id,
        'sales-associate',
        'entry-level',
        'full-time',
        'Test bio',
        true
    );

    RAISE NOTICE 'Test insertion successful for user ID: %', test_user_id;
    
    -- Clean up test data
    DELETE FROM job_seeker_profiles WHERE id = test_user_id;
    DELETE FROM user_profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'Test data cleaned up successfully';
END $$;
