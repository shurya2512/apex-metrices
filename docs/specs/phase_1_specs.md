# Phase 1 Specs: Project Initialization & Infrastructure Setup

## 1. Frontend Specifications (Directory: `/frontend`)
- **Framework:** Next.js 14 (App Router mandatory)
- **Language:** TypeScript (`tsconfig.json` set to strict)
- **Styling:** Tailwind CSS
- **Initialization Command:** `npx create-next-app@latest frontend --typescript --tailwind --eslint --app`
- **Component Library:** Prepare for Shadcn UI (install `lucide-react`, `clsx`, `tailwind-merge`).

## 2. Backend Specifications (Directory: `/backend`)
- **Framework:** FastAPI
- **Language:** Python 3.10+
- **Environment Management:** Use `venv` or `poetry`.
- **Requirements (`requirements.txt`):**
  - `fastapi`
  - `uvicorn[standard]`
  - `python-dotenv`
- **Initial Code (`main.py`):**
  ```python
  from fastapi import FastAPI
  app = FastAPI(title="ApexMetrics API")
  
  @app.get("/")
  def read_root():
      return {"status": "ok", "message": "ApexMetrics Backend Running"}
  ```

## 3. Global Configurations
- Provide a root level `README.md` explaining how to start both servers.
- Setup a `.gitignore` that ignores `.env`, `node_modules/`, `__pycache__/`, `venv/`, `.next/`.
