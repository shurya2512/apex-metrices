"use client";

import { useEffect, useState } from "react";

/**
 * FiveRedLights — F1 starting grid gantry countdown.
 *
 * Sequentially illuminates 5 circles from gray to bright red over ~2 seconds.
 * Each light activates ~400ms apart with a glow effect.
 *
 * Props:
 *   onComplete — callback fired after all 5 lights are lit
 *   autoStart  — start the countdown immediately (default: true)
 */
interface FiveRedLightsProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const LIGHT_COUNT = 5;
const LIGHT_INTERVAL_MS = 400;

export default function FiveRedLights({
  onComplete,
  autoStart = true,
}: FiveRedLightsProps) {
  const [activeLights, setActiveLights] = useState(0);

  useEffect(() => {
    if (!autoStart) return;

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setActiveLights(count);

      if (count >= LIGHT_COUNT) {
        clearInterval(interval);
        onComplete?.();
      }
    }, LIGHT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [autoStart, onComplete]);

  return (
    <div
      className="flex flex-col items-center gap-4"
      role="status"
      aria-label="Initializing workspace"
    >
      {/* Gantry housing */}
      <div className="relative flex items-center gap-3 rounded-sm bg-am-surface px-5 py-4 border border-am-border">
        {/* Horizontal gantry bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-am-text-muted/30" aria-hidden="true" />

        {Array.from({ length: LIGHT_COUNT }, (_, i) => {
          const isActive = i < activeLights;
          return (
            <div
              key={i}
              className="relative flex items-center justify-center"
            >
              {/* Light housing (dark ring) */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a2e] border border-am-border sm:h-12 sm:w-12">
                {/* Light bulb */}
                <div
                  className="h-6 w-6 rounded-full transition-all duration-300 sm:h-8 sm:w-8"
                  style={
                    isActive
                      ? {
                          backgroundColor: "#E10600",
                          boxShadow: "0 0 16px 4px rgba(225, 6, 0, 0.4), 0 0 32px 8px rgba(225, 6, 0, 0.2)",
                        }
                      : {
                          backgroundColor: "#374151",
                          boxShadow: "none",
                        }
                  }
                />
              </div>
            </div>
          );
        })}

        {/* Bottom gantry bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-am-text-muted/30" aria-hidden="true" />
      </div>

      {/* Status text */}
      <span className="font-data text-[10px] tracking-[0.25em] text-am-text-secondary uppercase">
        {activeLights < LIGHT_COUNT
          ? `Initializing${".".repeat(activeLights)}`
          : "Systems Ready"}
      </span>

      <span className="sr-only">
        {activeLights < LIGHT_COUNT
          ? `Loading: ${activeLights} of ${LIGHT_COUNT} systems ready`
          : "All systems ready"}
      </span>
    </div>
  );
}
