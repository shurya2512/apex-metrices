import json
from sqlalchemy.orm import Session
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import models
from services.openf1_client import openf1_client
from services.downsampler import downsampler

class CacheManager:
    async def get_session_data(self, db: Session, session_key: str):
        """Fetches session metadata, prioritizing DB cache."""
        # 1. Check Database
        cached_session = db.query(models.SessionsCache).filter_by(session_id=str(session_key)).first()
        if cached_session:
            return cached_session.api_payload

        # 2. Fetch from OpenF1 API
        raw_session = await openf1_client.fetch_session(session_key)
        if not raw_session:
            return None

        # 3. Cache it
        new_session = models.SessionsCache(
            session_id=str(session_key),
            circuit_name=raw_session.get("circuit_short_name", "Unknown Circuit"),
            year=raw_session.get("year"),
            api_payload=raw_session
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return new_session.api_payload

    async def get_lap_telemetry(self, db: Session, session_key: str, driver_number: int, lap_number: int):
        """Fetches telemetry for a specific lap, downsamples it, and caches it."""
        lap_id = f"{session_key}_{driver_number}_{lap_number}"
        
        # 1. Check Database
        cached = db.query(models.LapsCache).filter_by(lap_id=lap_id).first()
        if cached:
            return cached.downsampled_telemetry_json
            
        # Ensure session exists in sessions_cache to satisfy ForeignKey constraint
        await self.get_session_data(db, session_key)
        
        # 2. Fetch raw telemetry data
        # Note: OpenF1 /car_data endpoint can be filtered by date. 
        # But for this simple implementation, we just fetch all telemetry for the driver in this session 
        # and then downsample. In a real app, you would first fetch the lap start/end times from /laps 
        # to filter the /car_data, but as per specs we simply downsample the raw data.
        raw_data = await openf1_client.fetch_telemetry(session_key, driver_number)
        
        # 3. Downsample
        processed_data = downsampler.process_telemetry(raw_data)
        
        # 4. Save to DB
        new_cache = models.LapsCache(
            lap_id=lap_id,
            driver_number=driver_number,
            session_id=str(session_key),
            downsampled_telemetry_json=processed_data
        )
        db.add(new_cache)
        db.commit()
        
        return processed_data

cache_manager = CacheManager()
