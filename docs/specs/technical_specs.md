# Technical Specifications

## 1. System Architecture

### Frontend (Client-Side)
- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Charting:** Recharts / Chart.js (for synchronized time-series data)
- **Authentication:** Clerk
- **Deployment:** Vercel

### Backend (Server-Side)
- **Framework:** FastAPI (Python)
- **Data Processing:** Pandas (for mathematical downsampling)
- **Deployment:** Koyeb or Render

### Database
- **Engine:** PostgreSQL
- **ORM:** SQLAlchemy
- **Hosting:** Neon (Serverless Postgres)

## 2. Core Data Flow
1. **Frontend Request:** User requests telemetry for a specific lap via the Next.js UI.
2. **Backend Cache Check:** FastAPI checks PostgreSQL (`Laps_Cache`).
   - *If cached:* Return the downsampled JSON immediately.
   - *If not cached:* Fetch raw data from OpenF1 API.
3. **Data Processing:** FastAPI/Pandas downsamples the 10,000+ points to ~400-500 optimized points.
4. **Cache & Return:** Backend saves the optimized data to PostgreSQL and returns it to the Frontend.
5. **Visualization:** Recharts renders the data overlay on the client side.

## 3. Database Schema

### Users Table
- `clerk_user_id` (String, Primary Key)
- `email` (String)
- `created_at` (Timestamp)

### Sessions_Cache Table
- `session_id` (String, Primary Key)
- `circuit_name` (String)
- `year` (Integer)
- `api_payload` (JSONB)
- `cached_at` (Timestamp)

### Laps_Cache Table
- `lap_id` (String, Primary Key)
- `driver_number` (Integer)
- `session_id` (String, Foreign Key)
- `downsampled_telemetry_json` (JSONB)
- `cached_at` (Timestamp)

### User_Bookmarks Table
- `bookmark_id` (String, Primary Key)
- `clerk_user_id` (String, Foreign Key)
- `lap_id_1` (String)
- `lap_id_2` (String)
- `custom_note` (Text)
