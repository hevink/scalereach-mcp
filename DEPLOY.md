# ScaleReach MCP (Local/stdio) — Deploy Guide

Published to npm as `scalereach-mcp`. Users install via `npx scalereach-mcp`.

## Prerequisites

- npm account with publish access to `scalereach-mcp`
- Node.js >= 18

## Deploy Steps

```bash
cd scalereach-mcp

# 1. Install deps
bun install

# 2. Build TypeScript → dist/
bun run build

# 3. Bump version (patch/minor/major)
npm version patch

# 4. Publish to npm
npm publish

# 5. Push the version bump commit + tag
git push && git push --tags
```

## Verify

```bash
# Check the published version
npm info scalereach-mcp version

# Test it works
SCALEREACH_API_KEY=sr_live_xxx npx scalereach-mcp@latest
```

## Notes

- `prepublishOnly` in package.json auto-runs `bun run build` before publish
- The `bin` entry maps `scalereach-mcp` CLI command to `dist/setup.js`
- Only `dist/`, `README.md`, and `LICENSE` are included in the npm package (see `files` in package.json)
- After publishing, users get the update on next `npx scalereach-mcp` run (or with `@latest`)
