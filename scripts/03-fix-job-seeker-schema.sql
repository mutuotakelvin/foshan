-- Update job_seeker_profiles table to handle all fields properly
ALTER TABLE job_seeker_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Update the trigger function to handle job seeker data properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'zip_code', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')
  );
  
  -- Create specific profile based on user type
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'customer' THEN
    INSERT INTO customer_profiles (
      id,
      newsletter_subscribed
    ) VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'newsletter_subscribed')::boolean, false)
    );
  ELSIF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'job_seeker' THEN
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
