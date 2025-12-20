//using w/diff api  (orginal api stopped working )
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = String(req.query.q ?? "").trim();
    const location = String(req.query.location ?? "").trim();
    const remote = req.query.remote === "true";

    // view more 
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const pageSize = Math.min(20, Math.max(5, Number(req.query.pageSize ?? 10) || 10)); //10 results

    if (!q) {
      return res.status(400).json({ error: "Missing q" });
    }

    const apiKey = process.env.OPENWEBNINJA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "missing API key" });
    }

    //had trouble getting actual meanignful results so this splits query into meaningful tokens so ANY word can match
    function tokensFromQuery(text: string) {
      const stop = new Set([
        "the","and","or","to","of","in","a","an","for","with","on","at","by","from","as","is","are","be","this","that","job","jobs","role","roles","position","positions","intern","internship","entry","level"]);

      return String(text ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .map(t => t.trim())
        .filter(Boolean)
        .filter(t => t.length >= 3)
        .filter(t => !stop.has(t));
    }

    // build a small set of word tokens (so we don’t spam the API)
    const queryTokens = Array.from(new Set(tokensFromQuery(q))).slice(0, 5);

    // if user typed only short/stop words, fall back to the full query
    const terms = queryTokens.length > 0 ? queryTokens : [q];

    // fetch multiple searches and merge so results match ANy word
    const resultsMap = new Map<string, any>();

    async function fetchOne(term: string) {
      const url = new URL("https://api.openwebninja.com/jsearch/search"); //new working api
      url.searchParams.set("query", term);
      url.searchParams.set("page", String(page));
      url.searchParams.set("num_pages", "1");
      url.searchParams.set("country", "us");

      if (location) {
        url.searchParams.set("location", location);
      }

      if (remote) {
        url.searchParams.set("work_from_home", "true");
      }

      const r = await fetch(url.toString(), {
        headers: { //?? idk but it works even with this error
          "x-api-key": apiKey, Accept: "application/json",},
      });

      const data = await r.json();

      if (!r.ok) {
        return { ok: false, data };
      }

      const arr = data?.data ?? [];
      for (const j of arr) {
        const dedupeKey =
          String(j?.job_id ?? "") ||
          String(j?.job_apply_link ?? "") ||
          `${j?.job_title ?? ""}||${j?.employer_name ?? ""}||${j?.job_location ?? ""}`;

        if (dedupeKey && !resultsMap.has(dedupeKey)) {
          resultsMap.set(dedupeKey, j);
        }
      }

      return { ok: true, data };
    }

    const responses = await Promise.all(terms.map(t => fetchOne(t)));

    // if eveyrhing failed, this returns a warning (but doesn't crash UI)
    const anyOk = responses.some(r => r.ok);
    if (!anyOk) {
      const msg = responses.find(r => !r.ok)?.data?.message ?? "Job API error";
      return res.status(200).json({ jobs: [], warning: msg, page, hasMore: false });
    }

    const mergedRaw = Array.from(resultsMap.values());

    // map to UI shape
    const jobs = mergedRaw.slice(0, pageSize).map((j: any) => ({
      title: j?.job_title ?? "Untitled",
      company: j?.employer_name ?? "Unknown company",
      location:
        j?.job_city && j?.job_state
          ? `${j.job_city}, ${j.job_state}`
          : j?.job_location ?? "Remote / Unknown",
      description: j?.job_description?.slice(0, 400) ?? "",

      // keeps skill logic, but also returns rawQualifications for phrase extraction
      rawQualifications: j?.job_highlights?.Qualifications ?? [],
      skills: j?.job_highlights?.Qualifications?.slice(0, 6) ?? [],

      // job links
      url: j?.job_apply_link ?? null,
      employerWebsite: j?.employer_website ?? null,
    }));

    // simple "has more" signal for view more
    const hasMore = mergedRaw.length >= pageSize;

    return res.status(200).json({ jobs, page, hasMore });
  } catch (err: any) {
    return res.status(500).json({
      error: "Server error",
      details: String(err?.message ?? err),
    });
  }
}
