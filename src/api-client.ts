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

// Cache the workspace ID and slug so we only fetch once
let cachedWorkspaceId: string | null = null;
let cachedWorkspaceSlug: string | null = null;

export async function getWorkspaceId(): Promise<string> {
  if (cachedWorkspaceId) return cachedWorkspaceId;
  await resolveWorkspace();
  return cachedWorkspaceId!;
}

export async function getWorkspaceSlug(): Promise<string> {
  if (cachedWorkspaceSlug) return cachedWorkspaceSlug;
  await resolveWorkspace();
  return cachedWorkspaceSlug!;
}

async function resolveWorkspace(): Promise<void> {
  const { ok, data } = await apiCall<any[]>("GET", "/api/workspaces");
  if (ok && Array.isArray(data) && data.length > 0) {
    cachedWorkspaceId = data[0].id;
    cachedWorkspaceSlug = data[0].slug || data[0].id;
    return;
  }
  throw new Error("Could not resolve workspace from API key. Check your SCALEREACH_API_KEY.");
}

export function buildDashboardUrl(path: string): string {
  const slug = cachedWorkspaceSlug || "app";
  return `https://app.scalereach.ai/${slug}${path}`;
}

export async function getDashboardUrl(path: string): Promise<string> {
  await getWorkspaceSlug(); // ensure resolved
  return `https://app.scalereach.ai/${cachedWorkspaceSlug || "app"}${path}`;
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
