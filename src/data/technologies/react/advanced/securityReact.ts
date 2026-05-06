import type { TopicNode } from "@/data/types";

export const securityReact: TopicNode = {
  id: "react-security",
  title: "Security in React",
  iconName: "Shield",
  link: "https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html",
  theory:
    "React escapes all rendered content by default, preventing most XSS attacks automatically. However, using dangerouslySetInnerHTML, improper URL handling, or trusting user input in server-side contexts can still create vulnerabilities. Understanding React's security model and its escape hatches is critical for building production-safe applications.",
  theoryDetail: {
    keyConcepts: [
      "React auto-escapes all string content rendered in JSX — <p>{userInput}</p> is safe from XSS by default",
      "dangerouslySetInnerHTML bypasses React's escaping — never pass unsanitized user input to it",
      "href='javascript:...' in anchor tags can execute code — always validate and whitelist URL schemes (http, https, mailto)",
      "Server Components with database queries need SQL injection protection — use parameterized queries, never string concatenation",
      "Server Actions must validate and sanitize all inputs server-side — client-side validation is bypassed by attackers",
      "Content Security Policy (CSP) headers add a second layer of XSS defense on top of React's escaping",
    ],
    whyItMatters:
      "A single XSS vulnerability can compromise every user's session — stealing cookies, redirecting to phishing sites, or acting as the user. React's auto-escaping is excellent, but developers must understand the escape hatches that bypass it. With Server Components and Server Actions, server-side security (SQL injection, CSRF, auth) is now also part of the React developer's responsibility.",
    commonPitfalls: [
      "Using dangerouslySetInnerHTML with user-generated content without sanitizing with DOMPurify",
      "Passing user input to href attributes without checking for javascript: URLs",
      "Storing sensitive data (tokens, secrets) in React state or localStorage — use httpOnly cookies instead",
      "Trusting client-side form validation as the only defense — always validate on the server",
      "Concatenating user input into SQL queries in Server Components — use parameterized queries",
      "Exposing API keys in client-side code — use environment variables with server-only prefixes (no NEXT_PUBLIC_)",
    ],
    examples: [
      {
        title: "XSS Prevention — Safe vs Unsafe Patterns",
        description:
          "React auto-escapes JSX expressions, but certain APIs bypass this protection.",
        code: `import DOMPurify from 'dompurify';

// ✅ SAFE — React auto-escapes this
function SafeComment({ text }: { text: string }) {
  // Even if text = '<script>alert("xss")</script>'
  // React renders it as plain text, NOT as HTML
  return <p>{text}</p>;
}

// ❌ DANGEROUS — bypasses React's escaping
function UnsafeComment({ html }: { html: string }) {
  // If html comes from user input, this is an XSS vulnerability!
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ✅ SAFE — sanitize before using dangerouslySetInnerHTML
function SanitizedComment({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ❌ DANGEROUS — javascript: URLs execute code
function UnsafeLink({ url }: { url: string }) {
  // url could be "javascript:alert('xss')"
  return <a href={url}>Click me</a>;
}

// ✅ SAFE — validate URL scheme
function SafeLink({ url, children }: { url: string; children: React.ReactNode }) {
  const isValid = /^https?:\\/\\//i.test(url) || url.startsWith('mailto:');
  const safeUrl = isValid ? url : '#';
  return <a href={safeUrl} rel="noopener noreferrer">{children}</a>;
}`,
        language: "tsx",
      },
      {
        title: "Server Action Security",
        description:
          "Server Actions are public HTTP endpoints — always validate inputs, authenticate users, and use parameterized queries.",
        code: `'use server';

import { db } from '@/lib/database';
import { getSession } from '@/lib/auth';
import { z } from 'zod';  // Schema validation library

// Define strict input schema
const CreatePostSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(10).max(10000).trim(),
  category: z.enum(['tech', 'design', 'product']),
});

export async function createPost(formData: FormData) {
  // 1. AUTHENTICATE — verify the user is logged in
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // 2. VALIDATE — parse and validate all inputs
  const parsed = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    category: formData.get('category'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // 3. AUTHORIZE — check if user has permission
  if (!session.user.canCreatePosts) {
    throw new Error('Forbidden');
  }

  // 4. EXECUTE — use parameterized queries (never concatenate!)
  // ✅ SAFE: parameterized query
  await db.query(
    'INSERT INTO posts (title, content, category, author_id) VALUES ($1, $2, $3, $4)',
    [parsed.data.title, parsed.data.content, parsed.data.category, session.user.id]
  );

  // ❌ VULNERABLE: string concatenation
  // await db.query(\`INSERT INTO posts VALUES ('\${title}', '\${content}')\`);
  // An attacker could submit: title = "'); DROP TABLE posts; --"

  return { success: true };
}`,
        language: "typescript",
      },
      {
        title: "Environment Variables & Secrets",
        description:
          "Never expose secrets to the browser. Use server-only environment variables and understand the NEXT_PUBLIC_ prefix.",
        code: `// ── next.config.ts or .env.local ──

// ✅ Server-only: NOT exposed to the browser
// DATABASE_URL=postgresql://user:pass@localhost/db
// STRIPE_SECRET_KEY=sk_live_xxx
// JWT_SECRET=my-secret-key

// ❌ Browser-exposed: available in client-side code
// NEXT_PUBLIC_API_URL=https://api.example.com
// NEXT_PUBLIC_ANALYTICS_ID=UA-12345

// ──────────────────────────────────

// ✅ Server Component — can access all env vars
async function AdminPanel() {
  // This code runs on the server only
  const dbUrl = process.env.DATABASE_URL;  // ✅ Safe
  const data = await fetch(dbUrl!);
  return <Dashboard data={await data.json()} />;
}

// ❌ Client Component — only NEXT_PUBLIC_ vars available
'use client';
function Analytics() {
  // process.env.STRIPE_SECRET_KEY → undefined (stripped by bundler)
  // process.env.NEXT_PUBLIC_API_URL → "https://api.example.com"
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ❌ NEVER do this:
  // const secret = process.env.STRIPE_SECRET_KEY; // undefined in browser
  // Even if it worked, it would be visible in the JS bundle!
  return null;
}

// ── Additional Security Headers (middleware.ts) ──
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy — prevent inline scripts
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}`,
        language: "typescript",
      },
    ],
  },
};
