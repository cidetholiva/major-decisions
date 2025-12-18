//testing
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

    const { query, topJobTitle } = req.body ?? {};
    if (!query) return res.status(400).json({ error: "Missing query" });

    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_ANON_KEY!;
    if (!url || !key) return res.status(500).json({ error: "Missing Supabase env vars" });

    const supabase = createClient(url, key);

    const { error } = await supabase.from("searches").insert([
      { query, top_job_title: topJobTitle ?? null },
    ]);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error", details: String(err?.message ?? err) });
  }
}
