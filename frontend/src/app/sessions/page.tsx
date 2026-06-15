import { Suspense } from "react";
import { Radio } from "lucide-react";
import { fetchSessions } from "@/lib/api";
import type { Session } from "@/lib/api";
import F1TyreLoader from "@/components/F1TyreLoader";
import SessionsExplorer from "@/components/SessionsExplorer";

export const metadata = {
  title: "Sessions | ApexMetrics",
  description: "Browse and filter F1 sessions",
};

/* ---------- Loading fallback ---------- */
function SessionsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <F1TyreLoader size={56} />
      <span className="font-data text-xs tracking-widest text-am-text-muted uppercase">
        Fetching session data...
      </span>
    </div>
  );
}

/* ---------- Empty state ---------- */
function SessionsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-center w-full max-w-[1600px] mx-auto px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-[2px] border border-am-border bg-am-surface">
        <Radio size={24} className="text-am-text-muted" />
      </div>
      <h2 className="text-lg font-semibold text-am-text">No Sessions Cached</h2>
      <p className="max-w-sm text-sm text-am-text-secondary">
        The backend has not cached any session data yet. Start the FastAPI
        server and ingest sessions from the OpenF1 API to populate this view.
      </p>
      <div className="mt-2 rounded-[2px] border border-am-border bg-am-surface px-4 py-2">
        <code className="font-data text-xs text-am-yellow">
          GET /api/sessions
        </code>
      </div>
    </div>
  );
}

/* ---------- Session Fetcher ---------- */
async function SessionDataWrapper() {
  let sessions: Session[] = [];

  try {
    sessions = await fetchSessions();
  } catch {
    // Backend not running — show empty state gracefully
    return <SessionsEmpty />;
  }

  if (!sessions || sessions.length === 0) {
    return <SessionsEmpty />;
  }

  return <SessionsExplorer initialSessions={sessions} />;
}

/* ---------- Page ---------- */
export default function SessionsPage() {
  return (
    <div className="flex flex-1 flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 telemetry-grid opacity-20 pointer-events-none" aria-hidden="true" />
      
      {/* Suspense handles the async fetch */}
      <Suspense fallback={<SessionsLoading />}>
        <SessionDataWrapper />
      </Suspense>
    </div>
  );
}
