import type { TopicNode } from "@/data/types";

export const databasesSpecialized: TopicNode = {
  id: "databases-specialized",
  title: "Specialized Databases",
  iconName: "Layers",
  link: "https://db-engines.com/en/ranking_categories",
  theory:
    "Beyond relational and general-purpose NoSQL, modern applications use purpose-built databases optimised for specific data shapes and access patterns: graph databases for relationship traversal, time-series databases for sensor/metrics data, full-text search engines, and vector databases for AI-powered semantic search. Using the right database for the job is often more impactful than optimising the wrong one.",
  theoryDetail: {
    keyConcepts: [
      "Graph databases (Neo4j, Amazon Neptune): model data as nodes and edges — optimal for relationship-heavy queries like social graphs, recommendation engines, fraud detection; traversal of deep relationships is O(1) per hop vs expensive recursive joins in SQL",
      "Time-series databases (TimescaleDB, InfluxDB): optimised for append-mostly data with a time dimension — automatic partitioning by time, efficient downsampling/aggregation, compression (InfluxDB: 90%+ compression); use for metrics, IoT sensor data, financial tick data",
      "Full-text search (Elasticsearch, Typesense, Meilisearch): inverted-index-based engines — tokenise text, support relevance ranking, fuzzy matching, faceting, and highlighting; Elasticsearch handles petabyte scale, Typesense/Meilisearch are simpler and faster for smaller datasets",
      "Vector databases (Pinecone, Weaviate, Qdrant, pgvector): store high-dimensional embedding vectors and perform approximate nearest-neighbour (ANN) search — the foundation of semantic search and RAG systems",
      "Wide-column databases (Apache Cassandra, ScyllaDB, Google Bigtable): rows identified by a partition key + clustering columns; exceptional write throughput (millions/s) and linear horizontal scaling; used at Facebook, Netflix, Apple for user activity feeds",
      "Document databases (MongoDB, Firestore, DynamoDB with JSON): flexible schema, aggregates modelled as documents; best when the app always fetches the entire aggregate together",
      "Multi-model: PostgreSQL with extensions can handle JSON (JSONB), full-text search (tsvector), geospatial (PostGIS), and vectors (pgvector) — often the right choice to avoid operating multiple databases early on",
    ],
    whyItMatters:
      "Picking a database is an architectural decision that's expensive to reverse. Senior engineers are expected to know the trade-off matrix — not just SQL vs NoSQL, but which NoSQL and why. Vector databases are now essential knowledge for any team building AI-powered features.",
    commonPitfalls: [
      "Running full-text search queries against LIKE '%term%' in PostgreSQL — this is a sequential scan; use tsvector/tsquery (pg full-text search) or a dedicated search engine for anything beyond simple prefix matching",
      "Using Elasticsearch for transactional writes — ES is eventually consistent and not ACID; use it as a search replica fed by CDC (change data capture), not as your source of truth",
      "Storing vectors in a regular DB column and doing brute-force cosine similarity with no index — fine under 10k vectors, breaks above 100k; use pgvector's IVFFlat/HNSW index or a dedicated vector DB",
      "Cassandra with relational patterns — you cannot do ad-hoc JOINs or flexible WHERE clauses; every query pattern must be a pre-designed table",
    ],
    examples: [
      {
        title: "pgvector — semantic search with OpenAI embeddings",
        description:
          "Store document embeddings in PostgreSQL with pgvector and find the most semantically similar documents to a query.",
        code: `-- 1. Enable the extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Store embeddings alongside content
CREATE TABLE documents (
  id         BIGSERIAL PRIMARY KEY,
  content    TEXT        NOT NULL,
  embedding  VECTOR(1536) NOT NULL   -- OpenAI text-embedding-3-small dimension
);

-- 3. Create an HNSW index for fast approximate nearest-neighbour search
CREATE INDEX ON documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 4. Find the 5 most similar documents to a query vector
SELECT id, content,
       1 - (embedding <=> $1::vector) AS similarity
FROM documents
ORDER BY embedding <=> $1::vector   -- <=> is cosine distance
LIMIT 5;`,
        language: "sql",
      },
      {
        title: "TimescaleDB — insert metrics and downsample",
        description:
          "TimescaleDB extends PostgreSQL with hypertables that automatically partition time-series data by time.",
        code: `-- 1. Create hypertable (automatic time-based partitioning)
CREATE TABLE cpu_metrics (
  time        TIMESTAMPTZ NOT NULL,
  host        TEXT        NOT NULL,
  cpu_percent DOUBLE PRECISION
);

SELECT create_hypertable('cpu_metrics', 'time');

-- 2. Insert — same as regular PostgreSQL
INSERT INTO cpu_metrics VALUES (NOW(), 'web-01', 42.5);

-- 3. Downsample — 5-minute averages using time_bucket
SELECT
  time_bucket('5 minutes', time) AS bucket,
  host,
  AVG(cpu_percent)               AS avg_cpu,
  MAX(cpu_percent)               AS max_cpu
FROM cpu_metrics
WHERE time >= NOW() - INTERVAL '1 hour'
GROUP BY bucket, host
ORDER BY bucket DESC;

-- 4. Set data retention — automatically drop data older than 90 days
SELECT add_retention_policy('cpu_metrics', INTERVAL '90 days');`,
        language: "sql",
      },
    ],
  },
};
