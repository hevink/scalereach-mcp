import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function getVideoStatusTool(server: McpServer) {
  server.tool(
    "get_video_status",
    "Check the processing status of a video. Status flow: pending → downloading → uploading → transcribing → analyzing → completed (or failed). Also returns job progress percentage.",
    { videoId: z.string().describe("The video ID to check status for") },
    async ({ videoId }) => {
      const { ok, data } = await apiCall("GET", `/api/videos/${videoId}/status`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
