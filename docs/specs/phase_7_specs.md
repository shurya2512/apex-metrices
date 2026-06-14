# Phase 7 Specs: Track Map & Driver Positioning

## 1. Track Outline Rendering (`components/TrackMap.tsx`)
- Extract X and Y coordinates from the telemetry data array.
- Normalize the coordinates so they fit within an SVG `viewBox` (e.g., bounding box logic: `x_min`, `x_max`, `y_min`, `y_max`).
- Draw the track outline using an SVG `<polyline>` or `<path>`.

## 2. Driver Positioning
- Use a React `onMouseMove` event from the Recharts `Tooltip` to capture the active `time` index.
- Pass this `activeTime` state down to the `TrackMap` component.
- The `TrackMap` component looks up the `X` and `Y` coordinates at that `activeTime` and renders an SVG `<circle>` (the car) at those normalized coordinates.
- Ensure the car dot color matches the driver's team color.
