import type { TopicNode } from "@/data/types";

export const ormPrisma: TopicNode = {
  id: "orm-prisma",
  title: "Prisma ORM",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Prisma: Next-generation ORM for Node.js and TypeScript",
      "Schema: single source of truth for database structure",
      "Migrations: auto-generated from schema changes",
      "Prisma Client: type-safe query builder auto-generated from schema",
      "Relations: handle joins, nested queries, aggregations",
      "Seeds: populate test data via seed scripts",
    ],
    examples: [
      {
        title: "Prisma Schema & Queries",
        description: "Define schema and generate type-safe queries.",
        code: `// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}

---

// app/page.tsx - Type-safe queries
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // Get all posts with their authors (eager loading)
  const posts = await prisma.post.findMany({
    include: { author: true },
  });

  // Create with relation
  const newPost = await prisma.post.create({
    data: {
      title: 'Hello',
      content: 'World',
      author: {
        connect: { id: 1 },
      },
    },
    include: { author: true },
  });

  return posts.map(p => <div key={p.id}>{p.title}</div>);
}`,
        language: "typescript",
      },
    ],
  },
};
