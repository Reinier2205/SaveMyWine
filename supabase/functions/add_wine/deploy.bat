@echo off
echo 🚀 Deploying add_wine Edge Function...

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

REM Deploy the function
echo 📦 Deploying function...
supabase functions deploy add_wine

if %errorlevel% equ 0 (
    echo ✅ add_wine Edge Function deployed successfully!
    echo.
    echo 🔧 Next steps:
    echo 1. Ensure environment variables are set in Supabase dashboard:
    echo    - SUPABASE_URL
    echo    - SUPABASE_SERVICE_ROLE_KEY
    echo.
    echo 2. Test the function with wine data
    echo 3. Check function logs in Supabase dashboard
) else (
    echo ❌ Deployment failed. Check the error messages above.
)

pause
