@echo off
setlocal enabledelayedexpansion

echo 🚀 SaveMyWines - Deploying All Edge Functions
echo ==============================================

REM Check if Supabase CLI is installed
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found. Please install it first:
    echo    npm install -g supabase
    pause
    exit /b 1
)

REM Check if user is logged in
supabase status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Supabase. Please login first:
    echo    supabase login
    pause
    exit /b 1
)

REM Check if project is linked
supabase status | findstr "Linked to" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Project not linked. Linking to SaveMyWines project...
    supabase link --project-ref ssgraiwyiknqtlhjxvpc
)

echo 📋 Deploying Edge Functions...

REM Function to deploy a single Edge Function
:deploy_function
set function_name=%1
set function_path=supabase\functions\%function_name%

echo 📦 Deploying %function_name%...

if not exist "%function_path%" (
    echo ❌ Function directory %function_path% not found
    exit /b 1
)

supabase functions deploy %function_name%
if %errorlevel% equ 0 (
    echo ✅ %function_name% deployed successfully!
    exit /b 0
) else (
    echo ❌ Failed to deploy %function_name%
    exit /b 1
)

REM Deploy all functions
echo.
echo 📦 Deploying scan_wine...
call :deploy_function scan_wine
if %errorlevel% neq 0 (
    echo ❌ scan_wine deployment failed
    pause
    exit /b 1
)

echo.
echo 📦 Deploying add_wine...
call :deploy_function add_wine
if %errorlevel% neq 0 (
    echo ❌ add_wine deployment failed
    pause
    exit /b 1
)

echo.
echo 📦 Deploying list_wines...
call :deploy_function list_wines
if %errorlevel% neq 0 (
    echo ❌ list_wines deployment failed
    pause
    exit /b 1
)

echo.
echo ==============================================
echo 🎉 All Edge Functions deployed successfully!
echo.
echo 🔧 Next steps:
echo 1. Set environment variables in Supabase dashboard:
echo    - VISION_API_KEY (Google Cloud Vision API key)
echo    - SUPABASE_SERVICE_ROLE_KEY (from your project settings)
echo.
echo 2. Test the functions:
echo    - scan_wine: Test with a wine label image
echo    - add_wine: Test saving wine data
echo    - list_wines: Test retrieving wine collection
echo.
echo 3. Deploy the frontend to Cloudflare Pages or Netlify
echo.
echo ⚠️  Important: Environment variables must be set for functions to work!
echo.
pause
