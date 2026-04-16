import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function schedulePostTool(server: McpServer) {
  server.tool(
    "schedule_post",
    `Schedule a clip to be posted to a connected social media account. Before calling this, ASK the user:

1. **Which clip?** — Get the clip ID (use get_video_clips first if needed)
2. **Which account?** — Use list_social_accounts to show connected accounts
3. **When?** — Post now (immediate) or schedule for a specific date/time
4. **Caption** — What text should accompany the post?
5. **Hashtags** — Any hashtags to include?

Supports Instagram Reels, TikTok, YouTube Shorts, and more.`,
    {
      workspaceId: z.string().describe("Workspace ID"),
      clipId: z.string().describe("The clip ID to post"),
      socialAccountId: z
        .string()
        .describe("Connected social account ID (use list_social_accounts to find this)"),
      postType: z
        .enum(["immediate", "scheduled"])
        .describe("'immediate' to post now, 'scheduled' to post at a specific time"),
      caption: z
        .string()
        .optional()
        .describe("Post caption/description text"),
      hashtags: z
        .array(z.string())
        .optional()
        .describe("Hashtags to include (e.g., ['viral', 'clips', 'funny'])"),
      scheduledAt: z
        .string()
        .optional()
        .describe(
          "ISO 8601 datetime for scheduled posts (e.g., '2025-01-15T14:00:00Z'). Required when postType is 'scheduled'."
        ),
    },
    async (params) => {
      const { ok, status, data } = await apiCall("POST", "/api/social/posts", params);

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
