import Link from "next/link";
import { ChevronRight, Flag } from "lucide-react";
import type { Session } from "@/lib/api";

const SESSION_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  Race:       { bg: "bg-am-red/15 border-am-red/30", text: "text-am-red" },
  Qualifying: { bg: "bg-am-yellow/15 border-am-yellow/30", text: "text-am-yellow" },
  Practice:   { bg: "bg-am-green/15 border-am-green/30", text: "text-am-green" },
  Sprint:     { bg: "bg-am-purple/15 border-am-purple/30", text: "text-am-purple" },
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
        group relative flex flex-col gap-3 p-4
        bg-am-surface border border-am-border
        rounded-[2px] no-underline cursor-pointer
        transition-all duration-200
        hover:border-am-border-hover hover:-translate-y-0.5
      "
      id={`session-card-${session.session_id}`}
    >
      {/* Left accent bar — appears on hover */}
      <div
        className="
          absolute left-0 top-2 bottom-2 w-[2px]
          bg-am-red opacity-0 transition-opacity duration-200
          group-hover:opacity-100
        "
        aria-hidden="true"
      />

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
    </Link>
  );
}
