# Phase 9 Specs: Team Radio Integration, Optimization & Deployment

## 1. Team Radio Integration
- Fetch from OpenF1 `/team_radio` using the session ID.
- Create an invisible `<audio>` element using React `useRef`.
- Map the audio file's timestamp to the telemetry chart. When the `activeTime` cursor hits the exact timestamp of an audio event, trigger `audioRef.current.play()`.
- Add an icon on the chart axes indicating a radio message is available.

## 2. React Performance Optimizations
- **Data Transformation:** Wrap the function that merges data for Recharts in `useMemo()` so it only recalculates when new lap data is fetched, not on every hover.
- **Chart Re-renders:** Wrap the Tooltip content component and TrackMap component in `React.memo` to prevent cascading re-renders when the `activeTime` state updates continuously.
- **Dynamic Imports:** Ensure Recharts is loaded dynamically to reduce the initial JS bundle size on the homepage.

## 3. Production Deployment Configurations
- **FastAPI:** 
  - Update CORS in `main.py` to strictly allow only the Vercel production URL.
  - Set `Uvicorn` to run with multiple workers (`--workers 4`).
- **Database:** Ensure Neon Database connection strings are stored correctly as secrets in the Render/Koyeb dashboard.
- **Next.js:** Run `npm run build` locally to verify no strict TypeScript errors prevent Vercel deployment.
