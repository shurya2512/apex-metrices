"use client";

import type { Driver } from "@/lib/api";
import { COLOR_A, COLOR_B } from "./charts/types";

interface Props {
  drivers: Driver[];
  driverA: number | null;
  driverB: number | null;
  onSelectA: (num: number) => void;
  onSelectB: (num: number) => void;
  loading?: boolean;
}

/**
 * TimingTower — left command-rail that lists all drivers in the session.
 * Each row has an A and B selector button. Selected A rows glow red; selected B rows glow blue.
 * Design: 0px radius, angular, sharp — no glassmorphism, no rounded cards.
 */
export default function TimingTower({
  drivers,
  driverA,
  driverB,
  onSelectA,
  onSelectB,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <aside className="flex flex-col gap-1 p-3" aria-label="Timing Tower loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse bg-am-surface border border-am-border"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </aside>
    );
  }

  if (!drivers.length) {
    return (
      <aside className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
          No Drivers
        </span>
        <p className="text-xs text-am-text-muted">
          Could not load driver data for this session.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="flex flex-col gap-px stagger-children"
      aria-label="Timing Tower — Driver Selection"
    >
      {drivers.map((driver) => {
        const isA = driverA === driver.driver_number;
        const isB = driverB === driver.driver_number;

        return (
          <div
            key={driver.driver_number}
            className={`
              relative flex items-center gap-2 px-3 py-2.5
              bg-am-surface border-l-2 border-r-0 border-t-0 border-b-0
              transition-all duration-200
              ${isA
                ? "border-l-[#E10600] bg-[#E10600]/5"
                : isB
                ? "border-l-[#3B82F6] bg-[#3B82F6]/5"
                : "border-l-transparent hover:border-l-am-border-hover hover:bg-am-elevated"
              }
            `}
            id={`driver-row-${driver.driver_number}`}
          >
            {/* Driver number pill with team color */}
            <span
              className="flex h-7 w-8 shrink-0 items-center justify-center font-data text-[11px] font-bold leading-none"
              style={{
                background: `${driver.team_colour}18`,
                color: driver.team_colour,
                border: `1px solid ${driver.team_colour}40`,
              }}
            >
              {driver.driver_number}
            </span>

            {/* Driver name */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[11px] font-bold leading-none tracking-wide text-am-text uppercase truncate">
                {driver.name_acronym}
              </span>
              <span className="font-data text-[9px] leading-none text-am-text-muted truncate">
                {driver.team_name}
              </span>
            </div>

            {/* A / B selector buttons */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                id={`select-a-${driver.driver_number}`}
                type="button"
                onClick={() => onSelectA(driver.driver_number)}
                disabled={isB}
                aria-pressed={isA}
                aria-label={`Set ${driver.name_acronym} as Driver A`}
                className={`
                  flex h-5 w-5 items-center justify-center
                  text-[9px] font-bold leading-none cursor-pointer
                  transition-all duration-150
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${isA
                    ? "bg-[#E10600] text-white"
                    : "border border-am-border text-am-text-muted hover:border-[#E10600] hover:text-[#E10600]"
                  }
                `}
              >
                A
              </button>
              <button
                id={`select-b-${driver.driver_number}`}
                type="button"
                onClick={() => onSelectB(driver.driver_number)}
                disabled={isA}
                aria-pressed={isB}
                aria-label={`Set ${driver.name_acronym} as Driver B`}
                className={`
                  flex h-5 w-5 items-center justify-center
                  text-[9px] font-bold leading-none cursor-pointer
                  transition-all duration-150
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${isB
                    ? "bg-[#3B82F6] text-white"
                    : "border border-am-border text-am-text-muted hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  }
                `}
              >
                B
              </button>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
