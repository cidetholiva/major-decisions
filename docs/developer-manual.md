# Developer Manual – Major Decisions

INST377: Final Project  
Cideth Oliva and Khadija Wane

---

## Overview
Major Decisions is a full-stack web application designed to help students explore career paths by searching job titles or keywords and viewing related job postings, matching majors, and suggested courses. The system integrates a React-based frontend with serverless backend APIs and a Supabase database.

This document is intended for future developers who will take over the project. It explains how to set up the application locally, run it, understand the API, and continue development!

---

## Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **External APIs:** OpenWebNinja Jobs API, UMD.io API

---

## Server Application & API Endpoints

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

---

## Known Bugs and Limitations
- Initial search requests may be slow due to server startup time. 
- Search relevance between jobs, majors, and courses can be improved.
- External APIs may affect response speed and consistency.

---

## Roadmap for Future Development
Planned improvements include:
- Improving relevance between jobs, majors, and courses
- Caching majors and course data so results load faster 
- Adding user authentication
- Allowing users to save favorite majors and courses
- Improving layout and accessibilty. 
- Thinking about WCAG and possibily conducting user research to improve UI and other features. 

---

## Installation 

Notes

All backend logic is handled through Vercel serverless functions located in the /api directory.

### 1. Clone Repo 
-git clone https://github.com/cidetholiva/major-decisions.git
-cd major-decisions

### 2. Install dependencies 
- RUN npm install 
- RUN npm run dev 
- Control C to stop running

### 3. Set up enviroment variables 
- Create a .env file in the project root: touch .env
- Add the following (using your own keys): 

SUPABASE_URL= your supabase project url
SUPABASE_ANON_KEY= your supabase anon key
OPENWEBNINJA_API_KEY= your openwebninja api key

_Make sure these match the environment variables configured in Vercel. _

### 4. Run the application
- RUN npm run dev 
- Open http://localhost:5173
_Both frontend and backend serverless functions run together locally._ 

### 5. Deployment 
- Push changes to your main branch 
- Vercel automatically deploys the project using the environment variables. 
