# ScaleReach MCP Server

[![npm version](https://img.shields.io/npm/v/scalereach-mcp.svg)](https://www.npmjs.com/package/scalereach-mcp)

MCP server for [ScaleReach](https://scalereach.ai) — lets Claude and other AI assistants clip YouTube videos and schedule social media posts through natural conversation.

## How it works

```
You: "Clip this video: https://youtube.com/watch?v=abc — find the funniest moments"

Claude: "Before I clip this, a few questions:
  1. What genre? (Comedy, Education, Gaming...)
  2. Aspect ratio? 9:16 for TikTok, 16:9 for YouTube?
  3. How long should clips be?
  4. Caption style? (classic, hormozi, mrbeast-pro...)"

You: "Comedy, vertical for TikTok, 30-60 seconds, hormozi style"

Claude: → calls ScaleReach API → video processed → clips ready
```

## Quick Setup

### 1. Get your API key

Go to [ScaleReach Dashboard](https://app.scalereach.ai) → Settings → API Keys → Create Key

### 2a. Claude.ai (no install needed)

Go to [claude.ai](https://claude.ai) → Settings → Connectors → Add Custom Connector:
- URL: `https://mcp.scalereach.ai/mcp`
- Header: `Authorization: Bearer sr_live_your_key_here`

No terminal, no Node.js, no config files.

### 2b. Desktop apps (one command)

```bash
npx scalereach-mcp setup sr_live_your_key_here
```

Auto-detects Claude Desktop, Cursor, Windsurf, and Kiro — configures all of them. Restart your AI app.

To remove: `npx scalereach-mcp uninstall`

### 2c. Manual config

Add to your AI app's MCP config:

```json
{
  "mcpServers": {
    "scalereach": {
      "command": "npx",
      "args": ["-y", "scalereach-mcp"],
      "env": {
        "SCALEREACH_API_KEY": "sr_live_your_key_here"
      }
    }
  }
}
```

Config file locations:
- Claude Desktop (Mac): `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude Desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
- Cursor: `.cursor/mcp.json`
- Kiro: `.kiro/settings/mcp.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`

## Available Tools

### Video Clipping

| Tool | What it does |
|------|-------------|
| `validate_youtube_url` | Check if a YouTube URL is valid, get video info |
| `submit_youtube_video` | Submit video with full config (genre, captions, aspect ratio, etc.) |
| `configure_video` | Update config for an already-submitted video |
| `get_video_status` | Check processing progress |
| `get_video_clips` | Get all generated clips for a video |
| `get_clip_details` | Get details of a specific clip |
| `get_clip_download` | Get download URL for a clip |
| `list_my_videos` | List all videos in workspace |
| `delete_video` | Delete a video and its clips |
| `regenerate_video` | Re-process a video from scratch |

### Social Media Scheduling

| Tool | What it does |
|------|-------------|
| `list_social_accounts` | List connected Instagram, TikTok, YouTube accounts |
| `schedule_post` | Schedule a clip to post now or at a future time |
| `list_scheduled_posts` | View all scheduled/posted/failed posts |
| `update_scheduled_post` | Edit caption, hashtags, or reschedule time |
| `cancel_scheduled_post` | Cancel a pending scheduled post |

## Caption Templates

When Claude asks about caption style, these are the options:

| Template | Vibe |
|----------|------|
| `classic` | Yellow highlight, Poppins — most popular |
| `hormozi` | Gold, Anton font — business/motivation |
| `mrbeast-pro` | Green highlight — high energy |
| `garyvee` | Red highlight — entrepreneurship |
| `tiktok-native` | Pink — native TikTok look |
| `cinematic` | Warm ivory — premium/documentary |
| `neon-pop` | Cyan/magenta — eye-catching |
| `rainbow` | Multi-color — vibrant |
| `simple` | Clean, no highlight — minimal |
| `basker` | Serif, golden — elegant |
| `billy` | Lilita One, purple — playful |
| `electric-blue` | Cyan — gaming/tech |
| `sunset-fire` | Orange — high energy |
| `ice-cold` | Ice blue — cool & crisp |
| `coral-pop` | Coral — fun & bouncy |
| `midnight-purple` | Deep purple — mysterious |
| `toxic-green` | Neon green — bold |
| `georgia-elegance` | Serif, warm — editorial |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SCALEREACH_API_KEY` | Yes | Your API key (starts with `sr_live_`) |
| `SCALEREACH_API_URL` | No | API base URL (default: `https://api.scalereach.ai`) |

## Example Prompts

Once connected, try these with Claude:

- "Clip this YouTube video and find the most viral moments: [url]"
- "Make TikTok clips from this podcast, focus on the hot takes: [url]"
- "Extract the key business insights from this video, use hormozi caption style: [url]"
- "What videos do I have in my workspace?"
- "Show me the clips from my latest video"
- "Download the highest-scored clip"
- "Show my connected social accounts"
- "Schedule the best clip to Instagram at 3pm tomorrow"
- "Post this clip to TikTok right now with caption 'Check this out 🔥'"
- "Show my scheduled posts"
- "Change the caption on that scheduled post"
- "Cancel the post I scheduled for Friday"

## License

MIT
