# 🚀 SaveMyWines Deployment Guide

This guide covers deploying both the Supabase Edge Functions and the frontend application to production.

## 📋 Prerequisites

### Required Accounts & Keys
- [ ] Supabase project with database and storage configured
- [ ] Google Cloud Vision API key
- [ ] Supabase Service Role Key
- [ ] Cloudflare Pages or Netlify account

### Required Software
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Git for version control
- [ ] Node.js 18+ (for Supabase CLI)

## 🔧 Step 1: Deploy Edge Functions

### 1.1 Login to Supabase
```bash
supabase login
```

### 1.2 Link to Your Project
```bash
supabase link --project-ref ssgraiwyiknqtlhjxvpc
```

### 1.3 Deploy All Functions
**Option A: Use the deployment script (Recommended)**
```bash
# On Windows
deploy-all-functions.bat

# On macOS/Linux
chmod +x deploy-all-functions.sh
./deploy-all-functions.sh
```

**Option B: Deploy manually**
```bash
supabase functions deploy scan_wine
supabase functions deploy add_wine
supabase functions deploy list_wines
```

### 1.4 Set Environment Variables
In your Supabase dashboard:

1. Go to **Settings** → **Edge Functions**
2. Set these environment variables:
   - `VISION_API_KEY`: Your Google Cloud Vision API key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (not anon key)

## 🌐 Step 2: Deploy Frontend

### Option A: Cloudflare Pages (Recommended)

#### 2.1 Install Wrangler CLI
```bash
npm install -g wrangler
```

#### 2.2 Login to Cloudflare
```bash
wrangler login
```

#### 2.3 Deploy
```bash
wrangler pages deploy SaveMyWines --project-name savemywines
```

#### 2.4 Configure Custom Domain (Optional)
- Go to Cloudflare Pages dashboard
- Select your project
- Go to **Custom domains**
- Add your domain

### Option B: Netlify

#### 2.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2.2 Login to Netlify
```bash
netlify login
```

#### 2.3 Deploy
```bash
netlify deploy --prod --dir=SaveMyWines
```

#### 2.4 Configure Custom Domain (Optional)
- Go to Netlify dashboard
- Select your site
- Go to **Domain management**
- Add your domain

## 🔗 Step 3: Update Configuration

After deployment, update your frontend configuration with the production URLs:

### 3.1 Update Edge Function URLs
In `scripts/api.js`, ensure URLs point to your deployed functions:

```javascript
export const CONFIG = {
    SUPABASE_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co",
    SUPABASE_ANON_KEY: "your-anon-key",
    EDGE_SCAN_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/scan_wine",
    EDGE_ADD_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/add_wine",
    EDGE_LIST_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/list_wines",
};
```

### 3.2 Redeploy Frontend
After updating configuration, redeploy the frontend.

## ✅ Step 4: Testing

### 4.1 Test Edge Functions
```bash
# Test scan_wine function
curl -X POST https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/scan_wine \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-image.jpg" \
  -F "device_id=test-device-123"

# Test add_wine function
curl -X POST https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/add_wine \
  -H "Content-Type: application/json" \
  -d '{"device_id":"test","name":"Test Wine","date_purchased":"2024-01-01"}'

# Test list_wines function
curl "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/list_wines?device_id=test-device-123"
```

### 4.2 Test Frontend
1. Visit your deployed site
2. Test wine scanning workflow
3. Verify PWA installation
4. Check all functionality works

## 🚨 Troubleshooting

### Common Issues

#### Edge Functions Not Working
- Check environment variables are set correctly
- Verify function URLs in frontend config
- Check function logs in Supabase dashboard

#### Frontend Deployment Issues
- Ensure all files are in the correct directory
- Check for build errors in deployment logs
- Verify redirects are configured correctly

#### PWA Not Working
- Check manifest.webmanifest is accessible
- Verify service worker is registered
- Ensure HTTPS is enabled (required for PWA)

### Getting Help
- Check Supabase function logs in dashboard
- Review deployment logs from your hosting platform
- Verify all environment variables are set correctly

## 🔒 Security Notes

### Current Implementation
- Uses `device_id` for data segmentation
- No user authentication
- Data is not encrypted at rest

### Future Improvements
- Add Supabase Auth for user management
- Implement JWT-based RLS policies
- Add data encryption for sensitive information

## 📚 Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Netlify Documentation](https://docs.netlify.com/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
