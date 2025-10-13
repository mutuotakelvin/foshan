-- Test simple database operations
SELECT 'Testing database setup...' as status;

-- Test inserting a user profile
INSERT INTO public.user_profiles (
  id, 
  email, 
  first_name, 
  last_name, 
  user_type
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@example.com',
  'Test',
  'User',
  'customer'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;

-- Test inserting a customer profile
INSERT INTO public.customer_profiles (
  id,
  newsletter_subscribed
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  true
) ON CONFLICT (id) DO UPDATE SET
  newsletter_subscribed = EXCLUDED.newsletter_subscribed;

-- Verify the data
SELECT 'User Profile:' as type, * FROM public.user_profiles WHERE id = '11111111-1111-1111-1111-111111111111';
SELECT 'Customer Profile:' as type, * FROM public.customer_profiles WHERE id = '11111111-1111-1111-1111-111111111111';

-- Clean up test data
DELETE FROM public.customer_profiles WHERE id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.user_profiles WHERE id = '11111111-1111-1111-1111-111111111111';

SELECT 'Database test completed successfully!' as result;
