# Phase 5 Specs: Frontend Command Center & Navigation

## 📁 File Structure to Create
```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── sessions/
│       └── [session_id]/
│           └── page.tsx
├── components/
│   ├── Navbar.tsx
│   └── SessionCard.tsx
└── lib/
    └── api.ts
```

## 🛠️ Required Libraries & Tools
- `lucide-react`: For sleek iconography.
- `swr` or `@tanstack/react-query`: Optional, for client-side data fetching.

## 💻 Technical Implementation Details

### 1. API Helper (`lib/api.ts`)
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/api/sessions`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}
```

### 2. Global Layout (`app/layout.tsx`)
- Implement `<Navbar />` which should contain the "ApexMetrics" logo and navigation links.
- Set the `<body>` class to `bg-slate-950 text-slate-50` to establish the dark theme.

### 3. Homepage (`app/page.tsx`)
- Call `fetchSessions()`.
- Map over the resulting array to render `<SessionCard />` components.
- Each `<SessionCard />` should display `circuit_name` and `year`.
- Wrap the card in a `<Link href={\`/sessions/\${session.session_id}\`}>`.
