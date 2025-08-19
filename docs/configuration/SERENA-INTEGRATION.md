# Serena MCP Integration

This project includes helpers to run Serena as an MCP server for enhanced, IDE-grade semantic code tools.

## Quick Start (Windows / PowerShell)

- Install uv (required for `uvx`): https://docs.astral.sh/uv/getting-started/installation/
- Start Serena in stdio mode (for IDE clients):
  - `npm run serena:start`
- Start Serena in SSE mode on port 9121:
  - `npm run serena:start:sse`
- Pre-index this repo for faster tools:
  - `npm run serena:index`

VS Code tasks:

- "🧠 Start Serena MCP (stdio)"
- "🧠 Start Serena MCP (SSE)"
- "📚 Serena: Index Project"

## Recommended Context & Modes

- Context: `ide-assistant`
- Modes to try: `planning`, `editing`, `interactive`

## Avoid Tool Collisions

Serena provides filesystem tools. To prevent collisions with the Filesystem MCP server, you can:

- Set `SERENA_ACTIVE=1` when running the Supercharged MCP Manager, which skips `server-filesystem`.
  - Example: `SERENA_ACTIVE=1 npm run mcp:supercharged`

## Project Activation

From the chat/client, ask Serena to activate the project:

- "Activate the project {absolute-path}" or "Activate the project wedding-website"

Optionally pre-index:

- `uvx --from git+https://github.com/oraios/serena serena project index`

## Notes

- Serena opens a local dashboard by default: http://localhost:24282/dashboard/index.html (port may increment).
- If Windows shows long diffs due to line endings, ensure: `git config --global core.autocrlf true`.
