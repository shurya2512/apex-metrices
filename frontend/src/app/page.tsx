import { Suspense } from "react";
import { Activity, Radio, Zap } from "lucide-react";
import { fetchSessions } from "@/lib/api";
import type { Session } from "@/lib/api";
import SessionCard from "@/components/SessionCard";
import F1TyreLoader from "@/components/F1TyreLoader";

/* ---------- Hero Section ---------- */
function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-am-border">
      {/* Telemetry grid background */}
      <div className="absolute inset-0 telemetry-grid opacity-40" aria-hidden="true" />

      {/* Subtle red gradient accent from top-left */}
      <div
        className="absolute top-0 left-0 h-64 w-96 opacity-[0.07]"
        style={{
          background: "radial-gradient(ellipse at top left, #E10600 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 py-12 lg:px-6 lg:py-16">
        <div className="flex flex-col gap-4">
          {/* Sector label */}
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-8 bg-am-red" aria-hidden="true" />
            <span className="font-data text-[10px] tracking-[0.35em] text-am-red uppercase">
              Sector 1 — Command Center
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl font-bold tracking-tight text-am-text sm:text-4xl lg:text-5xl">
            Race
            <span className="text-am-red"> Intelligence</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-am-text-secondary lg:text-base">
            Browse available Formula 1 sessions. Select a Grand Prix to access
            real-time telemetry overlays, driver comparisons, and lap-by-lap
            performance analysis.
          </p>

          {/* Stat pills */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-[2px] border border-am-border bg-am-surface px-3 py-1.5">
              <Activity size={12} className="text-am-green" aria-hidden="true" />
              <span className="font-data text-[11px] text-am-text-secondary">
                Telemetry Feed
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[2px] border border-am-border bg-am-surface px-3 py-1.5">
              <Radio size={12} className="text-am-yellow" aria-hidden="true" />
              <span className="font-data text-[11px] text-am-text-secondary">
                OpenF1 API
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[2px] border border-am-border bg-am-surface px-3 py-1.5">
              <Zap size={12} className="text-am-red" aria-hidden="true" />
              <span className="font-data text-[11px] text-am-text-secondary">
                Downsampled
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Loading fallback ---------- */
function SessionsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
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
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
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

/* ---------- Session Grid (async data fetch) ---------- */
async function SessionGrid() {
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

  return (
    <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.session_id} session={session} />
      ))}
    </div>
  );
}

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />

      <section className="mx-auto w-full max-w-[1600px] px-4 py-8 lg:px-6 lg:py-10">
        {/* Section header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 w-[2px] bg-am-red" aria-hidden="true" />
            <h2 className="text-sm font-semibold tracking-wide text-am-text uppercase">
              Available Sessions
            </h2>
          </div>
          <span className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
            Cache Layer
          </span>
        </div>

        {/* Session grid with Suspense loading */}
        <Suspense fallback={<SessionsLoading />}>
          <SessionGrid />
        </Suspense>
      </section>
    </div>
  );
}
