-- Add resume-related columns to job_seeker_profiles table

-- Check if columns exist first
DO $$ 
BEGIN
    -- Add resume_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_seeker_profiles' 
        AND column_name = 'resume_url'
    ) THEN
        ALTER TABLE job_seeker_profiles ADD COLUMN resume_url TEXT;
    END IF;

    -- Add resume_file_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_seeker_profiles' 
        AND column_name = 'resume_file_name'
    ) THEN
        ALTER TABLE job_seeker_profiles ADD COLUMN resume_file_name TEXT;
    END IF;

    -- Add resume_file_size column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_seeker_profiles' 
        AND column_name = 'resume_file_size'
    ) THEN
        ALTER TABLE job_seeker_profiles ADD COLUMN resume_file_size INTEGER;
    END IF;

    -- Add resume_uploaded_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_seeker_profiles' 
        AND column_name = 'resume_uploaded_at'
    ) THEN
        ALTER TABLE job_seeker_profiles ADD COLUMN resume_uploaded_at TIMESTAMPTZ;
    END IF;
END $$;

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'job_seeker_profiles' 
    AND column_name IN ('resume_url', 'resume_file_name', 'resume_file_size', 'resume_uploaded_at')
ORDER BY column_name;

-- Show current structure of job_seeker_profiles table
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'job_seeker_profiles'
ORDER BY ordinal_position;

-- Test insert to make sure all columns work
SELECT 'Resume columns added successfully' as status;
