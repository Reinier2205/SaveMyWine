@echo off
setlocal enabledelayedexpansion

echo 🌐 SaveMyWines - Frontend Deployment
echo ====================================

REM Check if SaveMyWines directory exists
if not exist "SaveMyWines" (
    echo ❌ SaveMyWines directory not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo Choose deployment platform:
echo 1) Cloudflare Pages (Recommended)
echo 2) Netlify
echo 3) Both (for redundancy)
echo 4) Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_cloudflare
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto exit_script
echo Invalid choice. Please run the script again.
pause
exit /b 1

:deploy_cloudflare
echo 🚀 Deploying to Cloudflare Pages...
call :check_wrangler
call :deploy_cf
goto end_deployment

:deploy_netlify
echo 🚀 Deploying to Netlify...
call :check_netlify
call :deploy_netlify_func
goto end_deployment

:deploy_both
echo 🔄 Deploying to both platforms...
call :check_wrangler
call :deploy_cf
echo.
call :check_netlify
call :deploy_netlify_func
goto end_deployment

:check_wrangler
REM Check if Wrangler is installed
wrangler --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Wrangler CLI not found. Installing...
    npm install -g wrangler
)
REM Check if logged in
wrangler whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Not logged in to Cloudflare. Please login first:
    wrangler login
)
exit /b 0

:deploy_cf
echo 📦 Deploying to Cloudflare Pages...
wrangler pages deploy SaveMyWines --project-name savemywines
if %errorlevel% equ 0 (
    echo ✅ Deployed to Cloudflare Pages successfully!
) else (
    echo ❌ Cloudflare Pages deployment failed
)
exit /b 0

:check_netlify
REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Netlify CLI not found. Installing...
    npm install -g netlify-cli
)
REM Check if logged in
netlify status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Not logged in to Netlify. Please login first:
    netlify login
)
exit /b 0

:deploy_netlify_func
echo 📦 Deploying to Netlify...
netlify deploy --prod --dir=SaveMyWines
if %errorlevel% equ 0 (
    echo ✅ Deployed to Netlify successfully!
) else (
    echo ❌ Netlify deployment failed
)
exit /b 0

:end_deployment
echo.
echo 🎉 Frontend deployment completed!
echo.
echo 🔧 Next steps:
echo 1. Test your deployed application
echo 2. Verify PWA installation works
echo 3. Test wine scanning workflow
echo 4. Configure custom domain (optional)
echo.
echo ⚠️  Remember: Edge Functions must be deployed and configured first!
echo.
pause

:exit_script
echo Deployment cancelled.
pause
exit /b 0
