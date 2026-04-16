import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall, getWorkspaceId } from "../api-client.js";

export function listSocialAccountsTool(server: McpServer) {
  server.tool(
    "list_social_accounts",
    "List all connected social media accounts (Instagram, TikTok, YouTube, etc.) in the workspace. Use this to find the socialAccountId needed for scheduling posts.",
    {
      workspaceId: z.string().optional().describe("Workspace ID — auto-resolved from API key if not provided"),
    },
    async ({ workspaceId }) => {
      const wsId = workspaceId || await getWorkspaceId();
      const { ok, data } = await apiCall(
        "GET",
        `/api/social/accounts?workspaceId=${wsId}`
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
