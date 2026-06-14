# Phase 4 Specs: Backend REST API Development

## 1. CORS Configuration
In `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-production-url.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 2. API Routers
Create `routers/data.py` and include it in `main.py`.

### Endpoint: `GET /api/sessions`
- **Logic:** Query `sessions_cache` table. Return all available sessions.
- **Response:** List of `{ session_id, circuit_name, year }`.

### Endpoint: `GET /api/sessions/{session_id}/laps`
- **Logic:** Query `laps_cache` table where `session_id == session_id`.
- **Response:** List of `{ lap_id, driver_number }`.

### Endpoint: `GET /api/laps/{lap_id}/telemetry`
- **Logic:** Call `get_or_fetch_telemetry` from `services/cache_manager.py`.
- **Response:** JSON array of telemetry points `[ { time, speed, rpm, gear, throttle, brake } ]`.
