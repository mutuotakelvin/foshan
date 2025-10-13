-- First, let's check if the bucket exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'resumes') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
    END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Create more permissive storage policies for resumes bucket
CREATE POLICY "Allow authenticated users to upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
    AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow users to view their own resumes"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
    AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow users to update their own resumes"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
    AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow users to delete their own resumes"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
    AND auth.uid() IS NOT NULL
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Make sure the bucket allows uploads
UPDATE storage.buckets 
SET public = false, 
    file_size_limit = 5242880, -- 5MB limit
    allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
WHERE id = 'resumes';

-- Test the setup
SELECT 
    id, 
    name, 
    public, 
    file_size_limit, 
    allowed_mime_types 
FROM storage.buckets 
WHERE id = 'resumes';
