# opencode-mem

OpenCode plugin for persistent local memory - **fully offline, no API keys required**.

Your agent remembers what you tell it - across sessions, across projects.

## Features

- **100% Local** - All data stored locally, no cloud dependencies
- **No API Keys** - No registration, no subscription, completely free
- **Offline Capable** - Works without internet after initial model download
- **Semantic Search** - Find relevant memories using natural language
- **Cross-Session Memory** - Agent remembers across conversations
- **User & Project Scopes** - Separate memories for different contexts
- **Privacy First** - Data never leaves your machine

## Installation

### Option 1: Install from GitHub (Recommended)

```bash
bunx github:NINKCH/opencode-mem install
```

Then initialize:

```bash
bunx github:NINKCH/opencode-mem init
```

Replace `NINKCH` with your GitHub username.

Then initialize:

```bash
bunx github:NINKCH/opencode-mem init
```

Restart OpenCode:

```bash
opencode -c
```

### Option 2: Install from npm

```bash
bunx opencode-mem@latest install
```

Then initialize:

```bash
bunx opencode-mem@latest init
```

### Option 3: Manual Install (for development)

```bash
# Clone the repository
git clone https://github.com/NINKCH/opencode-mem.git
cd opencode-mem

# Install dependencies
bun install --ignore-scripts

# Build
bun run build

# Link locally
bun link

# Install to OpenCode
opencode-mem install
opencode-mem init
```

Or add directly to `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "plugin": ["file:///path/to/opencode-mem"]
}
```

## Usage

### In Conversation

The plugin automatically injects relevant context when you start a new conversation:

```
User: Help me add a new API endpoint

[Agent receives automatically]:
[LOCAL-MEMORY]

Project Knowledge:
- [100%] Uses Bun runtime
- [100%] API routes in /src/api
- [100%] Uses Hono framework

Relevant Memories:
- [85%] REST API follows JSON:API spec
- [78%] Authentication uses JWT
```

### Saving Memories

Use keywords like "remember" to trigger automatic memory saving:

```
User: Remember that this project uses bun instead of npm
Agent: [Automatically saves to project memory]
```

Supported keywords: `remember`, `memorize`, `save this`, `note this`, `keep in mind`, `don't forget`, `learn this`, `记住`, `记下`, `别忘了`

### Using the Tool

The agent has access to the `local-memory` tool:

| Mode | Args | Description |
|------|------|-------------|
| `add` | `content`, `type?`, `scope?` | Store memory |
| `search` | `query`, `scope?` | Search memories |
| `list` | `scope?`, `limit?` | List memories |
| `forget` | `memoryId` | Delete memory |
| `profile` | | View user profile |
| `help` | | Show usage guide |

**Scopes:** `user` (cross-project), `project` (default)

**Types:** `preference`, `project-config`, `architecture`, `error-solution`, `learned-pattern`, `conversation`

## CLI Commands

```bash
# Install plugin
opencode-mem install

# Initialize (download model)
opencode-mem init

# Show status
opencode-mem status

# List memories
opencode-mem memories list --scope project

# Search memories
opencode-mem memories search "build error"

# Add memory
opencode-mem memories add "This project uses Tailwind CSS"

# Delete memory
opencode-mem memories forget <id>

# Export/Import
opencode-mem export memories.json
opencode-mem import memories.json

# View logs
opencode-mem logs
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
  "containerTagPrefix": "opencode-mem",
  "keywordPatterns": ["记住", "记下来"],
  "compactionThreshold": 0.8
}
```

### Storage Location

- `user`: Store in `~/.local/share/opencode-memory/` (default)
- `project`: Store in `.opencode-memory/` in project directory

## Technical Details

### Embedding Model

- **Model**: `Xenova/paraphrase-multilingual-MiniLM-L12-v2`
- **Size**: ~420MB (downloaded once, cached locally)
- **Dimensions**: 384
- **Languages**: 100+ languages including Chinese, English, Japanese

### Storage

- **Vector Store**: SQLite + in-memory cosine similarity
- **Metadata**: SQLite database
- **Location**: `~/.local/share/opencode-memory/`

### Performance

| Operation | Time |
|-----------|------|
| First model load | ~5-10s |
| Subsequent loads | ~1-2s |
| Single embedding | ~50-100ms |
| Memory search | ~10-50ms |

## Comparison with opencode-supermemory

| Feature | opencode-supermemory | opencode-mem |
|---------|---------------------|--------------|
| API Key | Required | Not required |
| Data Storage | Cloud | Local |
| Cost | Paid | Free |
| Privacy | Data on cloud | 100% local |
| Offline | No | Yes |
| Model | Cloud embedding | Local embedding |

## Development

```bash
# Clone
git clone https://github.com/NINKCH/opencode-mem.git
cd opencode-mem

# Install dependencies (use --ignore-scripts to skip native builds)
bun install --ignore-scripts

# Build
bun run build

# Typecheck
bun run typecheck
```

## Logs

```bash
# View logs
tail -f ~/.local/share/opencode-memory/opencode-mem.log

# Or use the CLI
opencode-mem logs
```

## Publishing to npm

```bash
# Build
bun run build

# Publish
npm publish
```

After publishing, users can install with:

```bash
bunx opencode-mem@latest install
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
