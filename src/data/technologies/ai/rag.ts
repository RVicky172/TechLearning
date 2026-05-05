import type { TopicNode } from "@/data/types";

const ragPipeline: TopicNode = {
  id: "ai-rag-pipeline",
  title: "RAG Pipeline",
  iconName: "Workflow",
  link: "https://python.langchain.com/docs/tutorials/rag/",
  theory:
    "RAG (Retrieval Augmented Generation) grounds LLM answers in your data by retrieving relevant documents at query time and injecting them into the prompt. The model answers from the retrieved context, not its training data.",
  theoryDetail: {
    keyConcepts: [
      "Indexing phase (offline): chunk → embed → store in vector DB",
      "Query phase (online): embed query → retrieve top-K chunks → inject into prompt → generate",
      "The LLM never 'knows' your documents — it reads them fresh from context on each query",
      "Retrieval quality determines answer quality — a bad retriever makes a good generator useless",
      "Hybrid search (keyword + semantic) outperforms pure semantic search for most enterprise use cases",
    ],
    whyItMatters:
      "Fine-tuning teaches a model new behavior. RAG gives a model access to current, private, or specialized knowledge without retraining. RAG is faster to build, cheaper, and updatable in real time.",
    commonPitfalls: [
      "Using top-K=1 — retrieving a single chunk misses complementary information; 3-5 chunks is a better default",
      "Injecting chunks with no source metadata — the model can't cite sources and you can't debug wrong answers",
      "Not testing retrieval in isolation before testing generation — split eval into retrieval eval and generation eval",
    ],
    examples: [
      {
        title: "Full RAG pipeline implementation",
        description:
          "A complete indexing + query pipeline using OpenAI embeddings and pgvector.",
        code: `import OpenAI from "openai";
import { Pool } from "pg";

const client = new OpenAI();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// ═══ INDEXING PHASE (run once, offline) ═══

async function indexDocument(content: string, source: string) {
  // 1. Chunk the document
  const chunks = chunkText(content, { maxTokens: 400, overlap: 50 });

  // 2. Embed all chunks in one batched API call
  const { data } = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });

  // 3. Store chunks + embeddings in pgvector
  const values = chunks.map((chunk, i) => ({
    content: chunk,
    embedding: data[i].embedding,
    source,
  }));

  await db.query(
    \`INSERT INTO documents (content, embedding, source)
     SELECT * FROM unnest($1::text[], $2::vector[], $3::text[])\`,
    [values.map(v => v.content), values.map(v => v.embedding), values.map(v => v.source)]
  );
}

// ═══ QUERY PHASE (runs on every user question) ═══

async function ragQuery(question: string): Promise<string> {
  // 1. Embed the question
  const { data } = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const queryVector = data[0].embedding;

  // 2. Retrieve top 4 most relevant chunks
  const { rows } = await db.query<{ content: string; source: string; similarity: number }>(
    \`SELECT content, source, 1 - (embedding <=> $1::vector) AS similarity
     FROM documents
     WHERE 1 - (embedding <=> $1::vector) > 0.75
     ORDER BY embedding <=> $1::vector
     LIMIT 4\`,
    [JSON.stringify(queryVector)]
  );

  if (rows.length === 0) {
    return "I don't have enough information to answer that question.";
  }

  // 3. Build context from retrieved chunks
  const context = rows
    .map((row, i) => \`[Source \${i + 1}: \${row.source}]\n\${row.content}\`)
    .join("\n\n");

  // 4. Generate answer grounded in retrieved context
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: \`Answer the user's question using ONLY the provided context.
If the context doesn't contain the answer, say "I don't have that information."
Always cite the source numbers you used.

Context:
\${context}\`,
      },
      { role: "user", content: question },
    ],
  });

  return response.choices[0].message.content!;
}`,
        language: "typescript",
        output: `RAG PIPELINE FLOW
═══════════════════════════════════════════════════

  INDEXING (offline, one-time):
  ┌─────────────────────────────────────────────────────┐
  │  PDF / Docs / Web pages                             │
  │       ↓  chunk (400 tokens, 50 overlap)             │
  │  ["TypeScript adds types...", "Interfaces define..."]│
  │       ↓  embed (text-embedding-3-small)             │
  │  [[0.02, -0.15, ...], [0.08, -0.03, ...]]           │
  │       ↓  store                                      │
  │  pgvector (content + embedding + source)            │
  └─────────────────────────────────────────────────────┘

  QUERY (online, per user question):
  User: "What is a TypeScript interface?"
       ↓  embed query
  [0.019, -0.14, 0.09, ...]   (1536-dim vector)
       ↓  vector search (cosine similarity)
  Top 4 chunks retrieved (similarity > 0.75)
       ↓  build context string
  [Source 1: ts-handbook] Interfaces define the shape of objects...
  [Source 2: ts-handbook] An interface can extend other interfaces...
       ↓  LLM generation (gpt-4o-mini, temp 0.2)
  "A TypeScript interface defines the shape of an object [Source 1].
   It specifies which properties are required and their types..."

ACCURACY COMPARISON
═══════════════════════════════════════════════════
  LLM alone (no RAG):
    Answers from training data → may be outdated or hallucinated
    No source citations → unverifiable

  RAG:
    Answers from YOUR documents → always current
    Source citations → verifiable
    Unknown topics → "I don't have that information" (honest)`,
      },
    ],
  },
};

const chunkingStrategies: TopicNode = {
  id: "ai-chunking",
  title: "Chunking Strategies",
  iconName: "Puzzle",
  link: "https://www.pinecone.io/learn/chunking-strategies/",
  theory:
    "Chunking splits documents into segments small enough to embed meaningfully but large enough to contain a complete idea. Chunk size is the most impactful RAG parameter — wrong sizing is the #1 cause of poor retrieval.",
  theoryDetail: {
    keyConcepts: [
      "Fixed-size: split every N tokens — simple but can split sentences mid-thought",
      "Sentence/paragraph splitting: preserves semantic units — better default than fixed-size",
      "Recursive text splitter: tries paragraph → sentence → word — preserves meaning at each level",
      "Overlap (50-100 tokens between chunks): prevents losing context at chunk boundaries",
      "Chunk size vs retrieval: small chunks (100-200 tokens) are precise; large chunks (500-1000) have more context",
    ],
    whyItMatters:
      "A chunk that splits a sentence loses the meaning of both halves. A chunk that is too large forces the retriever to return massive, irrelevant context. Chunking strategy directly determines RAG accuracy.",
    commonPitfalls: [
      "Using chunk size 1000 tokens and top_k=4 — that's 4000 tokens of context, which may hit your prompt budget",
      "Not adding overlap — consecutive chunks with no overlap lose the transition between ideas",
      "Chunking code files by token count — code should be chunked by function/class boundary",
    ],
    examples: [
      {
        title: "Recursive text splitter with overlap",
        description:
          "The recursive splitter tries larger separators first, falling back to smaller ones — best general-purpose strategy.",
        code: `// Simplified recursive text splitter (production use: LangChain's RecursiveCharacterTextSplitter)

interface ChunkOptions {
  maxTokens: number;
  overlap: number;
  separators?: string[];
}

function roughTokenCount(text: string): number {
  return Math.ceil(text.length / 4); // rough estimate: 1 token ≈ 4 chars
}

function chunkText(text: string, opts: ChunkOptions): string[] {
  const { maxTokens, overlap, separators = ["\n\n", "\n", ". ", " ", ""] } = opts;

  if (roughTokenCount(text) <= maxTokens) return [text];

  for (const sep of separators) {
    if (!text.includes(sep) && sep !== "") continue;

    const parts = sep ? text.split(sep) : text.split("");
    const chunks: string[] = [];
    let current = "";

    for (const part of parts) {
      const candidate = current ? current + sep + part : part;
      if (roughTokenCount(candidate) > maxTokens) {
        if (current) chunks.push(current.trim());
        // Start new chunk with overlap from end of previous
        const overlapText = current.slice(-overlap * 4); // rough char count for overlap
        current = overlapText ? overlapText + sep + part : part;
      } else {
        current = candidate;
      }
    }
    if (current) chunks.push(current.trim());

    if (chunks.length > 1) return chunks;
  }

  return [text];
}

// ─── Usage ───
const document = \`TypeScript is a strongly typed programming language...
[...thousands of words...]\`;

const chunks = chunkText(document, {
  maxTokens: 400,   // ~1600 chars per chunk
  overlap: 50,      // ~200 chars overlap between chunks
});

console.log(\`Split into \${chunks.length} chunks\`);
chunks.forEach((chunk, i) =>
  console.log(\`Chunk \${i + 1}: \${roughTokenCount(chunk)} tokens\`)
);`,
        language: "typescript",
        output: `CHUNKING RESULTS (10,000-word TypeScript guide)
═══════════════════════════════════════════════════
  Split into 34 chunks

  Chunk  1: 398 tokens | "TypeScript is a strongly typed..."
  Chunk  2: 402 tokens | "...typed at compile time. Interfaces..."  ← overlap with chunk 1
  Chunk  3: 395 tokens | "...Interfaces define object shapes..."
  ...
  Chunk 34: 201 tokens | "...and that's why TypeScript matters."

CHUNK SIZE TRADEOFF
═══════════════════════════════════════════════════
  Small chunks (100-200 tokens):
  + Precise retrieval — very targeted results
  + More chunks = finer granularity
  - May lose context (a sentence with no surrounding paragraph)
  - Need more chunks to cover an idea → more DB space

  Large chunks (500-1000 tokens):
  + More context per chunk — richer answers
  - Noisy — irrelevant content dilutes the retrieved context
  - Uses more prompt tokens → higher cost per query

  RECOMMENDED DEFAULTS:
  ┌─────────────────┬──────────────┬──────────────┐
  │ Content type    │ Chunk size   │ Overlap      │
  ├─────────────────┼──────────────┼──────────────┤
  │ General text    │ 300-500 tok  │ 50-75 tok    │
  │ Technical docs  │ 400-600 tok  │ 75-100 tok   │
  │ Code (by fn)    │ per function │ no overlap   │
  │ Q&A / FAQ       │ 1 Q&A pair   │ no overlap   │
  └─────────────────┴──────────────┴──────────────┘`,
      },
    ],
  },
};

const reranking: TopicNode = {
  id: "ai-reranking",
  title: "Re-ranking & Hybrid Search",
  iconName: "ArrowUpDown",
  link: "https://www.cohere.com/blog/rerank",
  theory:
    "First-stage retrieval (vector search) optimizes for speed over precision. Re-ranking uses a slower but more accurate cross-encoder model to re-score the top-K candidates, dramatically improving result quality.",
  theoryDetail: {
    keyConcepts: [
      "Bi-encoder (embedding search): encodes query and documents independently — fast but less precise",
      "Cross-encoder (re-ranker): sees both query and document together — slow but much more accurate",
      "Hybrid search: combine BM25 (keyword) + semantic scores with Reciprocal Rank Fusion (RRF)",
      "Typical pipeline: retrieve top-20 with vector search → re-rank → use top-4 for generation",
      "Cohere Rerank, Jina Reranker, and Voyage AI offer managed re-ranking APIs",
    ],
    whyItMatters:
      "Vector search retrieves semantically close documents, but 'close' doesn't always mean 'relevant to the exact query'. Re-ranking catches cases where a document matches the topic but not the specific question.",
    commonPitfalls: [
      "Re-ranking all documents in the DB — only re-rank the top-K from the first stage (e.g. top-20)",
      "Skipping re-ranking and calling it done — re-ranking is a 15-minute add that often gives +10-15% accuracy",
      "Not measuring: add re-ranking without eval → no way to know if it helped",
    ],
    examples: [
      {
        title: "Two-stage retrieval with Cohere re-ranking",
        description:
          "Retrieve 20 candidates with vector search, re-rank to 4, pass top 4 to the LLM.",
        code: `import OpenAI from "openai";
import { CohereClient } from "cohere-ai";
import { Pool } from "pg";

const openai = new OpenAI();
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });
const db = new Pool({ connectionString: process.env.DATABASE_URL });

async function ragWithReranking(question: string): Promise<string> {
  // ─── Stage 1: Fast vector retrieval (top 20) ───
  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const { rows } = await db.query<{ id: number; content: string }>(
    \`SELECT id, content
     FROM documents
     ORDER BY embedding <=> $1::vector
     LIMIT 20\`,   // retrieve 20 candidates
    [JSON.stringify(data[0].embedding)]
  );

  // ─── Stage 2: Re-rank with cross-encoder (top 4) ───
  const reranked = await cohere.rerank({
    model:     "rerank-english-v3.0",
    query:     question,
    documents: rows.map(r => r.content),
    top_n:     4,   // keep only top 4 after re-ranking
  });

  const topChunks = reranked.results.map(r => ({
    content:        rows[r.index].content,
    relevanceScore: r.relevanceScore,
  }));

  // ─── Stage 3: Generate from top 4 re-ranked chunks ───
  const context = topChunks
    .map((c, i) => \`[\${i + 1}] (score: \${c.relevanceScore.toFixed(2)})\n\${c.content}\`)
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: \`Answer using ONLY this context:\n\${context}\` },
      { role: "user",   content: question },
    ],
  });

  return response.choices[0].message.content!;
}`,
        language: "typescript",
        output: `QUERY: "What are the performance implications of TypeScript generics?"

STAGE 1 — Vector search (top 20 by cosine similarity):
═══════════════════════════════════════════════════
  Rank  1 (sim 0.89): "TypeScript generics allow type-safe reusable code..."
  Rank  2 (sim 0.87): "Generic functions work with any type while preserving safety..."
  Rank  3 (sim 0.85): "Performance in TypeScript compiles away — generics are erased..."
  Rank  4 (sim 0.84): "Type inference in TypeScript reduces the need for annotations..."
  ...
  Rank 20 (sim 0.71): "TypeScript documentation and tooling support..."

  Problem: Ranks 1, 2, 4 are about WHAT generics are, not PERFORMANCE implications.
  Rank 3 is what we actually want — but the cross-encoder will catch this.

STAGE 2 — Cohere re-ranking (cross-encoder sees query+doc together):
═══════════════════════════════════════════════════
  Re-rank #1 (score 0.97): "Performance in TypeScript compiles away — generics are erased..."
  Re-rank #2 (score 0.82): "Conditional types can slow TypeScript compilation significantly..."
  Re-rank #3 (score 0.71): "Generic functions work with any type while preserving safety..."
  Re-rank #4 (score 0.64): "TypeScript generic constraints limit the types accepted..."

  The performance-specific chunk moved from position 3 → position 1. ✅

IMPACT ON ANSWER QUALITY:
  Without re-ranking: LLM answers about WHAT generics are (wrong topic)
  With re-ranking:    LLM answers about PERFORMANCE implications (correct)`,
      },
    ],
  },
};

export const aiRag: TopicNode = {
  id: "ai-rag",
  title: "RAG (Retrieval Augmented Generation)",
  iconName: "BookOpenCheck",
  link: "https://arxiv.org/abs/2005.11401",
  theory:
    "RAG is the architecture for giving LLMs access to your own data. Instead of fine-tuning the model's weights, RAG retrieves relevant documents at runtime and injects them into the prompt — producing grounded, citable answers.",
  theoryDetail: {
    keyConcepts: [
      "Two phases: indexing (offline: chunk → embed → store) and querying (online: embed → retrieve → generate)",
      "RAG vs fine-tuning: RAG for knowledge access; fine-tuning for behavior/style change",
      "Chunk size and retrieval quality are the primary levers for RAG accuracy",
    ],
    whyItMatters:
      "RAG is the #1 AI feature companies deploy. It turns an LLM into a domain expert over your private documents without retraining. Essential for product docs, internal knowledge bases, and customer support.",
    commonPitfalls: [
      "Treating RAG as a black box — you must eval retrieval and generation separately",
      "Forgetting to re-index when documents change",
    ],
  },
  children: [ragPipeline, chunkingStrategies, reranking],
};
