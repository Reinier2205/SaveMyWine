# Supabase Setup for SaveMyWines

This directory contains the database schema and setup instructions for the SaveMyWines application.

## Files

- `schema.sql` - Database table creation and RLS policies
- `README.md` - This setup guide

## Manual Setup Steps

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `savemywines` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Click "Create new project"
7. Wait for project setup to complete

### 2. Run Database Schema

1. In your Supabase project dashboard, go to "SQL Editor"
2. Copy the contents of `schema.sql`
3. Paste and run the SQL commands
4. Verify the `wines` table is created in "Table Editor"

### 3. Create Storage Bucket

1. In Supabase dashboard, go to "Storage"
2. Click "Create a new bucket"
3. Configure the bucket:
   - Name: `labels`
   - Public: `false` (keep private)
   - File size limit: Set appropriate limit (e.g., 10MB)
4. Click "Create bucket"

### 4. Configure Row Level Security (RLS)

The RLS policies are already included in the schema.sql file and will be created when you run it. These policies ensure that:
- Users can only access wines with their `device_id`
- Data is properly segmented between different devices/users

### 5. Update Environment Variables

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy the following values:
   - Project URL
   - Anon (public) key
3. Update the placeholders in `scripts/api.js`:
   ```javascript
   export const CONFIG = {
       SUPABASE_URL: "https://your-project-id.supabase.co",
       SUPABASE_ANON_KEY: "your-anon-key-here",
       EDGE_SCAN_URL: "https://your-project-id.supabase.co/functions/v1/scan_wine",
   };
   ```

### 6. Create Edge Function (Optional for MVP)

For the MVP without login, you'll need an Edge Function to handle wine scanning:

1. In Supabase dashboard, go to "Edge Functions"
2. Create a new function called `scan_wine`
3. This function will:
   - Accept the `device_id` from the request
   - Use service role credentials to write to the database
   - Avoid direct client table writes

## Security Notes

- **No PII**: The wines table contains no personally identifiable information
- **Device-based segmentation**: Data is segmented by `device_id` for privacy
- **RLS enabled**: Row Level Security prevents cross-device data access
- **Private storage**: Label images are stored in a private bucket

## Testing

After setup:
1. Verify the `wines` table exists and has RLS enabled
2. Test inserting a wine record with a `device_id`
3. Verify that RLS policies work correctly
4. Test the storage bucket by uploading a test image

## Troubleshooting

- **RLS errors**: Ensure RLS is enabled and policies are created
- **Permission denied**: Check that the `device_id` matches the JWT claims
- **Storage access**: Verify bucket permissions and RLS rules
- **Connection issues**: Check your Supabase URL and API keys

## Next Steps

Once Supabase is configured:
1. Update the frontend code to use Supabase client
2. Implement device ID generation in localStorage
3. Create the Edge Function for wine scanning
4. Test the complete data flow
