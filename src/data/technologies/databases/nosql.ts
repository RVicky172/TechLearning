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
      "Recreating relational joins at the application layer (doing N+1 lookups) and losing the benefit of the chosen store.",
    ],
    examples: [
      {
        title: "MongoDB: Embedding vs Referencing",
        description: "In NoSQL, you must design your schema based on how the application queries the data, not just how the data relates to itself.",
        code: `// ─── APPROACH 1: Embedding (Denormalization) ───
// Use when: Data is accessed together, and the embedded array won't grow infinitely.
// Example: A User and their primary shipping addresses.
const userDocument = {
  _id: ObjectId("507f191e810c19729de860ea"),
  name: "Alice",
  email: "alice@example.com",
  addresses: [
    { street: "123 Main St", city: "NY", zip: "10001" },
    { street: "456 Market St", city: "SF", zip: "94105" }
  ]
};
// PROS: One single query fetches everything. Fast reads.
// CONS: Updating an address requires finding the user first.

// ─── APPROACH 2: Referencing (Normalization) ───
// Use when: Data is queried independently, or the "many" side of a relationship is huge.
// Example: A Publisher and thousands of Books.
const publisherDocument = {
  _id: "pub_123",
  name: "Tech Press",
  founded: 1999
};

const bookDocument = {
  _id: "book_999",
  title: "Learning NoSQL",
  publisher_id: "pub_123" // Reference
};
// PROS: Books can grow infinitely without hitting the 16MB document limit.
// CONS: Requires two queries (or a $lookup pipeline) to fetch Publisher + Books.`,
        language: "javascript",
      }
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