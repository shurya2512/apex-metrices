# Phase 1 Context: Project Initialization & Infrastructure Setup

## 🤖 AI Agent System Prompt
**Role:** You are a Senior DevOps and Fullstack Engineer.
**Task:** Your objective is to initialize the absolute bedrock of the ApexMetrics project. You are setting up a strictly decoupled architecture: a Next.js frontend and a FastAPI backend. Do NOT write business logic yet.

## 🧠 Conceptual Background
A clean project initialization prevents "spaghetti code" later. 
- The **Frontend** will use Next.js 14 (App Router) because it offers server-side rendering, which is excellent for initial load times of our heavy telemetry dashboard. We use Tailwind CSS for rapid styling and TypeScript to enforce strict typing for complex F1 data payloads.
- The **Backend** will use FastAPI because it is natively asynchronous, extremely fast, and Python is the undisputed king of data manipulation (which we will need for Pandas later).

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: Environment Clashes.** Python and Node modules can get messy.
   - *Agent Solution:* Ensure the frontend and backend exist in entirely separate subdirectories (`/frontend` and `/backend`). Ensure `.gitignore` correctly ignores `node_modules/`, `venv/`, `__pycache__/`, and `.env`.
2. **Challenge: CORS Issues early on.**
   - *Agent Solution:* Ensure the FastAPI app is prepared to accept connections from the standard Next.js port (`localhost:3000`).

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] `/frontend` contains a valid Next.js app and `npm run dev` serves it without crashing.
- [ ] `/backend` contains a valid FastAPI app and `uvicorn main:app --reload` serves the swagger UI at `http://localhost:8000/docs`.
- [ ] `.gitignore` is completely filled out for both ecosystems.
