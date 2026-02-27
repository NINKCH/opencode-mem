export declare class EmbeddingService {
    private static instance;
    private extractor;
    private isLoading;
    private loadingProgress;
    private modelName;
    private quantized;
    private constructor();
    static getInstance(modelName?: string, quantized?: boolean): EmbeddingService;
    private loadModel;
    embed(texts: string[]): Promise<number[][]>;
    embedOne(text: string): Promise<number[]>;
    isReady(): boolean;
    getLoadingProgress(): number;
    getModelName(): string;
}
export declare const embeddingService: EmbeddingService;
//# sourceMappingURL=embedding.d.ts.map