import { getStore } from "./store.js";
import type { Tags } from "./tags.js";
import type { CompactionContext } from "../types/index.js";
import { log } from "./logger.js";

export type { CompactionContext } from "../types/index.js";

interface CompactionHookOptions {
  threshold: number;
  getModelLimit: (providerID: string, modelID: string) => number | undefined;
}

export function createCompactionHook(
  ctx: CompactionContext,
  tags: Tags,
  options: CompactionHookOptions
) {
  const processedEvents = new Set<string>();

  return {
    event: async (input: { event: { type: string; properties?: unknown } }) => {
      const { event } = input;
      
      if (event.type !== "context_window_limit_reached") {
        return;
      }

      const properties = event.properties as {
        sessionId?: string;
        provider?: string;
        model?: string;
        usage?: number;
        limit?: number;
      } | undefined;

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
      } catch (error) {
        log("Compaction failed", { error: String(error) });
      }
    },
  };
}
