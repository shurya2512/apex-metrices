# Phase 4 Context: Backend REST API Development

## 🤖 AI Agent System Prompt
**Role:** You are a Backend API Developer.
**Task:** Expose the data processed by the Data Engineer in Phase 3 via clean, documented REST endpoints using FastAPI routers.

## 🧠 Conceptual Background
The frontend (Next.js) will make standard HTTP GET requests to build its UI. It needs endpoints to list the available races, list the drivers/laps in those races, and finally fetch the specific telemetry arrays to feed into the charting libraries.
FastAPI handles data validation automatically via Pydantic, so we want to strictly define the shape of the data we are sending to the frontend.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: SQLAlchemy Session Lifecycle.** If database sessions aren't closed, Neon will run out of connection limits.
   - *Agent Solution:* Use FastAPI's `Depends(get_db)` to ensure the DB session is automatically acquired and securely closed upon request completion.
2. **Challenge: Error Handling.** What if a frontend asks for a `lap_id` that doesn't exist in OpenF1?
   - *Agent Solution:* Catch exceptions in the `cache_manager` and raise `HTTPException(status_code=404, detail="Lap not found")` so the frontend can gracefully show a "Not Found" UI instead of crashing.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] `/api/sessions` returns a 200 OK with a list of races.
- [ ] `/api/sessions/{session_id}/laps` returns a 200 OK with a list of laps.
- [ ] `/api/laps/{lap_id}/telemetry` successfully invokes the `cache_manager` and returns the downsampled array.
- [ ] Swagger UI (`/docs`) accurately reflects these routes and their Pydantic response models.
