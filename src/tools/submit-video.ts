import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiCall } from "../api-client.js";

/**
 * Submit a YouTube video with full configuration in one shot.
 *
 * The parameter descriptions are intentionally detailed — Claude reads these
 * and uses them to ask the user the right questions before calling the tool.
 */
export function submitYouTubeVideoTool(server: McpServer) {
  server.tool(
    "submit_youtube_video",
    `Submit a YouTube video URL for AI-powered clipping. Before calling this tool, ASK the user about their preferences:

1. **Genre** — What type of content is this? (Auto, Podcast, Gaming, Education, Entertainment)
2. **Aspect ratio** — Where will they post? 9:16 for TikTok/Reels/Shorts, 16:9 for YouTube, 1:1 for Instagram
3. **Clip duration** — How long should clips be? (e.g., 30-60 seconds for short-form)
4. **Caption style** — Which caption template? Options: classic, rainbow, hormozi, mrbeast-pro, garyvee, tiktok-native, neon-pop, cinematic, electric-blue, sunset-fire, ice-cold, coral-pop, midnight-purple, toxic-green, georgia-elegance, basker, billy, simple
5. **Custom prompt** — Any specific moments or topics to focus on?
6. **Language** — Auto-detect or specify (en, hi, es, fr, etc.)

The video will be downloaded, transcribed, and AI will find the most viral-worthy clips.`,
    {
      youtubeUrl: z
        .string()
        .url()
        .describe("YouTube video URL (e.g., https://youtube.com/watch?v=...)"),
      workspaceId: z
        .string()
        .describe("Workspace ID to process the video under"),
      projectId: z
        .string()
        .optional()
        .describe("Optional project ID to organize the video under"),
      genre: z
        .enum(["Auto", "Podcast", "Gaming", "Education", "Entertainment"])
        .optional()
        .default("Auto")
        .describe(
          "Content genre — helps AI find the right type of viral moments. " +
          "'Auto' lets AI detect it. 'Podcast' focuses on hot takes & debates. " +
          "'Gaming' finds epic plays & reactions. 'Education' extracts key insights. " +
          "'Entertainment' finds funny/emotional moments."
        ),
      aspectRatio: z
        .enum(["9:16", "16:9", "1:1"])
        .optional()
        .default("9:16")
        .describe(
          "Output aspect ratio. '9:16' for TikTok, Instagram Reels, YouTube Shorts (vertical). " +
          "'16:9' for YouTube (horizontal). '1:1' for Instagram feed (square)."
        ),
      clipDurationMin: z
        .number()
        .min(5)
        .optional()
        .default(15)
        .describe("Minimum clip duration in seconds (min 5). Default 15s."),
      clipDurationMax: z
        .number()
        .max(300)
        .optional()
        .default(90)
        .describe("Maximum clip duration in seconds (max 300). Default 90s."),
      captionTemplateId: z
        .enum([
          "classic", "rainbow", "basker", "billy", "simple", "hormozi",
          "mrbeast-pro", "garyvee", "tiktok-native", "neon-pop", "cinematic",
          "electric-blue", "sunset-fire", "ice-cold", "coral-pop",
          "midnight-purple", "toxic-green", "georgia-elegance",
        ])
        .optional()
        .default("classic")
        .describe(
          "Caption style template. Popular choices: " +
          "'classic' (yellow highlight, Poppins font — most popular), " +
          "'hormozi' (gold highlight, Anton font — business/motivation), " +
          "'mrbeast-pro' (green highlight — high energy), " +
          "'garyvee' (red highlight — entrepreneurship), " +
          "'tiktok-native' (pink highlight — native TikTok look), " +
          "'cinematic' (warm ivory — premium/documentary), " +
          "'neon-pop' (cyan/magenta — eye-catching), " +
          "'simple' (clean, no highlight — minimal). " +
          "Ask the user which vibe they want!"
        ),
      enableCaptions: z
        .boolean()
        .optional()
        .default(true)
        .describe("Enable burned-in captions on clips. Default true."),
      language: z
        .string()
        .optional()
        .describe(
          "Language code for transcription (e.g., 'en', 'hi', 'es', 'fr', 'de', 'ja'). " +
          "Leave empty for auto-detection."
        ),
      clipType: z
        .enum(["viral-clips", "highlights", "tutorials"])
        .optional()
        .default("viral-clips")
        .describe(
          "Type of clips to generate. 'viral-clips' finds the most shareable moments. " +
          "'highlights' extracts key moments. 'tutorials' finds educational segments."
        ),
      customPrompt: z
        .string()
        .optional()
        .describe(
          "Custom instructions for the AI. E.g., 'Focus on the cooking tips' or " +
          "'Find the funniest roasts' or 'Extract all the business advice'. " +
          "This guides what the AI looks for in the video."
        ),
      topicKeywords: z
        .array(z.string())
        .optional()
        .describe("Specific topics/keywords to focus on (e.g., ['marketing', 'AI', 'startup'])"),
      timeframeStart: z
        .number()
        .optional()
        .describe("Start time in seconds to begin clipping from (skip intro, etc.)"),
      timeframeEnd: z
        .number()
        .optional()
        .describe("End time in seconds to stop clipping at (skip outro, etc.)"),
      enableSplitScreen: z
        .boolean()
        .optional()
        .default(false)
        .describe("Enable split-screen mode with gameplay/satisfying video at bottom. Requires Starter+ plan."),
      enableSmartCrop: z
        .boolean()
        .optional()
        .default(false)
        .describe("Enable AI smart reframing — auto-tracks speakers/action for vertical crops."),
      enableIntroTitle: z
        .boolean()
        .optional()
        .default(false)
        .describe("Add an AI-generated hook title overlay in the first 3 seconds of each clip."),
    },
    async (params) => {
      const { youtubeUrl, workspaceId, projectId, ...config } = params;

      const { ok, status, data } = await apiCall("POST", "/api/videos/youtube", {
        youtubeUrl,
        workspaceId,
        projectId,
        config: {
          ...config,
          language: config.language || null,
        },
      });

      if (!ok) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error (${status}): ${JSON.stringify(data)}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}
