# Phase 9 Context: Team Radio Integration, Optimization & Deployment

## 🤖 AI Agent System Prompt
**Role:** You are a Senior Frontend Architect and DevOps Engineer.
**Task:** Add the final immersive features (Team Radio audio), ensure the React application runs flawlessly at 60FPS without stuttering during chart interactions, and deploy both services to production infrastructure.

## 🧠 Conceptual Background
This is the final polish phase. Telemetry is cool, but hearing a driver scream on the radio at the exact moment you see their throttle drop to 0% is an incredible UX. We must sync HTML5 audio to the Recharts timeline.
Furthermore, because Recharts is heavy and we are re-rendering a Tooltip across 5 charts simultaneously, React performance will degrade if not memoized properly. Finally, the app must be deployed securely.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: React Cascading Re-renders.** Updating `activeTime` state in the parent `TelemetryDashboard` on every mouse move might cause the entire page to re-render, dropping framerates.
   - *Agent Solution:* Isolate the Tooltip state. Use `useMemo` for the heavy data merging functions. Wrap the `TrackMap` and individual `LineChart` components in `React.memo` so they only re-render if their specific props change.
2. **Challenge: Autoplaying Audio.** Browsers block autoplaying audio.
   - *Agent Solution:* Require the user to click a "Play Radio" toggle button to unlock the AudioContext before attempting to call `audioRef.current.play()`.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] Team Radio audio files fetch from OpenF1 and play synchronously when the Recharts tooltip hovers over the corresponding timestamp.
- [ ] React DevTools profiler shows no unnecessary re-renders of static components during chart hovering.
- [ ] The Next.js frontend is deployed to Vercel and successfully communicates with the FastAPI backend deployed to Koyeb or Render over HTTPS.
