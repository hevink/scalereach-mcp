import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function updatePostTool(server: McpServer) {
  server.tool(
    "update_scheduled_post",
    "Edit a pending scheduled post — change the caption, hashtags, or reschedule to a different time. Only works on posts with status 'pending'.",
    {
      postId: z.string().describe("The scheduled post ID to edit"),
      caption: z
        .string()
        .optional()
        .describe("New caption text (replaces existing)"),
      hashtags: z
        .array(z.string())
        .optional()
        .describe("New hashtags (replaces existing)"),
      scheduledAt: z
        .string()
        .optional()
        .describe("New scheduled time as ISO 8601 datetime (e.g., '2025-01-15T14:00:00Z')"),
    },
    async (params) => {
      const { postId, ...updates } = params;
      const { ok, status, data } = await apiCall(
        "PATCH",
        `/api/social/posts/${postId}`,
        updates
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
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
