# Phase 3 Specs: OpenF1 API Ingestion & Downsampling Pipeline

## 📁 File Structure to Create
```text
backend/
├── services/
│   ├── openf1_client.py
│   ├── downsampler.py
│   └── cache_manager.py
```

## 🛠️ Required Libraries & Tools
- `httpx`: For asynchronous API requests to OpenF1.
- `pandas`: For vectorized data manipulation.
- `numpy`: Required by pandas.

## 💻 Technical Implementation Details

### 1. `services/openf1_client.py`
Create an async class to handle requests:
- **Base URL:** `https://api.openf1.org/v1/`
- Implement `fetch_session(session_key)`
- Implement `fetch_telemetry(session_key, driver_number)`
- Parse OpenF1 JSON responses.

### 2. `services/downsampler.py`
This is where the magic happens.
- **Input:** A list of raw dictionaries from OpenF1 (e.g., `[{date: '...', speed: 300, rpm: 11000}, ...]`)
- **Logic:**
  1. Load into Pandas: `df = pd.DataFrame(raw_data)`
  2. Convert `date` to datetime objects.
  3. Create a relative elapsed time column (e.g., seconds since lap start) to allow syncing multiple drivers easily.
  4. Resample: Set the elapsed time as index, and group data into fixed bins (e.g., `250ms` or `500ms`).
  5. Apply aggregation: For `speed`, `rpm`, `throttle`, `brake`, use `.mean()`.
  6. Fill gaps: Use `.ffill()` (forward fill) so if a sensor dropped out for 500ms, the previous value carries over.
  7. Drop NaN values and convert back to a list of dicts: `return df.to_dict(orient="records")`.

### 3. `services/cache_manager.py`
Orchestrator logic:
```python
async def get_lap_telemetry(db_session, session_key, driver_number, lap_id):
    # 1. Check database
    cached = db_session.query(Laps_Cache).filter_by(lap_id=lap_id).first()
    if cached:
        return cached.downsampled_telemetry_json
    
    # 2. Fetch raw data
    raw_data = await openf1_client.fetch_telemetry(session_key, driver_number)
    
    # 3. Downsample
    processed_data = downsampler.process_telemetry(raw_data)
    
    # 4. Save to DB
    new_cache = Laps_Cache(lap_id=lap_id, downsampled_telemetry_json=processed_data)
    db_session.add(new_cache)
    db_session.commit()
    
    return processed_data
```
