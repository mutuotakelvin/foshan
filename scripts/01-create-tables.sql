-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID REFERENCES user_profiles(id) PRIMARY KEY,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job seeker-specific data table
CREATE TABLE IF NOT EXISTS job_seeker_profiles (
  id UUID REFERENCES user_profiles(id) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS orders (
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

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can view own profile" ON customer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON customer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Job seekers can view own profile" ON job_seeker_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Job seekers can update own profile" ON job_seeker_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);
