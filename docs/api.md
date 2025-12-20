# API 
**External APIs:** OpenWebNinja Jobs API (job postings), UMD.io API (UMD majors and courses)

### GET Endpoints

#### `GET /api/jobs`
Fetches job postings based on a user search query.

**Response:**
- List of job postings
- Company name, job links, and skill keywords

---

#### `GET /api/majors`
Returns matching majors and suggested courses based on relevance to the search query.

**Response:**
- Array of matching majors
- Array of suggested courses

---

### POST Endpoints

#### `POST /api/saveSearch`
Stores search metadata anonymously in Supabase for analytics and future improvements.

**Response:**
- Success or error status

---

## Database
Supabase is used as a PostgreSQL database.

**Current usage:**
- Stores search queries anonymously
- Stores job counts and extracted skill keywords
- No user authentication is currently implemented
- Supabase Auth is not used

---

## Testing
API testing was performed manually using **Insomnia** to verify that endpoints returned valid responses.

The original job search API suddenly stopped working, so OpenWebNinja Jobs API was used instead.

There were no automated tests implemented but in the future, adding **Vitest** for frontend could be useful. 
- UMD.io API: https://api.umd.io/v1/courses/departments
-OpenWebNinja Job API: http://localhost:3000/api/jobs , http://localhost:5173/api/jobs?q=software%20engineer&page=1&pageSize=10





  
  