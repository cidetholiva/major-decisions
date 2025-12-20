//fetching majors
import type { VercelRequest, VercelResponse } from "@vercel/node";

const UMD_BASE = "https://api.umd.io/v1"; 

// makes search fast after first hit
let majorsCache: any[] | null = null;

// courses list (minified) so its faster
let coursesMinCache: any[] | null = null;

// do full course objects by id (so it don’t refetch the same ids repeatedly)
const fullCourseCache = new Map<string, any>();

// fuse is only used because it helps with "related" matching (not exact word matching) --ps. fuse is a library (fuse.js)
let FuseMod: any = null;

// fuse indexes built once (important for speed)
let majorsFuse: any = null;
let coursesFuse: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = (req.query.q as string)?.trim().toLowerCase();
    if (!q) return res.status(400).json({ error: "Missing q" });

    // anchors (only these are allowed to decide what matches)
    const termsRaw = String(req.query.terms ?? "").trim();
    const anchorTerms = termsRaw
      ? termsRaw
          .split("|")
          .map(s => String(s ?? "").trim().toLowerCase())
          .filter(Boolean)
      : [];

    // boosters (used only to rerank, but NOT to find unrelated stuff)
    const boostRaw = String(req.query.boost ?? "").trim();
    const boostTerms = boostRaw
      ? boostRaw
          .split("|")
          .map(s => String(s ?? "").trim().toLowerCase())
          .filter(Boolean)
      : [];

    // always includes the original q as an anchor
    const anchors = Array.from(new Set([q, ...anchorTerms]))
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 14);

    const boosters = Array.from(new Set(boostTerms))
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 18);

    if (!FuseMod) {
      // dynamic import so Vercel doesn't load it unless needed
      FuseMod = (await import("fuse.js")).default;
    }
    const Fuse = FuseMod;

    // majors list
    if (!majorsCache) {
      const majorsResp = await fetch(`${UMD_BASE}/majors/list`);
      majorsCache = await majorsResp.json();
    }

    // courses list (mini) - fetched once, then fuse index used for all searches
    if (!coursesMinCache) {
      coursesMinCache = await fetchAllCoursesMinified();
    }

    // builds fuse index onec for majors
    if (!majorsFuse) {
      majorsFuse = new Fuse(majorsCache ?? [], {
        keys: ["name", "college"],
        includeScore: true,
        threshold: 0.45, //can play around with this, but this works fine
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
    }

    // builds fuse index once for courses
    if (!coursesFuse) {
      coursesFuse = new Fuse(coursesMinCache ?? [], {
        keys: ["course_id", "name"],
        includeScore: true,
        threshold: 0.38,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
    }

   
    // majors------searchs using anchors onlyy, then reranks using boosters
    const majorsMap = new Map<string, any>();

    for (const term of anchors) {
      const hits = (majorsFuse.search(term) ?? []).slice(0, 120).map((r: any) => r.item);
      for (const m of hits) {
        const name = String(m?.name ?? "").trim();
        const dept = String(m?.college ?? "").trim();
        const key = `${name}||${dept}`;
        if (!name || !dept) continue;

        if (!majorsMap.has(key)) {
          majorsMap.set(key, {
            name: m?.name,
            department: m?.college, // keeping same key name for UI compatibility
            degree: m?.url, // stores url instead of breaking the format
          });
        }
      }
    }

    let matchedMajors = Array.from(majorsMap.values());

    // reranks majors with boosters ( doesn't add new majors, just orders them better)
    if (boosters.length > 0) {
      matchedMajors = matchedMajors
        .map((m: any) => ({ m, score: scoreMajor(m, anchors, boosters) }))
        .sort((a: any, b: any) => b.score - a.score)
        .map((x: any) => x.m);
    }

    matchedMajors = matchedMajors.slice(0, 60);


    // courses---- searchs using anchors only, then fetchs details + rerank with boosters
    const courseIds = new Set<string>();

    for (const term of anchors) {
      const hits = (coursesFuse.search(term) ?? []).slice(0, 70).map((r: any) => r.item);
      for (const c of hits) {
        const id = String(c?.course_id ?? "").trim();
        if (id) courseIds.add(id);
        if (courseIds.size >= 45) break;
      }
      if (courseIds.size >= 45) break;
    }

    const topCourseIds = Array.from(courseIds).slice(0, 45);
    let courses: any[] = [];

    if (topCourseIds.length > 0) {
      // fetch full course objects in chunks (endpoint supports comma-separated ids)
      const chunks: string[][] = [];
      for (let i = 0; i < topCourseIds.length; i += 25) chunks.push(topCourseIds.slice(i, i + 25));

      const fullCourses: any[] = [];
      for (const chunk of chunks) {
        // use cache first
        const need: string[] = [];
        for (const id of chunk) {
          const cached = fullCourseCache.get(id);
          if (cached) fullCourses.push(cached);
          else need.push(id);
        }
        if (need.length > 0) {
          const courseResp = await fetch(`${UMD_BASE}/courses/${need.join(",")}`);
          const arr = await courseResp.json();
          if (Array.isArray(arr)) {
            for (const c of arr) {
              const id = String(c?.course_id ?? "").trim();
              if (id) fullCourseCache.set(id, c);
              fullCourses.push(c);
            }
          }
        }
      }

      courses = (fullCourses ?? [])
        .map((c: any) => ({
          course_id: c.course_id,
          name: c.name,
          credits: c.credits,
          description: c.description,
        }))
        // rerank so unrelated stuff doesn’t float 
        .sort((a: any, b: any) => scoreCourse(b, anchors, boosters) - scoreCourse(a, anchors, boosters));
    }

    return res.status(200).json({ majors: matchedMajors, courses });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error", details: String(err?.message ?? err) });
  }
}

// fetch all mini courses one time(caps for serverless safety)
async function fetchAllCoursesMinified() {
  const PER_PAGE = 200;

  // reduced pages to speed up when starts on Vercel
  // 8 * 200 = 1600 minified courses --good enough but we can always alter 
  const MAX_PAGES = 8;

  const all: any[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = new URL(`${UMD_BASE}/courses/list`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(PER_PAGE));

    // timeout so the function can’t hang forever
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 7000);

    try {
      const r = await fetch(url.toString(), { signal: controller.signal });
      const data = await r.json();

      if (!Array.isArray(data) || data.length === 0) break;

      // stores only what we need for fuse search
      for (const c of data) {
        all.push({
          course_id: c?.course_id,
          name: c?.name,
        });
      }
    } catch (e) {
      // stops early on timeout/error (but keeps function responsive)
      break;
    } finally {
      clearTimeout(t);
    }
  }

  return all;
}

function norm(s: string) {
  return String(s ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreMajor(m: any, anchors: string[], boosters: string[]) {
  const blob = norm(`${m?.name ?? ""} ${m?.department ?? ""}`);
  let score = 0;

  // anchors matter most
  for (const t of anchors) {
    const tt = norm(t);
    if (!tt) continue;
    if (blob.includes(tt)) score += tt.includes(" ") ? 10 : 6;
  }

  // boosters only help reorder
  for (const t of boosters) {
    const tt = norm(t);
    if (!tt) continue;
    if (blob.includes(tt)) score += tt.includes(" ") ? 3 : 1;
  }

  return score;
}

function scoreCourse(course: any, anchors: string[], boosters: string[]) {
  const blob = norm(`${course?.course_id ?? ""} ${course?.name ?? ""} ${course?.description ?? ""}`);
  let score = 0;

  // anchors matter most (keeps results on-topic)
  for (const t of anchors) {
    const tt = norm(t);
    if (!tt) continue;
    if (blob.includes(tt)) score += tt.includes(" ") ? 8 : 5;
  }

  // boosters only reorder
  for (const t of boosters) {
    const tt = norm(t);
    if (!tt) continue;
    if (blob.includes(tt)) score += tt.includes(" ") ? 2 : 1;
  }

  return score;
}
