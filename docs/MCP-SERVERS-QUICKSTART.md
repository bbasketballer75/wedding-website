# MCP Servers Quickstart (Supercharged Manager)

This project includes a Windows-hardened MCP orchestrator at `scripts/mcp/supercharged-mcp-manager.mjs`.

Active servers (validated 2025-08-18):

- sequential-thinking: `npx -y @modelcontextprotocol/server-sequential-thinking`
- filesystem-enhanced: `npx -y @modelcontextprotocol/server-filesystem <allowedPath>`
- git-operations: `uvx mcp-server-git`
- web-fetch: `uvx mcp-server-fetch`
- time-management: `uvx mcp-server-time`
- memory-persistence: `npx -y @modelcontextprotocol/server-memory`
- everything: `npx -y @modelcontextprotocol/server-everything`
- browser-automation: `npx -y @playwright/mcp@latest --headless`

Notes:

- Python-based reference servers (git, fetch, time) run via `uvx` per official docs.
- On Windows, the manager uses `npx.cmd` and `shell:true` to avoid spawn issues.
- If `SERENA_ACTIVE=1`, the filesystem server is skipped to avoid tool collisions.
- To force all tools to run (including filesystem while Serena is active), set `BEAST_MODE_ALL_TOOLS=1`.

Run (PowerShell):

```
# From repo root
node scripts/mcp/supercharged-mcp-manager.mjs
```

With Serena active (skip filesystem):

```
$env:SERENA_ACTIVE="1"; node scripts/mcp/supercharged-mcp-manager.mjs
```

Force ALL tools (override Serena skip):

```
$env:BEAST_MODE_ALL_TOOLS="1"; node scripts/mcp/supercharged-mcp-manager.mjs
```

Reduce terminal output or avoid long-running loops:

```
# Quiet mode (less stdout/stderr)
node scripts/mcp/supercharged-mcp-manager.mjs --quiet

# Disable health and metrics loops
node scripts/mcp/supercharged-mcp-manager.mjs --no-health --no-metrics

# Short timed run (good for CI or quick checks)
node scripts/mcp/supercharged-mcp-manager.mjs --run-for 15 --quiet

# Tune intervals (ms)
node scripts/mcp/supercharged-mcp-manager.mjs --health-interval 60000 --metrics-interval 120000
```

NPM convenience scripts:

```
# Force all tools (overrides Serena skip)
npm run mcp:all

# Quiet and loop-free
npm run mcp:quiet

# Short CI run
npm run mcp:ci

# Headed Playwright
npm run mcp:headed

# Headed Chrome with extra Playwright arg
npm run mcp:headed:chrome
```

Playwright controls:

- `--headed`: removes the default `--headless` for the Playwright MCP.
- `--pw-arg <value>`: repeatable passthrough to Playwright MCP. Examples:
  - `--pw-arg --browser=chrome`
  - `--pw-arg --device="iPhone 15"`
  - `--pw-arg --caps=pdf`

Troubleshooting:

- Ensure `uv` is installed and on PATH (the manager worked with `uvx` during validation).
- First run may install Python packages (shown as "Installed X packages" logs).
- The manager writes a snapshot config to `.vscode/mcp-enhanced-config.json`.
