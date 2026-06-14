from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import httpx

from database import get_db
import models
import schemas
from services.cache_manager import cache_manager

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

@router.get("/", response_model=List[schemas.SessionResponse])
async def get_sessions(db: Session = Depends(get_db)):
    """
    Retrieve a list of available F1 sessions from the OpenF1 API directly.
    """
    from services.openf1_client import openf1_client
    
    # Fetch sessions for the current/recent year to populate the dashboard
    raw_sessions = await openf1_client.fetch_sessions(year=2024)
    
    formatted_sessions = []
    for s in raw_sessions:
        formatted_sessions.append({
            "session_id": s.get("session_key"),
            "circuit_name": s.get("circuit_short_name"),
            "year": s.get("year"),
            "session_type": s.get("session_type"),
            "country": s.get("country_name"),
            "date": s.get("date_start")
        })
    
    # Sort by date descending (newest first)
    formatted_sessions.sort(key=lambda x: x["date"] or "", reverse=True)
    return formatted_sessions

@router.get("/{session_id}/drivers")
async def get_session_drivers(session_id: str):
    """
    Retrieve the list of drivers for a specific session from the OpenF1 API.
    Returns driver_number, name_acronym, full_name, team_name, and team_colour.
    """
    url = "https://api.openf1.org/v1/drivers"
    params = {"session_key": session_id}
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            raw_drivers = response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"OpenF1 API error fetching drivers: {e}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch drivers: {e}")
    
    # Deduplicate by driver_number (OpenF1 may return multiple entries per driver)
    seen: set[int] = set()
    drivers = []
    for d in raw_drivers:
        num = d.get("driver_number")
        if num is not None and num not in seen:
            seen.add(num)
            # Sanitize team colour — OpenF1 may omit the '#' prefix
            colour = d.get("team_colour") or "ffffff"
            if not colour.startswith("#"):
                colour = f"#{colour}"
            drivers.append({
                "driver_number": num,
                "name_acronym": d.get("name_acronym", str(num)),
                "full_name": d.get("full_name", d.get("name_acronym", str(num))),
                "team_name": d.get("team_name", "Unknown"),
                "team_colour": colour,
            })
    
    # Sort by driver number for consistent ordering
    drivers.sort(key=lambda x: x["driver_number"])
    return drivers

@router.get("/{session_id}/laps")
async def get_session_laps(session_id: str, db: Session = Depends(get_db)):
    """
    Retrieve laps for a specific session.
    Since we don't have a lap listing cache currently, this might just return 
    the cached laps for this session from the DB or fetch them from OpenF1.
    For simplicity in this phase, we'll return cached laps from the DB.
    """
    laps = db.query(models.LapsCache).filter(models.LapsCache.session_id == session_id).all()
    
    # We don't have a specific response model for laps list yet, returning raw for now
    return [{"lap_id": lap.lap_id, "driver_number": lap.driver_number} for lap in laps]
