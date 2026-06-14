# Phase 3 Specs: OpenF1 API Ingestion & Downsampling Pipeline

## 1. Dependencies
- Add to `requirements.txt`: `httpx` (for async HTTP requests), `pandas`, `numpy`.

## 2. API Wrapper (`services/openf1_client.py`)
- Base URL: `https://api.openf1.org/v1/`
- **Method:** `fetch_session(session_id)`
- **Method:** `fetch_lap_telemetry(session_id, driver_number, lap_number)`

## 3. Pandas Downsampling Logic (`services/downsampler.py`)
- **Input:** List of dictionaries (raw telemetry from OpenF1).
- **Process:**
  1. Convert to Pandas DataFrame.
  2. Ensure `date` or `time` column is parsed as DateTime.
  3. Set DateTime as the index.
  4. Resample the data (e.g., using `.resample('250ms').mean()`).
  5. *Crucial:* Forward-fill missing values, or interpolate, to avoid gaps in the chart.
- **Output:** List of dictionaries (max 400-500 items).

## 4. Caching Pipeline (`services/cache_manager.py`)
- Function `get_or_fetch_telemetry(db_session, session_id, driver_number, lap_number)`:
  1. Query `laps_cache`. If it exists, return `downsampled_telemetry_json`.
  2. If not, call `openf1_client.fetch_lap_telemetry`.
  3. Pass data to `downsampler.py`.
  4. Save result to `laps_cache`.
  5. Return result.
