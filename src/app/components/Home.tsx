//assignment requirements are commented! (plus other comments in general)
import { Search, SlidersHorizontal, Heart, Clock, GraduationCap } from 'lucide-react';
import heroImage from "../../assets/hero.jpg";
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { useState } from "react";


//default major to jobs categories
export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState("");

  const careerCategories = [
    {name: 'Tech', jobs: ['Software Engineer', 'Data Scientist', 'UX Designer', 'Cybersecurity Analyst']},

    {name: 'Healthcare',jobs: ['Registered Nurse', 'Physical Therapist', 'Medical Researcher', 'Public Health Specialist']},

    { name: 'Education', jobs: ['Teacher', 'Educational Consultant', 'School Counselor', 'Curriculum Developer']},

    { name: 'Business', jobs: ['Marketing Manager', 'Financial Analyst', 'Human Resources Manager', 'Management Consultant']}
  ];

  async function handleSearch() {
  const q = query.trim();
  if (!q) return;

  setLoading(true);
  setError("");

  try {
    const [jobsRes, majorsRes] = await Promise.all([
      fetch(`/api/jobs?q=${encodeURIComponent(q)}`),
      fetch(`/api/majors?q=${encodeURIComponent(q)}`),
    ]);

    const jobsData = await jobsRes.json();
    const majorsData = await majorsRes.json();

    setJobs(jobsData.jobs ?? []);
    setMajors(majorsData.majors ?? []);
    setCourses(majorsData.courses ?? []);

    // save search 
    await fetch("/api/saveSearch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        topJobTitle: (jobsData.jobs?.[0]?.title ?? null),
      }),
    });
  } catch (e: any) {
    setError("Search failed. Try again.");
  } finally {
    setLoading(false);
  }
}


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
              <input type="text" id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try 'Software Engineer' or 'UX' "className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"/>


              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button className="px-6 py-3 bg-white border border-black rounded-lg hover:bg-black hover:text-white transition-colors flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" /> Filters</button>

            <button onClick={handleSearch} className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"> Search</button>

          </div>

        </div>
      </div>

      {/* career categories preview */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl text-black mb-3 tracking-tight">Explore Career Fields</h2>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl">Browse popular career paths to see what majors can get you there</p>
        
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

      {loading && <p className="text-gray-700">Loading results…</p>}
      {error && <p className="text-red-600">{error}</p>}
       {/* results section */}

      {!loading && (jobs.length > 0 || majors.length > 0) && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* jobs */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Jobs</h3>
            <div className="space-y-4">
              {jobs.slice(0, 3).map((j) => (
                <div key={j.title} className="border-b pb-3">
                  <p className="font-semibold">{j.title}</p>
                  <p className="text-sm text-gray-600">{j.company} • {j.location}</p>

                  {/* skill tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(j.skills ?? []).slice(0, 6).map((s: string) => (
                      <span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* majors */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Matching Majors</h3>
            <ul className="space-y-3">
              {majors.slice(0, 8).map((m) => (
                <li key={m.name}>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-gray-600">{m.department}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* courses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Suggested Courses</h3>
            <ul className="space-y-3">
              {courses.slice(0, 6).map((c) => (
                <li key={c.course_id}>
                  <p className="font-semibold">{c.course_id}: {c.name}</p>
                  <p className="text-xs text-gray-600">{String(c.description ?? "").slice(0, 120)}…</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}


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
            <p className="text-gray-700 leading-relaxed">See exactly where each major leads. Make informed decisions based on real-world outcomes, not guesswork.</p>
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