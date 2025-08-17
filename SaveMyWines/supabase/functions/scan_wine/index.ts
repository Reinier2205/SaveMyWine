// supabase/functions/scan_wine/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VISION_KEY = Deno.env.get("VISION_API_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

serve(async (req) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response("Bad Request", { status: 400 });
    }
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const device_id = String(form.get("device_id") || "");
    if (!file || !device_id) return new Response("Missing fields", { status: 400 });

    // 1) Upload to Storage
    const path = `labels/${crypto.randomUUID()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("labels").upload(path, file, {
      contentType: file.type,
      upsert: false
    });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from("labels").getPublicUrl(path);
    const label_image_url = pub?.publicUrl ?? "";

    // 2) Vision API
    const b64 = await file.arrayBuffer().then(a => btoa(String.fromCharCode(...new Uint8Array(a))));
    const visionRes = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [{
          image: { content: b64 },
          features: [{ type: "TEXT_DETECTION" }, { type: "LABEL_DETECTION", maxResults: 10 }]
        }]
      }))
    });
    const vision = await visionRes.json();

    // 3) Extract fields (simple heuristics)
    const annotations = vision?.responses?.[0] || {};
    const text = annotations.fullTextAnnotation?.text || "";
    const labels: string[] = (annotations.labelAnnotations || []).map((l: any) => (l.description || "").toLowerCase());
    const vintageMatch = text.match(/\b(19|20)\d{2}\b/);
    const VARIETALS = ["cabernet sauvignon","merlot","pinotage","shiraz","syrah","pinot noir","chardonnay","sauvignon blanc","chenin blanc","malbec","tempranillo","grenache","riesling","nebbiolo"];
    const varietal = VARIETALS.find(v => text.toLowerCase().includes(v)) || VARIETALS.find(v => labels.includes(v)) || "";

    // crude name/producer guess: first non-empty line not a varietal/year
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    let name = ""; let producer = "";
    for (const line of lines) {
      const l = line.toLowerCase();
      if (!VARIETALS.some(v=>l.includes(v)) && !/\b(19|20)\d{2}\b/.test(l) && l.length > 2) {
        if (!name) name = line;
        else if (!producer && line !== name) { producer = line; break; }
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      device_id,
      name,
      producer,
      varietal,
      vintage: vintageMatch ? Number(vintageMatch[0]) : null,
      region: "",
      alcohol: "",
      notes: "",
      label_image_url
    }), { headers: { "Content-Type": "application/json" }});
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:String(e) }), { status: 500 });
  }
});
