# Phase 8 Specs: Clerk Authentication & Personalized Workspaces

## 📁 File Structure to Create
```text
frontend/
├── middleware.ts
├── app/
│   ├── workspace/
│   │   └── page.tsx
backend/
├── dependencies/
│   └── auth.py
├── routers/
│   └── bookmarks.py
```

## 🛠️ Required Libraries & Tools
- Frontend: `@clerk/nextjs`
- Backend: `PyJWT`, `cryptography`, `httpx` (to fetch JWKS).

## 💻 Technical Implementation Details

### 1. Frontend Clerk Setup (`frontend/middleware.ts`)
```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/clerk", "/sessions(.*)"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 2. Backend JWT Verification (`backend/dependencies/auth.py`)
```python
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import httpx
import os

security = HTTPBearer()
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL") # e.g. https://api.clerk.com/v1/jwks

async def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    # 1. Fetch JWKS from Clerk
    # 2. Get unverified header from token to find the 'kid'
    # 3. Find matching key in JWKS
    # 4. jwt.decode(token, public_key, algorithms=["RS256"])
    # 5. Return the payload (which contains the user_id)
    # If any step fails, raise HTTPException 401
```

### 3. Bookmarks Endpoints (`backend/routers/bookmarks.py`)
- `POST /api/bookmarks`
  - Injects `user_payload = Depends(verify_clerk_token)`.
  - Injects `db = Depends(get_db)`.
  - Inserts `User_Bookmarks(clerk_user_id=user_payload['sub'], lap_id_1=..., lap_id_2=...)`.
- `GET /api/bookmarks`
  - Returns all bookmarks for `user_payload['sub']`.
