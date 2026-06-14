# Phase 8 Specs: Clerk Authentication & Personalized Workspaces

## 1. Frontend Clerk Integration
- Install `@clerk/nextjs`.
- Provide `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`.
- Wrap `app/layout.tsx` in `<ClerkProvider>`.
- Add `<UserButton />` to the global Navbar.
- Use `authMiddleware()` in `middleware.ts` to protect the `/workspace` route.

## 2. Backend JWT Verification
- Add a dependency in `FastAPI` to decode the Clerk token.
- Validate the Bearer token using Clerk's JWKS (JSON Web Key Set).
- Extract `user_id` from the payload.

## 3. Database Endpoints
- **POST `/api/bookmarks`**
  - **Auth:** Requires valid Clerk token.
  - **Body:** `{ lap_id_1, lap_id_2, custom_note }`
  - **Logic:** Upserts into `users` table if the user is new. Inserts into `user_bookmarks`.
- **GET `/api/bookmarks`**
  - **Auth:** Requires valid Clerk token.
  - **Logic:** Returns all rows from `user_bookmarks` where `clerk_user_id == current_user`.

## 4. Frontend Workspace
- Build `app/workspace/page.tsx`.
- Fetch data from `GET /api/bookmarks` passing the Clerk session token in the headers.
- Display a list of saved comparisons. Clicking one takes the user directly back to the Telemetry Chart with those two laps loaded.
