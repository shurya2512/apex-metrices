/**
 * Re-export MergedPoint from the single source of truth.
 * Chart components import from this file for convenience.
 */
export type { MergedPoint } from "@/lib/formatters";

/** Shared syncId so all charts share a crosshair on hover */
export const TELEMETRY_SYNC_ID = "telemetrySync";

/** Driver A = F1 Signal Red */
export const COLOR_A = "#E10600";
/** Driver B = Electric Blue */
export const COLOR_B = "#3B82F6";

/** Callback for broadcasting the active hover time from charts */
export type HoverTimeCallback = (time: number | null) => void;

