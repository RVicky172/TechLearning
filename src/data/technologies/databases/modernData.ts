import type { TopicNode } from "@/data/types";

export const databasesModernData: TopicNode = {
  id: "databases-modern-data",
  title: "Modern Data Workloads",
  iconName: "Sparkles",
  theory:
    "Current production stacks often add specialized storage for search, analytics, events, and AI. The relevant skill is not memorizing brands but understanding when a general-purpose database stops being the best fit.",
  theoryDetail: {
    keyConcepts: [
      "Search engines like Elasticsearch or OpenSearch are optimized for full-text search and ranking, not transactional correctness.",
      "Analytical warehouses favor large scans and aggregations over OLTP-style transactional workloads.",
      "Message logs and streams capture ordered events for asynchronous systems and data pipelines.",
      "Vector databases and vector indexes support semantic retrieval for AI features, but they still need filtering, freshness, and cost control.",
    ],
    whyItMatters:
      "A modern engineer will likely work on search, analytics, recommendation, or AI-adjacent features. Understanding these workload boundaries helps you extend a stack without creating accidental complexity.",
    commonPitfalls: [
      "Using the primary relational database for full-text ranking or heavy analytics without separating workloads.",
      "Adding a vector database before proving that simple PostgreSQL plus pgvector is insufficient.",
      "Shipping event-driven systems without clear idempotency and replay strategy.",
    ],
  },
  children: [
    {
      id: "databases-search-engines",
      title: "Search and Retrieval",
      iconName: "Search",
      theory:
        "Search systems index text and documents for fast relevance-based lookup. Learn tokenization, ranking, faceting, and synchronization from the source of truth.",
      link: "https://opensearch.org/docs/latest/",
    },
    {
      id: "databases-vector",
      title: "Vector Storage for AI Features",
      iconName: "Brain",
      theory:
        "Semantic search, recommendations, and RAG often start with embeddings plus vector search. The practical skill is combining vector similarity with metadata filters, caching, and cost-aware indexing.",
      link: "https://github.com/pgvector/pgvector",
    },
  ],
};