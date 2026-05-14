import type { TopicNode } from "@/data/types";

export const ormFundamentals: TopicNode = {
  id: "orm-fundamentals",
  title: "ORM & Query Builder Fundamentals",
  iconName: "Database",
  theoryDetail: {
    keyConcepts: [
      "ORMs map database tables to classes/types; query builders build SQL programmatically",
      "Type safety: TypeScript-first ORMs prevent common SQL mistakes",
      "Migrations: version control for database schema changes",
      "Relations: handle one-to-many, many-to-many automatically",
      "Query building: chainable API for complex queries without raw SQL",
      "Performance: lazy loading, eager loading, and N+1 query prevention",
    ],
    whyItMatters:
      "ORMs reduce boilerplate and prevent SQL injection. Type safety catches bugs at compile time instead of runtime.",
    commonPitfalls: [
      "N+1 queries from lazy-loaded relations; use eager loading (.include())",
      "Bloated objects from unnecessary fields; select only needed columns",
      "Not using migrations; schema drifts from code",
      "Over-using ORMs for complex queries; sometimes raw SQL is clearer",
    ],
  },
};
