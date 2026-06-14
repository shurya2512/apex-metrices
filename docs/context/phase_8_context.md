# Phase 8 Context: Clerk Authentication & Personalized Workspaces

## 🤖 AI Agent System Prompt
**Role:** You are a Fullstack Authentication Security Expert.
**Task:** Secure the application using Clerk. Allow users to sign in, and create protected API routes on the FastAPI backend that only logged-in users can hit to save their telemetry "bookmarks".

## 🧠 Conceptual Background
Up until now, the app has been entirely public and stateless. To retain users, we want them to save interesting telemetry comparisons (e.g., "Verstappen vs Hamilton, Lap 50, 2021 Abu Dhabi") to their account. 
Clerk handles the heavy lifting of OAuth (Google/Apple sign-in) on the Next.js frontend. However, Next.js does not own the database—FastAPI does. Therefore, when Next.js sends a `POST /api/bookmarks` request to FastAPI, it must include a Clerk JWT (JSON Web Token). FastAPI must cryptographically verify this token to ensure the request is legitimate before writing to the PostgreSQL database.

## 🚧 Expected Challenges & Agent Solutions
1. **Challenge: FastAPI reading Clerk JWTs.** FastAPI doesn't natively know about Clerk.
   - *Agent Solution:* Use the `PyJWT` and `cryptography` Python libraries. Fetch Clerk's public JWKS (JSON Web Key Set) URL to verify the signature of the Bearer token sent in the `Authorization` header.
2. **Challenge: Frontend UI state flashing.**
   - *Agent Solution:* Use Clerk's `<SignedIn>` and `<SignedOut>` components natively in Next.js to prevent UI flickering during the auth check on initial load.

## ✅ Definition of Done
The agent must verify the following before concluding this phase:
- [ ] Next.js app is wrapped in `<ClerkProvider>` and user login works.
- [ ] FastAPI has a dependency function `verify_clerk_token` that blocks unauthorized requests.
- [ ] A user can save a bookmark to the PostgreSQL DB, and it correctly associates with their `clerk_user_id`.
