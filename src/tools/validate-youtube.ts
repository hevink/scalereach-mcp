import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

export function validateYouTubeUrlTool(server: McpServer) {
  server.tool(
    "validate_youtube_url",
    "Validate a YouTube URL and get video info (title, duration, channel) before submitting. Use this first to confirm the video exists and show the user what they're about to clip.",
    { url: z.string().url().describe("YouTube video URL to validate") },
    async ({ url }) => {
      const { ok, data } = await apiCall(
        "GET",
        `/api/videos/validate-youtube?url=${encodeURIComponent(url)}`
      );
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(data, null, 2) },
        ],
      };
    }
  );
}
