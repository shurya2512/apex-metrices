import asyncio
import datetime
from sqlalchemy.orm import Session
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from database import engine
from services.cache_manager import cache_manager
from services.openf1_client import openf1_client

# ==========================================
# MOCK DATA INJECTION
# ==========================================
# Create mock data spanning 5 seconds, at ~10ms intervals (500 points)
# to simulate high-frequency OpenF1 telemetry
base_time = datetime.datetime.utcnow()
mock_telemetry = []
for i in range(500):
    t = base_time + datetime.timedelta(milliseconds=i*10)
    mock_telemetry.append({
        "date": t.isoformat() + "Z",
        "rpm": 10000 + (i * 10),
        "speed": 100 + (i * 0.2),
        "n_gear": 4,
        "throttle": 80 if i < 250 else 100,
        "brake": 0,
        "drs": 0
    })

mock_session = {
    "session_key": 9158,
    "circuit_short_name": "Mock Circuit (Bahrain)",
    "year": 2023
}

async def mock_fetch_session(session_key):
    print("MOCK: Bypassing OpenF1 API (returning mock session)...")
    return mock_session
    
async def mock_fetch_telemetry(session_key, driver_number):
    print(f"MOCK: Bypassing OpenF1 API (returning {len(mock_telemetry)} points of raw mock telemetry)...")
    return mock_telemetry

# Override the client methods for testing purposes
openf1_client.fetch_session = mock_fetch_session
openf1_client.fetch_telemetry = mock_fetch_telemetry
# ==========================================

async def main():
    # Known recent session (e.g., 2023 Bahrain GP)
    session_key = "9158"
    driver_number = 1  # Max Verstappen
    lap_number = 1
    
    print(f"Testing telemetry ingestion for Session {session_key}, Driver {driver_number}, Lap {lap_number}...\n")
    
    with Session(engine) as db:
        try:
            # This calls cache_manager, which internally calls openf1_client (now mocked), 
            # downsamples it using pandas, and saves it to Neon!
            data = await cache_manager.get_lap_telemetry(db, session_key, driver_number, lap_number)
            
            print(f"\nSUCCESS! Raw data (500 points) was downsampled to {len(data)} optimized telemetry points.")
            if data:
                print("\nSample Data Point (First Bucket):")
                for k, v in data[0].items():
                    print(f"  {k}: {v}")
                    
                print("\nSample Data Point (Middle Bucket):")
                mid = len(data) // 2
                for k, v in data[mid].items():
                    print(f"  {k}: {v}")
        except Exception as e:
            print(f"\nERROR: {e}")

if __name__ == "__main__":
    # Windows fix for asyncio and httpx/ProactorEventLoop
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main())
