"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FiveRedLights from "@/components/FiveRedLights";

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.session_id as string;
  const [ready, setReady] = useState(false);

  const handleCountdownComplete = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar — back navigation */}
      <div className="border-b border-am-border">
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
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        {!ready ? (
          /* Gantry countdown on mount */
          <FiveRedLights onComplete={handleCountdownComplete} />
        ) : (
          /* Workspace placeholder — activated after countdown */
          <div
            className="flex flex-col items-center gap-6 text-center"
            style={{ animation: "fade-up 0.5s ease-out" }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[2px] border border-am-border bg-am-surface">
              <Layers size={32} className="text-am-red" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-am-text">
                Session #{sessionId}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[2px] w-6 bg-am-red" aria-hidden="true" />
                <span className="font-data text-[10px] tracking-[0.3em] text-am-text-muted uppercase">
                  Telemetry Workspace
                </span>
                <div className="h-[2px] w-6 bg-am-red" aria-hidden="true" />
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-am-text-secondary">
              The telemetry overlay engine, driver comparison charts, and timing
              tower will be integrated in Phase 6. This workspace is ready for
              data visualization modules.
            </p>

            {/* Phase indicator pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {["Telemetry Charts", "Driver Comparison", "Timing Tower", "Track Map"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="rounded-[2px] border border-am-border bg-am-surface px-3 py-1 font-data text-[10px] tracking-wider text-am-text-muted uppercase"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
