# Phase 9 Specs: Team Radio Integration, Optimization & Deployment

## 📁 File Structure to Create
```text
frontend/
├── components/
│   └── TeamRadioPlayer.tsx
backend/
├── Procfile (if using Heroku/Render)
```

## 🛠️ Required Libraries & Tools
- React native hooks (`useRef`, `useMemo`, `useCallback`).
- Vercel CLI (optional for deployment).

## 💻 Technical Implementation Details

### 1. Audio Syncing (`components/TeamRadioPlayer.tsx`)
```tsx
import { useEffect, useRef } from 'react';

export default function TeamRadioPlayer({ radioEvents, activeTime, isAudioEnabled }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isAudioEnabled) return;
    
    // Find if there's a radio event at the exact current hovered time
    const event = radioEvents.find(e => e.time === activeTime);
    if (event && audioRef.current) {
        audioRef.current.src = event.audio_url; // Audio URL from OpenF1 API
        audioRef.current.play();
    }
  }, [activeTime, radioEvents, isAudioEnabled]);

  return <audio ref={audioRef} className="hidden" />;
}
```

### 2. React Memoization (`components/TelemetryDashboard.tsx`)
```tsx
import React, { useMemo } from 'react';
import TrackMap from './TrackMap';

// 1. Memoize the expensive data merge
const mergedData = useMemo(() => {
   return mergeTelemetryData(driverAData, driverBData);
}, [driverAData, driverBData]);

// 2. Wrap heavy children in React.memo
const MemoizedTrackMap = React.memo(TrackMap);

return (
  <div>
     <MemoizedTrackMap telemetryData={mergedData} activeTime={activeHoverTime} />
     {/* Charts go here */}
  </div>
)
```

### 3. Production Deployment Configuration
**Backend (Koyeb/Render):**
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 4`
- Environment Variables:
  - `DATABASE_URL` = (Neon Production URL)
  - `CLERK_JWKS_URL` = (Clerk Production URL)

**Frontend (Vercel):**
- Environment Variables:
  - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = (Clerk Production Key)
