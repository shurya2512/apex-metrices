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

export default function RpmChart({ data, labelA, labelB }: Props) {
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
            domain={[0, 15000]}
            width={42}
            tick={{ fill: "#64748b", fontSize: 9, fontFamily: "var(--font-data, monospace)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
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
              `${Math.round(Number(value))} rpm`,
              name === "rpm_A" ? labelA : labelB,
            ]}
            itemStyle={{ color: "#f1f5f9" }}
            labelStyle={{ color: "#64748b" }}
          />
          <Line
            type="monotone"
            dataKey="rpm_A"
            stroke={COLOR_A}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: COLOR_A, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="rpm_B"
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
