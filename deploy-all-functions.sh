#!/bin/bash

# SaveMyWines - Deploy All Edge Functions
# This script deploys all Edge Functions to Supabase

set -e  # Exit on any error

echo "🚀 SaveMyWines - Deploying All Edge Functions"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Please install it first:${NC}"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Supabase. Please login first:${NC}"
    echo "   supabase login"
    exit 1
fi

# Check if project is linked
if ! supabase status | grep -q "Linked to"; then
    echo -e "${YELLOW}⚠️  Project not linked. Linking to SaveMyWines project...${NC}"
    supabase link --project-ref ssgraiwyiknqtlhjxvpc
fi

echo -e "${BLUE}📋 Deploying Edge Functions...${NC}"

# Function to deploy a single Edge Function
deploy_function() {
    local function_name=$1
    local function_path="supabase/functions/$function_name"
    
    echo -e "${BLUE}📦 Deploying $function_name...${NC}"
    
    if [ ! -d "$function_path" ]; then
        echo -e "${RED}❌ Function directory $function_path not found${NC}"
        return 1
    fi
    
    if supabase functions deploy "$function_name"; then
        echo -e "${GREEN}✅ $function_name deployed successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to deploy $function_name${NC}"
        return 1
    fi
}

# Deploy all functions
functions=("scan_wine" "add_wine" "list_wines")
deployment_success=true

for func in "${functions[@]}"; do
    if ! deploy_function "$func"; then
        deployment_success=false
    fi
done

echo ""
echo "=============================================="

if [ "$deployment_success" = true ]; then
    echo -e "${GREEN}🎉 All Edge Functions deployed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🔧 Next steps:${NC}"
    echo "1. Set environment variables in Supabase dashboard:"
    echo "   - VISION_API_KEY (Google Cloud Vision API key)"
    echo "   - SUPABASE_SERVICE_ROLE_KEY (from your project settings)"
    echo ""
    echo "2. Test the functions:"
    echo "   - scan_wine: Test with a wine label image"
    echo "   - add_wine: Test saving wine data"
    echo "   - list_wines: Test retrieving wine collection"
    echo ""
    echo "3. Deploy the frontend to Cloudflare Pages or Netlify"
    echo ""
    echo -e "${YELLOW}⚠️  Important: Environment variables must be set for functions to work!${NC}"
else
    echo -e "${RED}❌ Some functions failed to deploy. Check the errors above.${NC}"
    exit 1
fi
