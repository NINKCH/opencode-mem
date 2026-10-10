# @ninkch/opencode-mem

OpenCode plugin for persistent local memory - **fully offline, no API keys required**.

Your AI agent remembers what you tell it - across sessions, across projects.

## Features

- **100% Local** - All data stored locally, no cloud dependencies
- **No API Keys** - No registration, no subscription, completely free
- **Offline Capable** - Works without internet after initial model download
- **Hybrid Search** - Semantic similarity blended with keyword overlap (great for mixed Chinese/English queries)
- **Self-Maintaining** - Duplicate memories merge on write, restated facts version the old ones, unused memories decay
- **Reflection** - Raw session notes get distilled into durable patterns over time (promotion chain)
- **Cross-Session Memory** - Agent remembers across conversations
- **Multi-language** - Supports 100+ languages including Chinese

## Installation

### Option 1: Install from npm

```bash
npm install -g @ninkch/opencode-mem
opencode-mem install
opencode-mem init
opencode -c
```

### Option 2: Local Clone

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

**Scopes:**
- `user` - Cross-project preferences (e.g., "I prefer concise responses", "Use 2-space indentation")
- `project` - Project-specific knowledge (default, e.g., "Architecture uses microservices", "API key in .env")

## CLI Commands

```bash
opencode-mem install              # Install plugin
opencode-mem init                 # Initialize storage
opencode-mem status               # Show status
opencode-mem memories list        # List current project memories
opencode-mem memories list --all  # List ALL project memories (cross-project)
opencode-mem memories list --project <name>  # List specific project memories
opencode-mem memories list --scope user  # List user preferences
opencode-mem memories show <id>   # Show memory details with path
opencode-mem memories search "x"  # Search memories (user + project scopes)
opencode-mem memories search "x" --scope user      # Search only user preferences
opencode-mem memories search "x" --threshold 0.4   # Lower the similarity bar
opencode-mem memories add "text"  # Add project memory
opencode-mem memories add "text" --scope user  # Add user preference
opencode-mem memories clear --force # Delete all memories
opencode-mem export backup.json   # Export memories
opencode-mem import backup.json   # Import memories
```

## Scopes

The memory system uses two scopes to organize memories:

### User Scope (`--scope user`)
- **Purpose**: Cross-project preferences and knowledge
- **Examples**: "I prefer concise responses", "Use 2-space indentation", "Always add comments"
- **Storage**: No project association (projectName=null)
- **Query**: Available in ALL projects

### Project Scope (default, `--scope project`)
- **Purpose**: Project-specific knowledge and configurations
- **Examples**: "API routes in /src/api", "Uses PostgreSQL database", "Error in module X"
- **Storage**: Associated with project name and path
- **Query**: Available only in the current project (by default)

### Cross-Project Query
Use `--all` flag to list memories from ALL projects:
```bash
opencode-mem memories list --all
```

This ignores the project tag and shows memories from all projects.

## Configuration

Create `~/.config/opencode/memory.json`:

```json
{
  "similarityThreshold": 0.6,
  "maxMemories": 5,
  "keywordPatterns": ["记住", "save this"],
  "hybridSearch": true,
  "keywordWeight": 0.3,
  "dedupThreshold": 0.85,
  "supersedeThreshold": 0.65,
  "decayEnabled": true,
  "decayHalfLifeDays": 90,
  "perMessageRetrieval": false,
  "perMessageMaxMemories": 3,
  "reflectionEnabled": true,
  "reflectionThreshold": 10
}
```

### Retrieval & Lifecycle Options

- `hybridSearch` — blend semantic similarity with keyword overlap (works well for Chinese + English mixed queries). `keywordWeight` controls the blend (0-1).
- `dedupThreshold` — when adding a memory whose similarity to an existing one is >= this value, the existing memory is updated (merged) instead of creating a duplicate row.
- `decayEnabled` / `decayHalfLifeDays` — search scores are attenuated by time since the memory was last accessed; every retrieval bumps `access_count`, and frequently recalled memories resist decay (rehearsal effect).
- `perMessageRetrieval` — by default memories are injected once, on the first message of a session. Set this to `true` to also search memories relevant to **every** user message and inject matches on the fly (`perMessageMaxMemories` caps how many, default 3).
- `supersedeThreshold` — when a new memory restates an existing fact (similarity in the `supersedeThreshold`–`dedupThreshold` band, defaults 0.65–0.85), all superseded rows are kept as history (`superseded_at` set) and the new row links back via `metadata.supersedes`. Search and lists return only current facts; exact duplicates (>= `dedupThreshold`) merge in place. Thresholds are calibrated for the default multilingual embedding model: related facts cluster at 0.63–0.85 cosine while unrelated ones stay below ~0.2.
- `reflectionEnabled` / `reflectionThreshold` — promotion chain: when a project accumulates >= `reflectionThreshold` (default 10) raw `conversation` memories, the plugin nudges the agent to distill them into durable `learned-pattern` / `architecture` / `error-solution` memories and forget the raw ones.

## Requirements

- Node.js 18+ or Bun
- ~500MB disk space (for embedding model)
- Embeddings run on [transformers.js v3](https://github.com/huggingface/transformers.js) (ONNX, fully local)

## Comparison

| Feature | opencode-supermemory | @ninkch/opencode-mem |
|---------|---------------------|----------------------|
| API Key | Required | **Not required** |
| Data Storage | Cloud | **Local** |
| Cost | Paid | **Free** |
| Offline | No | **Yes** |

## How Memory Evolves

Memories are not an append-only log. Four mechanisms keep the store clean and increasingly useful:

```
 write            write                 retrieve              accumulate
   │                │                      │                      │
   ▼                ▼                      ▼                      ▼
 ┌─────────┐  ┌───────────┐  ┌──────────────────┐  ┌─────────────────────┐
 │  MERGE  │  │ SUPERSEDE │  │ REINFORCE / DECAY │  │ REFLECTION PROMOTION │
 │ sim≥0.85│  │ 0.65–0.85 │  │ access_count ↑    │  │ conversation →       │
 │ (update │  │ (version  │  │ decay ∝ half-life │  │ learned-pattern      │
 │  in place)│ chain)    │  │ since last access │  │ (agent distills)     │
 └─────────┘  └───────────┘  └──────────────────┘  └─────────────────────┘
```

1. **Merge on write** — adding a memory whose cosine similarity to an existing one is >= `dedupThreshold` (0.85) updates that row in place instead of piling up duplicates. Duplicate variants converge automatically.
2. **Fact versioning** — a restated fact (similarity in the `supersedeThreshold`–`dedupThreshold` band, 0.65–0.85) marks the old rows as history (`superseded_at` set) and links back via `metadata.supersedes`. Search and lists return only current facts, but the old versions stay queryable — so "what was true before the change?" remains answerable. Thresholds are calibrated for the default multilingual embedding model: related facts cluster at 0.63–0.85 cosine while unrelated ones stay below ~0.2.
3. **Reinforcement & decay** — every retrieval bumps `access_count` and refreshes `last_accessed_at`. Search scores decay with a half-life (`decayHalfLifeDays`, default 90) measured from the last access, and each past access grants "half a half-life" of immunity — frequently recalled memories resist decay (rehearsal effect).
4. **Reflection promotion** — when a project accumulates >= `reflectionThreshold` (default 10) raw `conversation` memories, the plugin nudges the agent to distill them into durable `learned-pattern` / `architecture` / `error-solution` memories and delete the raw ones. The store gets sharper the longer you use it.

Every stored memory is stamped with `metadata.embedding_model`, so a future embedding-model swap can detect stale vectors and trigger a full re-embed.

## Architecture

```
src/
├── index.ts                  # Plugin entry: injection hooks, local-memory tool, nudges
├── cli.ts                    # CLI implementation
├── config.ts                 # Config loading (JSONC), validation, defaults
├── types/index.ts            # Types & DEFAULT_CONFIG
└── services/
    ├── store.ts              # SQLite (sql.js) storage, hybrid search, merge/supersede, decay
    ├── embedding.ts          # transformers.js v3 (ONNX) local embeddings, model preload
    ├── tags.ts               # user_<hash> / project_<hash> container tags
    ├── context.ts            # Prompt formatting, user profile
    ├── privacy.ts            # <private> tag stripping
    ├── compaction.ts         # context_window_limit_reached → session summary memory
    └── logger.ts             # Persistent logging
```

Retrieval scoring: `(1 - keywordWeight) × cosine + keywordWeight × keywordOverlap`, then attenuated by the rehearsal-aware decay factor. Keyword matching tokenizes Latin words and CJK character bigrams, so mixed Chinese/English queries work.

## Release

Releases are published to npm by [GitHub Actions](.github/workflows/publish.yml) via **OIDC Trusted Publishing** (no `NPM_TOKEN` secret needed — the npm ↔ GitHub connection validates automatically):

```bash
npm version minor    # bumps package.json, creates a v* tag
git push origin main --follow-tags
```

The workflow typechecks, builds, and publishes. Requires npm >= 11.5.1 in CI (the workflow pins this).

## Smoke Test

`node smoke-test.mjs` stubs the embedding model and verifies the full memory lifecycle: merge-on-write, supersede chains, hybrid search, reinforcement counters, and decay. 15 checks, no network needed.

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
