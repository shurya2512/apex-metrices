export interface NormalizedPoint {
  x: number;
  y: number;
}

/** Precomputed bounds + transform for reusing across points */
export interface TrackBounds {
  minX: number;
  minY: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Computes the normalization bounds from a set of reference points.
 * Call this once on the full track dataset, then use `applyBounds()`
 * to transform individual points cheaply.
 */
export function computeBounds(
  points: { x: number; y: number }[],
  svgWidth: number,
  svgHeight: number,
  padding = 30
): TrackBounds | null {
  if (points.length === 0) return null;

  const drawW = svgWidth - padding * 2;
  const drawH = svgHeight - padding * 2;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const scale = Math.min(drawW / rangeX, drawH / rangeY);
  const offsetX = padding + (drawW - rangeX * scale) / 2;
  const offsetY = padding + (drawH - rangeY * scale) / 2;

  return { minX, minY, scale, offsetX, offsetY };
}

/** Transforms a single point using precomputed bounds. */
export function applyBounds(
  point: { x: number; y: number },
  bounds: TrackBounds
): NormalizedPoint {
  return {
    x: (point.x - bounds.minX) * bounds.scale + bounds.offsetX,
    y: (point.y - bounds.minY) * bounds.scale + bounds.offsetY,
  };
}

/**
 * Scales raw X/Y coordinates to fit inside an SVG viewBox while preserving
 * aspect ratio. Convenience wrapper around computeBounds + applyBounds.
 */
export function normalizeCoordinates(
  points: { x: number; y: number }[],
  svgWidth: number,
  svgHeight: number,
  padding = 30
): NormalizedPoint[] {
  const bounds = computeBounds(points, svgWidth, svgHeight, padding);
  if (!bounds) return [];

  const result: NormalizedPoint[] = new Array(points.length);
  for (let i = 0; i < points.length; i++) {
    result[i] = applyBounds(points[i], bounds);
  }
  return result;
}

/**
 * Given a time value and an array of location data sorted by elapsed_time,
 * returns the index of the closest point via binary search.
 */
export function findClosestIndex(
  data: { elapsed_time: number }[],
  targetTime: number
): number {
  if (data.length === 0) return -1;

  let lo = 0;
  let hi = data.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (data[mid].elapsed_time < targetTime) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  // Compare lo and lo-1 to find the actual closest
  if (lo > 0) {
    const diffLo = Math.abs(data[lo].elapsed_time - targetTime);
    const diffPrev = Math.abs(data[lo - 1].elapsed_time - targetTime);
    if (diffPrev < diffLo) return lo - 1;
  }

  return lo;
}
