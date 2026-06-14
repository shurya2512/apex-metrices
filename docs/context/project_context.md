# Project Context: ApexMetrics

## Vision
To provide a highly performant, real-time interactive telemetry dashboard for motorsport enthusiasts and race engineers, bridging the gap between professional data analysis and fan accessibility.

## Target Audience
- **Motorsport Enthusiasts:** Fans looking for deeper insights into race strategies, driver performance, and real-time telemetry beyond standard broadcasts.
- **Data Analysts/Race Engineers:** Individuals wanting to analyze lap times, speed, RPM, and other vehicle metrics interactively.

## Primary Data Source
- **OpenF1 API:** The primary source for both live and historical Formula 1 data, providing access to telemetry, timing, and session info.

## Key Challenges
- **Data Volume:** Telemetry data is extremely high-frequency (10,000+ data points per lap). It must be downsampled efficiently without losing curve integrity to maintain browser performance.
- **API Rate Limiting:** Direct, repeated calls to the OpenF1 API could lead to rate limits or slow load times. Smart caching in PostgreSQL is required.
- **Real-Time Rendering:** Synchronized, multi-line time-series charts must render smoothly in the browser.
