import { getStore } from "./store.js";
import { log } from "./logger.js";
export function createCompactionHook(ctx, tags, options) {
    const processedEvents = new Set();
    return {
        event: async (input) => {
            const { event } = input;
            if (event.type !== "context_window_limit_reached") {
                return;
            }
            const properties = event.properties;
            const sessionId = properties?.sessionId;
            if (!sessionId || processedEvents.has(sessionId)) {
                return;
            }
            processedEvents.add(sessionId);
            const usage = properties?.usage || 0;
            const limit = properties?.limit || 0;
            const usageRatio = limit > 0 ? usage / limit : 0;
            if (usageRatio < options.threshold) {
                return;
            }
            log("Compaction triggered", {
                sessionId,
                usageRatio,
                threshold: options.threshold,
            });
            try {
                const result = await ctx.client.session.summarize(sessionId);
                const summary = result.data?.summary;
                if (summary) {
                    const store = getStore();
                    await store.addMemory({
                        content: `[Session Summary]\n${summary}`,
                        scope: "project",
                        type: "conversation",
                        containerTag: tags.project,
                    });
                    log("Session summary saved", { sessionId });
                }
            }
            catch (error) {
                log("Compaction failed", { error: String(error) });
            }
        },
    };
}
