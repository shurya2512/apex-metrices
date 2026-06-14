import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class User(Base):
    __tablename__ = "users"
    
    clerk_user_id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True)
    created_at = Column(DateTime, default=func.now())

class SessionsCache(Base):
    __tablename__ = "sessions_cache"
    
    session_id = Column(String, primary_key=True, index=True)
    circuit_name = Column(String)
    year = Column(Integer)
    api_payload = Column(JSONB)
    cached_at = Column(DateTime, default=func.now())

class LapsCache(Base):
    __tablename__ = "laps_cache"
    
    lap_id = Column(String, primary_key=True, index=True) # "{session_id}_{driver_number}_{lap_number}"
    driver_number = Column(Integer)
    session_id = Column(String, ForeignKey("sessions_cache.session_id"))
    downsampled_telemetry_json = Column(JSONB)
    cached_at = Column(DateTime, default=func.now())

class UserBookmark(Base):
    __tablename__ = "user_bookmarks"
    
    bookmark_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id = Column(String, ForeignKey("users.clerk_user_id"))
    lap_id_1 = Column(String)
    lap_id_2 = Column(String)
    custom_note = Column(Text, nullable=True)
