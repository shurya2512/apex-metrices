import type { TelemetryPoint } from "./api";

export interface MergedPoint {
  time: number;
  speed_A: number;
  speed_B: number;
  rpm_A: number;
  rpm_B: number;
  gear_A: number;
  gear_B: number;
  throttle_A: number;
  throttle_B: number;
  brake_A: number;
  brake_B: number;
}

/**
 * Merges two telemetry arrays onto a shared 100 ms-resolution timeline.
 *
 * Strategy: build a unified set of timestamp buckets (rounded to nearest 100 ms),
 * then for each bucket find the closest sample from each driver. If a driver has
 * no data near that bucket the value is carried forward from the last known sample.
 */
export function mergeTelemetryData(
  dataA: TelemetryPoint[],
  dataB: TelemetryPoint[]
): MergedPoint[] {
  if (!dataA.length || !dataB.length) return [];

  // Build index maps: bucket → nearest point
  const indexA = buildIndex(dataA);
  const indexB = buildIndex(dataB);

  // Safely collect all unique time buckets across both drivers without spread operator
  // Spreading large Maps (e.g. 30k+ keys) can exceed the JS engine's call stack limit
  const bucketSet = new Set<number>();
  for (const k of indexA.keys()) bucketSet.add(k);
  for (const k of indexB.keys()) bucketSet.add(k);
  const allBuckets = Array.from(bucketSet).sort((a, b) => a - b);

  // Fill-forward state for when one driver is missing a bucket
  let lastA: TelemetryPoint = dataA[0];
  let lastB: TelemetryPoint = dataB[0];

  const merged: MergedPoint[] = [];

  for (const t of allBuckets) {
    const pA = indexA.get(t) ?? lastA;
    const pB = indexB.get(t) ?? lastB;
    lastA = pA;
    lastB = pB;

    merged.push({
      time: t,
      speed_A: pA.speed,
      speed_B: pB.speed,
      rpm_A: pA.rpm,
      rpm_B: pB.rpm,
      gear_A: pA.gear,
      gear_B: pB.gear,
      throttle_A: pA.throttle,
      throttle_B: pB.throttle,
      brake_A: pA.brake,
      brake_B: pB.brake,
    });
  }

  return merged;
}

/** Builds a Map<bucketTime, closestPoint> for a single driver's telemetry array. */
function buildIndex(data: TelemetryPoint[]): Map<number, TelemetryPoint> {
  const map = new Map<number, TelemetryPoint>();

  for (const point of data) {
    const b = Math.round(point.time * 10) / 10;
    const existing = map.get(b);
    if (!existing || Math.abs(point.time - b) < Math.abs(existing.time - b)) {
      map.set(b, point);
    }
  }

  return map;
}

/* ---- Location data processing ---- */

export interface LocationElapsedPoint {
  elapsed_time: number;
  x: number;
  y: number;
}

/**
 * Converts raw location data (with ISO date strings) into elapsed-time-indexed
 * points so they can be correlated with the telemetry timeline.
 *
 * Optimized: ISO 8601 strings are lexicographically sortable, so we avoid
 * creating Date objects during the sort. We only parse dates in a single
 * final pass to compute elapsed_time.
 */
export function processLocationData(
  rawData: { date: string; x: number; y: number }[]
): LocationElapsedPoint[] {
  if (!rawData.length) return [];

  // ISO strings are lexicographically sortable — no Date parsing needed here
  const sorted = [...rawData].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const startMs = new Date(sorted[0].date).getTime();

  // Single pass: parse date only once per point
  const result: LocationElapsedPoint[] = new Array(sorted.length);
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    result[i] = {
      elapsed_time: (new Date(p.date).getTime() - startMs) / 1000,
      x: p.x,
      y: p.y,
    };
  }

  return result;
}

