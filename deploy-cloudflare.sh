#!/bin/bash

echo "🚀 Deploying SaveMyWines to Cloudflare Pages..."
echo "================================================"

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please login first:"
    wrangler login
    exit 1
fi

# Check if SaveMyWines folder exists
if [ ! -d "SaveMyWines" ]; then
    echo "❌ SaveMyWines folder not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Deploying SaveMyWines folder to Cloudflare Pages..."
wrangler pages deploy SaveMyWines --project-name savemywine

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app should be available at: https://savemywine.pages.dev"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Wait a few minutes for the deployment to propagate"
    echo "2. Visit https://savemywine.pages.dev to test"
    echo "3. Check Cloudflare Pages dashboard for deployment status"
else
    echo ""
    echo "❌ Deployment failed. Check the error messages above."
fi

echo ""
