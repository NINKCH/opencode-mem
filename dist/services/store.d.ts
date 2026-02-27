import type { Memory, MemorySearchResult, MemoryStore } from "../types/index.js";
export declare class LocalMemoryStore implements MemoryStore {
    private db;
    private dataDir;
    private dbPath;
    private initialized;
    private sqlReady;
    constructor(storageLocation?: "user" | "project", projectPath?: string);
    private initDatabase;
    private saveDatabase;
    addMemory(memory: Omit<Memory, "id" | "createdAt" | "updatedAt">): Promise<Memory>;
    getMemory(id: string): Promise<Memory | null>;
    searchMemories(query: string, containerTag: string, options?: {
        threshold?: number;
        limit?: number;
    }): Promise<MemorySearchResult[]>;
    listMemories(containerTag: string, limit?: number): Promise<Memory[]>;
    deleteMemory(id: string): Promise<boolean>;
    clearMemories(containerTag?: string): Promise<number>;
    getStats(): Promise<{
        total: number;
        user: number;
        project: number;
    }>;
    private rowToMemory;
    getDataDir(): string;
    close(): void;
}
export declare function getStore(storageLocation?: "user" | "project", projectPath?: string): LocalMemoryStore;
export declare function resetStore(): void;
//# sourceMappingURL=store.d.ts.map