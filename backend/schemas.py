from pydantic import BaseModel
from typing import List, Any, Optional

class SessionResponse(BaseModel):
    session_id: str
    circuit_name: str
    year: int

    class Config:
        from_attributes = True

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
