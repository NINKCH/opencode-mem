# opencode-mem

OpenCode plugin for persistent local memory - **fully offline, no API keys required**.

Your AI agent remembers what you tell it - across sessions, across projects.

## Features

- **100% Local** - All data stored locally, no cloud dependencies
- **No API Keys** - No registration, no subscription, completely free
- **Offline Capable** - Works without internet after initial model download
- **Semantic Search** - Find relevant memories using natural language
- **Cross-Session Memory** - Agent remembers across conversations
- **User & Project Scopes** - Separate memories for different contexts
- **Multi-language** - Supports 100+ languages including Chinese

## Installation

```bash
# Install plugin
bunx github:NINKCH/opencode-mem install

# Initialize storage
bunx github:NINKCH/opencode-mem init

# Restart OpenCode
opencode -c
```

## Usage

### Automatic Memory Injection

When you start a new conversation, the plugin automatically injects relevant context:

```
User: Help me add a new API endpoint

[Agent receives]:
[LOCAL-MEMORY]

User Profile:
- Prefers concise responses
- Expert in TypeScript

Project Knowledge:
- [100%] Uses Bun runtime
- [100%] API routes in /src/api
- [100%] Uses Hono framework

Relevant Memories:
- [85%] REST API follows JSON:API spec
- [78%] Authentication uses JWT
```

### Saving Memories

Use keywords to trigger automatic saving:

```
User: Remember that this project uses bun instead of npm
Agent: [Automatically saves to project memory]
```

**Supported keywords:** `remember`, `memorize`, `save this`, `note this`, `keep in mind`, `don't forget`, `learn this`, `记住`, `记下`, `别忘了`

### Tool Commands

The agent can use the `local-memory` tool:

| Mode | Args | Description |
|------|------|-------------|
| `add` | `content`, `type?`, `scope?` | Store a new memory |
| `search` | `query`, `scope?` | Search memories |
| `list` | `scope?`, `limit?` | List all memories |
| `forget` | `memoryId` | Delete a memory |
| `profile` | | View user profile |

**Scopes:** `user` (cross-project), `project` (default)

**Types:** `preference`, `project-config`, `architecture`, `error-solution`, `learned-pattern`, `conversation`

## CLI Commands

```bash
opencode-mem install              # Install plugin
opencode-mem init                 # Initialize storage
opencode-mem status               # Show status
opencode-mem memories list        # List memories
opencode-mem memories search "x"  # Search memories
opencode-mem memories add "text"  # Add memory manually
opencode-mem memories forget <id> # Delete memory
opencode-mem export backup.json   # Export memories
opencode-mem import backup.json   # Import memories
opencode-mem logs                 # View recent logs
```

## Configuration

Create `~/.config/opencode/memory.json`:

```json
{
  "storageLocation": "user",
  "similarityThreshold": 0.6,
  "maxMemories": 5,
  "maxProjectMemories": 10,
  "maxProfileItems": 5,
  "injectProfile": true,
  "keywordPatterns": ["记住", "save this"],
  "compactionThreshold": 0.8
}
```

### Storage Location

- `user`: Store in `~/.local/share/opencode-memory/` (default)
- `project`: Store in `.opencode-memory/` in project directory

## Technical Details

### Embedding Model

- **Model:** `Xenova/paraphrase-multilingual-MiniLM-L12-v2`
- **Size:** ~420MB (downloaded once, cached locally)
- **Dimensions:** 384
- **Languages:** 100+ languages including Chinese, English, Japanese

### Storage

- **Vector Store:** SQLite + in-memory cosine similarity
- **Location:** `~/.local/share/opencode-memory/`

### Performance

| Operation | Time |
|-----------|------|
| First model load | ~5-10s |
| Subsequent loads | ~1-2s |
| Single embedding | ~50-100ms |
| Memory search | ~10-50ms |

## Requirements

- Node.js 18+ or Bun
- ~500MB disk space (for embedding model)

## Comparison with opencode-supermemory

| Feature | opencode-supermemory | opencode-mem |
|---------|---------------------|--------------|
| API Key | Required | **Not required** |
| Data Storage | Cloud | **Local** |
| Cost | Paid | **Free** |
| Privacy | Data on cloud | **100% local** |
| Offline | No | **Yes** |
| Model | Cloud embedding | **Local embedding** |

## Development

```bash
git clone https://github.com/NINKCH/opencode-mem.git
cd opencode-mem
bun install --ignore-scripts
bun run build
```

## License

MIT
