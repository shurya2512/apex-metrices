# Phase 3 Context: OpenF1 API Ingestion & Downsampling Pipeline

## AI Agent Instructions & Objectives
**Goal:** Build the core data engine of the backend. Write scripts that pull data from the OpenF1 API, pass that data through a Pandas downsampling function, and store the result in the database.

**Why this matters:** A single lap can generate over 10,000 telemetry points. Sending this directly to the frontend will crash the user's browser. We must compress this data down to ~400 points while maintaining the integrity of the data curve (i.e., we cannot lose the absolute top speed or lowest braking point).

## Success Criteria
1. Python wrapper functions successfully hit the OpenF1 API.
2. The Pandas downsampling function correctly reduces a 10,000-point JSON array to ~400 points.
3. The downsampled data is successfully saved to the `laps_cache` table as JSONB.
