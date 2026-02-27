import { CONFIG } from "../config.js";
export function formatContextForPrompt(data) {
    const parts = ["[LOCAL-MEMORY]"];
    if (CONFIG.injectProfile && data.profile) {
        const { static: staticFacts, dynamic: dynamicFacts } = data.profile;
        if (staticFacts.length > 0) {
            parts.push("\nUser Profile:");
            staticFacts.slice(0, CONFIG.maxProfileItems).forEach((fact) => {
                parts.push(`- ${fact}`);
            });
        }
        if (dynamicFacts.length > 0) {
            parts.push("\nRecent Context:");
            dynamicFacts.slice(0, CONFIG.maxProfileItems).forEach((fact) => {
                parts.push(`- ${fact}`);
            });
        }
    }
    if (data.projectMemories.length > 0) {
        parts.push("\nProject Knowledge:");
        data.projectMemories.forEach((mem) => {
            const similarity = Math.round(mem.similarity * 100);
            parts.push(`- [${similarity}%] ${mem.content}`);
        });
    }
    if (data.userMemories.length > 0) {
        parts.push("\nRelevant Memories:");
        data.userMemories.forEach((mem) => {
            const similarity = Math.round(mem.similarity * 100);
            parts.push(`- [${similarity}%] ${mem.content}`);
        });
    }
    if (parts.length === 1) {
        return "";
    }
    return parts.join("\n");
}
export function generateUserProfile(memories) {
    const staticFacts = [];
    const dynamicFacts = [];
    const preferenceMemories = memories.filter((m) => m.type === "preference");
    const recentMemories = memories.slice(0, CONFIG.maxProfileItems);
    preferenceMemories.slice(0, 5).forEach((m) => {
        staticFacts.push(m.content);
    });
    recentMemories.forEach((m) => {
        if (!staticFacts.includes(m.content)) {
            dynamicFacts.push(m.content);
        }
    });
    return {
        static: staticFacts,
        dynamic: dynamicFacts.slice(0, CONFIG.maxProfileItems),
    };
}
