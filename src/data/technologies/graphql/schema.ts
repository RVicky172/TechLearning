import type { TopicNode } from "@/data/types";

export const graphqlSchema: TopicNode = {
  id: "graphql-schema",
  title: "Schema Design & Best Practices",
  iconName: "GitBranch",
  theoryDetail: {
    keyConcepts: [
      "Schema-first development: define contracts before implementation",
      "Keep mutation inputs in Input types separate from output types",
      "Use enums for fixed sets of values instead of strings",
      "Null safety: required fields use ! suffix; be explicit about nullability",
      "Pagination: use cursor-based or offset-based strategies for large datasets",
      "Versioning: avoid breaking changes; use @deprecated directive for safe deprecations",
    ],
    whyItMatters:
      "Well-designed schemas prevent common mistakes like breaking API changes, over-complex queries, and performance issues. Good schema design scales as teams and codebases grow.",
    commonPitfalls: [
      "Exposing internal database structure directly; add abstraction layer",
      "Missing proper pagination; queries on millions of records cause timeouts",
      "Breaking changes without deprecation warnings; always use @deprecated",
      "Cyclic types that lead to infinite nesting",
      "Storing sensitive data in response types; filter server-side",
    ],
    examples: [
      {
        title: "Well-Structured Schema",
        description: "Proper types, inputs, and patterns.",
        code: `enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

input CreatePostInput {
  title: String!
  content: String!
  status: PostStatus = DRAFT
}

input UpdatePostInput {
  id: ID!
  title: String
  content: String
  status: PostStatus
}

type Post {
  id: ID!
  title: String!
  content: String!
  status: PostStatus!
  author: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type PostEdge {
  cursor: String!
  node: Post!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type Query {
  post(id: ID!): Post
  posts(first: Int = 10, after: String): PostConnection!
  me: User
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(input: UpdatePostInput!): Post
  deletePost(id: ID!): Boolean!
}`,
        language: "graphql",
      },
    ],
  },
};
