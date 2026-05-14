import type { TopicNode } from "@/data/types";

export const environmentFundamentals: TopicNode = {
  id: "env-fundamentals",
  title: "Environment Variables & Configuration",
  iconName: "Settings",
  theoryDetail: {
    keyConcepts: [
      "Environment variables: runtime configuration independent of code",
      ".env files: local development secrets and config",
      ".env.example: committed to repo, documents required variables",
      ".gitignore: always ignore .env to prevent secrets in Git",
      "NEXT_PUBLIC_: prefix for variables exposed to the browser in Next.js",
      "Secrets in CI/CD: platform-specific UI for secure runtime variables",
    ],
    whyItMatters:
      "Environment variables prevent hardcoding secrets and enable configuration across development, staging, and production without code changes.",
    commonPitfalls: [
      "Committing .env to Git; secrets end up in public repositories",
      "Using NEXT_PUBLIC_* for sensitive data; visible in browser",
      "Not setting variables in deployment platform; app fails on production",
      "Inconsistent variable names; document them in .env.example",
      "Storing build-time config in .env.local; won't work in CI/CD unless set there too",
    ],
    examples: [
      {
        title: "Environment Configuration",
        description: "Proper .env setup and usage.",
        code: `# .env.local (local development only, in .gitignore)
DATABASE_URL="postgresql://user:pass@localhost:5432/dev_db"
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY="sk_test_123456789"
NEXT_PUBLIC_API_URL="http://localhost:3000"
JWT_SECRET="super_secret_dev_key"

---

# .env.example (committed to repo)
DATABASE_URL=
REDIS_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_API_URL=
JWT_SECRET=

---

# lib/config.ts - Validated config at startup
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_API_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
});

export const config = envSchema.parse(process.env);

---

// app/api/route.ts - Using config
import { config } from '@/lib/config';

export async function POST(request: Request) {
  const db = new Database(config.DATABASE_URL);
  const user = await db.getUser(1);
  return Response.json(user);
}`,
        language: "typescript",
      },
    ],
  },
};
