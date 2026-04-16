/**
 * Thin HTTP client for the ScaleReach API.
 * Reads API_URL and API_KEY from environment variables.
 */

const API_BASE =
  process.env.SCALEREACH_API_URL || "https://api.scalereach.ai";
const API_KEY = process.env.SCALEREACH_API_KEY; // sr_live_...

if (!API_KEY) {
  console.error(
    "[ScaleReach MCP] SCALEREACH_API_KEY is not set. " +
      "Generate one at: Dashboard → Settings → API Keys"
  );
}

// Cache the workspace ID so we only fetch it once
let cachedWorkspaceId: string | null = null;

export async function getWorkspaceId(): Promise<string> {
  if (cachedWorkspaceId) return cachedWorkspaceId;

  const { ok, data } = await apiCall<any[]>("GET", "/api/workspaces");
  if (ok && Array.isArray(data) && data.length > 0) {
    cachedWorkspaceId = data[0].id;
    return cachedWorkspaceId!;
  }

  throw new Error("Could not resolve workspace from API key. Check your SCALEREACH_API_KEY.");
}

export async function apiCall<T = any>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: T }> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as T;

  return { ok: res.ok, status: res.status, data };
}
