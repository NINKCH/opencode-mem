export declare class EmbeddingService {
    private static instance;
    private extractor;
    private isLoading;
    private loadingProgress;
    private modelName;
    private quantized;
    private preloadStarted;
    private constructor();
    static getInstance(modelName?: string, quantized?: boolean): EmbeddingService;
    private loadModel;
    embed(texts: string[]): Promise<number[][]>;
    embedOne(text: string): Promise<number[]>;
    isReady(): boolean;
    getLoadingProgress(): number;
    getModelName(): string;
    preload(): void;
}
export declare const embeddingService: EmbeddingService;
//# sourceMappingURL=embedding.d.ts.map