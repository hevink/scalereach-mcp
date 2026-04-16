import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function regenerateVideoTool(server: McpServer) {
  server.tool(
    "regenerate_video",
    "Re-process a video from scratch — re-download, re-transcribe, and re-detect viral clips. Useful if the user wants different results or if processing failed previously.",
    { videoId: z.string().describe("The video ID to regenerate") },
    async ({ videoId }) => {
      const { ok, status, data } = await apiCall("POST", `/api/videos/${videoId}/regenerate`);
      if (!ok) {
        return {
          content: [{ type: "text" as const, text: `Error (${status}): ${JSON.stringify(data)}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
