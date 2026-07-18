# 🏎️ ApexMetrics: Full-Stack Motorsport Telemetry Console

ApexMetrics is a high-performance, full-stack web application that serves as an elite, pit-wall telemetry console for motorsport enthusiasts and race engineers . The platform aggregates, processes, and visualizes raw high-frequency time-series data from live and historical racing sessions .

---

## 🛠️ The Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React), TypeScript, Tailwind CSS | UI rendering, server-side layouts, and strict type safety for complex racing JSON payloads . |
| **Visualizations** | Recharts | Generating synchronized, multi-line interactive charts for telemetry overlays . |
| **Backend API** | FastAPI (Python) | High-speed, asynchronous API routing, proxy configurations, and data ingestion . |
| **Data Engine** | Pandas & NumPy | Computational downsampling and mathematical array filtering of raw racing streams. |
| **Database** | PostgreSQL (SQLAlchemy + Alembic) | Serverless relational cache layer for historical telemetry and user configurations . |
| **Authentication** | Clerk Auth | Secure session handling, user profiles, and third-party OAuth management . |

---

## 🚀 Key Features

*   **Live Session Command Center:** Browse ongoing race weekends, qualifying classification, and deep-dive historical Grand Prix archives .
*   **Head-to-Head Telemetry Overlay:** Select any two drivers to layer their lap data (Speed, RPM, Throttle, Brake, Gear) simultaneously onto synchronized time-series graphs .
*   **Dynamic Timing Leaderboard:** A monospace telemetry timing tower displaying live field positions, interval gaps, tyre compounds, and pit-stop metrics updating in real-time .
*   **Contextual Team Radio Playback:** Stream official driver-to-pit-wall radio segments directly mapped to critical track occurrences .
*   **Personalized Workspaces:** Authenticated workspaces allowing drivers to bookmark specific classic lap matches, pin favorite constructors, and save view layout matrices .
*   **F1 Themed Micro-Interactions:** Custom animated Pirelli soft tyre layout loading states and an interactive five-red-lights starting gantry interface sequence.

---

## ⚙️ Engineering & Architecture Highlights

### 1. The High-Frequency Data Downsampling Pipeline
**The Problem:** The underlying data source emits telemetry inputs multiple times per second, yielding upwards of 10,000+ uncompressed data lines for a single lap . Fetching this array directly via client side requests chokes the browser main thread and causes severe chart rendering lag.
**The Solution:** I engineered an asynchronous processing pipeline inside **FastAPI** using **Pandas** . When a lap is requested, the backend pulls the heavy dataset, computes downsampled moving averages, and aggregates the array into an optimized 450-point payload . This maintains the geometric integrity of the racing lines while rendering flawlessly at 60 FPS in Recharts.

### 2. Relational Cache Strategy
To prevent hitting strict rate limits on the external provider and drastically minimize API latency, the application operates a smart caching layout inside **PostgreSQL** . 
Before triggering a network request, FastAPI verifies the transaction context within local tables . If a historical lap has been processed previously, the downsampled JSON payload is extracted directly out of database storage, dropping round-trip data retrieval times down to milliseconds .

---

## 📊 Database Schema Blueprint

The application leverages a structured relational database architecture to manage telemetry caching and user spaces securely :

*   `Users`: Tracks core system profiles tied to unique identifiers passed securely via Clerk webhooks (`Clerk_User_ID`, `Email`, `Created_At`) .
*   `Sessions_Cache`: Stores static metadata regarding Grand Prix venues and schedule dates to minimize remote calls (`Session_ID`, `Circuit_Name`, `Year`, `API_Payload`) .
*   `Laps_Cache`: Keeps the heavy, optimized, compressed time-series JSON strings indexed for instant database extraction (`Lap_ID`, `Driver_Number`, `Session_ID`, `Downsampled_Telemetry_JSON`) .
*   `User_Bookmarks`: Links custom user spaces to saved head-to-head lap arrays (`Bookmark_ID`, `Clerk_User_ID`, `Lap_ID_1`, `Lap_ID_2`, `Custom_Note`) .

---

## 💻 Local Installation & Setup

### Prerequisites
*   Node.js (v18+ or latest LTS)
*   Python (3.10+)
*   A local PostgreSQL instance or a Neon serverless connection string 

### 1. Clone the Workspace
```bash
git clone [https://github.com/your-username/apex-metrics.git](https://github.com/your-username/apex-metrics.git)
cd apex-metrics
