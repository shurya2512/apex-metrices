# Phase 1 Specs: Project Initialization & Infrastructure Setup

## 📁 File Structure to Create
```text
apex-metrics/
├── frontend/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── backend/
│   ├── requirements.txt
│   ├── main.py
│   └── .env
└── .gitignore
```

## 🛠️ Required Commands & Tools
### Frontend Initialization
Execute the following inside the `/frontend` directory:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"
```
Install UI prerequisites:
```bash
npm install lucide-react clsx tailwind-merge
```

### Backend Initialization
Execute the following inside the `/backend` directory:
```bash
python -m venv venv
# Activate venv
pip install fastapi uvicorn[standard] python-dotenv
```

## 💻 Technical Implementation Details

### Backend `main.py`
Create a boilerplate FastAPI application:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ApexMetrics API", version="1.0")

# Setup CORS immediately for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "ApexMetrics Backend"}
```

### `requirements.txt`
Generate a frozen requirements file so deployments don't break:
```text
fastapi==0.110.0
uvicorn[standard]==0.27.1
python-dotenv==1.0.1
```
