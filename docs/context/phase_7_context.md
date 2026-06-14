# Phase 7 Context: Track Map & Driver Positioning

## AI Agent Instructions & Objectives
**Goal:** Render a visual 2D map of the race circuit based on X/Y telemetry coordinates, and plot a moving dot representing the car.

**Why this matters:** Looking at line charts is abstract. Tying the line chart data to a physical location on the track (e.g., "Oh, he braked later into Turn 4") provides essential physical context to the data.

## Success Criteria
1. The circuit outline is correctly rendered using the array of X/Y coordinates from the API.
2. An indicator dot shows the driver's current position.
3. (Bonus) The indicator dot's position syncs with the currently hovered timestamp on the Recharts telemetry charts.
