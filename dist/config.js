import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { log } from "./services/logger.js";
import { DEFAULT_CONFIG } from "./types/index.js";
const CONFIG_DIR = join(homedir(), ".config", "opencode");
const CONFIG_FILES = [
    join(CONFIG_DIR, "memory.jsonc"),
    join(CONFIG_DIR, "memory.json"),
];
function stripJsoncComments(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
        .trim();
}
function isValidRegex(pattern) {
    try {
        new RegExp(pattern);
        return true;
    }
    catch {
        return false;
    }
}
function validateCompactionThreshold(value) {
    if (value === undefined || typeof value !== "number" || isNaN(value)) {
        return DEFAULT_CONFIG.compactionThreshold;
    }
    if (value <= 0 || value > 1)
        return DEFAULT_CONFIG.compactionThreshold;
    return value;
}
function validateSimilarityThreshold(value) {
    if (value === undefined || typeof value !== "number" || isNaN(value)) {
        return DEFAULT_CONFIG.similarityThreshold;
    }
    if (value < 0 || value > 1)
        return DEFAULT_CONFIG.similarityThreshold;
    return value;
}
function loadConfig() {
    for (const path of CONFIG_FILES) {
        if (existsSync(path)) {
            try {
                const content = readFileSync(path, "utf-8");
                const json = stripJsoncComments(content);
                return JSON.parse(json);
            }
            catch (error) {
                log("Failed to parse config file", { path, error: String(error) });
            }
        }
    }
    return {};
}
const userConfig = loadConfig();
export const CONFIG = {
    storageLocation: userConfig.storageLocation ?? DEFAULT_CONFIG.storageLocation,
    similarityThreshold: validateSimilarityThreshold(userConfig.similarityThreshold),
    maxMemories: userConfig.maxMemories ?? DEFAULT_CONFIG.maxMemories,
    maxProjectMemories: userConfig.maxProjectMemories ?? DEFAULT_CONFIG.maxProjectMemories,
    maxProfileItems: userConfig.maxProfileItems ?? DEFAULT_CONFIG.maxProfileItems,
    injectProfile: userConfig.injectProfile ?? DEFAULT_CONFIG.injectProfile,
    containerTagPrefix: userConfig.containerTagPrefix ?? DEFAULT_CONFIG.containerTagPrefix,
    userContainerTag: userConfig.userContainerTag,
    projectContainerTag: userConfig.projectContainerTag,
    filterPrompt: userConfig.filterPrompt ?? DEFAULT_CONFIG.filterPrompt,
    keywordPatterns: [
        ...DEFAULT_CONFIG.keywordPatterns,
        ...(userConfig.keywordPatterns ?? []).filter(isValidRegex),
    ],
    compactionThreshold: validateCompactionThreshold(userConfig.compactionThreshold),
    model: {
        name: userConfig.model?.name ?? DEFAULT_CONFIG.model.name,
        quantized: userConfig.model?.quantized ?? DEFAULT_CONFIG.model.quantized,
    },
};
export function saveConfig(config) {
    const configPath = join(CONFIG_DIR, "memory.json");
    const currentConfig = loadConfig();
    const newConfig = { ...currentConfig, ...config };
    if (!existsSync(CONFIG_DIR)) {
        const { mkdirSync } = require("node:fs");
        mkdirSync(CONFIG_DIR, { recursive: true });
    }
    writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
    log("Config saved", { path: configPath });
}
export function getConfigPath() {
    return join(CONFIG_DIR, "memory.json");
}
export function isInitialized() {
    const dataDir = join(homedir(), ".local", "share", "opencode-memory");
    const dbPath = join(dataDir, "data.db");
    return existsSync(dbPath);
}
