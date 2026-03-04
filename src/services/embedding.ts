import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync } from "node:fs";
import { log } from "./logger.js";

const CACHE_DIR = join(homedir(), ".local", "share", "opencode-memory", "models");

interface TransformersModule {
  pipeline: typeof import("@xenova/transformers").pipeline;
  env: typeof import("@xenova/transformers").env;
}

let cachedModule: TransformersModule | null = null;

async function getTransformers(): Promise<TransformersModule> {
  if (cachedModule) {
    return cachedModule;
  }

  const transformers = await import("@xenova/transformers");
  cachedModule = {
    pipeline: transformers.pipeline,
    env: transformers.env,
  };
  cachedModule.env.cacheDir = CACHE_DIR;

  return cachedModule;
}

export class EmbeddingService {
  private static instance: EmbeddingService;
  private extractor: Promise<any> | null = null;
  private isLoading = false;
  private loadingProgress = 0;
  private modelName: string;
  private quantized: boolean;
  private preloadStarted = false;

  private constructor(modelName: string, quantized: boolean) {
    this.modelName = modelName;
    this.quantized = quantized;
  }

  static getInstance(modelName = "Xenova/paraphrase-multilingual-MiniLM-L12-v2", quantized = true): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService(modelName, quantized);
    }
    return EmbeddingService.instance;
  }

  private async loadModel(): Promise<any> {
    if (this.extractor) return this.extractor;

    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return this.extractor!;
    }

    this.isLoading = true;
    this.loadingProgress = 0;

    try {
      log("Loading embedding model", { model: this.modelName });

      if (!existsSync(CACHE_DIR)) {
        mkdirSync(CACHE_DIR, { recursive: true });
      }

      const { pipeline } = await getTransformers();

      this.extractor = pipeline("feature-extraction", this.modelName, {
        quantized: this.quantized,
        progress_callback: (progress: any) => {
          if (progress && typeof progress.progress === "number") {
            this.loadingProgress = Math.round(progress.progress);
            if (progress.status === "downloading") {
              log("Model download progress", {
                file: progress.file,
                progress: this.loadingProgress,
              });
            }
          }
        },
      });

      await this.extractor;
      this.loadingProgress = 100;
      log("Embedding model loaded successfully", { model: this.modelName });
    } catch (error) {
      log("Failed to load embedding model", { error: String(error) });
      this.extractor = null;
      throw error;
    } finally {
      this.isLoading = false;
    }

    return this.extractor!;
  }

  async embed(texts: string[]): Promise<number[][]> {
    const model = await this.loadModel();

    try {
      const results = await model(texts, {
        pooling: "mean",
        normalize: true,
      });

      const vectors: number[][] = [];
      for (let i = 0; i < texts.length; i++) {
        const tensor = results[i];
        vectors.push(Array.from(tensor.data));
      }

      return vectors;
    } catch (error) {
      log("Embedding failed", { error: String(error) });
      throw error;
    }
  }

  async embedOne(text: string): Promise<number[]> {
    const results = await this.embed([text]);
    return results[0];
  }

  isReady(): boolean {
    return this.extractor !== null && !this.isLoading;
  }

  getLoadingProgress(): number {
    return this.loadingProgress;
  }

  getModelName(): string {
    return this.modelName;
  }

  preload(): void {
    if (this.preloadStarted || this.extractor) return;
    this.preloadStarted = true;

    this.loadModel().catch((error) => {
      log("Preload failed", { error: String(error) });
      this.preloadStarted = false;
    });

    log("Model preload started in background");
  }
}

export const embeddingService = EmbeddingService.getInstance();
