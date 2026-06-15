"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { computeBounds, applyBounds, findClosestIndex } from "@/lib/mapping";
import type { LocationElapsedPoint } from "@/lib/formatters";
import { COLOR_A, COLOR_B } from "./charts/types";

/** SVG viewBox dimensions */
const SVG_W = 500;
const SVG_H = 500;
const SVG_PADDING = 35;

/** Max points for the visible track polyline (SVG rendering perf) */
const TRACK_OUTLINE_POINTS = 600;

interface Props {
  locationA: LocationElapsedPoint[];
  locationB: LocationElapsedPoint[];
  activeHoverTime: number | null;
  labelA: string;
  labelB: string;
}

/**
 * TrackMap — Renders the circuit layout as an SVG polyline and places
 * two pulsing driver dots at the position corresponding to the current
 * hover time on the telemetry charts.
 *
 * Performance: bounds are computed once from Driver A's full data, then
 * reused for the polyline and both driver dots via `applyBounds()`.
 */
export default function TrackMap({
  locationA,
  locationB,
  activeHoverTime,
  labelA,
  labelB,
}: Props) {
  /* ---- Compute bounds ONCE from Driver A's full dataset ---- */
  const trackBounds = useMemo(
    () => computeBounds(
      locationA.map((p) => ({ x: p.x, y: p.y })),
      SVG_W,
      SVG_H,
      SVG_PADDING
    ),
    [locationA]
  );

  /* ---- Downsample + normalize for the track outline polyline ---- */
  const trackPolyline = useMemo(() => {
    if (!trackBounds || locationA.length === 0) return "";
    const step = Math.max(1, Math.floor(locationA.length / TRACK_OUTLINE_POINTS));
    const parts: string[] = [];
    for (let i = 0; i < locationA.length; i += step) {
      const p = applyBounds(locationA[i], trackBounds);
      parts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    return parts.join(" ");
  }, [locationA, trackBounds]);

  /* ---- Find active dot positions via binary search + cheap applyBounds ---- */
  const activeDotA = useMemo(() => {
    if (activeHoverTime === null || locationA.length === 0 || !trackBounds) return null;
    const idx = findClosestIndex(locationA, activeHoverTime);
    if (idx < 0) return null;
    return applyBounds(locationA[idx], trackBounds);
  }, [activeHoverTime, locationA, trackBounds]);

  const activeDotB = useMemo(() => {
    if (activeHoverTime === null || locationB.length === 0 || !trackBounds) return null;
    const idx = findClosestIndex(locationB, activeHoverTime);
    if (idx < 0) return null;
    return applyBounds(locationB[idx], trackBounds);
  }, [activeHoverTime, locationB, trackBounds]);

  /* ---- Start/Finish marker ---- */
  const startFinish = useMemo(() => {
    if (!trackBounds || locationA.length === 0) return null;
    return applyBounds(locationA[0], trackBounds);
  }, [locationA, trackBounds]);

  const hasTrackData = trackPolyline.length > 0;

  return (
    <div className="flex flex-col border-b border-am-border">
      {/* Header — matches existing chart label rows */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="font-data text-[9px] tracking-[0.25em] text-am-text-muted uppercase">
            Track Map
          </span>
        </div>
        {activeHoverTime !== null && (
          <span className="font-data text-[9px] text-am-text-muted">
            t={activeHoverTime.toFixed(2)}s
          </span>
        )}
      </div>

      {/* SVG Track */}
      <div className="relative px-2 pb-3">
        {!hasTrackData ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div
              className="flex h-12 w-12 items-center justify-center border border-am-border bg-am-surface"
              aria-hidden="true"
            >
              <MapPin size={20} className="text-am-text-muted" />
            </div>
            <p className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
              Location data unavailable
            </p>
          </div>
        ) : (
          <div className="track-map-container relative overflow-hidden">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              style={{ maxHeight: 320 }}
              role="img"
              aria-label={`Track map showing positions of ${labelA} and ${labelB}`}
            >
              {/* Background grid pattern */}
              <defs>
                <pattern
                  id="track-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(30,41,59,0.3)"
                    strokeWidth="0.5"
                  />
                </pattern>

                {/* Glow filters for driver dots */}
                <filter id="glow-a" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-b" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid background */}
              <rect width={SVG_W} height={SVG_H} fill="url(#track-grid)" />

              {/* Track outline — full circuit */}
              <polyline
                points={trackPolyline}
                fill="none"
                stroke="#1e293b"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Track highlight line — slightly brighter inner stroke */}
              <polyline
                points={trackPolyline}
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Start/Finish marker */}
              {startFinish && (
                <g>
                  <line
                    x1={startFinish.x - 8}
                    y1={startFinish.y - 8}
                    x2={startFinish.x + 8}
                    y2={startFinish.y + 8}
                    stroke="#e10600"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <text
                    x={startFinish.x + 12}
                    y={startFinish.y - 4}
                    fill="#64748b"
                    fontSize="8"
                    fontFamily="var(--font-data, monospace)"
                  >
                    S/F
                  </text>
                </g>
              )}

              {/* Driver B dot — rendered first so A appears on top */}
              {activeDotB && (
                <g className="driver-dot-group">
                  {/* Outer glow ring */}
                  <circle
                    cx={activeDotB.x}
                    cy={activeDotB.y}
                    r="14"
                    fill="none"
                    stroke={COLOR_B}
                    strokeWidth="1.5"
                    opacity="0.3"
                    className="driver-dot-pulse"
                  />
                  {/* Main dot */}
                  <circle
                    cx={activeDotB.x}
                    cy={activeDotB.y}
                    r="7"
                    fill={COLOR_B}
                    filter="url(#glow-b)"
                  />
                  {/* Inner bright core */}
                  <circle
                    cx={activeDotB.x}
                    cy={activeDotB.y}
                    r="3"
                    fill="#fff"
                    opacity="0.8"
                  />
                  {/* Label */}
                  <text
                    x={activeDotB.x + 14}
                    y={activeDotB.y + 4}
                    fill={COLOR_B}
                    fontSize="9"
                    fontFamily="var(--font-data, monospace)"
                    fontWeight="bold"
                  >
                    {labelB}
                  </text>
                </g>
              )}

              {/* Driver A dot — on top layer */}
              {activeDotA && (
                <g className="driver-dot-group">
                  {/* Outer glow ring */}
                  <circle
                    cx={activeDotA.x}
                    cy={activeDotA.y}
                    r="14"
                    fill="none"
                    stroke={COLOR_A}
                    strokeWidth="1.5"
                    opacity="0.3"
                    className="driver-dot-pulse"
                  />
                  {/* Main dot */}
                  <circle
                    cx={activeDotA.x}
                    cy={activeDotA.y}
                    r="7"
                    fill={COLOR_A}
                    filter="url(#glow-a)"
                  />
                  {/* Inner bright core */}
                  <circle
                    cx={activeDotA.x}
                    cy={activeDotA.y}
                    r="3"
                    fill="#fff"
                    opacity="0.8"
                  />
                  {/* Label */}
                  <text
                    x={activeDotA.x + 14}
                    y={activeDotA.y + 4}
                    fill={COLOR_A}
                    fontSize="9"
                    fontFamily="var(--font-data, monospace)"
                    fontWeight="bold"
                  >
                    {labelA}
                  </text>
                </g>
              )}

              {/* No hover state — show instruction */}
              {activeHoverTime === null && hasTrackData && (
                <text
                  x={SVG_W / 2}
                  y={SVG_H / 2}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="var(--font-data, monospace)"
                  letterSpacing="0.15em"
                >
                  HOVER CHARTS TO TRACK POSITION
                </text>
              )}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
