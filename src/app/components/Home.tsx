//assignment requirements are commented! (plus other comments in general) 
//p.s--this is the longest file because everything happens in the home page (api, etc. ) also, had a hard time figuring out how to cross reference so had to do a lot to get it to work
import { Search, SlidersHorizontal, Heart, Clock, GraduationCap } from 'lucide-react';
import heroImage from "../../assets/hero.jpg";
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { useState } from "react";


//home page component (default export so router can load it easily)
export default function Home() { //this is all for storing and tracking
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState("");

  // added this for a better ui look so it doesn't load a huge set of lists. --so adding "view more" options, the results don't show all at once unless view more 
  const [jobsVisible, setJobsVisible] = useState(5); //5 jobs display (we can add more but i think 5 is good)
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsHasMore, setJobsHasMore] = useState(false);

  const [coursesVisible, setCoursesVisible] = useState(8); //8 courses show (unless view more)

  //filters (remote + location)
  const [showFilters, setShowFilters] = useState(false); //<--toggles filter dropdown area under bar/shows if its visble or not
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [location, setLocation] = useState("");

  const careerCategories = [
    {name: 'Tech', jobs: ['Software Engineer', 'Data Scientist', 'UX Designer', 'Cybersecurity Analyst', 'Project Management']}, //we can add more but this is the only way i figured how to cross-reference jobs + majors + courses. 
    {name: 'Healthcare',jobs: ['Registered Nurse', 'Physical Therapist', 'Medical Researcher', 'Public Health Specialist']},
    { name: 'Education', jobs: ['Teacher', 'Educational Consultant', 'School Counselor', 'Curriculum Developer']},
    { name: 'Business', jobs: ['Marketing Manager', 'Financial Analyst', 'Human Resources Manager', 'Management Consultant']}
  ];

  // not really neceassry but helps actual future users navigate page easier. this is for taking users directly to testudo page if course is pressed. so it builds a Testudo link for a course id so they can view from source 
  function testudoLink(courseId: string) {
    const id = String(courseId ?? "").trim();
    if (!id) return "https://app.testudo.umd.edu/soc/";
    return `https://app.testudo.umd.edu/soc/search?courseId=${encodeURIComponent(id)}`;
  }

  // had to keep playing with this but this turns text into searchable "tokens" aka words and removes common filler words because it kept showing up on the skills and made the ui looks messy
  function tokenize(text: string) {
    const stop = new Set([
      "the","and","or","to","of","in","a","an","for","with","on","at","by","from","as","is","are","be","this","that",
      "you","your","our","we","they","their","will","can","may","must","have","has","had","do","does","did","year","years",
      "experience","preferred","required","skills","skill","ability","abilities","work","working","job","role","team","teams",
      "using","use","including","include","etc",
      // also, while testing... if remote filter was used it showed up on class courses, so like any word that had remote in the title would also show up regardless of matching job/major so this prevents random results
      "remote","hybrid","onsite","on-site","wfh","workfromhome","entry","level","junior","senior","lead","principal","performance","theatre","theater","business","live"
    ]);

    return String(text ?? "")
      .toLowerCase() //normalizes to lowercase 
      .replace(/https?:\/\/\S+/g, " ") //removes urls 
      .replace(/[^a-z0-9\s]/g, " ") //removes punc + symbols 
      .split(/\s+/)
      .map(t => t.trim())  //trim each word
      .filter(t => t.length >= 2) //keep words that are at least 2 letters
      .filter(t => !stop.has(t)); //remove stop words
  }

  // so short words like UX don't exist in majors/courses so need to expand query to real words. ideally there would be a better way to do this, but that can be something we consider for future developments. right now, this works. 
  function expandQuery(q: string) {
    const s = String(q ?? "").trim().toLowerCase();

    const expansions: Record<string, string[]> = {
      //did the ones that display in "career fields" as examples
      // UX/UI
      "ux": ["user experience", "human computer interaction", "interaction design", "usability", "user research", "information science", "immersive media design"],
      "ui": ["user interface", "interaction design", "visual design", "interface design", "information science", "immersive media design"],

      // software
      "swe": ["software engineering", "computer science", "programming", "software development", "information science", "computer science"],
      "software engineer": ["software engineering", "computer science", "programming", "software development", "information science", "computer science"],

      // product / project
      "pm": ["product management", "project management", "product design", "requirements", "information science", "computer science", "technology design"], //feels a bit biased inputting words ourselves but there wasn't an api that related jobs to terms 
      "product manager": ["product management", "project management", "requirements", "roadmap", "information science", "computer science", "technology design"],

      // data / AI
      "ds": ["data science", "statistics", "data analysis", "machine learning", "information science", "computer science"],
      "data scientist": ["data science", "statistics", "machine learning", "data analysis", "information science", "computer science"],
      "ml": ["machine learning", "artificial intelligence", "modeling", "human computer interaction", "information science", "computer science"],
      "ai": ["artificial intelligence", "machine learning", "human computer interaction", "hci", "information science", "computer science"],

      // security
      "cybersecurity": ["cybersecurity", "security", "information assurance", "risk", "privacy", "information security", "network security", "security analysis","information science", "computer science" ],
      "security": ["information assurance", "cybersecurity", "risk", "privacy", "information science", "computer science"],
      
      //nursing /healthcare
       "nurse": ["nursing", "registered nurse", "rn", "clinical", "patient care", "public health", "epidemiology", "health"],
       "nursing": ["registered nurse", "rn", "clinical", "patient care", "public health", "epidemiology", "health"],

       // teaching / education
       "teacher": ["education", "teaching", "curriculum", "instruction", "school", "learning"],
       "teaching": ["education", "curriculum", "instruction", "learning"],

       // common business queries
       "marketing": ["marketing", "business", "management", "communications", "advertising"],
       "finance": ["finance", "accounting", "economics", "business"],
       "accountant": ["accounting", "finance", "business"],
    };

    const out = new Set<string>();
    out.add(s); //always includes the orginal query

    // if query exactly matches one key, then add its expansions 
    if (expansions[s]) expansions[s].forEach(t => out.add(t));

    // also expand if query contains important words "tokens" (if user types "ux designer" it contains "ux" etc.)
    const parts = s.split(/\s+/).filter(Boolean);
    for (const p of parts) {
      if (expansions[p]) expansions[p].forEach(t => out.add(t));
    }

    return Array.from(out).filter(Boolean);
  }

  // this is for skills part, because we want users to know why the jobs and majors appear--the skills show what the job needs skills wise. 
  //phrases like "user experience" are better signals than using words like "user"
  function extractPhrases(text: string) {
    const words = tokenize(text);
    const phrases: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const w3 = words[i + 2];

      if (w1 && w2) phrases.push(`${w1} ${w2}`);
      if (w1 && w2 && w3) phrases.push(`${w1} ${w2} ${w3}`);
    }

    // counts how often phrases appear then sorts by frequency
    const freq: Record<string, number> = {};
    for (const p of phrases) freq[p] = (freq[p] ?? 0) + 1;

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1]) //high freq at first
      .map(([p]) => p)
      .slice(0, 10); //keep top 10 
  }

  // matches location filters better like "DC" with "District of Columbia" because some job listing have one or the other
  function matchesLocationFilter(jobLoc: string, wantRaw: string) {
    const want = String(wantRaw ?? "").trim().toLowerCase();
    if (!want) return true;

    const loc = String(jobLoc ?? "").trim().toLowerCase();
    if (!loc) return false;
    if (loc.includes(want)) return true;
    // checks token word match (if user types multiple words)
    const wantTokens = want.split(/\s+/).filter(Boolean);
    if (wantTokens.some(t => t.length >= 2 && loc.includes(t))) return true;

    // matches abbrievation (like "dc" should match "district of columbia")
    const connectorWords = new Set(["of", "the", "and", "for", "in", "at"]);
    const locWords = loc
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .filter(w => !connectorWords.has(w));

    const initialsPairs = new Set<string>();
    for (let i = 0; i < locWords.length - 1; i++) {
      initialsPairs.add(`${locWords[i][0] ?? ""}${locWords[i + 1][0] ?? ""}`);
    }

    if (want.length >= 2 && want.length <= 4 && initialsPairs.has(want)) return true;

    return false;
  }

  // finds shared phrases (not just single words) that appear in BOTH job text and majors/courses text
  function sharedPhrases(job: any, majorsArr: any[], coursesArr: any[]) {
    const jobText = [
      job?.title ?? "",
      ...(Array.isArray(job?.rawQualifications) ? job.rawQualifications : []),
      job?.description ?? "",
    ].join(" ").toLowerCase();

    const mcText = [
      ...majorsArr.map(m => `${m?.name ?? ""} ${m?.department ?? ""}`),
      ...coursesArr.map(c => `${c?.course_id ?? ""} ${c?.name ?? ""} ${c?.description ?? ""}`),
    ].join(" ").toLowerCase();

    const words = jobText
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .map(w => w.trim())
      .filter(Boolean);

    const stop = new Set([
      "the","and","or","to","of","in","a","an","for","with","on","at","by","from","as","is","are","be","this","that","you","your","our","we","they","their","will","can","may","must","have","has","had","do","does","did",
      "year","years","experience","preferred","required","skills","skill","ability","abilities","work","working","job","role","team","teams","using","use","including","include","etc","remote","hybrid","onsite","on-site",
      "wfh","workfromhome","entry","level","junior","senior","lead","principal","performance","theatre","theater","business","live" //might be missing a few words...
    ]);

    // build candidate pairs like "cloud computing", "user experience"
    const candidates: string[] = [];
    for (let i = 0; i < words.length; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const w3 = words[i + 2];

      if (w1 && w2) candidates.push(`${w1} ${w2}`);
      if (w1 && w2 && w3) candidates.push(`${w1} ${w2} ${w3}`);
    }

    const freq: Record<string, number> = {};
    for (const phrase of candidates) {
      const parts = phrase.split(" ");
      if (parts.some(p => stop.has(p))) continue; //ignore filler
      if (phrase.length < 5) continue; //also ignore tiny phrases

      // must exist in majors/courses text too
      if (mcText.includes(phrase)) {
        freq[phrase] = (freq[phrase] ?? 0) + 1;
      }
    }

    const ranked = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([p]) => p);

    // keeping it clean for UI
    return ranked.slice(0, 6);
  }

  // <--this is the search flow---> 
  async function handleSearch() {
    const q = query.trim();
    if (!q) return; //doesnt search on empty input (since it's not form, can't use required)

    setLoading(true);
    setError("");

    try {
      // reset "view-more" counters on a brand new search
      setJobsVisible(5);
      setJobsPage(1);
      setJobsHasMore(false);
      setCoursesVisible(8); //again 8 results

      const params = new URLSearchParams();
      params.set("q", q);

      // adding filter params so backend can use them (and we can filter on frontend too)
      if (remoteOnly) params.set("remote", "true");
      if (location.trim()) params.set("location", location.trim());

      // get jobs first (so we can build boosters from real postings)
      params.set("page", "1");
      params.set("pageSize", "10");

      const jobsRes = await fetch(`/api/jobs?${params.toString()}`);
      const jobsData = await jobsRes.json();

      const rawJobs = jobsData.jobs ?? [];
      setJobsHasMore(Boolean(jobsData.hasMore));

      // next, build anchor terms from query + the approved expansions (anchors determine what majors/courses are relevant)
      const expanded = expandQuery(q);
      const queryTokens = tokenize(expanded.join(" ")).slice(0, 10);
      const queryPhrases = extractPhrases(expanded.join(" ")).slice(0, 10);

      const anchorTerms = Array.from(new Set([
        q.toLowerCase(),...expanded,...queryTokens,...queryPhrases,
      ])).slice(0, 14);

      // build boosters from job titles+ qualifications only (not full description to avoid noise--plus it slows it down so much w/o this)
      const boosterBlob = rawJobs
        .slice(0, 8)
        .map((j: any) => `${j?.title ?? ""} ${(j?.rawQualifications ?? []).join(" ")}`)
        .join(" ");

      const boosterTokens = tokenize(boosterBlob).slice(0, 16);
      const boosterPhrases = extractPhrases(boosterBlob).slice(0, 10);

      const boostTerms = Array.from(new Set([
        ...boosterTokens,
        ...boosterPhrases,
      ])).slice(0, 18);

      // fetch majors endpoint one time with anchors + boosters
      const majorsParams = new URLSearchParams();
      majorsParams.set("q", q);
      majorsParams.set("terms", anchorTerms.join("|"));
      majorsParams.set("boost", boostTerms.join("|"));

      const majorsRes = await fetch(`/api/majors?${majorsParams.toString()}`);
      const majorsData = await majorsRes.json();

      const mergedMajors = majorsData?.majors ?? [];
      const mergedCourses = majorsData?.courses ?? [];

      // location + remote filtering (1 request for speed)
      const filteredJobs = rawJobs.filter((j: any) => {
        const loc = String(j?.location ?? "").toLowerCase();
        const isRemote = loc.includes("remote") || loc.includes("work from home") || loc.includes("wfh");

        if (remoteOnly && !isRemote) return false;

        if (location.trim()) {
          if (!matchesLocationFilter(String(j?.location ?? ""), location)) return false;
        }

        return true;
      });

      // bullet points skills as shared phrases across job + majors/courses 
      const jobsWithShared = filteredJobs.map((j: any) => ({
        ...j,
        skills: sharedPhrases(j, mergedMajors, mergedCourses),
      }));

      setJobs(jobsWithShared);
      setMajors(mergedMajors);
      setCourses(mergedCourses);

      // save search to supabase
      await fetch("/api/saveSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          topJobTitle: (jobsWithShared?.[0]?.title ?? rawJobs?.[0]?.title ?? null),
          jobsCount: jobsWithShared?.length ?? 0,
          topSkills: (jobsWithShared ?? [])
            .flatMap((j: any) => (j.skills ?? []))
            .map((s: any) => String(s).trim())
            .filter(Boolean)
            // removes duplicates but keeps order
            .filter((s: string, i: number, arr: string[]) => arr.indexOf(s) === i)
            .slice(0, 8),
        }),
      });
    } catch (e: any) {
      setError("Oh no, search failed. Please try again!");
    } finally {
      setLoading(false);
    }
  }
 //loads next page (for view more jobs)
  async function loadMoreJobs() {
    const q = query.trim();
    if (!q) return;

    try {
      const nextPage = jobsPage + 1;

      const params = new URLSearchParams();
      params.set("q", q);

      if (remoteOnly) params.set("remote", "true");
      if (location.trim()) params.set("location", location.trim());

      params.set("page", String(nextPage));
      params.set("pageSize", "10");

      const jobsRes = await fetch(`/api/jobs?${params.toString()}`);
      const jobsData = await jobsRes.json();

      const more = jobsData.jobs ?? [];

      // append new jobs to exisitng list
      setJobs(prev => [...prev, ...more]);
      setJobsPage(nextPage);
      setJobsHasMore(Boolean(jobsData.hasMore));

      // increases the visible count so user actually sees the new loaded jobs
      setJobsVisible(v => v + 5);
    } catch (e) {
      
    }
  }

  //<-UI section->
  return (
    <div className="min-h-screen bg-white">
      {/* this is navigation sec. */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-30 bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <motion.div 
                className="text-xl text-black cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Major Decisions
              </motion.div>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white px-4 py-2 rounded-lg bg-red-600">Home</Link>

              <Link to="/about" className="text-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all">About</Link>

              <Link to="/contact" className="text-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all">Contact</Link>
              
              <Link to="/help" className="text-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"> Help</Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* hero sec. */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        <img src={heroImage} alt="student studying" className="absolute inset-0 w-full h-full object-cover"/>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-red-900/60 to-black/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <h1 className="md:text-8xl text-white mb-4 leading-tight text-[64px]">Don't Guess Your Major—<br />
            <span className="text-yellow-400">Match It</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mt-8 leading-relaxed"> Explore career paths before choosing a major. Match your interests to real jobs, understand the skills you'll need, and make informed decisions about your academic future.</p>
        </div>
      </div>

      {/* search Area  */}
      <div className="max-w-7xl mx-auto px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
          <label htmlFor="search" className="block mb-3 text-black">Search by Job Title or Keyword</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                id="search" 
                value={query} 
                onChange={(e) => /[^a-zA-Z\s]/.test(e.target.value) ? alert("Please use letters only.") : setQuery(e.target.value)} //no symbols or nums
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                placeholder="Try 'Software Engineer' or 'UX' "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />


              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-black rounded-lg hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </button>

            <button onClick={handleSearch} className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"> Search</button>

          </div>

          {/* filters section */}
          {showFilters && (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-3 text-black">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Remote only
                </label>
                <p className="text-xs text-gray-600 mt-2">Shows only jobs with "remote" in the location field.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-black mb-2">Location (city or state)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Example: Maryland, NYC, DC"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <p className="text-xs text-gray-600 mt-2">Filters jobs by location.</p>
              </div>
            </div>
          )}

          {loading && <p className="text-gray-700 mt-6">Just a moment! Loading results…</p>}
          {error && <p className="text-red-600 mt-6">{error}</p>}

          {/* results section - results now will show up directly under search bar */}
          {!loading && (jobs.length > 0 || majors.length > 0 || courses.length > 0) && (
            <div className="mt-8">
              <h2 className="text-2xl text-black mb-4 tracking-tight">Results</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* jobs */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Jobs</h3>

                  {jobs.length === 0 && (
                    <p className="text-sm text-gray-600">No jobs matched your filters. Try turning off Remote only or clearing Location.</p>
                  )}

                  <div className="space-y-4">
                    {jobs.slice(0, jobsVisible).map((j) => (
                      <div key={`${j.title}-${j.company}-${j.location}`} className="border-b pb-3">
                        <p className="font-semibold">{j.title}</p>
                        <p className="text-sm text-gray-600">{j.company} • {j.location}</p>

                        {/* job links */}
                        <div className="flex flex-col gap-2 mt-2">
                          {j.url && (
                            <a
                              href={j.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-red-600 hover:underline">View job posting →</a>
                          )}
                          {j.employerWebsite && (
                            <a href={j.employerWebsite} target="_blank"rel="noreferrer" className="text-sm text-gray-700 hover:underline"> Company site →</a>
                          )}
                        </div>

                        {/* skill tags */}
                        <ul className="list-disc ml-5 mt-4 space-y-1">
                          {(j.skills ?? []).length === 0 && (
                            <li className="text-sm text-gray-600"> No shared keywords found between this job and the matched majors/courses. Check out Job Link or Company Site for more info! </li>
                          )}

                          {(j.skills ?? []).slice(0, 6).map((s: string) => (
                            <li key={s} className="text-sm text-gray-700">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* view more jobs */}
                  {(jobs.length > jobsVisible || jobsHasMore) && (
                    <button
                      onClick={() => {
                        if (jobs.length > jobsVisible) {
                          setJobsVisible(v => v + 5);
                        } else if (jobsHasMore) {
                          loadMoreJobs();
                        }
                      }}
                      className="mt-4 text-sm text-red-600 hover:underline"> View more jobs →</button>
                      )}
                </div>

                {/* majors */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Matching Majors</h3>

                  {majors.length === 0 && (
                    <p className="text-sm text-gray-600">No majors matched that exact keyword, but we still suggested courses below.</p>
                  )}

                  <ul className="space-y-3">
                    {majors.slice(0, 12).map((m) => (
                      <li key={`${m.name}-${m.department}`}>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-sm text-gray-600">{m.department}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* courses */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Suggested Courses</h3>

                  {courses.length === 0 && (
                    <p className="text-sm text-gray-600">No courses found for that keyword. Try a broader search like “software”, “data”, or “design”.</p>
                  )}

                  <ul className="space-y-3">
                    {courses.slice(0, coursesVisible).map((c) => (
                      <li key={c.course_id}>
                        <p className="font-semibold">{c.course_id}: {c.name}</p>
                        <p className="text-xs text-gray-600">{String(c.description ?? "").slice(0, 120)}…</p>

                        <div className="mt-1">
                          <a
                            href={testudoLink(c.course_id)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-red-600 hover:underline">View on Testudo →</a>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* view more courses */}
                  {courses.length > coursesVisible && (
                    <button
                      onClick={() => setCoursesVisible(v => v + 8)}
                      className="mt-4 text-sm text-red-600 hover:underline">View more courses →</button>)}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* career categories preview */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl text-black mb-3 tracking-tight">Explore Career Fields</h2>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl">Browse popular career paths to see what majors can lead you there</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careerCategories.map((category) => (
            <div key={category.name} className="border border-gray-300 rounded-lg p-6 hover:border-red-600 hover:shadow-lg transition-all">
              <h3 className="text-2xl text-black mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.jobs.map((job) => (
                  <li key={job} className="text-gray-700">
                    {job}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>


      {/* why major decisions section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl text-black mb-12 tracking-tight text-center"> Why Major Decisions? </h2>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-black mb-4"> Reduce Stress</h3>
            <p className="text-gray-700 leading-relaxed">Stop second-guessing. Match your interests and career goals with the right academic path from day one.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-black mb-4">Save Time & Money </h3>
            <p className="text-gray-700 leading-relaxed">Avoid switching majors mid-degree. Find the right fit early and graduate on time with confidence.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl text-black mb-4">Connect Education to Careers</h3>
            <p className="text-gray-700 leading-relaxed">See exactly where each major leads. Make informed decisions based on real-world outcomes and skills.</p>
          </div>
        </div>
      </div>

      {/* footer- -made seperatly because it was the first page and this is where api's will mostly be working out of but can switch to layout later */}
      <footer className="bg-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link to="/" className="text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Contact
              </Link>
              <Link to="/help" className="text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Help
              </Link>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-white/80">
              INST377- Cideth Oliva & Khadija Wane
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
