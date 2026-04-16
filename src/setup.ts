#!/usr/bin/env node
/**
 * ScaleReach MCP Setup CLI
 *
 * One command to configure ScaleReach MCP in all detected AI apps.
 * Usage: npx scalereach-mcp setup sr_live_YOUR_KEY
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as readline from "readline";

const SCALEREACH_CONFIG = {
  command: "npx",
  args: ["-y", "scalereach-mcp"],
  env: {} as Record<string, string>,
};

interface AppConfig {
  name: string;
  configPath: string;
  exists: boolean;
}

function getApps(): AppConfig[] {
  const home = os.homedir();
  const platform = os.platform();

  const apps: AppConfig[] = [];

  // Claude Desktop
  if (platform === "darwin") {
    apps.push({
      name: "Claude Desktop",
      configPath: path.join(
        home,
        "Library/Application Support/Claude/claude_desktop_config.json"
      ),
      exists: false,
    });
  } else if (platform === "win32") {
    apps.push({
      name: "Claude Desktop",
      configPath: path.join(
        home,
        "AppData/Roaming/Claude/claude_desktop_config.json"
      ),
      exists: false,
    });
  } else {
    apps.push({
      name: "Claude Desktop",
      configPath: path.join(home, ".config/claude/claude_desktop_config.json"),
      exists: false,
    });
  }

  // Cursor (workspace-level, use home as fallback)
  apps.push({
    name: "Cursor",
    configPath: path.join(home, ".cursor/mcp.json"),
    exists: false,
  });

  // Windsurf
  apps.push({
    name: "Windsurf",
    configPath: path.join(home, ".codeium/windsurf/mcp_config.json"),
    exists: false,
  });

  // Kiro
  apps.push({
    name: "Kiro",
    configPath: path.join(home, ".kiro/settings/mcp.json"),
    exists: false,
  });

  // Check which exist
  for (const app of apps) {
    app.exists =
      fs.existsSync(app.configPath) ||
      fs.existsSync(path.dirname(app.configPath));
  }

  return apps;
}

function readJsonFile(filePath: string): Record<string, any> {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function writeJsonFile(filePath: string, data: Record<string, any>): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function addToConfig(filePath: string, apiKey: string): boolean {
  const config = readJsonFile(filePath);

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  // Check if already configured
  if (config.mcpServers.scalereach) {
    const existing = config.mcpServers.scalereach;
    if (existing.env?.SCALEREACH_API_KEY === apiKey) {
      return false; // Already configured with same key
    }
  }

  config.mcpServers.scalereach = {
    ...SCALEREACH_CONFIG,
    env: { SCALEREACH_API_KEY: apiKey },
  };

  writeJsonFile(filePath, config);
  return true;
}

function removeFromConfig(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const config = readJsonFile(filePath);
  if (!config.mcpServers?.scalereach) return false;

  delete config.mcpServers.scalereach;
  writeJsonFile(filePath, config);
  return true;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function setup(apiKey?: string): Promise<void> {
  console.log("\n🎬 ScaleReach MCP Setup\n");

  // Get or ask for API key
  if (!apiKey) {
    console.log("Get your API key from: https://app.scalereach.ai → Settings → API Keys\n");
    apiKey = await prompt("Paste your API key (sr_live_...): ");
  }

  if (!apiKey || !apiKey.startsWith("sr_live_")) {
    console.error("❌ Invalid API key. It should start with sr_live_");
    process.exit(1);
  }

  const apps = getApps();
  const detected = apps.filter((a) => a.exists);

  if (detected.length === 0) {
    console.log("No AI apps detected. Supported apps:");
    console.log("  - Claude Desktop (https://claude.ai/download)");
    console.log("  - Cursor (https://cursor.com)");
    console.log("  - Windsurf (https://codeium.com/windsurf)");
    console.log("  - Kiro (https://kiro.dev)\n");
    console.log("Install one and run this again.");
    process.exit(0);
  }

  console.log(`Found ${detected.length} AI app(s):\n`);

  let configured = 0;
  for (const app of detected) {
    const added = addToConfig(app.configPath, apiKey);
    if (added) {
      console.log(`  ✅ ${app.name} — configured`);
      configured++;
    } else {
      console.log(`  ⏭️  ${app.name} — already configured`);
    }
  }

  console.log(
    `\n${configured > 0 ? "🎉 Done!" : "Nothing to update."} ${configured > 0 ? "Restart your AI app(s) to connect.\n" : "\n"}`
  );

  if (configured > 0) {
    console.log('Then try: "Clip this video: https://youtube.com/watch?v=..."');
    console.log("");
  }
}

async function uninstall(): Promise<void> {
  console.log("\n🗑️  ScaleReach MCP Uninstall\n");

  const apps = getApps();
  let removed = 0;

  for (const app of apps) {
    if (removeFromConfig(app.configPath)) {
      console.log(`  ✅ Removed from ${app.name}`);
      removed++;
    }
  }

  console.log(
    `\n${removed > 0 ? "Done! Restart your AI app(s)." : "ScaleReach was not configured in any app."}\n`
  );
}

// CLI entry point
const args = process.argv.slice(2);
const command = args[0];

if (command === "setup" || command === "install") {
  setup(args[1]);
} else if (command === "uninstall" || command === "remove") {
  uninstall();
} else if (command?.startsWith("sr_live_")) {
  // Allow: npx scalereach-mcp setup sr_live_xxx
  // or:    npx scalereach-mcp sr_live_xxx
  setup(command);
} else if (command === "help" || command === "--help" || command === "-h") {
  console.log(`
ScaleReach MCP — Clip YouTube videos with Claude

Usage:
  npx scalereach-mcp setup <API_KEY>    Add ScaleReach to your AI apps
  npx scalereach-mcp setup              Interactive setup (asks for key)
  npx scalereach-mcp uninstall          Remove from all AI apps

Get your API key: https://app.scalereach.ai → Settings → API Keys
`);
} else if (!command) {
  // No args = run as MCP server (default behavior from index.ts)
  // This file is only called when explicitly invoked with setup/uninstall
  // The MCP server entry point is index.ts
  import("./index.js");
} else {
  console.error(`Unknown command: ${command}`);
  console.log('Run "npx scalereach-mcp help" for usage.');
  process.exit(1);
}
