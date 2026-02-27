import { tool } from "@opencode-ai/plugin/tool";
import { getStore } from "./services/store.js";
import { formatContextForPrompt, generateUserProfile } from "./services/context.js";
import { getTags } from "./services/tags.js";
import { stripPrivateContent, isFullyPrivate } from "./services/privacy.js";
import { createCompactionHook } from "./services/compaction.js";
import { CONFIG, isInitialized } from "./config.js";
import { log } from "./services/logger.js";
const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g;
const INLINE_CODE_PATTERN = /`[^`]+`/g;
const MEMORY_KEYWORD_PATTERN = new RegExp(`\\b(${CONFIG.keywordPatterns.join("|")})\\b`, "i");
const MEMORY_NUDGE_MESSAGE = `[MEMORY TRIGGER DETECTED]
The user wants you to remember something. You MUST use the \`local-memory\` tool with \`mode: "add"\` to save this information.

Extract the key information the user wants remembered and save it as a concise, searchable memory.
- Use \`scope: "project"\` for project-specific preferences (e.g., "run lint with tests")
- Use \`scope: "user"\` for cross-project preferences (e.g., "prefers concise responses")
- Choose an appropriate \`type\`: "preference", "project-config", "learned-pattern", etc.

DO NOT skip this step. The user explicitly asked you to remember.`;
function removeCodeBlocks(text) {
    return text.replace(CODE_BLOCK_PATTERN, "").replace(INLINE_CODE_PATTERN, "");
}
function detectMemoryKeyword(text) {
    const textWithoutCode = removeCodeBlocks(text);
    return MEMORY_KEYWORD_PATTERN.test(textWithoutCode);
}
export const LocalMemoryPlugin = async (ctx) => {
    const { directory } = ctx;
    const tags = getTags(directory);
    const injectedSessions = new Set();
    log("Plugin init", { directory, tags, initialized: isInitialized() });
    if (!isInitialized()) {
        log("Plugin disabled - not initialized. Run 'opencode-mem init' first.");
    }
    const modelLimits = new Map();
    (async () => {
        try {
            const response = await ctx.client.provider.list();
            if (response.data?.all) {
                for (const provider of response.data.all) {
                    if (provider.models) {
                        for (const [modelId, model] of Object.entries(provider.models)) {
                            if (model.limit?.context) {
                                modelLimits.set(`${provider.id}/${modelId}`, model.limit.context);
                            }
                        }
                    }
                }
            }
            log("Model limits loaded", { count: modelLimits.size });
        }
        catch (error) {
            log("Failed to fetch model limits", { error: String(error) });
        }
    })();
    const getModelLimit = (providerID, modelID) => {
        return modelLimits.get(`${providerID}/${modelID}`);
    };
    const compactionHook = isInitialized() && ctx.client
        ? createCompactionHook(ctx, tags, {
            threshold: CONFIG.compactionThreshold,
            getModelLimit,
        })
        : null;
    return {
        "chat.message": async (input, output) => {
            if (!isInitialized())
                return;
            const start = Date.now();
            try {
                const textParts = output.parts.filter((p) => p.type === "text");
                if (textParts.length === 0) {
                    log("chat.message: no text parts found");
                    return;
                }
                const userMessage = textParts.map((p) => p.text).join("\n");
                if (!userMessage.trim()) {
                    log("chat.message: empty message, skipping");
                    return;
                }
                log("chat.message: processing", {
                    messagePreview: userMessage.slice(0, 100),
                    partsCount: output.parts.length,
                    textPartsCount: textParts.length,
                });
                if (detectMemoryKeyword(userMessage)) {
                    log("chat.message: memory keyword detected");
                    const nudgePart = {
                        id: `local-memory-nudge-${Date.now()}`,
                        sessionID: input.sessionID,
                        messageID: output.message.id,
                        type: "text",
                        text: MEMORY_NUDGE_MESSAGE,
                        synthetic: true,
                    };
                    output.parts.push(nudgePart);
                }
                const isFirstMessage = !injectedSessions.has(input.sessionID);
                if (isFirstMessage) {
                    injectedSessions.add(input.sessionID);
                    const store = getStore(CONFIG.storageLocation, directory);
                    const [userMemoriesResult, projectMemoriesList] = await Promise.all([
                        store.searchMemories(userMessage, tags.user, {
                            threshold: CONFIG.similarityThreshold,
                            limit: CONFIG.maxMemories,
                        }),
                        store.listMemories(tags.project, CONFIG.maxProjectMemories),
                    ]);
                    const projectMemories = projectMemoriesList.map((m) => ({
                        id: m.id,
                        content: m.content,
                        similarity: 1,
                        scope: m.scope,
                        type: m.type,
                        createdAt: m.createdAt,
                    }));
                    const profile = generateUserProfile(userMemoriesResult);
                    const memoryContext = formatContextForPrompt({
                        profile,
                        userMemories: userMemoriesResult,
                        projectMemories,
                    });
                    if (memoryContext) {
                        const contextPart = {
                            id: `local-memory-context-${Date.now()}`,
                            sessionID: input.sessionID,
                            messageID: output.message.id,
                            type: "text",
                            text: memoryContext,
                            synthetic: true,
                        };
                        output.parts.unshift(contextPart);
                        const duration = Date.now() - start;
                        log("chat.message: context injected", {
                            duration,
                            contextLength: memoryContext.length,
                        });
                    }
                }
            }
            catch (error) {
                log("chat.message: ERROR", { error: String(error) });
            }
        },
        tool: {
            "local-memory": tool({
                description: "Manage and query the local persistent memory system. Use 'search' to find relevant memories, 'add' to store new knowledge, 'list' to see recent memories, 'forget' to remove a memory.",
                args: {
                    mode: tool.schema
                        .enum(["add", "search", "list", "forget", "profile", "help"])
                        .optional(),
                    content: tool.schema.string().optional(),
                    query: tool.schema.string().optional(),
                    type: tool.schema
                        .enum([
                        "preference",
                        "project-config",
                        "architecture",
                        "error-solution",
                        "learned-pattern",
                        "conversation",
                    ])
                        .optional(),
                    scope: tool.schema.enum(["user", "project"]).optional(),
                    memoryId: tool.schema.string().optional(),
                    limit: tool.schema.number().optional(),
                },
                async execute(args) {
                    if (!isInitialized()) {
                        return JSON.stringify({
                            success: false,
                            error: "Local memory not initialized. Run 'opencode-mem init' first.",
                        });
                    }
                    const mode = args.mode || "help";
                    const store = getStore(CONFIG.storageLocation, directory);
                    try {
                        switch (mode) {
                            case "help": {
                                return JSON.stringify({
                                    success: true,
                                    message: "Local Memory Usage Guide",
                                    commands: [
                                        {
                                            command: "add",
                                            description: "Store a new memory",
                                            args: ["content", "type?", "scope?"],
                                        },
                                        {
                                            command: "search",
                                            description: "Search memories",
                                            args: ["query", "scope?"],
                                        },
                                        {
                                            command: "profile",
                                            description: "View user profile",
                                            args: [],
                                        },
                                        {
                                            command: "list",
                                            description: "List recent memories",
                                            args: ["scope?", "limit?"],
                                        },
                                        {
                                            command: "forget",
                                            description: "Remove a memory",
                                            args: ["memoryId"],
                                        },
                                    ],
                                    scopes: {
                                        user: "Cross-project preferences and knowledge",
                                        project: "Project-specific knowledge (default)",
                                    },
                                    types: [
                                        "preference",
                                        "project-config",
                                        "architecture",
                                        "error-solution",
                                        "learned-pattern",
                                        "conversation",
                                    ],
                                });
                            }
                            case "add": {
                                if (!args.content) {
                                    return JSON.stringify({
                                        success: false,
                                        error: "content parameter is required for add mode",
                                    });
                                }
                                const sanitizedContent = stripPrivateContent(args.content);
                                if (isFullyPrivate(args.content)) {
                                    return JSON.stringify({
                                        success: false,
                                        error: "Cannot store fully private content",
                                    });
                                }
                                const scope = args.scope || "project";
                                const containerTag = scope === "user" ? tags.user : tags.project;
                                const result = await store.addMemory({
                                    content: sanitizedContent,
                                    scope,
                                    type: args.type || "learned-pattern",
                                    containerTag,
                                });
                                return JSON.stringify({
                                    success: true,
                                    message: `Memory added to ${scope} scope`,
                                    id: result.id,
                                    scope,
                                    type: args.type,
                                });
                            }
                            case "search": {
                                if (!args.query) {
                                    return JSON.stringify({
                                        success: false,
                                        error: "query parameter is required for search mode",
                                    });
                                }
                                const scope = args.scope;
                                if (scope === "user") {
                                    const result = await store.searchMemories(args.query, tags.user, { threshold: CONFIG.similarityThreshold, limit: args.limit || 10 });
                                    return formatSearchResults(args.query, scope, result, args.limit);
                                }
                                if (scope === "project") {
                                    const result = await store.searchMemories(args.query, tags.project, { threshold: CONFIG.similarityThreshold, limit: args.limit || 10 });
                                    return formatSearchResults(args.query, scope, result, args.limit);
                                }
                                const [userResult, projectResult] = await Promise.all([
                                    store.searchMemories(args.query, tags.user, {
                                        threshold: CONFIG.similarityThreshold,
                                        limit: args.limit || 10,
                                    }),
                                    store.searchMemories(args.query, tags.project, {
                                        threshold: CONFIG.similarityThreshold,
                                        limit: args.limit || 10,
                                    }),
                                ]);
                                const combined = [
                                    ...userResult.map((r) => ({ ...r, scope: "user" })),
                                    ...projectResult.map((r) => ({ ...r, scope: "project" })),
                                ].sort((a, b) => b.similarity - a.similarity);
                                return JSON.stringify({
                                    success: true,
                                    query: args.query,
                                    count: combined.length,
                                    results: combined.slice(0, args.limit || 10).map((r) => ({
                                        id: r.id,
                                        content: r.content,
                                        similarity: Math.round(r.similarity * 100),
                                        scope: r.scope,
                                    })),
                                });
                            }
                            case "profile": {
                                const userMemories = await store.searchMemories("", tags.user, {
                                    threshold: 0,
                                    limit: 20,
                                });
                                const profile = generateUserProfile(userMemories);
                                return JSON.stringify({
                                    success: true,
                                    profile,
                                });
                            }
                            case "list": {
                                const scope = args.scope || "project";
                                const limit = args.limit || 20;
                                const containerTag = scope === "user" ? tags.user : tags.project;
                                const memories = await store.listMemories(containerTag, limit);
                                return JSON.stringify({
                                    success: true,
                                    scope,
                                    count: memories.length,
                                    memories: memories.map((m) => ({
                                        id: m.id,
                                        content: m.content,
                                        createdAt: m.createdAt,
                                        type: m.type,
                                    })),
                                });
                            }
                            case "forget": {
                                if (!args.memoryId) {
                                    return JSON.stringify({
                                        success: false,
                                        error: "memoryId parameter is required for forget mode",
                                    });
                                }
                                const deleted = await store.deleteMemory(args.memoryId);
                                if (!deleted) {
                                    return JSON.stringify({
                                        success: false,
                                        error: "Memory not found or could not be deleted",
                                    });
                                }
                                return JSON.stringify({
                                    success: true,
                                    message: `Memory ${args.memoryId} removed`,
                                });
                            }
                            default:
                                return JSON.stringify({
                                    success: false,
                                    error: `Unknown mode: ${mode}`,
                                });
                        }
                    }
                    catch (error) {
                        return JSON.stringify({
                            success: false,
                            error: error instanceof Error ? error.message : String(error),
                        });
                    }
                },
            }),
        },
        event: async (input) => {
            if (compactionHook) {
                await compactionHook.event(input);
            }
        },
    };
};
function formatSearchResults(query, scope, results, limit) {
    return JSON.stringify({
        success: true,
        query,
        scope,
        count: results.length,
        results: results.slice(0, limit || 10).map((r) => ({
            id: r.id,
            content: r.content,
            similarity: Math.round(r.similarity * 100),
        })),
    });
}
export default LocalMemoryPlugin;
