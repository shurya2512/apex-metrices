import Link from "next/link";
import { ChevronRight, Flag } from "lucide-react";
import type { Session } from "@/lib/api";

const SESSION_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  Race:       { bg: "bg-am-red/15 border-am-red/30", text: "text-am-red" },
  Qualifying: { bg: "bg-am-yellow/15 border-am-yellow/30", text: "text-am-yellow" },
  Practice:   { bg: "bg-am-green/15 border-am-green/30", text: "text-am-green" },
  Sprint:     { bg: "bg-[#f97316]/15 border-[#f97316]/30", text: "text-[#f97316]" },
};

function getSessionStyle(type?: string) {
  if (!type) return { bg: "bg-am-text-muted/10 border-am-text-muted/20", text: "text-am-text-secondary" };
  return SESSION_TYPE_STYLES[type] ?? SESSION_TYPE_STYLES.Race;
}

export default function SessionCard({ session }: { session: Session }) {
  const typeStyle = getSessionStyle(session.session_type);

  return (
    <Link
      href={`/sessions/${session.session_id}`}
      className="
        group relative flex flex-col p-5
        rounded-[4px] no-underline cursor-pointer
        transition-all duration-[400ms]
        hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(225,6,0,0.15)]
        overflow-hidden
      "
      style={{
        boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
      }}
      id={`session-card-${session.session_id}`}
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backdropFilter: "blur(12px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 transition-colors duration-[400ms]"
        style={{ background: "rgba(15, 15, 15, 0.35)" }}
      />
      <div
        className="absolute inset-0 z-20 pointer-events-none group-hover:bg-[#e10600]/5 transition-colors duration-[400ms]"
        style={{
          boxShadow:
            "inset 0px 1px 1px 0 rgba(255, 255, 255, 0.15), inset 0px -1px 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      />
      {/* Left accent bar — appears on hover */}
      <div
        className="
          absolute left-0 top-2 bottom-2 w-[3px]
          bg-am-red opacity-0 transition-opacity duration-200
          group-hover:opacity-100 z-30
        "
        aria-hidden="true"
      />

      {/* Main Content Wrapper */}
      <div className="relative z-30 flex flex-col gap-3 h-full">

      {/* Top row: session type badge + year */}
      <div className="flex items-center justify-between">
        {session.session_type && (
          <span
            className={`
              inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase
              border rounded-[1px]
              ${typeStyle.bg} ${typeStyle.text}
            `}
          >
            {session.session_type}
          </span>
        )}
        <span className="font-data text-xs text-am-text-muted">
          {session.year}
        </span>
      </div>

      {/* Circuit name */}
      <div className="flex items-start gap-2">
        <Flag
          size={14}
          className="mt-0.5 shrink-0 text-am-text-muted group-hover:text-am-red transition-colors duration-200"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold text-am-text leading-tight group-hover:text-white transition-colors duration-200">
          {session.circuit_name}
        </h3>
      </div>

      {/* Country / date row */}
      {(session.country || session.date) && (
        <div className="flex items-center gap-2 text-xs text-am-text-secondary">
          {session.country && <span>{session.country}</span>}
          {session.country && session.date && (
            <span className="text-am-text-muted">•</span>
          )}
          {session.date && (
            <span className="font-data text-[11px]">{session.date}</span>
          )}
        </div>
      )}

      {/* Bottom: enter arrow */}
      <div className="flex items-center justify-end mt-auto">
        <ChevronRight
          size={14}
          className="text-am-text-muted group-hover:text-am-red group-hover:translate-x-0.5 transition-all duration-200"
          aria-hidden="true"
        />
      </div>
      </div>
    </Link>
  );
}
