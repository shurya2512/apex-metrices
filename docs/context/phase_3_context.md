# Phase 3 Context: OpenF1 API Ingestion & Downsampling Pipeline

## 🤖 AI Agent System Prompt
**Role:** You are a Python Data Engineer.
**Task:** Write the pipeline that hits the external OpenF1 API, loads the huge JSON arrays into Pandas, mathematically downsamples them, and caches them in our database.

## 🧠 Conceptual Background
This is the most critical logic in the application. OpenF1 serves telemetry at incredibly high frequencies. If you query `/car_data` for a single lap, you might receive 10,000 JSON objects representing micro-seconds of time. 
If we send 10,000 points to a React frontend, the browser will crash. We need to reduce this to ~400 points. However, we cannot just skip every 20th point—if we do, we might skip the exact moment a driver hit their top speed or slammed on the brakes. We must use a rolling average or a specialized Pandas `.resample()` to maintain the *shape* of the data curve.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: Time Alignment.** Telemetry data for Driver A and Driver B on the same lap won't have the exact same timestamps (one might trigger a sensor at `12.001s` and the other at `12.003s`).
   - *Agent Solution:* In Pandas, set a normalized time index starting from `0.0s` representing the start of the lap, and resample the data into fixed buckets (e.g., every 250 milliseconds). Forward-fill (`ffill`) missing data so both drivers have identical time buckets.
2. **Challenge: OpenF1 Rate Limiting.**
   - *Agent Solution:* Build a cache manager. Always check `laps_cache` in PostgreSQL before calling `httpx.get()`.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] The `openf1_client.py` successfully fetches raw data.
- [ ] The `downsampler.py` successfully inputs 10k points and outputs ~400 points without losing absolute min/max curve shapes.
- [ ] The `cache_manager.py` successfully coordinates between DB, HTTPX, and Pandas.
