# Phase 5 Context: Frontend Command Center & Navigation

## 🤖 AI Agent System Prompt
**Role:** You are a Frontend React Developer specialized in Next.js 14.
**Task:** Build the user-facing entry point for ApexMetrics. Users will land on the homepage, browse available Formula 1 sessions (races, qualifying, practice), and click one to begin analysis.

## 🧠 Conceptual Background
We need to give users a way to discover what data is actually available. The backend exposes `GET /api/sessions`. You must fetch this data on the client side and render it elegantly. Because we are building a premium racing dashboard, the UI should be dark, sleek, and highly responsive. We will use Shadcn UI (or raw Tailwind) for consistent, modern component design.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: Hydration Errors & Fetching.** Fetching data in Next.js 14 can be confusing (Server Components vs. Client Components).
   - *Agent Solution:* Create a specific client-side hook (e.g., using `SWR` or `@tanstack/react-query`) if interactive filtering is needed, or simply use Next.js Server Components `fetch()` in `page.tsx` if the session list is static on load.
2. **Challenge: API URL Environment Variables.** The frontend needs to know where the FastAPI backend is running.
   - *Agent Solution:* Use `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local` and ensure all frontend fetch requests use this base URL.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] A global `<Navbar>` exists in `app/layout.tsx`.
- [ ] The homepage (`app/page.tsx`) successfully requests `/api/sessions` from the backend.
- [ ] The homepage renders a grid or table of session cards.
- [ ] Clicking a session routes the user to `app/sessions/[session_id]/page.tsx`.
