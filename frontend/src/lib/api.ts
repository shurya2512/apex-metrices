const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Session {
  session_id: number;
  circuit_name: string;
  year: number;
  session_type?: string;
  country?: string;
  date?: string;
}

export interface Driver {
  driver_number: number;
  name_acronym: string;
  full_name: string;
  team_name: string;
  team_colour: string;
}

export interface TelemetryPoint {
  time: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
}

export interface TelemetryResponse {
  lap_id: string;
  data: TelemetryPoint[];
}

export interface ApiError {
  detail: string;
  status: number;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API Error ${res.status}: Failed to fetch ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchSessions(): Promise<Session[]> {
  return apiFetch<Session[]>("/api/sessions");
}

export async function fetchSessionById(id: string): Promise<Session> {
  return apiFetch<Session>(`/api/sessions/${id}`);
}

export async function fetchDrivers(sessionId: string): Promise<Driver[]> {
  return apiFetch<Driver[]>(`/api/sessions/${sessionId}/drivers`);
}

export async function fetchTelemetry(lapId: string): Promise<TelemetryResponse> {
  const res = await fetch(`${API_BASE}/api/laps/${lapId}/telemetry`);
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: Failed to fetch telemetry for ${lapId}`);
  }
  return res.json() as Promise<TelemetryResponse>;
}
