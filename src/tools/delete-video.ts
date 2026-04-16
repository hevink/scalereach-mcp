import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function deleteVideoTool(server: McpServer) {
  server.tool(
    "delete_video",
    "Delete a video and all its generated clips. This is irreversible. Always confirm with the user before deleting.",
    { videoId: z.string().describe("The video ID to delete") },
    async ({ videoId }) => {
      const { ok, status, data } = await apiCall("DELETE", `/api/videos/${videoId}`);
      if (!ok) {
        return {
          content: [{ type: "text" as const, text: `Error (${status}): ${JSON.stringify(data)}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: "Video deleted successfully." }],
      };
    }
  );
}
