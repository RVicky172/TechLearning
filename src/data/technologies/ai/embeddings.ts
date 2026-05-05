import type { TopicNode } from "@/data/types";

const whatAreEmbeddings: TopicNode = {
  id: "ai-what-are-embeddings",
  title: "What Are Embeddings?",
  iconName: "Grid3x3",
  link: "https://platform.openai.com/docs/guides/embeddings",
  theory:
    "Embeddings are dense numerical vectors that represent the semantic meaning of text. Texts with similar meanings produce vectors that are close together in the high-dimensional embedding space.",
  theoryDetail: {
    keyConcepts: [
      "An embedding model converts text → a fixed-length array of floats (e.g. 1536 dimensions for text-embedding-3-small)",
      "The same model must embed both documents and queries — never mix models",
      "Embeddings capture semantics: 'happy' and 'joyful' will have similar vectors even though they share no characters",
      "OpenAI text-embedding-3-small: 1536 dims, $0.02/1M tokens — excellent cost-quality tradeoff",
      "Matryoshka embeddings can be truncated to fewer dimensions (e.g. 256) with modest accuracy loss but huge storage savings",
    ],
    whyItMatters:
      "Embeddings are the foundation of semantic search, RAG (Retrieval Augmented Generation), recommendation systems, duplicate detection, and clustering. Without them, you are limited to keyword search.",
    commonPitfalls: [
      "Embedding documents with different models than queries — vectors live in different spaces and comparisons are meaningless",
      "Not normalizing vectors before cosine similarity — most libraries expect unit vectors",
      "Re-embedding already-embedded documents when re-indexing — cache embeddings by content hash",
    ],
    examples: [
      {
        title: "Generating embeddings with OpenAI",
        description: "Convert text to embedding vectors and inspect their properties.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

async function embed(texts: string[]): Promise<number[][]> {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
    encoding_format: "float",
  });

  // Sort by index to preserve order (API doesn't guarantee order)
  return response.data
    .sort((a, b) => a.index - b.index)
    .map(item => item.embedding);
}

// Example
const texts = [
  "The cat sat on the mat",
  "A feline rested on the rug",    // semantically similar
  "JavaScript is a programming language", // unrelated
];

const embeddings = await embed(texts);

console.log("Dimensions:", embeddings[0].length);
console.log("First 5 values:", embeddings[0].slice(0, 5));
console.log("Vector magnitude:", Math.sqrt(
  embeddings[0].reduce((sum, v) => sum + v * v, 0)
));`,
        language: "typescript",
        output: `EMBEDDING PROPERTIES
═══════════════════════════════════════════════════
  Model: text-embedding-3-small
  Dimensions: 1536
  First 5 values: [0.0023, -0.0156, 0.0089, -0.0234, 0.0178]
  Vector magnitude: ~1.0  (OpenAI returns normalized unit vectors)

  Response also includes:
  {
    usage: { prompt_tokens: 22, total_tokens: 22 }
  }

WHAT THE NUMBERS REPRESENT
═══════════════════════════════════════════════════
  "The cat sat on the mat"       → [0.002, -0.016, 0.009, ...]
  "A feline rested on the rug"   → [0.004, -0.018, 0.011, ...]
  "JavaScript is a programming…" → [-0.089, 0.234, -0.056, ...]

  The first two vectors are CLOSE (same meaning, different words).
  The third vector is FAR AWAY (completely different topic).

  You can't interpret individual dimensions — the meaning is
  encoded collectively across all 1536 values.

COST ESTIMATE (text-embedding-3-small at $0.02/1M tokens)
═══════════════════════════════════════════════════
  100-page PDF (~75,000 tokens)  →  $0.0015  (less than 1 cent)
  10,000 product descriptions    →  ~$0.008  (less than 1 cent)
  1M Wikipedia articles          →  ~$80     (one-time indexing cost)`,
      },
    ],
  },
};

const cosineSimilarity: TopicNode = {
  id: "ai-cosine-similarity",
  title: "Similarity Search",
  iconName: "ScanSearch",
  link: "https://en.wikipedia.org/wiki/Cosine_similarity",
  theory:
    "Cosine similarity measures the angle between two vectors, returning a value from -1 (opposite) to 1 (identical). It is the standard metric for semantic search because it is scale-invariant — vector length doesn't affect the score.",
  theoryDetail: {
    keyConcepts: [
      "cosine_similarity = (A · B) / (|A| × |B|) — dot product divided by product of magnitudes",
      "For normalized (unit) vectors: cosine similarity = simple dot product (much faster to compute)",
      "Score > 0.85 typically indicates strong semantic similarity; score < 0.7 is often noise",
      "Dot product search is faster — most vector DBs index by dot product and require normalized vectors",
      "Approximate Nearest Neighbor (ANN) algorithms (HNSW, IVF) trade tiny accuracy loss for massive speed gains at scale",
    ],
    whyItMatters:
      "Semantic search finds 'what the user means' even when query words don't appear in documents. A search for 'heart attack' will find documents about 'myocardial infarction' — keyword search cannot do this.",
    commonPitfalls: [
      "Using Euclidean distance instead of cosine similarity for text — it is sensitive to vector magnitude",
      "Not normalizing vectors — raw OpenAI embeddings are normalized, but other models may not be",
      "Setting a similarity threshold too high — a 0.95 threshold may filter out relevant results",
    ],
    examples: [
      {
        title: "Semantic search from scratch",
        description:
          "Embed a corpus, embed a query, compute cosine similarities, and return ranked results.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

// Cosine similarity for normalized (unit) vectors = dot product
function cosineSimilarity(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

async function semanticSearch(query: string, documents: string[], topK = 3) {
  // Embed everything in one batched call (more efficient)
  const all = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: [query, ...documents],
  });

  const [queryEmbedding, ...docEmbeddings] = all.data
    .sort((a, b) => a.index - b.index)
    .map(item => item.embedding);

  // Score each document
  const scored = documents.map((doc, i) => ({
    document: doc,
    score: cosineSimilarity(queryEmbedding, docEmbeddings[i]),
  }));

  // Return top K sorted by score descending
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Example corpus
const docs = [
  "TypeScript adds static typing to JavaScript",
  "Python is great for data science and machine learning",
  "React is a UI library for building web interfaces",
  "Neural networks are inspired by the human brain",
  "Myocardial infarction occurs when blood flow to the heart stops",
  "Cardiovascular disease is the leading cause of death worldwide",
];

const results = await semanticSearch("heart attack treatment", docs, 3);
console.log(results);`,
        language: "typescript",
        output: `QUERY: "heart attack treatment"

RESULTS (ranked by cosine similarity):
═══════════════════════════════════════════════════
  Rank 1 | Score: 0.847
  "Myocardial infarction occurs when blood flow to the heart stops"
  ↑ No shared words with "heart attack treatment" except "heart"
    but semantically very similar

  Rank 2 | Score: 0.762
  "Cardiovascular disease is the leading cause of death worldwide"
  ↑ Related medical topic

  Rank 3 | Score: 0.312
  "Neural networks are inspired by the human brain"
  ↑ Low score — "brain" has some medical context but unrelated

KEYWORD SEARCH RESULT (for comparison):
═══════════════════════════════════════════════════
  Query: "heart attack treatment"
  Only exact match: "Myocardial infarction..." would NOT be found
  (it contains none of the query words "heart", "attack", "treatment")

SEMANTIC SEARCH WINS WHEN:
  • User uses synonyms or medical/technical terms
  • Query and document are in different languages (cross-lingual models)
  • Document describes the concept without naming it`,
      },
    ],
  },
};

const vectorDatabases: TopicNode = {
  id: "ai-vector-databases",
  title: "Vector Databases",
  iconName: "Database",
  link: "https://www.pinecone.io/learn/vector-database/",
  theory:
    "Vector databases store embeddings and allow fast approximate nearest-neighbor (ANN) search at scale. Searching 10 million vectors in milliseconds requires specialized indexing — standard SQL databases cannot do this efficiently.",
  theoryDetail: {
    keyConcepts: [
      "HNSW (Hierarchical Navigable Small World) — the most common ANN index; fast and accurate",
      "IVF (Inverted File Index) — clusters vectors for efficient search; good for billions of vectors",
      "Metadata filtering: filter by tags/category first, then do vector search within the filtered set",
      "Upsert semantics: most vector DBs use upsert (insert or update by ID) rather than separate insert/update",
      "pgvector (PostgreSQL extension) — adds vector search to Postgres; great for starting out before dedicated DB",
    ],
    whyItMatters:
      "Without a vector database, semantic search on large corpora requires brute-force comparisons across every stored vector — O(n) per query. Vector databases use ANN indexes to reduce this to O(log n).",
    commonPitfalls: [
      "Choosing a managed vector DB before trying pgvector — pgvector handles millions of vectors and saves operational complexity",
      "Not storing the original text alongside the embedding — you need the text to return as search results",
      "Indexing all content at once without chunking — long documents need to be chunked first (see RAG section)",
    ],
    examples: [
      {
        title: "pgvector — semantic search in PostgreSQL",
        description:
          "pgvector adds a vector column type and similarity search operators to standard PostgreSQL.",
        code: `-- ─── Setup ───
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id          SERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  embedding   vector(1536) NOT NULL,  -- matches text-embedding-3-small dims
  source      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for fast approximate nearest-neighbor search
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ─── Insert a document with its embedding ───
INSERT INTO documents (content, embedding, source)
VALUES (
  'TypeScript is a statically typed superset of JavaScript',
  '[0.023, -0.156, ...]'::vector,  -- 1536-dim vector from OpenAI
  'typescript-handbook'
);

-- ─── Semantic search: find top 5 closest documents ───
SELECT
  id,
  content,
  source,
  1 - (embedding <=> $1::vector) AS similarity  -- cosine similarity
FROM documents
WHERE 1 - (embedding <=> $1::vector) > 0.75     -- threshold filter
ORDER BY embedding <=> $1::vector               -- order by distance (ASC)
LIMIT 5;

-- ─── Hybrid: metadata filter + vector search ───
SELECT content, 1 - (embedding <=> $1::vector) AS similarity
FROM documents
WHERE source = 'typescript-handbook'            -- filter first
ORDER BY embedding <=> $1::vector
LIMIT 5;`,
        language: "sql",
        output: `QUERY EMBEDDING: [vector for "static typing in JavaScript"]

SEMANTIC SEARCH RESULTS:
═══════════════════════════════════════════════════
  id │ similarity │ content
  ───┼────────────┼────────────────────────────────────────────────
   1 │   0.924    │ TypeScript is a statically typed superset of JavaScript
   8 │   0.871    │ Static analysis catches bugs before runtime in TS
  23 │   0.843    │ Type annotations in TypeScript help IDEs provide autocomplete
  45 │   0.791    │ Flow is an alternative type checker for JavaScript
  67 │   0.776    │ Strongly typed languages reduce runtime errors

POPULAR VECTOR DATABASE OPTIONS (2026)
═══════════════════════════════════════════════════
  pgvector    → PostgreSQL extension. Self-host. Free. Start here.
  Pinecone    → Managed, serverless. Great DX. Paid.
  Qdrant      → Open-source. Self-host or cloud. Rust-based, fast.
  Weaviate    → Open-source. GraphQL API. Good metadata filtering.
  Chroma      → Open-source. Python-first. Great for prototyping.

WHEN TO UPGRADE FROM pgvector → dedicated vector DB:
  > 10M vectors and < 100ms p99 latency requirement
  Frequent large-scale re-indexing
  Need multi-tenancy isolation at the vector level`,
      },
    ],
  },
};

export const aiEmbeddings: TopicNode = {
  id: "ai-embeddings",
  title: "Embeddings & Vector Search",
  iconName: "Sigma",
  link: "https://platform.openai.com/docs/guides/embeddings",
  theory:
    "Embeddings transform text into high-dimensional vectors where semantic similarity maps to geometric proximity. They are the enabling technology for semantic search, RAG, clustering, and recommendation systems.",
  theoryDetail: {
    keyConcepts: [
      "Embedding models: text → fixed-length float array capturing semantic meaning",
      "Cosine similarity measures angle between vectors; close angle = similar meaning",
      "Vector databases (pgvector, Pinecone, Qdrant) index vectors for fast approximate nearest-neighbor search",
    ],
    whyItMatters:
      "Semantic search and RAG are the two highest-leverage AI features you can add to a product. Both require embeddings. This is a must-know topic for any engineer building AI features.",
    commonPitfalls: [
      "Mixing embedding models for documents and queries",
      "Not caching embeddings — re-embedding the same content wastes money",
    ],
  },
  children: [whatAreEmbeddings, cosineSimilarity, vectorDatabases],
};
