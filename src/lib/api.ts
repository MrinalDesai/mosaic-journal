import type { User } from "firebase/auth";
import type { Memory } from "../types";

async function authHeaders(user: User): Promise<Record<string, string>> {
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function parseError(res: Response): Promise<Error> {
  try {
    const body = await res.json();
    return new Error(body.error ?? `Request failed (${res.status})`);
  } catch {
    return new Error(`Request failed (${res.status})`);
  }
}

export async function createTextMoment(user: User, text: string) {
  const headers = await authHeaders(user);
  const res = await fetch("/api/moments", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "text", text })
  });
  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<{ memoryId: string; analysis: Memory["analysis"]; question: string }>;
}

export async function createImageMoment(user: User, file: File) {
  const headers = await authHeaders(user);
  const form = new FormData();
  form.set("type", "image");
  form.set("artifact", file);
  const res = await fetch("/api/moments", { method: "POST", headers, body: form });
  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<{ memoryId: string; analysis: Memory["analysis"]; question: string }>;
}

export async function answerMoment(user: User, memoryId: string, answer: string) {
  const headers = await authHeaders(user);
  const res = await fetch(`/api/moments/${encodeURIComponent(memoryId)}/answer`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ answer })
  });
  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<{ memory: Memory }>;
}

export async function getMemories(user: User): Promise<Memory[]> {
  const headers = await authHeaders(user);
  const res = await fetch("/api/memories", { headers });
  if (!res.ok) throw await parseError(res);
  const body = (await res.json()) as { memories: Memory[] };
  return body.memories;
}

export async function deleteMemory(user: User, memoryId: string): Promise<void> {
  const headers = await authHeaders(user);
  const res = await fetch(`/api/memories/${encodeURIComponent(memoryId)}`, {
    method: "DELETE",
    headers
  });
  if (!res.ok) throw await parseError(res);
}
