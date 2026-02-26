import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { log } from "./logger.js";
import { embeddingService } from "./embedding.js";
import type { Memory, MemorySearchResult, MemoryStore } from "../types/index.js";

const DATA_DIR_USER = join(homedir(), ".local", "share", "opencode-memory");
const DB_NAME = "data.db";

function generateId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

let SQL: SqlJsStatic | null = null;

async function initSql(): Promise<SqlJsStatic> {
  if (SQL) return SQL;
  SQL = await initSqlJs({});
  return SQL;
}

export class LocalMemoryStore implements MemoryStore {
  private db!: Database;
  private dataDir: string;
  private dbPath: string;
  private initialized = false;
  private sqlReady = false;

  constructor(storageLocation: "user" | "project" = "user", projectPath?: string) {
    if (storageLocation === "project" && projectPath) {
      this.dataDir = join(projectPath, ".opencode-memory");
    } else {
      this.dataDir = DATA_DIR_USER;
    }

    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }

    this.dbPath = join(this.dataDir, DB_NAME);
    this.initialized = true;
    log("Memory store created", { dataDir: this.dataDir, dbPath: this.dbPath });
  }

  private async initDatabase(): Promise<void> {
    if (this.sqlReady) return;

    const sql = await initSql();

    if (existsSync(this.dbPath)) {
      const buffer = readFileSync(this.dbPath);
      this.db = new sql.Database(buffer);
    } else {
      this.db = new sql.Database();
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS memories (
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
      )
    `);

    this.db.run(`CREATE INDEX IF NOT EXISTS idx_container_tag ON memories(container_tag)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_scope ON memories(scope)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_created_at ON memories(created_at)`);

    this.saveDatabase();
    this.sqlReady = true;
    log("Database initialized", { dataDir: this.dataDir });
  }

  private saveDatabase(): void {
    if (!this.db) return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    writeFileSync(this.dbPath, buffer);
  }

  async addMemory(memory: Omit<Memory, "id" | "createdAt" | "updatedAt">): Promise<Memory> {
    await this.initDatabase();

    const id = generateId();
    const now = Date.now();

    let vector: number[] | undefined;
    try {
      vector = await embeddingService.embedOne(memory.content);
    } catch (error) {
      log("Failed to generate embedding", { error: String(error) });
    }

    const vectorBlob = vector ? Buffer.from(new Float32Array(vector).buffer) : null;
    const metadataJson = memory.metadata ? JSON.stringify(memory.metadata) : null;

    this.db.run(
      `INSERT INTO memories (id, content, vector, scope, type, container_tag, project_name, project_path, created_at, updated_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        memory.content,
        vectorBlob,
        memory.scope,
        memory.type,
        memory.containerTag,
        memory.projectName || null,
        memory.projectPath || null,
        now,
        now,
        metadataJson,
      ]
    );

    this.saveDatabase();
    log("Memory added", { id, scope: memory.scope, type: memory.type });

    return {
      id,
      content: memory.content,
      vector,
      scope: memory.scope,
      type: memory.type,
      containerTag: memory.containerTag,
      projectName: memory.projectName,
      projectPath: memory.projectPath,
      createdAt: now,
      updatedAt: now,
      metadata: memory.metadata,
    };
  }

  async getMemory(id: string): Promise<Memory | null> {
    await this.initDatabase();

    const result = this.db.exec("SELECT * FROM memories WHERE id = ?", [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    return this.rowToMemory(result[0].columns, result[0].values[0]);
  }

  async searchMemories(
    query: string,
    containerTag: string,
    options?: { threshold?: number; limit?: number }
  ): Promise<MemorySearchResult[]> {
    await this.initDatabase();

    const threshold = options?.threshold ?? 0.6;
    const limit = options?.limit ?? 10;

    let queryVector: number[];
    try {
      queryVector = await embeddingService.embedOne(query);
    } catch (error) {
      log("Failed to generate query embedding", { error: String(error) });
      return [];
    }

    const result = this.db.exec(
      `SELECT id, content, vector, scope, type, created_at FROM memories WHERE container_tag = ? ORDER BY created_at DESC`,
      [containerTag]
    );

    if (result.length === 0) return [];

    const rows = result[0].values;
    const results: MemorySearchResult[] = [];

    for (const row of rows) {
      const vectorData = row[2] as Uint8Array;
      if (!vectorData) continue;

      const memoryVector = Array.from(new Float32Array(vectorData.buffer));
      const similarity = cosineSimilarity(queryVector, memoryVector);

      if (similarity >= threshold) {
        results.push({
          id: row[0] as string,
          content: row[1] as string,
          similarity,
          scope: row[3] as any,
          type: row[4] as any,
          createdAt: row[5] as number,
        });
      }
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }

  async listMemories(containerTag: string, limit = 20): Promise<Memory[]> {
    await this.initDatabase();

    const result = this.db.exec(
      `SELECT * FROM memories WHERE container_tag = ? ORDER BY created_at DESC LIMIT ?`,
      [containerTag, limit]
    );

    if (result.length === 0) return [];

    const columns = result[0].columns;
    return result[0].values.map((row) => this.rowToMemory(columns, row));
  }

  async deleteMemory(id: string): Promise<boolean> {
    await this.initDatabase();

    this.db.run("DELETE FROM memories WHERE id = ?", [id]);
    this.saveDatabase();

    log("Memory deleted", { id });
    return true;
  }

  async clearMemories(containerTag?: string): Promise<number> {
    await this.initDatabase();

    let count = 0;
    if (containerTag) {
      const result = this.db.exec("SELECT COUNT(*) FROM memories WHERE container_tag = ?", [containerTag]);
      count = result[0]?.values[0]?.[0] as number || 0;
      this.db.run("DELETE FROM memories WHERE container_tag = ?", [containerTag]);
    } else {
      const result = this.db.exec("SELECT COUNT(*) FROM memories");
      count = result[0]?.values[0]?.[0] as number || 0;
      this.db.run("DELETE FROM memories");
    }

    this.saveDatabase();
    log("Memories cleared", { containerTag, count });
    return count;
  }

  async getStats(): Promise<{ total: number; user: number; project: number }> {
    await this.initDatabase();

    const totalResult = this.db.exec("SELECT COUNT(*) FROM memories");
    const userResult = this.db.exec("SELECT COUNT(*) FROM memories WHERE scope = 'user'");
    const projectResult = this.db.exec("SELECT COUNT(*) FROM memories WHERE scope = 'project'");

    return {
      total: (totalResult[0]?.values[0]?.[0] as number) || 0,
      user: (userResult[0]?.values[0]?.[0] as number) || 0,
      project: (projectResult[0]?.values[0]?.[0] as number) || 0,
    };
  }

  private rowToMemory(columns: string[], row: any[]): Memory {
    const colIndex: Record<string, number> = {};
    columns.forEach((col, i) => {
      colIndex[col] = i;
    });

    let vector: number[] | undefined;
    const vectorData = row[colIndex["vector"]] as Uint8Array;
    if (vectorData) {
      vector = Array.from(new Float32Array(vectorData.buffer));
    }

    return {
      id: row[colIndex["id"]] as string,
      content: row[colIndex["content"]] as string,
      vector,
      scope: row[colIndex["scope"]] as any,
      type: row[colIndex["type"]] as any,
      containerTag: row[colIndex["container_tag"]] as string,
      projectName: row[colIndex["project_name"]] as string | undefined,
      projectPath: row[colIndex["project_path"]] as string | undefined,
      createdAt: row[colIndex["created_at"]] as number,
      updatedAt: row[colIndex["updated_at"]] as number,
      metadata: row[colIndex["metadata"]] ? JSON.parse(row[colIndex["metadata"]] as string) : undefined,
    };
  }

  getDataDir(): string {
    return this.dataDir;
  }

  close(): void {
    if (this.db) {
      this.saveDatabase();
      this.db.close();
      log("Memory store closed");
    }
  }
}

let storeInstance: LocalMemoryStore | null = null;

export function getStore(storageLocation: "user" | "project" = "user", projectPath?: string): LocalMemoryStore {
  if (!storeInstance) {
    storeInstance = new LocalMemoryStore(storageLocation, projectPath);
  }
  return storeInstance;
}

export function resetStore(): void {
  if (storeInstance) {
    storeInstance.close();
    storeInstance = null;
  }
}