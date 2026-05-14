import type { TopicNode } from "@/data/types";

export const databasesNoSql: TopicNode = {
  id: "databases-nosql",
  title: "NoSQL Systems",
  iconName: "Layers",
  theory:
    "NoSQL is not one thing. It includes document stores, key-value databases, column-family systems, graph databases, and specialized services optimized for specific access patterns and scale characteristics.",
  theoryDetail: {
    keyConcepts: [
      "Document stores like MongoDB work well when aggregates are loaded together and schema flexibility matters.",
      "Key-value systems like Redis and DynamoDB optimize for predictable access patterns and high throughput.",
      "Denormalization is a feature, not a mistake, when it reduces expensive joins in distributed systems.",
      "Partition keys and hot-key avoidance are central to scalable NoSQL design.",
    ],
    whyItMatters:
      "Modern systems frequently combine SQL and NoSQL. Knowing when to use MongoDB, DynamoDB, Redis, or a graph database prevents cargo-cult architecture and keeps costs under control.",
    commonPitfalls: [
      "Choosing NoSQL just because it sounds more scalable, without understanding the access pattern.",
      "Using a poor partition key and creating hot shards under load.",
      "Recreating relational joins at the application layer and losing the benefit of the chosen store.",
    ],
  },
  children: [
    {
      id: "databases-document",
      title: "Document Databases",
      iconName: "FileJson",
      theory:
        "MongoDB and similar systems store JSON-like documents. They are strong when one document can represent a whole aggregate and evolve with the product.",
      link: "https://www.mongodb.com/docs/manual/introduction/",
    },
    {
      id: "databases-key-value",
      title: "Key-Value and Wide-Column",
      iconName: "KeyRound",
      theory:
        "DynamoDB, Redis, and Cassandra reward strict access-pattern design. Model the partition key, sort key, and query shape before writing application code.",
      link: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
    },
  ],
};