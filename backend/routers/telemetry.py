from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas
from database import get_db
from services.cache_manager import cache_manager

router = APIRouter(prefix="/api/laps", tags=["Telemetry"])

@router.get("/{lap_id}/telemetry", response_model=schemas.TelemetryResponse)
async def get_telemetry(lap_id: str, db: Session = Depends(get_db)):
    """
    Retrieve downsampled telemetry data for a specific lap.
    lap_id format: {session_key}_{driver_number}_{lap_number}
    """
    try:
        parts = lap_id.split('_')
        if len(parts) != 3:
            raise ValueError("Invalid lap_id format. Expected {session_key}_{driver_number}_{lap_number}")
        
        session_key = parts[0]
        driver_number = int(parts[1])
        lap_number = int(parts[2])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid lap_id: {str(e)}")

    try:
        telemetry_data = await cache_manager.get_lap_telemetry(
            db=db, 
            session_key=session_key, 
            driver_number=driver_number, 
            lap_number=lap_number
        )
        
        if not telemetry_data:
            raise HTTPException(status_code=404, detail="Lap telemetry not found")
            
        # Format the response to match the Pydantic schema
        # `downsampled_telemetry_json` is an array of dictionaries with 
        # elapsed_time, speed, rpm, n_gear, throttle, brake (from downsampler.py)
        # We need to map `elapsed_time` -> `time`, `n_gear` -> `gear`
        
        formatted_data = []
        for point in telemetry_data:
            formatted_data.append(schemas.TelemetryDataPoint(
                time=float(point.get("elapsed_time", 0.0)),
                speed=float(point.get("speed", 0.0) or 0.0),
                rpm=float(point.get("rpm", 0.0) or 0.0),
                gear=int(point.get("n_gear", 0) or 0),
                throttle=float(point.get("throttle", 0.0) or 0.0),
                brake=float(point.get("brake", 0.0) or 0.0)
            ))
            
        return schemas.TelemetryResponse(lap_id=lap_id, data=formatted_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
