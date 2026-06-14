const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Session {
  session_id: number;
  circuit_name: string;
  year: number;
  session_type?: string;
  country?: string;
  date?: string;
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
