import type { MemorySearchResult } from "../types/index.js";
export interface ContextData {
    profile: {
        static: string[];
        dynamic: string[];
    } | null;
    userMemories: MemorySearchResult[];
    projectMemories: MemorySearchResult[];
}
export declare function formatContextForPrompt(data: ContextData): string;
export declare function generateUserProfile(memories: MemorySearchResult[]): {
    static: string[];
    dynamic: string[];
};
//# sourceMappingURL=context.d.ts.map