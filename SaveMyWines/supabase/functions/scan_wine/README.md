# scan_wine Edge Function

This Edge Function handles wine label scanning using Google Vision API and Supabase storage.

## Function Overview

The `scan_wine` function:
1. Accepts multipart/form-data with `file` and `device_id`
2. Uploads the image to Supabase storage in the `labels/` bucket
3. Calls Google Vision API for text and label detection
4. Parses wine information (name, producer, varietal, vintage, region)
5. Returns structured JSON with extracted data and image URL

## Environment Variables Required

Set these in your Supabase project dashboard under Settings > Edge Functions:

- `VISION_API_KEY` - Google Cloud Vision API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (not anon key)

## Deployment

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref YOUR_PROJECT_REF`
4. Deploy: `supabase functions deploy scan_wine`

## Usage

Send a POST request to `/functions/v1/scan_wine` with:

```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('device_id', 'device123');

const response = await fetch('/functions/v1/scan_wine', {
  method: 'POST',
  body: formData
});
```

## Response Format

```json
{
  "ok": true,
  "device_id": "device123",
  "name": "Château Margaux",
  "producer": "Château Margaux",
  "varietal": "cabernet sauvignon",
  "vintage": 2015,
  "region": "",
  "alcohol": "",
  "notes": "",
  "label_image_url": "https://..."
}
```

## Error Handling

Returns `{ "ok": false, "error": "error message" }` on failure.

## Dependencies

- Deno runtime
- @supabase/supabase-js v2
- Google Cloud Vision API

## Notes

- The function uses simple heuristics to extract wine information
- Varietal detection is based on a predefined list
- Vintage detection uses regex for 19xx/20xx years
- Images are stored with UUID prefixes to avoid conflicts
