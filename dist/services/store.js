import initSqlJs from "sql.js";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { log } from "./logger.js";
import { embeddingService, EMBEDDING_MODEL_ID } from "./embedding.js";
import { CONFIG } from "../config.js";
const DATA_DIR_USER = join(homedir(), ".local", "share", "opencode-memory");
const DB_NAME = "data.db";
function generateId() {
    return `mem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
function decodeVector(data) {
    // Use explicit byteOffset/length: sql.js may return views over a shared buffer.
    const floats = new Float32Array(data.buffer, data.byteOffset, data.byteLength / 4);
    return Array.from(floats);
}
function safeParseJson(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return undefined;
    }
}
// --- Hybrid retrieval helpers -------------------------------------------
const TOKEN_PATTERN = /[a-z0-9_]+|[\u4e00-\u9fff]+/g;
export function tokenize(text) {
    const tokens = [];
    for (const seg of text.toLowerCase().match(TOKEN_PATTERN) ?? []) {
        if (/^[\u4e00-\u9fff]+$/.test(seg)) {
            // CJK segments: index character bigrams (single chars are too ambiguous)
            if (seg.length === 1) {
                tokens.push(seg);
            }
            else {
                for (let i = 0; i < seg.length - 1; i++)
                    tokens.push(seg.slice(i, i + 2));
            }
        }
        else {
            tokens.push(seg);
        }
    }
    return tokens;
}
export function keywordScore(query, content) {
    const queryTokens = new Set(tokenize(query));
    if (queryTokens.size === 0)
        return 0;
    const contentTokens = new Set(tokenize(content));
    let hits = 0;
    for (const token of queryTokens) {
        if (contentTokens.has(token))
            hits++;
    }
    return hits / queryTokens.size;
}
function decayFactor(createdAt, updatedAt, accessCount, lastAccessedAt) {
    if (!CONFIG.decayEnabled)
        return 1;
    // Frequently accessed memories resist decay (rehearsal effect).
    const reference = Math.max(lastAccessedAt ?? 0, updatedAt || 0, createdAt || 0);
    const days = Math.max(0, (Date.now() - reference) / 86400000);
    const reinforcement = Math.log2(1 + Math.max(0, accessCount)) * 0.5; // each access adds half a half-life of immunity
    const halfLife = CONFIG.decayHalfLifeDays + reinforcement * CONFIG.decayHalfLifeDays;
    return Math.pow(0.5, days / halfLife);
}
let SQL = null;
async function initSql() {
    if (SQL)
        return SQL;
    SQL = await initSqlJs({});
    return SQL;
}
export class LocalMemoryStore {
    db;
    dataDir;
    dbPath;
    initialized = false;
    sqlReady = false;
    constructor(storageLocation = "user", projectPath) {
        if (storageLocation === "project" && projectPath) {
            this.dataDir = join(projectPath, ".opencode-memory");
        }
        else {
            this.dataDir = DATA_DIR_USER;
        }
        if (!existsSync(this.dataDir)) {
            mkdirSync(this.dataDir, { recursive: true });
        }
        this.dbPath = join(this.dataDir, DB_NAME);
        this.initialized = true;
        log("Memory store created", { dataDir: this.dataDir, dbPath: this.dbPath });
    }
    async initDatabase() {
        if (this.sqlReady)
            return;
        const sql = await initSql();
        if (existsSync(this.dbPath)) {
            const buffer = readFileSync(this.dbPath);
            this.db = new sql.Database(buffer);
        }
        else {
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
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_project_name ON memories(project_name)`);
        // Lightweight schema migration: add reinforcement columns to older databases.
        this.migrateColumn("access_count", "ALTER TABLE memories ADD COLUMN access_count INTEGER NOT NULL DEFAULT 0");
        this.migrateColumn("last_accessed_at", "ALTER TABLE memories ADD COLUMN last_accessed_at INTEGER");
        this.migrateColumn("superseded_at", "ALTER TABLE memories ADD COLUMN superseded_at INTEGER");
        this.saveDatabase();
        this.sqlReady = true;
        log("Database initialized", { dataDir: this.dataDir });
    }
    migrateColumn(column, ddl) {
        try {
            const result = this.db.exec("PRAGMA table_info(memories)");
            if (result.length > 0 && !result[0].columns.includes(column)) {
                this.db.run(ddl);
                log("Schema migrated", { added: column });
            }
        }
        catch (error) {
            log("Schema migration check failed", { column, error: String(error) });
        }
    }
    saveDatabase() {
        if (!this.db)
            return;
        const data = this.db.export();
        const buffer = Buffer.from(data);
        writeFileSync(this.dbPath, buffer);
    }
    async addMemory(memory) {
        await this.initDatabase();
        let vector;
        try {
            vector = await embeddingService.embedOne(memory.content);
        }
        catch (error) {
            log("Failed to generate embedding", { error: String(error) });
        }
        // --- Fact versioning: merge exact duplicates, supersede restated facts ---
        if (vector) {
            const candidates = this.findCandidates(memory.containerTag, vector);
            if (candidates.length > 0) {
                const best = candidates[0];
                const now = Date.now();
                if (best.similarity >= CONFIG.dedupThreshold) {
                    // Merge: update the winning row in place.
                    this.db.run(`UPDATE memories SET content = ?, vector = ?, type = ?, updated_at = ?, last_accessed_at = ? WHERE id = ?`, [memory.content, Buffer.from(new Float32Array(vector).buffer), memory.type, now, now, best.id]);
                    // Any other rows above the supersede band are covered by the merged fact.
                    for (const c of candidates.slice(1)) {
                        this.db.run(`UPDATE memories SET superseded_at = ? WHERE id = ?`, [now, c.id]);
                    }
                    this.saveDatabase();
                    log("Memory merged into existing", { id: best.id, merged: candidates.length - 1, similarity: best.similarity, scope: memory.scope });
                    return {
                        id: best.id,
                        content: memory.content,
                        vector,
                        scope: memory.scope,
                        type: memory.type,
                        containerTag: memory.containerTag,
                        projectName: memory.projectName,
                        projectPath: memory.projectPath,
                        createdAt: best.createdAt,
                        updatedAt: now,
                        accessCount: best.accessCount,
                        lastAccessedAt: now,
                        metadata: { merged: true, superseded: candidates.length - 1 },
                    };
                }
                // Supersede: the new statement replaces every row in the version band.
                const id = generateId();
                const priorMeta = best.metadata ?? {};
                const metadataJson = JSON.stringify({
                    ...memory.metadata,
                    embedding_model: EMBEDDING_MODEL_ID,
                    supersedes: candidates.map((c) => c.id),
                    supersedes_content: candidates.map((c) => c.content),
                });
                for (const c of candidates) {
                    this.db.run(`UPDATE memories SET superseded_at = ? WHERE id = ?`, [now, c.id]);
                }
                this.db.run(`INSERT INTO memories (id, content, vector, scope, type, container_tag, project_name, project_path, created_at, updated_at, metadata)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    id,
                    memory.content,
                    Buffer.from(new Float32Array(vector).buffer),
                    memory.scope,
                    memory.type,
                    memory.containerTag,
                    memory.projectName || null,
                    memory.projectPath || null,
                    now,
                    now,
                    metadataJson,
                ]);
                this.saveDatabase();
                log("Memory supersedes prior versions", { id, superseded: candidates.map((c) => c.id), similarity: best.similarity });
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
                    accessCount: 0,
                    lastAccessedAt: now,
                    metadata: JSON.parse(metadataJson),
                };
            }
        }
        const id = generateId();
        const now = Date.now();
        const vectorBlob = vector ? Buffer.from(new Float32Array(vector).buffer) : null;
        const metadataJson = JSON.stringify({
            ...memory.metadata,
            embedding_model: EMBEDDING_MODEL_ID,
        });
        this.db.run(`INSERT INTO memories (id, content, vector, scope, type, container_tag, project_name, project_path, created_at, updated_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        ]);
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
    async getMemory(id) {
        await this.initDatabase();
        const result = this.db.exec("SELECT * FROM memories WHERE id = ?", [id]);
        if (result.length === 0 || result[0].values.length === 0)
            return null;
        return this.rowToMemory(result[0].columns, result[0].values[0]);
    }
    findCandidates(containerTag, vector) {
        const result = this.db.exec(`SELECT id, vector, created_at, access_count, content, metadata FROM memories WHERE container_tag = ?`, [containerTag]);
        if (result.length === 0)
            return [];
        const candidates = [];
        for (const row of result[0].values) {
            const vectorData = row[1];
            if (!vectorData)
                continue;
            // Pure cosine for the versioning decision, calibrated on real
            // multilingual-embedding data: paraphrases cluster at 0.63-0.85 while
            // unrelated facts stay below ~0.2. (Lexical blending is only used for
            // search ranking — it misleads here because true paraphrases often
            // share few surface tokens.)
            const similarity = cosineSimilarity(vector, decodeVector(vectorData));
            if (similarity >= CONFIG.supersedeThreshold) {
                candidates.push({
                    id: row[0],
                    similarity,
                    createdAt: row[2],
                    accessCount: row[3] || 0,
                    content: row[4] || "",
                    metadata: row[5] ? safeParseJson(row[5]) : undefined,
                });
            }
        }
        candidates.sort((a, b) => b.similarity - a.similarity);
        return candidates;
    }
    async searchMemories(query, containerTag, options) {
        await this.initDatabase();
        const threshold = options?.threshold ?? 0.6;
        const limit = options?.limit ?? 10;
        let queryVector;
        try {
            queryVector = await embeddingService.embedOne(query);
        }
        catch (error) {
            log("Failed to generate query embedding", { error: String(error) });
            return [];
        }
        const result = this.db.exec(`SELECT id, content, vector, scope, type, created_at, access_count, last_accessed_at, updated_at FROM memories WHERE container_tag = ? AND superseded_at IS NULL ORDER BY created_at DESC`, [containerTag]);
        if (result.length === 0)
            return [];
        const rows = result[0].values;
        const scored = [];
        for (const row of rows) {
            const vectorData = row[2];
            if (!vectorData)
                continue;
            const memoryVector = decodeVector(vectorData);
            const similarity = cosineSimilarity(queryVector, memoryVector);
            if (similarity < threshold)
                continue;
            // Hybrid score: semantic similarity blended with keyword overlap, then
            // attenuated by a rehearsal-aware time decay.
            const kw = CONFIG.hybridSearch ? CONFIG.keywordWeight : 0;
            const textScore = keywordScore(query, row[1]);
            const decay = decayFactor(row[5], row[8] || 0, row[6] || 0, row[7] || null);
            const score = ((1 - kw) * similarity + kw * textScore) * decay;
            scored.push({
                id: row[0],
                content: row[1],
                similarity: score,
                scope: row[3],
                type: row[4],
                createdAt: row[5],
                accessCount: row[6] || 0,
            });
        }
        scored.sort((a, b) => b.similarity - a.similarity);
        const results = scored.slice(0, limit);
        // Reinforcement: record that these memories were retrieved and used.
        if (results.length > 0) {
            const now = Date.now();
            for (const r of results) {
                this.db.run(`UPDATE memories SET access_count = access_count + 1, last_accessed_at = ? WHERE id = ?`, [now, r.id]);
            }
            this.saveDatabase();
        }
        return results;
    }
    async listMemories(containerTag, limit = 20, additionalTags) {
        await this.initDatabase();
        let query;
        let params;
        if (additionalTags && additionalTags.length > 0) {
            const placeholders = additionalTags.map(() => "?").join(", ");
            query = `SELECT * FROM memories WHERE (container_tag = ? OR container_tag IN (${placeholders})) AND superseded_at IS NULL ORDER BY created_at DESC LIMIT ?`;
            params = [containerTag, ...additionalTags, Number(limit)];
        }
        else {
            query = `SELECT * FROM memories WHERE container_tag = ? AND superseded_at IS NULL ORDER BY created_at DESC LIMIT ?`;
            params = [containerTag, Number(limit)];
        }
        const result = this.db.exec(query, params);
        if (result.length === 0)
            return [];
        const columns = result[0].columns;
        return result[0].values.map((row) => this.rowToMemory(columns, row));
    }
    async listAllMemories(limit = 100) {
        await this.initDatabase();
        const result = this.db.exec(`SELECT * FROM memories WHERE superseded_at IS NULL ORDER BY created_at DESC LIMIT ?`, [Number(limit)]);
        if (result.length === 0)
            return [];
        const columns = result[0].columns;
        return result[0].values.map((row) => this.rowToMemory(columns, row));
    }
    async listMemoriesByProject(projectName, limit = 100) {
        await this.initDatabase();
        const result = this.db.exec(`SELECT * FROM memories WHERE project_name = ? AND superseded_at IS NULL ORDER BY created_at DESC LIMIT ?`, [projectName, Number(limit)]);
        if (result.length === 0)
            return [];
        const columns = result[0].columns;
        return result[0].values.map((row) => this.rowToMemory(columns, row));
    }
    async deleteMemory(id) {
        await this.initDatabase();
        this.db.run("DELETE FROM memories WHERE id = ?", [id]);
        this.saveDatabase();
        log("Memory deleted", { id });
        return true;
    }
    async clearMemories(containerTag) {
        await this.initDatabase();
        let count = 0;
        if (containerTag) {
            const result = this.db.exec("SELECT COUNT(*) FROM memories WHERE container_tag = ?", [containerTag]);
            count = result[0]?.values[0]?.[0] || 0;
            this.db.run("DELETE FROM memories WHERE container_tag = ?", [containerTag]);
        }
        else {
            const result = this.db.exec("SELECT COUNT(*) FROM memories");
            count = result[0]?.values[0]?.[0] || 0;
            this.db.run("DELETE FROM memories");
        }
        this.saveDatabase();
        log("Memories cleared", { containerTag, count });
        return count;
    }
    async countByType(containerTag, type) {
        await this.initDatabase();
        const result = this.db.exec(`SELECT COUNT(*) FROM memories WHERE container_tag = ? AND type = ? AND superseded_at IS NULL`, [containerTag, type]);
        return result[0]?.values[0]?.[0] || 0;
    }
    async getStats() {
        await this.initDatabase();
        const totalResult = this.db.exec("SELECT COUNT(*) FROM memories");
        const userResult = this.db.exec("SELECT COUNT(*) FROM memories WHERE scope = 'user'");
        const projectResult = this.db.exec("SELECT COUNT(*) FROM memories WHERE scope = 'project'");
        return {
            total: totalResult[0]?.values[0]?.[0] || 0,
            user: userResult[0]?.values[0]?.[0] || 0,
            project: projectResult[0]?.values[0]?.[0] || 0,
        };
    }
    rowToMemory(columns, row) {
        const colIndex = {};
        columns.forEach((col, i) => {
            colIndex[col] = i;
        });
        let vector;
        const vectorData = row[colIndex["vector"]];
        if (vectorData) {
            vector = decodeVector(vectorData);
        }
        return {
            id: row[colIndex["id"]],
            content: row[colIndex["content"]],
            vector,
            scope: row[colIndex["scope"]],
            type: row[colIndex["type"]],
            containerTag: row[colIndex["container_tag"]],
            projectName: row[colIndex["project_name"]],
            projectPath: row[colIndex["project_path"]],
            createdAt: row[colIndex["created_at"]],
            updatedAt: row[colIndex["updated_at"]],
            metadata: row[colIndex["metadata"]] ? JSON.parse(row[colIndex["metadata"]]) : undefined,
        };
    }
    getDataDir() {
        return this.dataDir;
    }
    close() {
        if (this.db) {
            this.saveDatabase();
            this.db.close();
            log("Memory store closed");
        }
    }
}
let storeInstance = null;
export function getStore(storageLocation = "user", projectPath) {
    if (!storeInstance) {
        storeInstance = new LocalMemoryStore(storageLocation, projectPath);
    }
    return storeInstance;
}
export function resetStore() {
    if (storeInstance) {
        storeInstance.close();
        storeInstance = null;
    }
}
