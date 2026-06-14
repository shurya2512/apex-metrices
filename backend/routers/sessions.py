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
    Retrieve a list of available F1 sessions from the database cache.
    """
    sessions = db.query(models.SessionsCache).all()
    # Pydantic's from_attributes=True on the Config will handle ORM to Pydantic conversion
    return sessions

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
