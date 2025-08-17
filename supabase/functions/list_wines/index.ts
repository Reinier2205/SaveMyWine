// supabase/functions/list_wines/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  try {
    // Get device_id from query parameters
    const url = new URL(req.url);
    const device_id = url.searchParams.get("device_id");

    if (!device_id) {
      return new Response("Missing device_id parameter", { status: 400 });
    }

    // Query wines by device_id
    const { data, error } = await supabase
      .from("wines")
      .select("*")
      .eq("device_id", device_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), { 
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    // Return wines array
    return new Response(JSON.stringify(data || []), {
      headers: { 'content-type': 'application/json' }
    });

  } catch (e) {
    console.error('list_wines function error:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { 
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
});
