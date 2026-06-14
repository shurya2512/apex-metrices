# Phase 6 Context: Frontend Telemetry Charting & Timing Tower

## 🤖 AI Agent System Prompt
**Role:** You are a Frontend Data Visualization Expert.
**Task:** Build the core interface of the app: The Dynamic Timing Tower and the synchronized Head-to-Head Telemetry Charts using Recharts.

## 🧠 Conceptual Background
Once a user clicks into a session (e.g., `/sessions/1234`), they need to see two things:
1. **Timing Tower:** A list of all drivers in that session. The user must be able to select two distinct drivers to compare (Driver A and Driver B).
2. **Telemetry Charts:** 5 separate line graphs representing Speed, RPM, Gear, Throttle, and Brake. These graphs must plot both drivers' data simultaneously, and crucially, hovering over one graph must sync the tooltip line across all 5 graphs instantly.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: Recharts Syncing.** You have 5 independent charts. Hovering on the 'Speed' chart needs to show the 'Brake' tooltip at that exact timestamp.
   - *Agent Solution:* Use the `syncId="telemetrySync"` prop on all 5 `<LineChart>` components. Recharts handles the cross-chart synchronization automatically.
2. **Challenge: Data Formatting for Recharts.** The backend returns an array of data for Driver A and a separate array for Driver B. Recharts requires a single merged array.
   - *Agent Solution:* Write a Javascript utility function that merges the two arrays based on the `time` key.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] The `TimingTower` component successfully renders the drivers for the active session.
- [ ] A user can select a 'Primary' and 'Secondary' driver.
- [ ] The `TelemetryChart` component fetches the telemetry for both drivers, merges it, and plots 5 synced Recharts `<LineChart>`s.
