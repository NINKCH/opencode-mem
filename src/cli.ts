#!/usr/bin/env node

import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";

const CONFIG_DIR = join(homedir(), ".config", "opencode");
const OPENCODE_CONFIG = join(CONFIG_DIR, "opencode.jsonc");
const OPENCODE_CONFIG_JSON = join(CONFIG_DIR, "opencode.json");
const DATA_DIR = join(homedir(), ".local", "share", "opencode-memory");
const PLUGIN_NAME = "opencode-mem";

function stripJsoncComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .trim();
}

function readJsonc(path: string): any {
  const content = readFileSync(path, "utf-8");
  return JSON.parse(stripJsoncComments(content));
}

function writeJson(path: string, data: any): void {
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

function getOpenCodeConfigPath(): string | null {
  if (existsSync(OPENCODE_CONFIG)) return OPENCODE_CONFIG;
  if (existsSync(OPENCODE_CONFIG_JSON)) return OPENCODE_CONFIG_JSON;
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getDirSize(dir: string): number {
  let size = 0;
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  return size;
}

const commands: Record<string, (args: string[]) => Promise<void>> = {
  install: async () => {
    console.log(`\n  Installing ${PLUGIN_NAME}...\n`);

    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }

    const configPath = getOpenCodeConfigPath();
    let config: any = {};

    if (configPath && existsSync(configPath)) {
      try {
        config = readJsonc(configPath);
      } catch (e) {
        console.log("  Warning: Could not parse existing config");
      }
    }

    if (!config.plugin) {
      config.plugin = [];
    }

    if (!Array.isArray(config.plugin)) {
      config.plugin = [config.plugin];
    }

    if (config.plugin.includes(PLUGIN_NAME)) {
      console.log(`  ✓ ${PLUGIN_NAME} is already installed\n`);
      return;
    }

    config.plugin.push(PLUGIN_NAME);

    const targetPath = configPath || OPENCODE_CONFIG_JSON;
    writeJson(targetPath, config);

    console.log(`  ✓ Registered plugin in ${targetPath}`);
    console.log(`  ✓ Created data directory: ${DATA_DIR}\n`);
    console.log(`  Next steps:`);
    console.log(`  1. Run '${PLUGIN_NAME} init' to download the embedding model`);
    console.log(`  2. Restart OpenCode with: opencode -c\n`);
  },

  init: async () => {
    console.log(`\n  Initializing ${PLUGIN_NAME}...\n`);

    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    console.log(`  ✓ Data directory created: ${DATA_DIR}`);
    console.log(`\n  The embedding model will be downloaded automatically on first use.`);
    console.log(`  Model: Xenova/paraphrase-multilingual-MiniLM-L12-v2 (~420MB)\n`);
    console.log(`  ✓ Initialization complete!\n`);
    console.log(`  Restart OpenCode to use local memory:`);
    console.log(`    opencode -c\n`);
  },

  status: async () => {
    console.log(`\n  ${PLUGIN_NAME} Status\n`);

    const configPath = getOpenCodeConfigPath();
    let installed = false;

    if (configPath && existsSync(configPath)) {
      try {
        const config = readJsonc(configPath);
        installed = config.plugin?.includes?.(PLUGIN_NAME) || false;
      } catch {}
    }

    console.log(`  Plugin: ${installed ? "✓ Installed" : "✗ Not installed"}`);
    console.log(`  Data Directory: ${DATA_DIR}`);
    console.log(`  Exists: ${existsSync(DATA_DIR) ? "✓" : "✗"}`);

    const dbPath = join(DATA_DIR, "data.db");
    if (existsSync(dbPath)) {
      const dbStats = statSync(dbPath);
      console.log(`  Database: ${formatBytes(dbStats.size)}`);
    }

    const modelsDir = join(DATA_DIR, "models");
    if (existsSync(modelsDir)) {
      const modelSize = getDirSize(modelsDir);
      console.log(`  Model Cache: ${formatBytes(modelSize)}`);
    }

    console.log();
  },

  config: async (args: string[]) => {
    const subCommand = args[0];

    if (subCommand === "show" || !subCommand) {
      const configPath = join(CONFIG_DIR, "memory.json");
      console.log(`\n  Config file: ${configPath}\n`);

      if (existsSync(configPath)) {
        console.log(readFileSync(configPath, "utf-8"));
      } else {
        console.log("  No config file found. Using defaults.\n");
      }
    } else if (subCommand === "set") {
      const key = args[1];
      const value = args[2];

      if (!key || !value) {
        console.log("  Usage: config set <key> <value>\n");
        return;
      }

      const configPath = join(CONFIG_DIR, "memory.json");
      let config: any = {};

      if (existsSync(configPath)) {
        config = JSON.parse(readFileSync(configPath, "utf-8"));
      }

      if (value === "true") config[key] = true;
      else if (value === "false") config[key] = false;
      else if (!isNaN(Number(value))) config[key] = Number(value);
      else config[key] = value;

      if (!existsSync(CONFIG_DIR)) {
        mkdirSync(CONFIG_DIR, { recursive: true });
      }

      writeJson(configPath, config);
      console.log(`\n  ✓ Set ${key} = ${value}\n`);
    } else if (subCommand === "edit") {
      const configPath = join(CONFIG_DIR, "memory.json");
      const editor = process.env.EDITOR || process.env.VISUAL || "nano";
      const { execSync } = require("node:child_process");
      execSync(`${editor} ${configPath}`, { stdio: "inherit" });
    }
  },

  memories: async (args: string[]) => {
    const subCommand = args[0];

    const { getStore } = await import("./services/store.js");
    const store = getStore();

    if (subCommand === "list") {
      const scope = args.includes("--scope") ? args[args.indexOf("--scope") + 1] : undefined;
      const limit = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1]) : 20;

      const tag = scope === "user" ? `${PLUGIN_NAME}_user_default` : `${PLUGIN_NAME}_project_default`;
      const memories = await store.listMemories(tag, limit);

      console.log(`\n  Memories (${scope || "all"}): ${memories.length}\n`);

      if (memories.length === 0) {
        console.log("  No memories found.\n");
        return;
      }

      memories.forEach((m, i) => {
        const date = new Date(m.createdAt).toLocaleDateString();
        console.log(`  ${i + 1}. [${m.type}] ${m.content.slice(0, 60)}${m.content.length > 60 ? "..." : ""}`);
        console.log(`     ID: ${m.id} | ${date}\n`);
      });
    } else if (subCommand === "search") {
      const query = args[1];
      if (!query) {
        console.log("  Usage: memories search <query>\n");
        return;
      }

      const tag = `${PLUGIN_NAME}_project_default`;
      const results = await store.searchMemories(query, tag, { limit: 10 });

      console.log(`\n  Search results for "${query}": ${results.length}\n`);

      results.forEach((r, i) => {
        const similarity = Math.round(r.similarity * 100);
        console.log(`  ${i + 1}. [${similarity}%] ${r.content.slice(0, 60)}${r.content.length > 60 ? "..." : ""}`);
        console.log(`     ID: ${r.id}\n`);
      });
    } else if (subCommand === "add") {
      const content = args.slice(1).join(" ");
      if (!content) {
        console.log("  Usage: memories add <content>\n");
        return;
      }

      const tag = `${PLUGIN_NAME}_project_default`;
      const memory = await store.addMemory({
        content,
        scope: "project",
        type: "learned-pattern",
        containerTag: tag,
      });

      console.log(`\n  ✓ Memory added with ID: ${memory.id}\n`);
    } else if (subCommand === "forget") {
      const id = args[1];
      if (!id) {
        console.log("  Usage: memories forget <id>\n");
        return;
      }

      const deleted = await store.deleteMemory(id);
      if (deleted) {
        console.log(`\n  ✓ Memory ${id} deleted\n`);
      } else {
        console.log(`\n  ✗ Memory not found\n`);
      }
    } else if (subCommand === "clear") {
      const confirmed = args.includes("--force");
      if (!confirmed) {
        console.log("  This will delete ALL memories. Use --force to confirm.\n");
        return;
      }

      const count = await store.clearMemories();
      console.log(`\n  ✓ Cleared ${count} memories\n`);
    } else {
      console.log(`
  Memory Commands:
  
    list [--scope <user|project>] [--limit <n>]   List memories
    search <query>                                 Search memories
    add <content>                                  Add a memory
    forget <id>                                    Delete a memory
    clear --force                                  Delete all memories
`);
    }
  },

  export: async (args: string[]) => {
    const outputPath = args[0] || "memories-export.json";

    const { getStore } = await import("./services/store.js");
    const store = getStore();
    const stats = await store.getStats();

    const memories = {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
      stats,
      memories: [] as any[],
    };

    const tag = `${PLUGIN_NAME}_project_default`;
    const allMemories = await store.listMemories(tag, 1000);
    memories.memories = allMemories;

    writeFileSync(outputPath, JSON.stringify(memories, null, 2), "utf-8");
    console.log(`\n  ✓ Exported ${allMemories.length} memories to ${outputPath}\n`);
  },

  import: async (args: string[]) => {
    const inputPath = args[0];
    if (!inputPath || !existsSync(inputPath)) {
      console.log("  Usage: import <file>\n");
      return;
    }

    const data = JSON.parse(readFileSync(inputPath, "utf-8"));

    const { getStore } = await import("./services/store.js");
    const store = getStore();

    let imported = 0;
    const tag = `${PLUGIN_NAME}_project_default`;

    for (const mem of data.memories || []) {
      await store.addMemory({
        content: mem.content,
        scope: mem.scope || "project",
        type: mem.type || "learned-pattern",
        containerTag: tag,
      });
      imported++;
    }

    console.log(`\n  ✓ Imported ${imported} memories\n`);
  },

  model: async (args: string[]) => {
    const subCommand = args[0];

    if (subCommand === "clear-cache") {
      const modelsDir = join(DATA_DIR, "models");
      if (existsSync(modelsDir)) {
        const { rmSync } = require("node:fs");
        rmSync(modelsDir, { recursive: true });
        console.log(`\n  ✓ Model cache cleared\n`);
      } else {
        console.log(`\n  No model cache found\n`);
      }
    } else {
      console.log(`
  Model Commands:
  
    clear-cache    Clear the embedding model cache
`);
    }
  },

  logs: async () => {
    const logFile = join(DATA_DIR, "opencode-mem.log");
    if (existsSync(logFile)) {
      const content = readFileSync(logFile, "utf-8");
      const lines = content.split("\n").slice(-50);
      console.log(`\n  Last 50 log lines:\n`);
      lines.forEach((line) => console.log(`  ${line}`));
    } else {
      console.log("\n  No logs found\n");
    }
  },

  help: async () => {
    console.log(`
  ${PLUGIN_NAME} - Local persistent memory for OpenCode

  Usage: ${PLUGIN_NAME} <command> [options]

  Commands:

    install                Install plugin to OpenCode
    init                   Initialize storage and download model
    status                 Show plugin status
    config [show|set|edit] Manage configuration
    memories <cmd>         Manage memories (list, search, add, forget, clear)
    export [file]          Export memories to JSON
    import <file>          Import memories from JSON
    model <cmd>            Model management (clear-cache)
    logs                   View recent logs
    help                   Show this help

  Examples:

    ${PLUGIN_NAME} install
    ${PLUGIN_NAME} init
    ${PLUGIN_NAME} memories list --scope project
    ${PLUGIN_NAME} memories search "build error"
    ${PLUGIN_NAME} export my-memories.json

  More info: https://github.com/opencode-mem/opencode-mem
`);
  },
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  if (commands[command]) {
    await commands[command](args.slice(1));
  } else {
    console.log(`\n  Unknown command: ${command}`);
    console.log(`  Run '${PLUGIN_NAME} help' for usage.\n`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`\n  Error: ${e.message}\n`);
  process.exit(1);
});
