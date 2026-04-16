import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

/**
 * Configure or reconfigure a video's clipping settings.
 * Useful when the video was submitted without config, or to change settings.
 */
export function configureVideoTool(server: McpServer) {
  server.tool(
    "configure_video",
    "Update clipping configuration for a video that's already been submitted. Use this to change genre, caption style, aspect ratio, or other settings before or after processing.",
    {
      videoId: z.string().describe("The video ID to configure"),
      genre: z
        .enum(["Auto", "Podcast", "Gaming", "Education", "Entertainment"])
        .optional()
        .describe("Content genre for AI clip detection"),
      aspectRatio: z
        .enum(["9:16", "16:9", "1:1"])
        .optional()
        .describe("Output aspect ratio"),
      clipDurationMin: z.number().optional().describe("Min clip duration (seconds)"),
      clipDurationMax: z.number().optional().describe("Max clip duration (seconds)"),
      captionTemplateId: z.string().optional().describe("Caption style template ID"),
      enableCaptions: z.boolean().optional().describe("Enable/disable captions"),
      clipType: z.string().optional().describe("Clip type: viral-clips, highlights, tutorials"),
      customPrompt: z.string().optional().describe("Custom AI instructions"),
      language: z.string().optional().describe("Language code or null for auto-detect"),
      enableSmartCrop: z.boolean().optional().describe("Enable AI smart reframing"),
      enableSplitScreen: z.boolean().optional().describe("Enable split-screen mode"),
      splitRatio: z.number().min(30).max(70).optional().describe("Split ratio (30-70, increments of 5)"),
    },
    async (params) => {
      const { videoId, ...config } = params;
      const { ok, status, data } = await apiCall(
        "PATCH",
        `/api/videos/${videoId}/config`,
        config
      );

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
