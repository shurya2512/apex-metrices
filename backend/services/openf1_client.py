import httpx
import logging

logger = logging.getLogger(__name__)

class OpenF1Client:
    def __init__(self):
        self.base_url = "https://api.openf1.org/v1"
        self.timeout = 30.0 # High frequency data can take a while to download

    async def fetch_session(self, session_key: str):
        """Fetch session metadata by session_key."""
        url = f"{self.base_url}/sessions"
        params = {"session_key": session_key}
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                if not data:
                    return None
                return data[0] # Return the first matching session
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error occurred while fetching session {session_key}: {e}")
                raise
            except Exception as e:
                logger.error(f"An error occurred while fetching session {session_key}: {e}")
                raise

    async def fetch_telemetry(self, session_key: str, driver_number: int):
        """Fetch raw telemetry data (car_data) for a specific session and driver."""
        url = f"{self.base_url}/car_data"
        params = {
            "session_key": session_key,
            "driver_number": driver_number
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error occurred while fetching telemetry for session {session_key}, driver {driver_number}: {e}")
                raise
            except Exception as e:
                logger.error(f"An error occurred while fetching telemetry for session {session_key}, driver {driver_number}: {e}")
                raise

# Expose a singleton instance
openf1_client = OpenF1Client()
