# Phase 4 Context: Backend REST API Development

## AI Agent Instructions & Objectives
**Goal:** Expose the cached and processed data via REST endpoints using FastAPI so the frontend can consume it.

**Why this matters:** The frontend needs a structured, predictable way to request session lists, lap lists, and the compressed telemetry data. If the backend API is slow or throws errors, the entire frontend charting experience will fail.

## Success Criteria
1. `GET /api/sessions` returns a list of sessions.
2. `GET /api/sessions/{session_id}/laps` returns available laps for drivers in that session.
3. `GET /api/laps/{lap_id}/telemetry` returns the optimized ~400-point JSON array for charting.
4. All endpoints must use SQLAlchemy dependency injection to access the database securely.
5. FastAPI CORS middleware is configured to allow requests from the Next.js frontend (e.g., `localhost:3000`).
