import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function getClipDetailsTool(server: McpServer) {
  server.tool(
    "get_clip_details",
    "Get detailed information about a specific clip — title, transcript, virality score, hooks, emotions, recommended platforms, and generation status.",
    { clipId: z.string().describe("The clip ID to get details for") },
    async ({ clipId }) => {
      const { ok, data } = await apiCall("GET", `/api/clips/${clipId}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
