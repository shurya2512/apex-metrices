# Phase 5 Context: Frontend Command Center & Navigation

## AI Agent Instructions & Objectives
**Goal:** Build the primary user interface skeleton and the "Command Center" where users select which race session they want to analyze.

**Why this matters:** Users need an intuitive way to navigate the massive historical archive of F1 data. The command center acts as the entry point to the telemetry dashboards.

## Success Criteria
1. Next.js App Router utilizes a standard `layout.tsx` with a top navigation bar.
2. The homepage (`/`) displays a data table or grid of available sessions fetched from the FastAPI backend.
3. Users can click a session to navigate to a dynamic route like `/sessions/[id]`.
4. Implement Shadcn UI or Tailwind CSS for a modern, dark-mode racing aesthetic.
