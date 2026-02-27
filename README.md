# @ninkch/opencode-mem

OpenCode plugin for persistent local memory - **fully offline, no API keys required**.

Your AI agent remembers what you tell it - across sessions, across projects.

## Features

- **100% Local** - All data stored locally, no cloud dependencies
- **No API Keys** - No registration, no subscription, completely free
- **Offline Capable** - Works without internet after initial model download
- **Semantic Search** - Find relevant memories using natural language
- **Cross-Session Memory** - Agent remembers across conversations
- **Multi-language** - Supports 100+ languages including Chinese

## Installation

### Option 1: Install from GitHub (Recommended)

```bash
bunx github:NINKCH/opencode-mem install
bunx github:NINKCH/opencode-mem init
opencode -c
```

### Option 2: Install from npm

```bash
npm install -g @ninkch/opencode-mem
opencode-mem install
opencode-mem init
opencode -c
```

### Option 3: Local Clone

```bash
git clone https://github.com/NINKCH/opencode-mem.git
cd opencode-mem
npm install
npm run build
node dist/cli.js install
node dist/cli.js init
opencode -c
```

## Usage

### Automatic Memory Injection

When you start a new conversation, the plugin automatically injects relevant context:

```
User: Help me add a new API endpoint

[Agent receives]:
[LOCAL-MEMORY]

Project Knowledge:
- [100%] Uses Bun runtime
- [100%] API routes in /src/api

Relevant Memories:
- [85%] REST API follows JSON:API spec
```

### Saving Memories

Use keywords to trigger automatic saving:

```
User: Remember that this project uses bun instead of npm
Agent: [Automatically saves to project memory]
```

**Supported keywords:** `remember`, `save this`, `don't forget`, `learn this`, `记住`, `记下`

### Tool Commands

The agent can use the `local-memory` tool:

| Mode | Description |
|------|-------------|
| `add` | Store a new memory |
| `search` | Search memories |
| `list` | List all memories |
| `forget` | Delete a memory |
| `profile` | View user profile |

**Scopes:** `user` (cross-project), `project` (default)

## CLI Commands

```bash
opencode-mem install              # Install plugin
opencode-mem init                 # Initialize storage
opencode-mem status               # Show status
opencode-mem memories list        # List memories
opencode-mem memories search "x"  # Search memories
opencode-mem memories add "text"  # Add memory
opencode-mem memories clear --force # Delete all memories
opencode-mem export backup.json   # Export memories
opencode-mem import backup.json   # Import memories
```

## Configuration
Create `~/.config/opencode/memory.json`:

```json
{
  "similarityThreshold": 0.6,
  "maxMemories": 5,
  "keywordPatterns": ["记住", "save this"]
}
```

## Requirements
- Node.js 18+ or Bun
- ~500MB disk space (for embedding model)

## Comparison
| Feature | opencode-supermemory | @ninkch/opencode-mem |
|---------|---------------------|----------------------|
| API Key | Required | **Not required** |
| Data Storage | Cloud | **Local** |
| Cost | Paid | **Free** |
| Offline | No | **Yes** |

## Development
```bash
git clone https://github.com/NINKCH/opencode-mem.git
cd opencode-mem
npm install
npm run build
npm run typecheck
```

## License
MIT
