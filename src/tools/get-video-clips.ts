import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall, buildDashboardUrl } from "../api-client.js";

export function getVideoClipsTool(server: McpServer) {
  server.tool(
    "get_video_clips",
    "Get all AI-generated clips for a processed video. Returns clip titles, virality scores, timestamps, transcripts, hooks, emotions, and generation status. Use after video status is 'completed'.",
    { videoId: z.string().describe("The video ID to get clips for") },
    async ({ videoId }) => {
      const { ok, data } = await apiCall("GET", `/api/videos/${videoId}/clips`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) +
          `\n\nView clips in dashboard: ${buildDashboardUrl(`/videos/${videoId}/clips`)}` }],
      };
    }
  );
}
