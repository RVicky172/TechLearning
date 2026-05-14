import type { TopicNode } from "@/data/types";

export const graphqlResolvers: TopicNode = {
  id: "graphql-resolvers",
  title: "Resolvers & Execution",
  iconName: "Cpu",
  theoryDetail: {
    keyConcepts: [
      "Resolvers are functions that return data for each field in the schema",
      "Default resolver returns obj[fieldName] if no custom resolver defined",
      "Arguments passed to resolvers: (obj, args, context, info)",
      "Async resolvers automatically await; use Promise.all() for parallel fetching",
      "DataLoader batches and caches database queries to prevent N+1 problems",
      "Context object carries auth, database connections, and shared utilities",
    ],
    whyItMatters:
      "Understanding resolvers is crucial for building performant GraphQL APIs. Poor resolver implementations cause N+1 queries and cascading request errors.",
    commonPitfalls: [
      "N+1 queries from nested resolvers; use DataLoader for batching",
      "Not caching resolver results; same query repeated multiple times",
      "Exposing database errors to clients; wrap in try/catch and return safe messages",
      "Blocking resolvers with synchronous operations; always use async",
      "Not handling partial failures; some fields may succeed while others fail",
    ],
    examples: [
      {
        title: "Resolvers with DataLoader",
        description: "Prevent N+1 queries with batching.",
        code: `import DataLoader from 'dataloader';

// Batch loader for users
const userLoader = new DataLoader(async (ids) => {
  const users = await db.user.findMany({
    where: { id: { in: ids } },
  });
  return ids.map(id => users.find(u => u.id === id));
});

const resolvers = {
  Query: {
    post: async (_, { id }, context) => {
      return await context.db.post.findUnique({ where: { id } });
    },
    posts: async (_, { limit }, context) => {
      return await context.db.post.findMany({ take: limit });
    },
  },

  Post: {
    author: async (post, _, context) => {
      // DataLoader batches these calls
      return await userLoader.load(post.authorId);
    },
  },

  Mutation: {
    createPost: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      
      const post = await context.db.post.create({
        data: {
          ...input,
          authorId: context.user.id,
        },
      });

      return post;
    },
  },
};`,
        language: "typescript",
      },
    ],
  },
};
