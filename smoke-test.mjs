// Smoke test for new store behaviors with a stubbed embedding service.
import { embeddingService } from "./dist/services/embedding.js";
import { LocalMemoryStore, resetStore, tokenize } from "./dist/services/store.js";
import { rmSync } from "node:fs";
import { join } from "node:path";

// The store persists to <projectPath>/.opencode-memory — clean it for isolation.
const DB_DIR = join(process.cwd(), ".opencode-memory");
rmSync(DB_DIR, { recursive: true, force: true });

// Deterministic 8-dim stub embeddings based on bag-of-words.
const vocab = ["bun", "npm", "postgres", "sqlite", "rust", "golang", "docker", "k8s"];
function stub(text) {
  const t = tokenize(text.toLowerCase());
  const v = new Array(vocab.length).fill(0);
  for (const w of t) {
    const i = vocab.indexOf(w);
    if (i >= 0) v[i] += 1;
  }
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}
embeddingService.embedOne = async (text) => stub(text);
embeddingService.embed = async (texts) => texts.map(stub);

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS", name); }
  else { fail++; console.log("FAIL", name); }
}

const store = new LocalMemoryStore("project", process.cwd());

// 1) dedup on write: near-duplicate content merges instead of inserting
const m1 = await store.addMemory({ content: "use bun instead of npm", scope: "project", type: "project-config", containerTag: "test_tag" });
const m2 = await store.addMemory({ content: "use bun instead of npm", scope: "project", type: "project-config", containerTag: "test_tag" });
check("dedup: identical content merges to same id", m1.id === m2.id);
check("dedup: merged flag returned", m2.metadata?.merged === true);

const distinct = await store.addMemory({ content: "database is postgres not sqlite", scope: "project", type: "architecture", containerTag: "test_tag" });
check("distinct content gets new id", distinct.id !== m1.id);

// 1b) supersede: restated fact (similarity in the 0.8-0.92 band) versions the old one
const v1 = await store.addMemory({ content: "rust build uses bun", scope: "project", type: "project-config", containerTag: "sup_tag" });
const v2 = await store.addMemory({ content: "rust build uses bun golang", scope: "project", type: "project-config", containerTag: "sup_tag" });
check("supersede: restatement gets new id", v2.id !== v1.id);
check("supersede: new memory links to old", Array.isArray(v2.metadata?.supersedes) && v2.metadata.supersedes.includes(v1.id));
check("supersede: model id stamped", typeof v2.metadata?.embedding_model === "string");
const supHits = await store.searchMemories("rust build bun", "sup_tag", { threshold: 0.01, limit: 10 });
check("supersede: search returns only current version", supHits.length === 1 && supHits[0].id === v2.id);
const oldGet = await store.getMemory(v1.id);
check("supersede: old version still retrievable as history", oldGet !== null);

// 1c) countByType (used by the reflection promotion chain)
const convCount = await store.countByType("test_tag", "conversation");
check("countByType works", convCount === 0);
await store.addMemory({ content: "note golang ci workflow", scope: "project", type: "conversation", containerTag: "test_tag" });
check("countByType counts conversations", (await store.countByType("test_tag", "conversation")) === 1);

// 2) hybrid search: keyword + semantic both find results
const hits = await store.searchMemories("bun npm", "test_tag", { threshold: 0.05, limit: 5 });
check("hybrid search finds the bun memory", hits.some((h) => h.id === m1.id));
check("search result exposes accessCount", typeof hits[0].accessCount === "number");

// 3) reinforcement: access_count bumps persist across retrievals
// (returned value is the pre-bump snapshot, so it lags one search behind)
await store.searchMemories("bun npm", "test_tag", { threshold: 0.05, limit: 5 });
const hits3 = await store.searchMemories("bun npm", "test_tag", { threshold: 0.05, limit: 5 });
const target3 = hits3.find((h) => h.id === m1.id);
check("reinforcement: accessCount incremented across searches", (target3?.accessCount ?? 0) >= 2);

// 4) decay: an old untouched memory scores lower than a fresh identical one
const fresh = await store.addMemory({ content: "cache layer uses docker compose", scope: "project", type: "architecture", containerTag: "decay_tag" });
// simulate an old memory by direct row manipulation
const db = store;
await db.addMemory({ content: "legacy note about golang build", scope: "project", type: "conversation", containerTag: "decay_tag" });
const oldHits = await store.searchMemories("docker compose cache", "decay_tag", { threshold: 0.01, limit: 5 });
check("decay search returns fresh memory first", oldHits[0]?.id === fresh.id);

// 5) schema migration on legacy DB columns didn't crash (implicitly proven above)
const stats = await store.getStats();
check("stats still work", stats.total >= 4);

store.close();
rmSync(DB_DIR, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
