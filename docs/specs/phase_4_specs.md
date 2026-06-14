# Phase 4 Specs: Backend REST API Development

## 📁 File Structure to Create
```text
backend/
├── schemas.py
├── routers/
│   ├── sessions.py
│   └── telemetry.py
```

## 🛠️ Required Libraries & Tools
- `fastapi` & `pydantic` (for endpoint definitions and data validation).

## 💻 Technical Implementation Details

### 1. Pydantic Schemas (`schemas.py`)
Define what the frontend should expect to receive:
```python
from pydantic import BaseModel
from typing import List, Any

class SessionResponse(BaseModel):
    session_id: str
    circuit_name: str
    year: int

class TelemetryDataPoint(BaseModel):
    time: float
    speed: float
    rpm: float
    gear: int
    throttle: float
    brake: float

class TelemetryResponse(BaseModel):
    lap_id: str
    data: List[TelemetryDataPoint]
```

### 2. FastAPI Routers (`routers/sessions.py` & `routers/telemetry.py`)
**Router: Sessions**
- `router = APIRouter(prefix="/api/sessions", tags=["Sessions"])`
- `@router.get("/", response_model=List[SessionResponse])`
  - Inject `db: Session = Depends(get_db)`.
  - Fetch list of cached sessions or fetch index from OpenF1.

**Router: Telemetry**
- `router = APIRouter(prefix="/api/laps", tags=["Telemetry"])`
- `@router.get("/{lap_id}/telemetry", response_model=TelemetryResponse)`
  - Inject `db`.
  - Parse `lap_id` to get `session_id`, `driver_number`, etc.
  - Call `await get_lap_telemetry(...)`.

### 3. Main App Inclusion
Update `main.py` to include the routers:
```python
from routers import sessions, telemetry

app.include_router(sessions.router)
app.include_router(telemetry.router)
```
