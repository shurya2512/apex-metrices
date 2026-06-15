"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Crosshair } from "lucide-react";
import type { Driver } from "@/lib/api";
import { fetchDrivers, fetchTelemetry, fetchLocationData } from "@/lib/api";
import {
  mergeTelemetryData,
  processLocationData,
  type MergedPoint,
  type LocationElapsedPoint,
} from "@/lib/formatters";
import TimingTower from "./TimingTower";
import F1TyreLoader from "./F1TyreLoader";
import TrackMap from "./TrackMap";
import SpeedChart from "./charts/SpeedChart";
import RpmChart from "./charts/RpmChart";
import GearChart from "./charts/GearChart";
import ThrottleChart from "./charts/ThrottleChart";
import BrakeChart from "./charts/BrakeChart";
import { COLOR_A, COLOR_B } from "./charts/types";

interface Props {
  sessionId: string;
}

interface ChartConfig {
  label: string;
  unit: string;
  component: React.ComponentType<{
    data: MergedPoint[];
    labelA: string;
    labelB: string;
    onHoverTimeChange?: (time: number | null) => void;
  }>;
}

const CHARTS: ChartConfig[] = [
  { label: "SPEED", unit: "km/h", component: SpeedChart },
  { label: "ENGINE RPM", unit: "rpm", component: RpmChart },
  { label: "GEAR", unit: "", component: GearChart },
  { label: "THROTTLE", unit: "%", component: ThrottleChart },
  { label: "BRAKE", unit: "%", component: BrakeChart },
];

/**
 * TelemetryDashboard — master orchestrator for the session telemetry workspace.
 *
 * Layout: 30/70 asymmetric split
 *   Left (30%) — TimingTower: driver selection command rail
 *   Right (70%) — TrackMap + 5 stacked synchronized Recharts line charts
 *
 * State machine:
 *   drivers → fetched on mount
 *   driverA / driverB → set by user via TimingTower
 *   mergedData → fetched + merged when both A and B are set
 *   locationA / locationB → fetched when both drivers selected
 *   activeHoverTime → set by chart hover, drives TrackMap dot positions
 */
export default function TelemetryDashboard({ sessionId }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driversLoading, setDriversLoading] = useState(true);
  const [driversError, setDriversError] = useState<string | null>(null);

  const [driverA, setDriverA] = useState<number | null>(null);
  const [driverB, setDriverB] = useState<number | null>(null);

  const [mergedData, setMergedData] = useState<MergedPoint[]>([]);
  const [telemetryLoading, setTelemetryLoading] = useState(false);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);

  /* ---- Track Map state ---- */
  const [locationA, setLocationA] = useState<LocationElapsedPoint[]>([]);
  const [locationB, setLocationB] = useState<LocationElapsedPoint[]>([]);
  const [activeHoverTime, setActiveHoverTime] = useState<number | null>(null);

  /* ---- Fetch driver list on mount ---- */
  useEffect(() => {
    let cancelled = false;
    setDriversLoading(true);
    setDriversError(null);

    fetchDrivers(sessionId)
      .then((data) => {
        if (!cancelled) setDrivers(data);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setDriversError(err instanceof Error ? err.message : "Failed to load drivers");
      })
      .finally(() => {
        if (!cancelled) setDriversLoading(false);
      });

    return () => { cancelled = true; };
  }, [sessionId]);

  /* ---- Fetch + merge telemetry when both drivers are selected ---- */
  useEffect(() => {
    if (driverA === null || driverB === null) {
      setMergedData([]);
      return;
    }

    let cancelled = false;
    setTelemetryLoading(true);
    setTelemetryError(null);
    setMergedData([]);

    const lapIdA = `${sessionId}_${driverA}_1`;
    const lapIdB = `${sessionId}_${driverB}_1`;

    Promise.allSettled([fetchTelemetry(lapIdA), fetchTelemetry(lapIdB)])
      .then(([resA, resB]) => {
        if (cancelled) return;
        
        const dataA = resA.status === "fulfilled" ? resA.value.data : [];
        const dataB = resB.status === "fulfilled" ? resB.value.data : [];
        
        // If both failed, show error
        if (resA.status === "rejected" && resB.status === "rejected") {
          setTelemetryError("Failed to fetch telemetry for both drivers.");
          return;
        }

        const merged = mergeTelemetryData(dataA, dataB);
        setMergedData(merged);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setTelemetryError(
            err instanceof Error ? err.message : "Failed to load telemetry"
          );
      })
      .finally(() => {
        if (!cancelled) setTelemetryLoading(false);
      });

    return () => { cancelled = true; };
  }, [sessionId, driverA, driverB]);

  /* ---- Fetch location data for track map when both drivers are selected ---- */
  useEffect(() => {
    if (driverA === null || driverB === null) {
      setLocationA([]);
      setLocationB([]);
      return;
    }

    let cancelled = false;

    Promise.allSettled([
      fetchLocationData(sessionId, driverA),
      fetchLocationData(sessionId, driverB),
    ])
      .then(([resA, resB]) => {
        if (cancelled) return;
        setLocationA(resA.status === "fulfilled" ? processLocationData(resA.value.data) : []);
        setLocationB(resB.status === "fulfilled" ? processLocationData(resB.value.data) : []);
      })
      .catch(() => {
        // Location data is optional — silently fail and show empty track map
        if (!cancelled) {
          setLocationA([]);
          setLocationB([]);
        }
      });

    return () => { cancelled = true; };
  }, [sessionId, driverA, driverB]);

  const handleSelectA = useCallback((num: number) => {
    setDriverA((prev) => (prev === num ? null : num));
  }, []);

  const handleSelectB = useCallback((num: number) => {
    setDriverB((prev) => (prev === num ? null : num));
  }, []);

  const handleHoverTimeChange = useCallback((time: number | null) => {
    setActiveHoverTime(time);
  }, []);

  const driverAInfo = drivers.find((d) => d.driver_number === driverA);
  const driverBInfo = drivers.find((d) => d.driver_number === driverB);

  const labelA = driverAInfo?.name_acronym ?? "Driver A";
  const labelB = driverBInfo?.name_acronym ?? "Driver B";

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── LEFT COMMAND RAIL — Timing Tower ── */}
      <div
        className="flex flex-col border-r border-am-border"
        style={{ width: "clamp(200px, 28%, 300px)", flexShrink: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-am-border px-3 py-2.5">
          <div className="h-[2px] w-4 bg-am-red shrink-0" aria-hidden="true" />
          <span className="font-data text-[9px] tracking-[0.3em] text-am-text-muted uppercase">
            Timing Tower
          </span>
        </div>

        {/* Driver legend */}
        {(driverA !== null || driverB !== null) && (
          <div className="flex items-center gap-3 border-b border-am-border px-3 py-2">
            {driverA !== null && (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 shrink-0" style={{ background: COLOR_A }} />
                <span className="font-data text-[10px] text-am-text truncate">{labelA}</span>
              </div>
            )}
            {driverB !== null && (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 shrink-0" style={{ background: COLOR_B }} />
                <span className="font-data text-[10px] text-am-text truncate">{labelB}</span>
              </div>
            )}
          </div>
        )}

        {/* Driver error state */}
        {driversError && (
          <div className="flex items-center gap-2 p-3">
            <AlertCircle size={14} className="shrink-0 text-am-red" />
            <span className="text-[11px] text-am-text-secondary">{driversError}</span>
          </div>
        )}

        {/* Driver list */}
        <div className="flex-1 overflow-y-auto">
          <TimingTower
            drivers={drivers}
            driverA={driverA}
            driverB={driverB}
            onSelectA={handleSelectA}
            onSelectB={handleSelectB}
            loading={driversLoading}
          />
        </div>

        {/* Instruction hint when nothing selected */}
        {!driversLoading && drivers.length > 0 && driverA === null && driverB === null && (
          <div className="border-t border-am-border px-3 py-3">
            <p className="font-data text-[9px] leading-relaxed tracking-wide text-am-text-muted uppercase">
              Select{" "}
              <span style={{ color: COLOR_A }}>A</span>
              {" "}and{" "}
              <span style={{ color: COLOR_B }}>B</span>
              {" "}driver to compare telemetry
            </p>
          </div>
        )}
      </div>

      {/* ── RIGHT TELEMETRY PANEL — Track Map + 5 stacked charts ── */}
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* ── Empty state: prompt to select drivers ── */}
        {!telemetryLoading && mergedData.length === 0 && !telemetryError && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center border border-am-border bg-am-surface"
              aria-hidden="true"
            >
              <Crosshair size={28} className="text-am-text-muted" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-am-text">
                {driverA === null || driverB === null
                  ? "Select two drivers to begin comparison"
                  : "Initialising telemetry feed…"}
              </p>
              <p className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
                {driverA !== null && driverB === null && `${labelA} selected — choose Driver B`}
                {driverB !== null && driverA === null && `${labelB} selected — choose Driver A`}
                {driverA === null && driverB === null && "Use the timing tower on the left"}
              </p>
            </div>
          </div>
        )}

        {/* ── Telemetry loading ── */}
        {telemetryLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <F1TyreLoader size={52} />
            <span className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
              Fetching telemetry…
            </span>
          </div>
        )}

        {/* ── Telemetry error ── */}
        {telemetryError && !telemetryLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle size={28} className="text-am-red" />
            <p className="text-sm font-medium text-am-text">Telemetry Unavailable</p>
            <p className="max-w-xs font-data text-[10px] text-am-text-muted">{telemetryError}</p>
          </div>
        )}

        {/* ── Charts + TrackMap: only render when data is ready ── */}
        {!telemetryLoading && mergedData.length > 0 && (
          <div
            className="flex flex-col divide-y divide-am-border"
            style={{ animation: "fade-up 0.4s ease-out" }}
          >
            {/* Driver comparison header bar */}
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-[2px] w-6" style={{ background: COLOR_A }} />
                  <span className="font-data text-[10px] font-bold text-am-text uppercase">
                    {labelA}
                  </span>
                </div>
                <span className="text-[10px] text-am-text-muted">vs</span>
                <div className="flex items-center gap-2">
                  <span className="h-[2px] w-6" style={{ background: COLOR_B }} />
                  <span className="font-data text-[10px] font-bold text-am-text uppercase">
                    {labelB}
                  </span>
                </div>
              </div>
              <span className="font-data text-[9px] tracking-widest text-am-text-muted uppercase">
                {mergedData.length} samples · Lap 1
              </span>
            </div>

            {/* ── Track Map Panel ── */}
            <TrackMap
              locationA={locationA}
              locationB={locationB}
              activeHoverTime={activeHoverTime}
              labelA={labelA}
              labelB={labelB}
            />

            {/* Chart rows */}
            {CHARTS.map(({ label, unit, component: ChartComponent }, idx) => (
              <div key={label} className="flex flex-col">
                {/* Chart label row */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                  <span className="font-data text-[9px] tracking-[0.25em] text-am-text-muted uppercase">
                    {label}
                  </span>
                  {unit && (
                    <span className="font-data text-[9px] text-am-text-muted">
                      ({unit})
                    </span>
                  )}
                </div>
                {/* Chart */}
                <div className="px-2 pb-2">
                  <ChartComponent
                    data={mergedData}
                    labelA={labelA}
                    labelB={labelB}
                    /* Only SpeedChart (idx 0) broadcasts hover — all charts sync via syncId */
                    onHoverTimeChange={idx === 0 ? handleHoverTimeChange : undefined}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}