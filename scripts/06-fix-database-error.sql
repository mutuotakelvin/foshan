-- Drop existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate tables with proper structure
DROP TABLE IF EXISTS job_seeker_profiles CASCADE;
DROP TABLE IF EXISTS customer_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'job_seeker')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer-specific data table
CREATE TABLE customer_profiles (
  id UUID REFERENCES user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job seeker-specific data table
CREATE TABLE job_seeker_profiles (
  id UUID REFERENCES user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  position_interest TEXT,
  experience_level TEXT,
  availability TEXT,
  bio TEXT,
  resume_url TEXT,
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected', 'interview_scheduled')),
  job_alerts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customer_profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable insert for authenticated users only" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON customer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id" ON customer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON customer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON job_seeker_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id" ON job_seeker_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON job_seeker_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Enable select for users based on customer_id" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Create a simpler trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into user_profiles first
  INSERT INTO public.user_profiles (
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
    INSERT INTO public.customer_profiles (
      id,
      newsletter_subscribed
    ) VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'newsletter_subscribed')::boolean, false)
    );
  ELSIF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'job_seeker' THEN
    INSERT INTO public.job_seeker_profiles (
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
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
