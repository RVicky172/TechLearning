import type { TopicNode } from "@/data/types";

export const graphqlFundamentals: TopicNode = {
  id: "graphql-fundamentals",
  title: "GraphQL Fundamentals",
  iconName: "Network",
  theoryDetail: {
    keyConcepts: [
      "GraphQL is a query language and runtime for APIs—clients request exactly what they need",
      "Strongly typed schema defines all possible queries, mutations, and subscriptions",
      "No over-fetching or under-fetching; request only the fields you need",
      "Single endpoint for all operations (vs REST's many endpoints)",
      "Resolver functions transform schema fields into actual data",
      "Introspection allows clients to discover the schema at runtime",
    ],
    whyItMatters:
      "GraphQL eliminates common REST API problems like over-fetching and versioning. It provides a contract between frontend and backend, enabling better tooling and type safety.",
    commonPitfalls: [
      "Using GraphQL for simple read-only APIs; REST is fine and simpler",
      "N+1 query problems from nested resolvers; use batching and caching",
      "Overly complex schemas with too much nesting; keep queries relatively flat",
      "Insufficient authentication; GraphQL endpoints need the same security as REST",
      "Missing query complexity analysis; malicious queries can cause DOS",
    ],
    examples: [
      {
        title: "Basic GraphQL Schema",
        description: "Define types, queries, and mutations.",
        code: `type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  posts(limit: Int = 10): [Post!]!
}

type Mutation {
  createPost(title: String!, content: String!): Post!
  updateUser(id: ID!, name: String): User
  deletePost(id: ID!): Boolean!
}

type Subscription {
  postCreated: Post!
}`,
        language: "graphql",
      },
      {
        title: "Query Examples",
        description: "Clients request exactly what they need.",
        code: `# Simple query
query GetUser {
  user(id: "1") {
    id
    name
    email
  }
}

# Nested query
query UserWithPosts {
  user(id: "1") {
    name
    posts {
      id
      title
      createdAt
    }
  }
}

# Mutation
mutation CreatePost {
  createPost(title: "Hello", content: "World") {
    id
    title
    author {
      name
    }
  }
}

# Subscription
subscription OnNewPost {
  postCreated {
    id
    title
    author { name }
  }
}`,
        language: "graphql",
      },
    ],
  },
};
