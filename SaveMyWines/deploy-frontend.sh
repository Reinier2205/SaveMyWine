#!/bin/bash

# SaveMyWines - Frontend Deployment Script
# Supports both Cloudflare Pages and Netlify

set -e

echo "🌐 SaveMyWines - Frontend Deployment"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if SaveMyWines directory exists
if [ ! -d "SaveMyWines" ]; then
    echo -e "${RED}❌ SaveMyWines directory not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Function to deploy to Cloudflare Pages
deploy_cloudflare() {
    echo -e "${BLUE}🚀 Deploying to Cloudflare Pages...${NC}"
    
    # Check if Wrangler is installed
    if ! command -v wrangler &> /dev/null; then
        echo -e "${YELLOW}⚠️  Wrangler CLI not found. Installing...${NC}"
        npm install -g wrangler
    fi
    
    # Check if logged in
    if ! wrangler whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Not logged in to Cloudflare. Please login first:${NC}"
        wrangler login
    fi
    
    # Deploy
    echo -e "${BLUE}📦 Deploying...${NC}"
    wrangler pages deploy SaveMyWines --project-name savemywines
    
    echo -e "${GREEN}✅ Deployed to Cloudflare Pages successfully!${NC}"
}

# Function to deploy to Netlify
deploy_netlify() {
    echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
        npm install -g netlify-cli
    fi
    
    # Check if logged in
    if ! netlify status &> /dev/null; then
        echo -e "${YELLOW}⚠️  Not logged in to Netlify. Please login first:${NC}"
        netlify login
    fi
    
    # Deploy
    echo -e "${BLUE}📦 Deploying...${NC}"
    netlify deploy --prod --dir=SaveMyWines
    
    echo -e "${GREEN}✅ Deployed to Netlify successfully!${NC}"
}

# Main deployment logic
echo -e "${BLUE}Choose deployment platform:${NC}"
echo "1) Cloudflare Pages (Recommended)"
echo "2) Netlify"
echo "3) Both (for redundancy)"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_cloudflare
        ;;
    2)
        deploy_netlify
        ;;
    3)
        echo -e "${BLUE}🔄 Deploying to both platforms...${NC}"
        deploy_cloudflare
        echo ""
        deploy_netlify
        ;;
    4)
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Frontend deployment completed!${NC}"
echo ""
echo -e "${BLUE}🔧 Next steps:${NC}"
echo "1. Test your deployed application"
echo "2. Verify PWA installation works"
echo "3. Test wine scanning workflow"
echo "4. Configure custom domain (optional)"
echo ""
echo -e "${YELLOW}⚠️  Remember: Edge Functions must be deployed and configured first!${NC}"
