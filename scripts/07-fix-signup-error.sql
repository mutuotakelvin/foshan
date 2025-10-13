-- Drop existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function with better error handling and logging
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type_val TEXT;
BEGIN
  -- Get user type from metadata, default to 'customer'
  user_type_val := COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer');
  
  -- Log the attempt
  RAISE LOG 'Creating profile for user: % with type: %', NEW.id, user_type_val;
  
  -- Insert user profile with all metadata
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
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'zip_code', ''),
    user_type_val
  );
  
  -- Create specific profile based on user type
  IF user_type_val = 'customer' THEN
    INSERT INTO customer_profiles (
      id,
      newsletter_subscribed
    ) VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'newsletter_subscribed')::boolean, false)
    );
    RAISE LOG 'Created customer profile for user: %', NEW.id;
  ELSIF user_type_val = 'job_seeker' THEN
    INSERT INTO job_seeker_profiles (
      id,
      position_interest,
      experience_level,
      availability,
      bio,
      job_alerts
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'position_interest', ''),
      COALESCE(NEW.raw_user_meta_data->>'experience_level', ''),
      COALESCE(NEW.raw_user_meta_data->>'availability', ''),
      COALESCE(NEW.raw_user_meta_data->>'bio', ''),
      COALESCE((NEW.raw_user_meta_data->>'job_alerts')::boolean, false)
    );
    RAISE LOG 'Created job seeker profile for user: %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    -- Re-raise the exception to prevent user creation if profile creation fails
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies to be more permissive for inserts
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Customers can insert own profile" ON customer_profiles;
CREATE POLICY "Customers can insert own profile" ON customer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Job seekers can insert own profile" ON job_seeker_profiles;
CREATE POLICY "Job seekers can insert own profile" ON job_seeker_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Test the setup
DO $$
BEGIN
  RAISE LOG 'Database setup completed successfully';
END $$;
