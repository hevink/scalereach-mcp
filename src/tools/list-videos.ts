import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall, getWorkspaceId } from "../api-client.js";

export function listMyVideosTool(server: McpServer) {
  server.tool(
    "list_my_videos",
    "List all videos in the workspace. Returns video titles, statuses, durations, and source types. Useful to find a video ID or check what's been processed.",
    {
      workspaceId: z.string().optional().describe("Workspace ID — auto-resolved from API key if not provided"),
      filter: z
        .enum(["all", "completed", "processing", "failed"])
        .optional()
        .describe("Filter by status. Default shows all."),
      sourceType: z
        .enum(["youtube", "upload"])
        .optional()
        .describe("Filter by source type"),
    },
    async ({ workspaceId, filter, sourceType }) => {
      const wsId = workspaceId || await getWorkspaceId();
      const params = new URLSearchParams({ workspaceId: wsId });
      if (filter) params.set("filter", filter);
      if (sourceType) params.set("sourceType", sourceType);

      const { ok, data } = await apiCall("GET", `/api/videos/my-videos?${params}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
