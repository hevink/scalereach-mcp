import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function cancelPostTool(server: McpServer) {
  server.tool(
    "cancel_scheduled_post",
    "Cancel a scheduled post. Works on any post that hasn't been posted yet (status: pending, failed). Cannot cancel posts that are already posted. Always confirm with the user before cancelling.",
    {
      postId: z.string().describe("The scheduled post ID to cancel"),
    },
    async ({ postId }) => {
      const { ok, status, data } = await apiCall(
        "DELETE",
        `/api/social/posts/${postId}`
      );

      if (!ok) {
        return {
          content: [
            { type: "text" as const, text: `Error (${status}): ${JSON.stringify(data)}` },
          ],
          isError: true,
        };
      }

      return {
        content: [{ type: "text" as const, text: "Post cancelled successfully." }],
      };
    }
  );
}
