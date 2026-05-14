import type { TopicNode } from "@/data/types";

export const nextjsEcosystem: TopicNode = {
  id: "nextjs-ecosystem",
  title: "Ecosystem & Integrations",
  iconName: "Package",
  theoryDetail: {
    keyConcepts: [
      "Authentication: Auth0, NextAuth.js, Clerk, Supabase handle user management",
      "Databases: Prisma, Drizzle for type-safe queries; direct drivers (postgres, mysql) for raw SQL",
      "Form handling: React Hook Form integrates with Server Actions for validation",
      "Styling: Tailwind CSS, CSS Modules, or styled-components all work seamlessly",
      "CMS: Contentful, Sanity, Strapi for headless content management",
      "Deployment: Vercel, AWS, Azure, self-hosted all supported",
    ],
    whyItMatters:
      "The Next.js ecosystem provides battle-tested solutions for common fullstack needs. Choosing the right tools saves time and prevents re-building solved problems.",
    commonPitfalls: [
      "Picking tools before understanding your needs; evaluate based on team experience",
      "Mixing too many tools; a simple app doesn't need Auth0 + Firebase + Supabase",
      "Not checking if a tool has Next.js/Server Components support; some are client-only",
      "Assuming ecosystem tools will just work; always check for edge runtime compatibility",
    ],
    examples: [
      {
        title: "Popular Stack: Next.js + Prisma + NextAuth",
        description: "Common fullstack setup for production apps.",
        code: `// schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id    Int     @id @default(autoincrement())
  title String
  author User @relation(fields: [authorId], references: [id])
  authorId Int
}

---

// app/auth.ts - NextAuth configuration
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && await bcrypt.compare(credentials.password, user.hash)) {
          return { id: user.id, email: user.email };
        }
        return null;
      },
    }),
  ],
});

---

// app/dashboard/page.tsx - Protected route
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const posts = await db.post.findMany({
    where: { authorId: parseInt(session.user.id) },
  });

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <div>{posts.map(p => <p key={p.id}>{p.title}</p>)}</div>
    </div>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
