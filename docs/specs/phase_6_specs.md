# Phase 6 Specs: Frontend Telemetry Charting & Timing Tower

## 1. Dependencies
- Install Recharts: `npm install recharts`

## 2. Dynamic Timing Tower (`components/TimingTower.tsx`)
- Displays a vertical list of drivers participating in the selected session.
- Allows the user to select `Driver A` and `Driver B` for comparison via a React context or local state.

## 3. Telemetry Overlay (`components/TelemetryChart.tsx`)
- **Data Fetching:** When `Driver A` and `Driver B` are selected, fetch `/api/laps/{lap_id_a}/telemetry` and `/api/laps/{lap_id_b}/telemetry`.
- **Data Transformation:** Merge the two JSON arrays by timestamp so Recharts can plot both lines on the same axis.
  ```json
  // Target format
  [
    { "time": 12.5, "speedA": 300, "speedB": 305 },
    { "time": 12.6, "speedA": 302, "speedB": 308 }
  ]
  ```

## 4. Recharts Configuration
- Create 5 separate `<ResponsiveContainer><LineChart>` instances for Speed, RPM, Throttle, Brake, Gear.
- **Synchronization:** Use the `syncId="telemetry"` prop on all 5 charts so the user's cursor tooltip syncs vertically across all charts instantly.
- **Styling:** Use team colors (e.g., Red for Ferrari, Blue for Red Bull) as the `stroke` color for the lines.
