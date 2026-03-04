# AGENTS.md - Development Guide for opencode-mem

## Project Overview

This is an OpenCode plugin for persistent local memory - fully offline, no API keys required. It provides semantic search and automatic context injection for coding sessions.

## Build Commands

```bash
# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run dev

# Type checking only (no emit)
npm run typecheck
```

### Running the CLI

```bash
# After building, run CLI commands
opencode-mem <command>

# Or directly via node
node dist/cli.js <command>
```

### Available CLI Commands

| Command | Description |
|---------|-------------|
| `opencode-mem install` | Install plugin to OpenCode |
| `opencode-mem init` | Initialize storage and download model |
| `opencode-mem status` | Show plugin status |
| `opencode-mem config [show\|set\|edit]` | Manage configuration |
| `opencode-mem memories list [--scope] [--all] [--project] [--limit]` | List memories |
| `opencode-mem memories show <id>` | Show memory details |
| `opencode-mem memories search <query>` | Search memories |
| `opencode-mem memories add <content> [--scope]` | Add a memory |
| `opencode-mem memories forget <id>` | Delete a memory |
| `opencode-mem memories clear --force` | Delete all memories |
| `opencode-mem export [file]` | Export memories to JSON |
| `opencode-mem import <file>` | Import memories from JSON |
| `opencode-mem model clear-cache` | Clear embedding model cache |
| `opencode-mem logs` | View recent logs |

## Code Style Guidelines

### TypeScript Configuration

The project uses strict TypeScript with ES2022 target. Key settings in `tsconfig.json`:

- `strict: true` - Full strict type checking
- `module: NodeNext` - ESM modules
- `moduleResolution: NodeNext` - Node-style resolution
- `esModuleInterop: true` - CommonJS interop

### Imports

```typescript
// Use node: protocol for built-in Node.js modules
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Use type imports for types
import type { Memory, MemorySearchResult, MemoryStore } from "../types/index.js";

// Use named imports for values
import { getStore } from "./services/store.js";
import { log } from "./services/logger.js";

// Always include .js extension for ESM imports
import { getTags } from "./services/tags.js";  // ✓
import { getTags } from "./services/tags";     // ✗
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `LocalMemoryStore` |
| Interfaces | PascalCase | `Memory`, `MemorySearchResult` |
| Types | PascalCase | `MemoryScope`, `MemoryType` |
| Functions | camelCase | `getStore()`, `generateId()` |
| Variables | camelCase | `storeInstance`, `queryVector` |
| Constants | UPPER_SNAKE_CASE | `DATA_DIR`, `DB_NAME` |
| Enums | PascalCase | `MemoryScope = "user" \| "project"` |
| File names | kebab-case | `store.ts`, `tags.ts` |

### Type Annotations

```typescript
// Explicit return types for functions
function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Use interfaces for object shapes
interface Memory {
  id: string;
  content: string;
  vector?: number[];
  scope: MemoryScope;
  type: MemoryType;
}

// Use type for unions and aliases
type MemoryScope = "user" | "project";
type MemoryType = "preference" | "project-config" | "architecture" | "error-solution" | "learned-pattern" | "conversation";
```

### Error Handling

```typescript
// Always handle errors with try/catch
try {
  const result = await someOperation();
} catch (error) {
  // Log errors with String(error) for safe conversion
  log("Operation failed", { error: String(error), context });
  return null;
}

// For user-facing errors, extract message safely
console.log(`Error: ${e instanceof Error ? e.message : String(e)}`);

// In catch blocks, prefer early return pattern
try {
  const config = readJsonc(configPath);
} catch (e) {
  console.log("Failed to parse config");
  return;  // Early return instead of nested else
}
```

### Logging

```typescript
// Use the logger service for persistent logging
import { log } from "./services/logger.js";

// Structured logging with context
log("Memory added", { id, scope: memory.scope, type: memory.type });
log("chat.message: processing", { messagePreview: userMessage.slice(0, 100) });
```

### Null/Undefined Handling

```typescript
// Use optional chaining and nullish coalescing
const projectName = memory.projectName ?? "unknown";
const size = stats?.size ?? 0;

// Check for null/undefined explicitly when needed
if (existsSync(DATA_DIR)) {
  // ...
}
```

### Async/Await

```typescript
// Always use async/await, avoid .then() chains
async function getMemory(id: string): Promise<Memory | null> {
  await this.initDatabase();
  const result = this.db.exec("SELECT * FROM memories WHERE id = ?", [id]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  return this.rowToMemory(result[0].columns, result[0].values[0]);
}

// Use Promise.all for parallel operations
const [userResult, projectResult] = await Promise.all([
  store.searchMemories(query, tags.user, options),
  store.searchMemories(query, tags.project, options),
]);
```

### Database Operations

```typescript
// Initialize database lazily
private async initDatabase(): Promise<void> {
  if (this.sqlReady) return;
  const sql = await initSql();
  // ... setup code
  this.sqlReady = true;
}

// Save after mutations
private saveDatabase(): void {
  if (!this.db) return;
  const data = this.db.export();
  const buffer = Buffer.from(data);
  writeFileSync(this.dbPath, buffer);
}

// Use parameterized queries to prevent SQL injection
this.db.run(
  `INSERT INTO memories (id, content) VALUES (?, ?)`,
  [id, content]
);
```

### CLI Commands Pattern

```typescript
const commands: Record<string, (args: string[]) => Promise<void>> = {
  commandName: async (args: string[]) => {
    // Implementation
  },
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  if (commands[command]) {
    await commands[command](args.slice(1));
  } else {
    console.log(`Unknown command: ${command}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
```

### Config Loading Pattern

```typescript
// Support both .json and .jsonc files
const CONFIG_FILES = [
  join(CONFIG_DIR, "memory.jsonc"),
  join(CONFIG_DIR, "memory.json"),
];

function loadConfig(): UserConfig {
  for (const path of CONFIG_FILES) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, "utf-8");
        const json = stripJsoncComments(content);  // Handle JSONC
        return JSON.parse(json) as UserConfig;
      } catch (error) {
        log("Failed to parse config", { path, error: String(error) });
      }
    }
  }
  return {};
}
```

### Private Fields and Methods

```typescript
export class LocalMemoryStore implements MemoryStore {
  private db!: Database;
  private dataDir: string;
  private dbPath: string;
  private initialized = false;
  private sqlReady = false;
}
```

## Project Structure

```
src/
├── index.ts           # Main plugin entry point
├── cli.ts             # CLI implementation
├── config.ts          # Configuration management
├── types/
│   └── index.ts       # TypeScript interfaces and types
└── services/
    ├── store.ts       # SQLite memory storage
    ├── embedding.ts   # Embedding service
    ├── tags.ts        # Tag generation
    ├── context.ts     # Context formatting
    ├── privacy.ts     # Privacy filtering
    ├── compaction.ts  # Memory compaction
    └── logger.ts      # Logging service
```

## Key Dependencies

- `@opencode-ai/plugin` - Plugin framework
- `@xenova/transformers` - Local embedding model
- `sql.js` - SQLite in JavaScript
- `sharp` - Image processing

## Database Schema

```sql
CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  vector BLOB,
  scope TEXT NOT NULL,
  type TEXT NOT NULL,
  container_tag TEXT NOT NULL,
  project_name TEXT,
  project_path TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  metadata TEXT
);

-- Indexes
CREATE INDEX idx_container_tag ON memories(container_tag);
CREATE INDEX idx_scope ON memories(scope);
CREATE INDEX idx_created_at ON memories(created_at);
CREATE INDEX idx_project_name ON memories(project_name);
```

## Tag Format

- **User tags**: `user_<sha256(email)[:16]>`
- **Project tags**: `<projectName>_<sha256(directory)[:16]>`

Project name is derived from `package.json` `name` field, or falls back to directory basename.

## Testing

This project does not currently have a test framework set up. When adding tests:

- Use Vitest for unit tests
- Keep tests in `__tests__/` directory
- Mock external dependencies (sql.js, embedding service)
- Test both success and error paths
