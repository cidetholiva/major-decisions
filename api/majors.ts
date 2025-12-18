//trying
import type { VercelRequest, VercelResponse } from "@vercel/node";

const UMD_BASE = "https://api.umd.io/v0"; 

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = (req.query.q as string)?.trim().toLowerCase();
    if (!q) return res.status(400).json({ error: "Missing q" });

    // majors list
    const majorsResp = await fetch(`${UMD_BASE}/majors`);
    const majors = await majorsResp.json();

    const matchedMajors = (majors ?? [])
      .filter((m: any) => {
        const name = String(m?.name ?? "").toLowerCase();
        const dept = String(m?.department ?? "").toLowerCase();
        return name.includes(q) || dept.includes(q);
      })
      .slice(0, 10)
      .map((m: any) => ({
        name: m?.name,
        department: m?.department,
        degree: m?.degree, // if has
      }));

    // related courses( guess based on query/skills)
    const deptGuess = guessDeptFromKeyword(q); // ex: "ux" --> "INST", "software" --> "CMSC"
    let courses: any[] = [];

    if (deptGuess) {
      const courseUrl = new URL(`${UMD_BASE}/courses`);
      courseUrl.searchParams.set("dept_id", deptGuess);
      courseUrl.searchParams.set("per_page", "10");
      const courseResp = await fetch(courseUrl.toString());
      courses = (await courseResp.json()).map((c: any) => ({
        course_id: c.course_id,
        name: c.name,
        credits: c.credits,
        description: c.description,
      }));
    }

    return res.status(200).json({ majors: matchedMajors, deptGuess, courses });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error", details: String(err?.message ?? err) });
  }
}

function guessDeptFromKeyword(q: string) {
  ///just to test
  if (q.includes("ux") || q.includes("ui") || q.includes("design") || q.includes("product")) return "INST";
  if (q.includes("software") || q.includes("developer") || q.includes("computer")) return "CMSC";
  if (q.includes("data") || q.includes("analytics")) return "INST";
  if (q.includes("math")) return "MATH";
  if (q.includes("business") || q.includes("marketing") || q.includes("finance")) return "BMGT";
  return null;
}
