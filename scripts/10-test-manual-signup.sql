-- Test manual user profile creation
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_email TEXT := 'test@example.com';
BEGIN
  -- Test user profile creation
  INSERT INTO user_profiles (id, email, user_type) 
  VALUES (test_user_id, test_email, 'customer');
  
  -- Test customer profile creation
  INSERT INTO customer_profiles (id, newsletter_subscribed) 
  VALUES (test_user_id, true);
  
  -- Verify data was inserted
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = test_user_id) THEN
    RAISE NOTICE 'User profile created successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create user profile';
  END IF;
  
  IF EXISTS (SELECT 1 FROM customer_profiles WHERE id = test_user_id) THEN
    RAISE NOTICE 'Customer profile created successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create customer profile';
  END IF;
  
  -- Clean up test data
  DELETE FROM customer_profiles WHERE id = test_user_id;
  DELETE FROM user_profiles WHERE id = test_user_id;
  
  RAISE NOTICE 'Manual signup test completed successfully!';
END $$;
