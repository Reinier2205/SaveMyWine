// supabase/functions/add_wine/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  try {
    // Check content type
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response("Bad Request: Expected JSON", { status: 400 });
    }

    // Parse request data
    const data = await req.json();
    const { 
      device_id, 
      name, 
      producer, 
      varietal, 
      vintage, 
      date_purchased, 
      best_drink_date, 
      notes, 
      label_image_url 
    } = data;

    // Validate required fields
    if (!device_id || !name || !date_purchased) {
      return new Response("Missing required fields: device_id, name, date_purchased", { status: 400 });
    }

    // Insert wine into database
    const { error } = await supabase.from("wines").insert({
      device_id,
      name,
      producer,
      varietal,
      vintage,
      date_purchased,
      best_drink_date,
      notes,
      label_image_url
    });

    if (error) {
      console.error('Database insert error:', error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), { 
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    // Return success response
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json' }
    });

  } catch (e) {
    console.error('add_wine function error:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
});
