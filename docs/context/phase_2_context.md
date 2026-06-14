# Phase 2 Context: Database Schema & ORM Setup

## AI Agent Instructions & Objectives
**Goal:** Connect the FastAPI backend to our PostgreSQL database using SQLAlchemy. Generate database migrations using Alembic.

**Why this matters:** We need a robust relational database to cache the massive amounts of telemetry data we will pull from OpenF1. Fetching raw data on every user click will result in rate limits and a slow application. The schema must exactly match our PRD requirements to support user bookmarks and cached sessions.

## Success Criteria
1. The backend connects successfully to the Neon Serverless Postgres DB.
2. SQLAlchemy models are defined cleanly in a `models.py` file.
3. Alembic is initialized (`alembic init alembic`) and an initial migration script is successfully generated (`alembic revision --autogenerate -m "Initial schema"`).
4. Applying the migration creates the tables in the database.
