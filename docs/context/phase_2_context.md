# Phase 2 Context: Database Schema & ORM Setup

## 🤖 AI Agent System Prompt
**Role:** You are a Database Architect and Backend Python Developer.
**Task:** Your objective is to configure SQLAlchemy, connect it to a Neon Serverless PostgreSQL instance, build the database models, and set up Alembic for migration tracking.

## 🧠 Conceptual Background
We are building a smart-caching layer. The OpenF1 API is powerful but rate-limits heavily. If 1,000 users ask for Max Verstappen's lap telemetry, we should only query OpenF1 once. We will store that heavy telemetry payload in a PostgreSQL database as `JSONB`. 
We also need user tables to support personalized workspaces (bookmarks). SQLAlchemy acts as our bridge, and Alembic ensures our schema is version-controlled.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: Storing massive telemetry data.** Relational rows per telemetry point (10,000 points per lap) will destroy the database.
   - *Agent Solution:* Do NOT create a `telemetry_points` table. Instead, store the *entire array* of downsampled points as a single `JSONB` column inside the `laps_cache` table.
2. **Challenge: Database connection pooling.** Neon Serverless Postgres connections can drop if poorly managed.
   - *Agent Solution:* Ensure the SQLAlchemy engine uses connection pooling appropriately and handles SSL correctly.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] SQLAlchemy `engine`, `SessionLocal`, and `Base` are configured in `database.py`.
- [ ] The `models.py` file perfectly reflects the 4 required tables: `users`, `sessions_cache`, `laps_cache`, `user_bookmarks`.
- [ ] `alembic init alembic` is run, and the first migration `Initial schema` is generated and applied to the database.
