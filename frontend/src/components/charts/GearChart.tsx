"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MergedPoint } from "./types";
import { TELEMETRY_SYNC_ID, COLOR_A, COLOR_B } from "./types";

interface Props {
  data: MergedPoint[];
  labelA: string;
  labelB: string;
}

export default function GearChart({ data, labelA, labelB }: Props) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          syncId={TELEMETRY_SYNC_ID}
          margin={{ top: 2, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="1 4"
            stroke="rgba(30,41,59,0.7)"
            vertical={false}
          />
          <XAxis dataKey="time" hide />
          <YAxis
            domain={[0, 8]}
            width={24}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
            tick={{ fill: "#64748b", fontSize: 9, fontFamily: "var(--font-data, monospace)" }}
            tickLine={false}
            axisLine={false}
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
              `Gear ${Number(value)}`,
              name === "gear_A" ? labelA : labelB,
            ]}
            itemStyle={{ color: "#f1f5f9" }}
            labelStyle={{ color: "#64748b" }}
          />
          <Line
            type="stepAfter"
            dataKey="gear_A"
            stroke={COLOR_A}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: COLOR_A, strokeWidth: 0 }}
          />
          <Line
            type="stepAfter"
            dataKey="gear_B"
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
