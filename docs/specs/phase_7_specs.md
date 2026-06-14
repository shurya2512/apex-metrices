# Phase 7 Specs: Track Map & Driver Positioning

## 📁 File Structure to Create
```text
frontend/
├── components/
│   └── TrackMap.tsx
└── lib/
    └── mapping.ts
```

## 🛠️ Required Libraries & Tools
- No external libraries required; use native SVG elements (`<svg>`, `<polyline>`, `<circle>`).

## 💻 Technical Implementation Details

### 1. Scaling Logic (`lib/mapping.ts`)
```typescript
export function normalizeCoordinates(data: any[], svgWidth: number, svgHeight: number) {
    // Find min and max X, Y
    // Return array of scaled coordinates that fit inside the width/height
}
```

### 2. SVG Track Component (`components/TrackMap.tsx`)
```tsx
export default function TrackMap({ telemetryData, activeTime }: { telemetryData: any[], activeTime: number }) {
  // Normalize the entire track data to draw the grey background line
  const normalizedTrack = normalizeCoordinates(telemetryData, 500, 500);
  
  // Find the exact X/Y for the current hovered `activeTime`
  const activePoint = telemetryData.find(d => d.time === activeTime);
  const activeNormalized = // ... scale activePoint

  return (
    <svg viewBox="0 0 500 500" className="w-full h-full bg-slate-900 rounded-lg">
      {/* The Track */}
      <polyline 
        points={normalizedTrack.map(p => `${p.x},${p.y}`).join(' ')} 
        fill="none" 
        stroke="#334155" 
        strokeWidth="4" 
      />
      
      {/* The Driver Dot */}
      {activeNormalized && (
         <circle cx={activeNormalized.x} cy={activeNormalized.y} r="8" fill="#EF4444" />
      )}
    </svg>
  );
}
```

### 3. Syncing State in Dashboard
In `TelemetryDashboard.tsx`:
```tsx
const [activeHoverTime, setActiveHoverTime] = useState<number | null>(null);

// Inside the Recharts SpeedChart
<Tooltip content={(props) => {
   if (props.active && props.payload && props.payload.length) {
       setActiveHoverTime(props.payload[0].payload.time);
   }
   return <CustomTooltip {...props} />
}} />

// Pass to map
<TrackMap telemetryData={mergedData} activeTime={activeHoverTime} />
```
