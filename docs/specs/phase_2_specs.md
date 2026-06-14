# Phase 2 Specs: Database Schema & ORM Setup

## 📁 File Structure to Create
```text
backend/
├── alembic.ini
├── alembic/
│   └── versions/
├── database.py
└── models.py
```

## 🛠️ Required Libraries & Tools
- `sqlalchemy`: The standard Python ORM.
- `psycopg2-binary`: PostgreSQL adapter for Python.
- `alembic`: Database migration tool for SQLAlchemy.

## 💻 Technical Implementation Details

### 1. Database Connection (`database.py`)
```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2. SQLAlchemy Models (`models.py`)
You must define these exact tables to support the app logic:

**Users Table (`users`)**
- `clerk_user_id` (String, Primary Key, Index=True)
- `email` (String, Unique=True)
- `created_at` (DateTime, default=func.now())

**Sessions Cache (`sessions_cache`)**
- `session_id` (String, Primary Key, Index=True)
- `circuit_name` (String)
- `year` (Integer)
- `api_payload` (JSONB)
- `cached_at` (DateTime, default=func.now())

**Laps Cache (`laps_cache`)**
- `lap_id` (String, Primary Key, Index=True) - Format e.g., `"{session_id}_{driver_number}_{lap_number}"`
- `driver_number` (Integer)
- `session_id` (String, ForeignKey("sessions_cache.session_id"))
- `downsampled_telemetry_json` (JSONB)
- `cached_at` (DateTime, default=func.now())

**User Bookmarks (`user_bookmarks`)**
- `bookmark_id` (String, Primary Key, default=uuid4)
- `clerk_user_id` (String, ForeignKey("users.clerk_user_id"))
- `lap_id_1` (String)
- `lap_id_2` (String)
- `custom_note` (Text, Nullable=True)
