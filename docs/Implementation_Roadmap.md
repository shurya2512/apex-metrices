# Implementation Roadmap: ApexMetrics

## Phase 1: Project Initialization & Infrastructure Setup
- [ ] Initialize Next.js 14+ (App Router) project with TypeScript, Tailwind CSS, and Shadcn UI (or similar) for the frontend.
- [ ] Initialize FastAPI project with Python 3.10+, Uvicorn, and Poetry/Pip for the backend.
- [ ] Provision a Neon Serverless PostgreSQL database.
- [ ] Setup initial GitHub Actions or CI pipelines for basic linting.

## Phase 2: Database Schema & ORM Setup
- [ ] Configure SQLAlchemy with FastAPI.
- [ ] Setup Alembic for database migrations.
- [ ] Define SQLAlchemy models: `Users`, `Sessions_Cache`, `Laps_Cache`, `User_Bookmarks`.
- [ ] Write database connection utility functions and dependency injections for FastAPI routes.

## Phase 3: OpenF1 API Ingestion & Downsampling Pipeline
- [ ] Create Python utility classes to wrap the OpenF1 API.
- [ ] Implement Pandas-based data downsampling algorithms to compress telemetry arrays (10,000+ points to ~400 points).
- [ ] Build the caching logic: store raw or downsampled payloads into `Sessions_Cache` and `Laps_Cache` to bypass rate limits.

## Phase 4: Backend REST API Development
- [ ] Build GET `/api/sessions` (list available races/sessions).
- [ ] Build GET `/api/sessions/{session_id}/laps` (list laps per driver).
- [ ] Build GET `/api/laps/{lap_id}/telemetry` (serve downsampled telemetry).
- [ ] Implement error handling, rate limiting on our FastAPI side, and CORS policies.

## Phase 5: Frontend Command Center & Navigation
- [ ] Build the main Layout and Navigation bar.
- [ ] Develop the Live Session Command Center: a dashboard to browse historical and active sessions.
- [ ] Implement data fetching utilities using SWR or React Query to consume the FastAPI endpoints.

## Phase 6: Frontend Telemetry Charting & Timing Tower
- [ ] Build the Dynamic Timing Tower component (live leaderboard, gaps, tyre compounds).
- [ ] Integrate Recharts (or Chart.js) to build the Head-to-Head Telemetry Overlay.
- [ ] Create synchronized multi-line charts comparing Speed, RPM, Throttle, Brake, and Gear for two drivers.

## Phase 7: Track Map & Driver Positioning
- [ ] Build a custom SVG or Canvas component to render the Track Map.
- [ ] Map driver X/Y coordinates to the track shape.
- [ ] Create interactive markers showing driver positions at specific timestamps, synced with the Telemetry Chart hover state.

## Phase 8: Clerk Authentication & Personalized Workspaces
- [ ] Integrate `@clerk/nextjs` into the frontend.
- [ ] Add JWT verification middleware in FastAPI to secure bookmarking routes.
- [ ] Build backend routes: POST `/api/bookmarks` and GET `/api/bookmarks`.
- [ ] Build the "My Workspace" frontend page allowing users to load saved telemetry comparisons.

## Phase 9: Team Radio Integration, Optimization & Final Deployment
- [ ] Fetch and map Team Radio audio clips from OpenF1 to telemetry timestamps.
- [ ] Implement an audio player component synced with chart timelines.
- [ ] Perform React performance optimizations (useMemo, React.memo) to prevent chart re-rendering lags.
- [ ] Final deployment to Vercel (Frontend) and Render/Koyeb (Backend) with custom domains.
