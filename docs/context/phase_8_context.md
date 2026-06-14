# Phase 8 Context: Clerk Authentication & Personalized Workspaces

## AI Agent Instructions & Objectives
**Goal:** Add user accounts using Clerk, allowing users to bookmark their favorite head-to-head lap comparisons to view later.

**Why this matters:** Returning users shouldn't have to navigate through the entire session command center to find their favorite comparisons. A personalized workspace adds significant user retention value.

## Success Criteria
1. The app handles user sign-in and sign-up using Clerk.
2. The user can click a "Save Bookmark" button on a telemetry comparison.
3. The bookmark is securely saved via FastAPI to the PostgreSQL `user_bookmarks` table.
4. A `/workspace` route loads the user's saved bookmarks securely.
