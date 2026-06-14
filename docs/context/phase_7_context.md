# Phase 7 Context: Track Map & Driver Positioning

## 🤖 AI Agent System Prompt
**Role:** You are a Frontend Graphics Engineer.
**Task:** Build a custom HTML5 Canvas or SVG component that draws the physical layout of the racing circuit and places the drivers' exact positions onto the track based on the telemetry timestamp.

## 🧠 Conceptual Background
Line charts tell us *how* a driver is performing, but a Track Map tells us *where*. If we see a massive spike in braking, we need to see that it occurred going into a hairpin turn. OpenF1 provides `x` and `y` coordinates for every telemetry timestamp. You must draw all of these points to create the "track line", and then place a moving dot representing the car.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: Coordinate Normalization.** Real-world X/Y coordinates might range from -10000 to +10000. An SVG `viewBox` needs normalized dimensions (e.g., 0 to 1000).
   - *Agent Solution:* Find the min/max X and min/max Y in the dataset. Scale the points to fit inside the SVG viewBox proportionally.
2. **Challenge: Syncing the Map to the Charts.**
   - *Agent Solution:* Recharts `Tooltip` provides an `onMouseMove` callback. Capture the `activePayload.time` from Recharts, save it to React state, and pass that time to the `TrackMap` component so it knows exactly which X/Y coordinate to render the dot at.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] An SVG or Canvas successfully draws the circuit shape using the `X` and `Y` telemetry data.
- [ ] Two dots (representing Driver A and B) render on the track.
- [ ] Hovering over the Recharts telemetry chart moves the dots on the Track Map in real-time.
