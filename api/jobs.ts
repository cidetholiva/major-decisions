// trying it out
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) return res.status(400).json({ error: "Missing q" });

    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", q);
    url.searchParams.set("page", "1");
    url.searchParams.set("num_pages", "1");

    const rapidKey = process.env.RAPIDAPI_KEY;
    const rapidHost = process.env.RAPIDAPI_HOST;

    if (!rapidKey || !rapidHost) {
      return res.status(500).json({ error: "Missing RAPIDAPI env vars" });
    }

    const r = await fetch(url.toString(), {
      headers: {
        "X-RapidAPI-Key": rapidKey,
        "X-RapidAPI-Host": rapidHost,
      },
    });

    const data = await r.json().catch(() => ({}));

   
    if (!r.ok) {
      // in case it fails 
      return res.status(200).json({
        jobs: [
          {title: "Software Engineer (Demo)", company: "Example Co",  location: "College Park, MD", description: "Demo job shown because JSearch is not available.",salary: null,skills: ["JavaScript", "React", "APIs"],},],
        warning: data?.message ?? "JSearch unavailable--demo fallback.",
      });
    }

    // jsearch ui
    const jobs = (data?.data ?? []).slice(0, 12).map((j: any) => {
      const quals: string[] =
        j?.job_highlights?.Qualifications ??
        j?.job_highlights?.qualifications ??
        [];

      return {
        title: j?.job_title ?? "Untitled",
        company: j?.employer_name ?? "Unknown employer",
        location: j?.job_city && j?.job_state ? `${j.job_city}, ${j.job_state}` : (j?.job_location ?? "Unknown"),
        description: j?.job_description?.slice(0, 500) ?? "",
        salary: j?.job_salary ?? null,
        skills: extractSkillsFromTextArray(quals),
      };
    });

    return res.status(200).json({ jobs });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error", details: String(err?.message ?? err) });
  }
}

function extractSkillsFromTextArray(lines: string[]) {
  const text = (lines ?? []).join(" ").toLowerCase();

  // bc no api to crossreference, use this while i figure out
  const skillBank = ["python", "java", "javascript", "typescript", "react", "node","sql", "excel", "aws", "azure", "gcp", "ui", "ux", "figma", "data", "analytics", "security",];

  const found = skillBank.filter(s => text.includes(s));

  return found.map(s => (s === "ui" || s === "ux") ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1));
}
