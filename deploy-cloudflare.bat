@echo off
echo 🚀 Deploying SaveMyWines to Cloudflare Pages...
echo ================================================

REM Check if Wrangler is installed
wrangler --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Wrangler CLI not found. Installing...
    npm install -g wrangler
)

REM Check if logged in
wrangler whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Cloudflare. Please login first:
    wrangler login
    pause
    exit /b 1
)

REM Check if current directory contains required files
if not exist "index.html" (
    echo ❌ index.html not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📦 Deploying current directory to Cloudflare Pages...
wrangler pages deploy . --project-name savemywine

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo 🌐 Your app should be available at: https://savemywine.pages.dev
    echo.
    echo 🔧 Next steps:
    echo 1. Wait a few minutes for the deployment to propagate
    echo 2. Visit https://savemywine.pages.dev to test
    echo 3. Check Cloudflare Pages dashboard for deployment status
) else (
    echo.
    echo ❌ Deployment failed. Check the error messages above.
)

echo.
pause
