export type MemoryScope = "user" | "project";
export type MemoryType = "preference" | "project-config" | "architecture" | "error-solution" | "learned-pattern" | "conversation";
export interface Memory {
    id: string;
    content: string;
    vector?: number[];
    scope: MemoryScope;
    type: MemoryType;
    containerTag: string;
    projectName?: string;
    projectPath?: string;
    createdAt: number;
    updatedAt: number;
    metadata?: Record<string, unknown>;
}
export interface MemorySearchResult {
    id: string;
    content: string;
    similarity: number;
    scope: MemoryScope;
    type?: MemoryType;
    createdAt?: number;
}
export interface UserProfile {
    static: string[];
    dynamic: string[];
}
export interface EmbeddingService {
    embed(texts: string[]): Promise<number[][]>;
    embedOne(text: string): Promise<number[]>;
    isReady(): boolean;
    getLoadingProgress(): number;
}
export interface MemoryStore {
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
}
export interface ConversationMessage {
    role: "user" | "assistant" | "system" | "tool";
    content: string | ConversationContentPart[];
    name?: string;
}
export type ConversationContentPart = {
    type: "text";
    text: string;
} | {
    type: "image_url";
    imageUrl: {
        url: string;
    };
};
export interface CompactionContext {
    sessionID: string;
    client: {
        session: {
            summarize: (sessionId: string) => Promise<{
                data?: {
                    summary?: string;
                };
            }>;
        };
    };
}
export interface Config {
    storageLocation: "user" | "project";
    similarityThreshold: number;
    maxMemories: number;
    maxProjectMemories: number;
    maxProfileItems: number;
    injectProfile: boolean;
    containerTagPrefix: string;
    userContainerTag?: string;
    projectContainerTag?: string;
    filterPrompt: string;
    keywordPatterns: string[];
    compactionThreshold: number;
    model: {
        name: string;
        quantized: boolean;
    };
}
export declare const DEFAULT_CONFIG: Config;
//# sourceMappingURL=index.d.ts.map