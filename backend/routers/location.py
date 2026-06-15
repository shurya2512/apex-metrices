from fastapi import APIRouter, HTTPException
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/sessions", tags=["Location"])

# Maximum number of points to return to the frontend.
# OpenF1 location data can contain 100K+ points per driver per session.
# We aggressively downsample to ~1500 points which is more than enough
# to draw a smooth track outline and position dots accurately.
MAX_POINTS = 1500


@router.get("/{session_id}/drivers/{driver_number}/location")
async def get_driver_location(session_id: str, driver_number: int):
    """
    Fetch X/Y position data for a specific driver in a session from OpenF1.
    The data is downsampled server-side to prevent browser freezing.
    """
    url = "https://api.openf1.org/v1/location"
    params = {
        "session_key": session_id,
        "driver_number": driver_number,
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            raw_data = response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                logger.error(
                    "OpenF1 API requires authentication during live sessions."
                )
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"OpenF1 API error fetching location: {e}",
            )
        except httpx.ReadTimeout:
            logger.warning(f"Timeout fetching location for session {session_id}, driver {driver_number}")
            return {"driver_number": driver_number, "data": []}
        except Exception as e:
            logger.error(f"Failed to fetch location data: {e}")
            raise HTTPException(
                status_code=500, detail=f"Failed to fetch location data: {e}"
            )

    if not raw_data:
        return {"driver_number": driver_number, "data": []}

    # Extract only the fields we need: date, x, y
    # Filter out invalid points in a single pass
    location_points = []
    for point in raw_data:
        x = point.get("x")
        y = point.get("y")
        date = point.get("date")
        if x is not None and y is not None and date is not None:
            location_points.append(
                {"date": date, "x": float(x), "y": float(y)}
            )

    # Server-side downsampling: if we have more points than MAX_POINTS,
    # take every Nth point to keep the dataset manageable
    total = len(location_points)
    if total > MAX_POINTS:
        step = total // MAX_POINTS
        location_points = [location_points[i] for i in range(0, total, step)]

    logger.info(
        f"Location data for session {session_id}, driver {driver_number}: "
        f"{total} raw points -> {len(location_points)} downsampled"
    )

    return {"driver_number": driver_number, "data": location_points}
