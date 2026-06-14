"use client";

import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FiveRedLights from "@/components/FiveRedLights";
import TelemetryDashboard from "@/components/TelemetryDashboard";

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.session_id as string;
  const [ready, setReady] = useState(false);

  const handleCountdownComplete = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top bar — back navigation */}
      <div className="border-b border-am-border shrink-0">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-am-text-secondary no-underline transition-colors hover:text-am-text cursor-pointer"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Command Center
          </Link>
          <span className="text-am-text-muted">|</span>
          <span className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
            Session #{sessionId}
          </span>
        </div>
      </div>

      {/* Content */}
      {!ready ? (
        /* Gantry countdown on mount — centered */
        <div className="flex flex-1 items-center justify-center">
          <FiveRedLights onComplete={handleCountdownComplete} />
        </div>
      ) : (
        /* Telemetry workspace — activated after countdown */
        <TelemetryDashboard sessionId={sessionId} />
      )}
    </div>
  );
}
