"use client";

import { useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MergedPoint, HoverTimeCallback } from "./types";
import { TELEMETRY_SYNC_ID, COLOR_A, COLOR_B } from "./types";

interface Props {
  data: MergedPoint[];
  labelA: string;
  labelB: string;
  onHoverTimeChange?: HoverTimeCallback;
}

export default function SpeedChart({ data, labelA, labelB, onHoverTimeChange }: Props) {
  const handleMouseMove = useCallback(
    (state: { activeLabel?: string | number }) => {
      if (state?.activeLabel != null && onHoverTimeChange) {
        onHoverTimeChange(Number(state.activeLabel));
      }
    },
    [onHoverTimeChange]
  );

  const handleMouseLeave = useCallback(() => {
    onHoverTimeChange?.(null);
  }, [onHoverTimeChange]);

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          syncId={TELEMETRY_SYNC_ID}
          margin={{ top: 2, right: 8, left: 0, bottom: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid
            strokeDasharray="1 4"
            stroke="rgba(30,41,59,0.7)"
            vertical={false}
          />
          <XAxis dataKey="time" hide />
          <YAxis
            domain={[0, 380]}
            width={36}
            tick={{ fill: "#64748b", fontSize: 9, fontFamily: "var(--font-data, monospace)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#161f30",
              border: "1px solid #1e293b",
              borderRadius: 0,
              fontSize: 10,
              fontFamily: "var(--font-data, monospace)",
              padding: "6px 10px",
            }}
            labelFormatter={(v) => `t=${Number(v).toFixed(2)}s`}
            formatter={(value, name) => [
              `${Math.round(Number(value))} km/h`,
              name === "speed_A" ? labelA : labelB,
            ]}
            itemStyle={{ color: "#f1f5f9" }}
            labelStyle={{ color: "#64748b" }}
          />
          <Line
            type="monotone"
            dataKey="speed_A"
            stroke={COLOR_A}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: COLOR_A, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="speed_B"
            stroke={COLOR_B}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: COLOR_B, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

