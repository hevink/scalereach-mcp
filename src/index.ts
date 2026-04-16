#!/usr/bin/env node
/**
 * ScaleReach MCP Server
 *
 * Lets Claude (or any MCP client) interact with ScaleReach's video clipping API.
 * Claude will naturally ask users about genre, caption style, aspect ratio, etc.
 * before submitting the video — because it sees the tool parameter schemas.
 *
 * Usage:
 *   npx scalereach-mcp          (via npm)
 *   SCALEREACH_API_KEY=sr_live_xxx npx scalereach-mcp
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  submitYouTubeVideoTool,
  configureVideoTool,
  getVideoStatusTool,
  getVideoClipsTool,
  getClipDetailsTool,
  getClipDownloadTool,
  listMyVideosTool,
  deleteVideoTool,
  regenerateVideoTool,
  validateYouTubeUrlTool,
  listSocialAccountsTool,
  schedulePostTool,
  listPostsTool,
  updatePostTool,
  cancelPostTool,
} from "./tools/index.js";

const server = new McpServer({
  name: "scalereach",
  version: "1.0.0",
});

// ── Register all tools ──────────────────────────────────────────────

validateYouTubeUrlTool(server);
submitYouTubeVideoTool(server);
configureVideoTool(server);
getVideoStatusTool(server);
getVideoClipsTool(server);
getClipDetailsTool(server);
getClipDownloadTool(server);
listMyVideosTool(server);
deleteVideoTool(server);
regenerateVideoTool(server);
listSocialAccountsTool(server);
schedulePostTool(server);
listPostsTool(server);
updatePostTool(server);
cancelPostTool(server);

// ── Start ───────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[ScaleReach MCP] Server started");
}

main().catch((err) => {
  console.error("[ScaleReach MCP] Fatal error:", err);
  process.exit(1);
});
