import type { Config } from "./types/index.js";
interface UserConfig {
    storageLocation?: "user" | "project";
    similarityThreshold?: number;
    maxMemories?: number;
    maxProjectMemories?: number;
    maxProfileItems?: number;
    injectProfile?: boolean;
    containerTagPrefix?: string;
    userContainerTag?: string;
    projectContainerTag?: string;
    filterPrompt?: string;
    keywordPatterns?: string[];
    compactionThreshold?: number;
    model?: {
        name?: string;
        quantized?: boolean;
    };
}
export declare const CONFIG: Config;
export declare function saveConfig(config: Partial<UserConfig>): void;
export declare function getConfigPath(): string;
export declare function isInitialized(): boolean;
export {};
//# sourceMappingURL=config.d.ts.map