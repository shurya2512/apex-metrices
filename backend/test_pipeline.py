import asyncio
from sqlalchemy.orm import Session
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from database import engine
from services.cache_manager import cache_manager

async def main():
    # Known recent session (e.g., 2024 testing or race)
    # Using 9158 which is 2023 Bahrain GP
    session_key = "9158"
    driver_number = 1  # Max Verstappen
    lap_number = 1
    
    print(f"Testing telemetry ingestion for Session {session_key}, Driver {driver_number}, Lap {lap_number}...")
    print("This may take a few seconds as it fetches high-frequency data from OpenF1...")
    
    with Session(engine) as db:
        try:
            data = await cache_manager.get_lap_telemetry(db, session_key, driver_number, lap_number)
            print(f"\nSUCCESS! Processed {len(data)} downsampled telemetry points.")
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
