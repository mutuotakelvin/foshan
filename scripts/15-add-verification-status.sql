-- Add verification status and related fields to job_seeker_profiles table

-- Add new columns for verification tracking
ALTER TABLE job_seeker_profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS can_edit_application BOOLEAN DEFAULT true;

-- Update existing records to have default values
UPDATE job_seeker_profiles 
SET 
  verification_status = 'unverified',
  can_edit_application = true
WHERE verification_status IS NULL OR can_edit_application IS NULL;

-- Create index for faster queries on verification status
CREATE INDEX IF NOT EXISTS idx_job_seeker_verification_status ON job_seeker_profiles(verification_status);

-- Add a trigger to automatically set verified_at when status changes to 'verified'
CREATE OR REPLACE FUNCTION update_verified_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set verified_at when status changes to 'verified'
  IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
    NEW.verified_at = NOW();
  END IF;
  
  -- Clear verified_at when status changes away from 'verified'
  IF NEW.verification_status != 'verified' AND OLD.verification_status = 'verified' THEN
    NEW.verified_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_verified_at ON job_seeker_profiles;
CREATE TRIGGER trigger_update_verified_at
  BEFORE UPDATE ON job_seeker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_verified_at();

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'job_seeker_profiles' 
  AND column_name IN ('verification_status', 'verification_notes', 'verified_at', 'can_edit_application')
ORDER BY column_name;

-- Show sample data
SELECT 
  id,
  verification_status,
  can_edit_application,
  application_status,
  created_at
FROM job_seeker_profiles 
LIMIT 5;
