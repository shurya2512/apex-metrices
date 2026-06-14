# **Product Requirements Document: Project ApexMetrics**

**Project Type:** Full-Stack Web Application  
**Primary API:** OpenF1 (Live & Historical Formula 1 Data)  
**Core Goal:** Provide a highly performant, real-time interactive telemetry dashboard for motorsport enthusiasts and race engineers.

## **1. Core Features (User-Facing)**

* **Live Session Command Center:** Browse ongoing race weekends, qualifying sessions, and historical Grand Prix events.  
* **Head-to-Head Telemetry Overlay:** Select two drivers and compare their lap data (Speed, RPM, Throttle, Brake, Gear) on synchronized time-series line charts (Recharts).  
* **Dynamic Timing Tower:** Real-time leaderboard showing driver positions, interval gaps, sector times, tyre compounds, and pit-stop counts.  
* **Track Map & Driver Positioning:** Visual representation of the circuit with mini-indicators showing driver locations based on X/Y coordinate telemetry.  
* **Team Radio Integration:** Contextual playback of driver-to-pit radio communications, mapped to specific events (e.g., overtakes, fastest laps).  
* **Personalized Workspaces:** Authenticated users can save favorite drivers, bookmark specific historical laps for quick comparison, and customize their dashboard layout.

## **2. Engineering & Backend Features**

* **Data Downsampling Engine:** FastAPI and Pandas pipeline to compress high-frequency telemetry (10,000+ data points per lap) into optimized, browser-friendly datasets (e.g., 400-500 points) without losing the integrity of the data curve.  
* **PostgreSQL Smart Caching:** Historical session and lap data are cached in the database to prevent API rate-limiting and ensure instant load times for previously requested laps.  
* **Clerk Authentication Flow:** Seamless integration of Clerk for secure, modern user registration, login, and OAuth provider management, completely offloading session handling.

## **3. Technology Stack**

| Layer | Technology | Purpose |
| :---- | :---- | :---- |
| Frontend | Next.js, React, TypeScript | UI framework, server-side rendering, and strict type safety for complex F1 JSON payloads. |
| Visualizations | Recharts / Chart.js | Rendering highly dynamic, multi-line synchronized time-series charts. |
| Backend | FastAPI, Python (Pandas) | High-speed data ingestion, mathematical downsampling, and API proxying. |
| Database | PostgreSQL (SQLAlchemy) | Caching lap data, managing user preferences, and storing dashboard layouts. |
| Authentication | Clerk | Securing user profiles, managing OAuth, and protecting personalized workspace routes. |
| Deployment | Vercel (FE) + Koyeb/Render (BE) + Neon (DB) | Free-tier, scalable deployment architecture. |

## **4. Database Schema Overview (Initial)**

The relational database will primarily consist of the following tables:

* **Users:** Clerk_User_ID (Primary Key), Email, Created At  
* **Sessions_Cache:** Session ID, Circuit Name, Year, API_Payload, Cached_At  
* **Laps_Cache:** Lap ID, Driver Number, Session ID, Downsampled_Telemetry_JSON, Cached_At  
* **User_Bookmarks:** Bookmark ID, Clerk_User_ID, Lap ID 1, Lap ID 2, Custom Note
