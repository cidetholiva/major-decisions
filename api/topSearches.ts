// reads supabase and returns top searches (adding this to show supabase working)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Use GET!" });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      return res.status(500).json({ error: "missing Supabase env vars" });
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("saved_searches")
      .select("query");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const q = String(row.query ?? "").toLowerCase().trim();
      if (!q) continue;
      counts[q] = (counts[q] || 0) + 1;
    }

    const top5 = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) //only shows 5
      .map(([keyword, searches]) => ({ keyword, searches }));

    return res.status(200).json({ top: top5 });
  } catch (err: any) {
    return res.status(500).json({
      error: "server error",
      details: String(err?.message ?? err),
    });
  }
}
