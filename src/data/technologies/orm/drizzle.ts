import type { TopicNode } from "@/data/types";

export const ormDrizzle: TopicNode = {
  id: "orm-drizzle",
  title: "Drizzle ORM",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Drizzle: lightweight, zero-dependency TypeScript ORM",
      "Schema: define tables and types in TypeScript",
      "SQL-like API: chainable query builder that feels natural to SQL developers",
      "Type inference: automatic TypeScript types from schema",
      "Migrations: programmatic or SQL-based",
      "Smaller bundle: lighter than Prisma for edge functions",
    ],
  },
};
