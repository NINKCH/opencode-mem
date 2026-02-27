import { pipeline, env } from "@xenova/transformers";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync } from "node:fs";
import { log } from "./logger.js";
const CACHE_DIR = join(homedir(), ".local", "share", "opencode-memory", "models");
env.cacheDir = CACHE_DIR;
export class EmbeddingService {
    static instance;
    extractor = null;
    isLoading = false;
    loadingProgress = 0;
    modelName;
    quantized;
    constructor(modelName, quantized) {
        this.modelName = modelName;
        this.quantized = quantized;
    }
    static getInstance(modelName = "Xenova/paraphrase-multilingual-MiniLM-L12-v2", quantized = true) {
        if (!EmbeddingService.instance) {
            EmbeddingService.instance = new EmbeddingService(modelName, quantized);
        }
        return EmbeddingService.instance;
    }
    async loadModel() {
        if (this.extractor)
            return this.extractor;
        if (this.isLoading) {
            while (this.isLoading) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return this.extractor;
        }
        this.isLoading = true;
        this.loadingProgress = 0;
        try {
            log("Loading embedding model", { model: this.modelName });
            if (!existsSync(CACHE_DIR)) {
                mkdirSync(CACHE_DIR, { recursive: true });
            }
            this.extractor = pipeline("feature-extraction", this.modelName, {
                quantized: this.quantized,
                progress_callback: (progress) => {
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
        }
        catch (error) {
            log("Failed to load embedding model", { error: String(error) });
            this.extractor = null;
            throw error;
        }
        finally {
            this.isLoading = false;
        }
        return this.extractor;
    }
    async embed(texts) {
        const model = await this.loadModel();
        try {
            const results = await model(texts, {
                pooling: "mean",
                normalize: true,
            });
            const vectors = [];
            for (let i = 0; i < texts.length; i++) {
                const tensor = results[i];
                vectors.push(Array.from(tensor.data));
            }
            return vectors;
        }
        catch (error) {
            log("Embedding failed", { error: String(error) });
            throw error;
        }
    }
    async embedOne(text) {
        const results = await this.embed([text]);
        return results[0];
    }
    isReady() {
        return this.extractor !== null && !this.isLoading;
    }
    getLoadingProgress() {
        return this.loadingProgress;
    }
    getModelName() {
        return this.modelName;
    }
}
export const embeddingService = EmbeddingService.getInstance();
