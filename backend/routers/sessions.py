from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

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
