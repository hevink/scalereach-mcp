import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function getClipDownloadTool(server: McpServer) {
  server.tool(
    "get_clip_download",
    "Get a temporary download URL for a generated clip. The URL is a signed S3/R2 link valid for a limited time. Only works for clips with status 'ready'.",
    { clipId: z.string().describe("The clip ID to get download URL for") },
    async ({ clipId }) => {
      const { ok, data } = await apiCall("GET", `/api/clips/${clipId}/download`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
