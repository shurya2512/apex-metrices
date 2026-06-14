# Phase 6 Specs: Frontend Telemetry Charting & Timing Tower

## 📁 File Structure to Create
```text
frontend/
├── components/
│   ├── TimingTower.tsx
│   ├── TelemetryDashboard.tsx
│   └── charts/
│       ├── SpeedChart.tsx
│       ├── RpmChart.tsx
│       └── ...
└── lib/
    └── formatters.ts
```

## 🛠️ Required Libraries & Tools
- `recharts`: A composable charting library built on React components.

## 💻 Technical Implementation Details

### 1. Data Merging Utility (`lib/formatters.ts`)
```typescript
export function mergeTelemetryData(dataA: any[], dataB: any[]) {
  // Logic to merge based on the 'time' property
  // Example output: { time: 1.25, speed_A: 200, speed_B: 205, rpm_A: ... }
  // You may need to interpolate or align the timestamps to the nearest 100ms
}
```

### 2. Chart Components (`components/charts/SpeedChart.tsx`)
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SpeedChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId="telemetrySync">
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="speed_A" stroke="#EF4444" dot={false} />
          <Line type="monotone" dataKey="speed_B" stroke="#3B82F6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 3. State Management (`TelemetryDashboard.tsx`)
- `const [driverA, setDriverA] = useState<number | null>(null)`
- `const [driverB, setDriverB] = useState<number | null>(null)`
- Fetch data when these states change, pass to `mergeTelemetryData`, pass result to charts.
