#!/bin/bash

# Deploy list_wines Edge Function to Supabase
# Make sure you have Supabase CLI installed and are logged in

echo "🚀 Deploying list_wines Edge Function..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first:"
    echo "   supabase login"
    exit 1
fi

# Deploy the function
echo "📦 Deploying function..."
supabase functions deploy list_wines

if [ $? -eq 0 ]; then
    echo "✅ list_wines Edge Function deployed successfully!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Ensure environment variables are set in Supabase dashboard:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "2. Test the function by querying wines"
    echo "3. Check function logs in Supabase dashboard"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
