#!/bin/bash

echo "Setting up environment variables for Heritage Crafted Interiors"
echo "=============================================================="
echo ""

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# To get these values:
# 1. Go to https://supabase.com
# 2. Create a new project or select existing one
# 3. Go to Settings > API
# 4. Copy the Project URL and anon/public key
# 5. Replace the values above
EOF

echo "Created .env.local file with placeholder values."
echo ""
echo "Next steps:"
echo "1. Go to https://supabase.com and create a project"
echo "2. Get your Project URL and anon key from Settings > API"
echo "3. Update the values in .env.local"
echo "4. Run the database setup scripts in the scripts/ folder"
echo "5. Restart the development server with 'pnpm dev'"
echo ""
echo "The app should then work properly!"
