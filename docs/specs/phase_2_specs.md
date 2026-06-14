# Phase 2 Specs: Database Schema & ORM Setup

## 1. Environment Variables
- `DATABASE_URL`: The Neon PostgreSQL connection string. (e.g., `postgresql+psycopg2://user:password@host/dbname`)

## 2. Dependencies
- Add to `requirements.txt`: `sqlalchemy`, `alembic`, `psycopg2-binary`.

## 3. Database Configuration (`database.py`)
- Setup `create_engine()`, `SessionLocal`, and `Base = declarative_base()`.
- Create a `get_db()` dependency for FastAPI route injection.

## 4. SQLAlchemy Models (`models.py`)
Implement the following schema:

**Table: `users`**
- `clerk_user_id` (String, Primary Key, Index)
- `email` (String, Unique)
- `created_at` (DateTime, default=func.now())

**Table: `sessions_cache`**
- `session_id` (String, Primary Key)
- `circuit_name` (String)
- `year` (Integer)
- `api_payload` (JSONB) - Stores the raw/metadata payload.
- `cached_at` (DateTime, default=func.now())

**Table: `laps_cache`**
- `lap_id` (String, Primary Key)
- `driver_number` (Integer)
- `session_id` (String, ForeignKey("sessions_cache.session_id"))
- `downsampled_telemetry_json` (JSONB) - The compressed Pandas output.
- `cached_at` (DateTime, default=func.now())

**Table: `user_bookmarks`**
- `bookmark_id` (String, Primary Key, UUID)
- `clerk_user_id` (String, ForeignKey("users.clerk_user_id"))
- `lap_id_1` (String)
- `lap_id_2` (String)
- `custom_note` (Text)
