import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall, getWorkspaceId } from "../api-client.js";

export function listPostsTool(server: McpServer) {
  server.tool(
    "list_scheduled_posts",
    "List all scheduled, pending, posted, or failed social media posts in a workspace. Shows post status, platform, caption, scheduled time, and clip info.",
    {
      workspaceId: z.string().optional().describe("Workspace ID — auto-resolved from API key if not provided"),
      status: z
        .enum(["pending", "posting", "posted", "failed", "cancelled"])
        .optional()
        .describe("Filter by post status. Omit to show all."),
      clipId: z
        .string()
        .optional()
        .describe("Filter posts for a specific clip"),
    },
    async ({ workspaceId, status, clipId }) => {
      const wsId = workspaceId || await getWorkspaceId();
      const params = new URLSearchParams({ workspaceId: wsId });
      if (status) params.set("status", status);
      if (clipId) params.set("clipId", clipId);

      const { ok, data } = await apiCall("GET", `/api/social/posts?${params}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
