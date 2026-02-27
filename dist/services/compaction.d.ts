import type { Tags } from "./tags.js";
import type { CompactionContext } from "../types/index.js";
export type { CompactionContext } from "../types/index.js";
interface CompactionHookOptions {
    threshold: number;
    getModelLimit: (providerID: string, modelID: string) => number | undefined;
}
export declare function createCompactionHook(ctx: CompactionContext, tags: Tags, options: CompactionHookOptions): {
    event: (input: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
};
//# sourceMappingURL=compaction.d.ts.map