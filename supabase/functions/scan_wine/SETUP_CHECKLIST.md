# scan_wine Edge Function Setup Checklist

## ✅ Prerequisites

- [ ] Supabase project created and accessible
- [ ] Database schema executed (wines table with RLS)
- [ ] Storage bucket "labels" created
- [ ] Supabase CLI installed (`npm install -g supabase`)

## 🔑 Required API Keys

- [ ] **Google Vision API Key**
  - Go to [Google Cloud Console](https://console.cloud.google.com/)
  - Enable Vision API
  - Create credentials (API key)
  - Copy the API key

- [ ] **Supabase Service Role Key**
  - Go to your Supabase project dashboard
  - Settings → API
  - Copy the "service_role" key (NOT the anon key)

## 🚀 Deployment Steps

1. **Login to Supabase CLI**
   ```bash
   supabase login
   ```

2. **Link to your project**
   ```bash
   supabase link --project-ref ssgraiwyiknqtlhjxvpc
   ```

3. **Deploy the function**
   ```bash
   supabase functions deploy scan_wine
   ```

## ⚙️ Environment Variables

After deployment, set these in Supabase dashboard:

1. Go to **Settings → Edge Functions**
2. Find `scan_wine` function
3. Click **Settings**
4. Add environment variables:
   - `VISION_API_KEY` = Your Google Vision API key
   - `SUPABASE_URL` = https://ssgraiwyiknqtlhjxvpc.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key

## 🧪 Testing

1. **Test with dummy image**
   - Open browser console on any page
   - Load `test.js` script
   - Run `testScanWine()`

2. **Test with real wine label**
   - Use `testWithRealImage(imageFile)`
   - Check function logs in Supabase dashboard

## 🔍 Verification

- [ ] Function deploys without errors
- [ ] Environment variables are set correctly
- [ ] Function responds to test requests
- [ ] Images upload to storage bucket
- [ ] Vision API calls work
- [ ] Wine data extraction works
- [ ] Function returns proper JSON response

## 🚨 Troubleshooting

### Common Issues

1. **Function deployment fails**
   - Check Supabase CLI installation
   - Verify project linking
   - Check function code syntax

2. **Environment variable errors**
   - Verify all 3 variables are set
   - Check for typos in values
   - Ensure service role key is correct

3. **Vision API errors**
   - Verify API key is valid
   - Check Vision API is enabled
   - Verify billing is set up

4. **Storage upload fails**
   - Check bucket permissions
   - Verify RLS policies
   - Check service role permissions

## 📞 Support

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Google Cloud Vision API Docs](https://cloud.google.com/vision/docs)
- [Function Logs](https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/scan_wine)

## 🎯 Success Criteria

- Function deploys successfully
- Accepts multipart/form-data requests
- Uploads images to storage
- Calls Vision API successfully
- Returns parsed wine data
- Handles errors gracefully
