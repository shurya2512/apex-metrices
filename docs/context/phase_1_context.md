# Phase 1 Context: Project Initialization & Infrastructure Setup

## AI Agent Instructions & Objectives
**Goal:** Your sole task in this phase is to scaffold the frontend and backend repositories. Do not write any business logic, API calls, or database schemas yet. 

**Why this matters:** A clean, strictly typed, and cleanly structured repository prevents technical debt. We are keeping Frontend (Next.js) and Backend (FastAPI) decoupled.

## Success Criteria
1. **Frontend:** Running `npm run dev` in the frontend directory successfully serves a Next.js 14+ default page on port 3000. TailwindCSS should be successfully compiling.
2. **Backend:** Running `uvicorn main:app --reload` in the backend directory serves a FastAPI Swagger UI on port 8000.
3. **Configuration:** `.env` files are created with template variables. `.gitignore` is populated for both node and python environments.
