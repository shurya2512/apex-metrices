# Phase 5 Specs: Frontend Command Center & Navigation

## 1. Layout & Styling
- Edit `app/layout.tsx` to include a global Navbar component.
- Apply a dark theme utilizing Tailwind classes (e.g., `bg-slate-900 text-white`).

## 2. Data Fetching
- **Tool:** Use `@tanstack/react-query` or `swr` for client-side data fetching, or standard React Server Components if fetching at request time.
- **Hook:** Create a custom hook `useSessions()` that fetches from `http://localhost:8000/api/sessions`.

## 3. Components
- **`SessionList`:** A responsive grid or list component iterating over the fetched sessions.
- **`SessionCard`:** Displays the Circuit Name, Year, and a button to "Analyze".

## 4. Routing
- The "Analyze" button pushes the user to `/sessions/[session_id]`.
