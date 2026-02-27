export type MemoryScope = "user" | "project";

export type MemoryType =
  | "preference"
  | "project-config"
  | "architecture"
  | "error-solution"
  | "learned-pattern"
  | "conversation";

export interface Memory {
  id: string;
  content: string;
  vector?: number[];
  scope: MemoryScope;
  type: MemoryType;
  containerTag: string;
  projectName?: string;
  projectPath?: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

export interface MemorySearchResult {
  id: string;
  content: string;
  similarity: number;
  scope: MemoryScope;
  type?: MemoryType;
  createdAt?: number;
}

export interface UserProfile {
  static: string[];
  dynamic: string[];
}

export interface EmbeddingService {
  embed(texts: string[]): Promise<number[][]>;
  embedOne(text: string): Promise<number[]>;
  isReady(): boolean;
  getLoadingProgress(): number;
}

export interface MemoryStore {
  addMemory(memory: Omit<Memory, "id" | "createdAt" | "updatedAt">): Promise<Memory>;
  getMemory(id: string): Promise<Memory | null>;
  searchMemories(
    query: string,
    containerTag: string,
    options?: { threshold?: number; limit?: number }
  ): Promise<MemorySearchResult[]>;
  listMemories(containerTag: string, limit?: number): Promise<Memory[]>;
  deleteMemory(id: string): Promise<boolean>;
  clearMemories(containerTag?: string): Promise<number>;
  getStats(): Promise<{ total: number; user: number; project: number }>;
}

export interface ConversationMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string | ConversationContentPart[];
  name?: string;
}

export type ConversationContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; imageUrl: { url: string } };

export interface CompactionContext {
  sessionID: string;
  client: {
    session: {
      summarize: (sessionId: string) => Promise<{ data?: { summary?: string } }>;
    };
  };
}

export interface Config {
  storageLocation: "user" | "project";
  similarityThreshold: number;
  maxMemories: number;
  maxProjectMemories: number;
  maxProfileItems: number;
  injectProfile: boolean;
  containerTagPrefix: string;
  userContainerTag?: string;
  projectContainerTag?: string;
  filterPrompt: string;
  keywordPatterns: string[];
  compactionThreshold: number;
  model: {
    name: string;
    quantized: boolean;
  };
}

export const DEFAULT_CONFIG: Config = {
  storageLocation: "user",
  similarityThreshold: 0.6,
  maxMemories: 5,
  maxProjectMemories: 10,
  maxProfileItems: 5,
  injectProfile: true,
  containerTagPrefix: "mem",
  filterPrompt:
    "You are a stateful coding agent. Remember all information including user preferences, tech stack, behaviors, and workflows.",
  keywordPatterns: [
    "remember",
    "memorize",
    "save\\s+this",
    "note\\s+this",
    "keep\\s+in\\s+mind",
    "don'?t\\s+forget",
    "learn\\s+this",
    "store\\s+this",
    "record\\s+this",
    "make\\s+a\\s+note",
    "take\\s+note",
    "jot\\s+down",
    "commit\\s+to\\s+memory",
    "remember\\s+that",
    "never\\s+forget",
    "always\\s+remember",
    "记住",
    "记下",
    "别忘了",
    "记住这个",
  ],
  compactionThreshold: 0.8,
  model: {
    name: "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
    quantized: true,
  },
};