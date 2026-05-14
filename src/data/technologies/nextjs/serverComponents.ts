import type { TopicNode } from "@/data/types";

export const nextjsServerComponents: TopicNode = {
  id: "nextjs-server-components",
  title: "Server Components & Actions",
  iconName: "Cpu",
  theoryDetail: {
    keyConcepts: [
      "Server Components are the default in App Router; they run only on the server",
      "Direct database/API access in Server Components eliminates need for API routes",
      "No JavaScript bundle bloat from server-only libraries (e.g., encryption, big databases)",
      "Server Actions allow mutation logic to run securely on the server",
      "'use client' directive switches to Client Component when browser interactivity is needed",
      "Middleware runs on the edge before requests reach your app for auth, logging, rewrites",
    ],
    whyItMatters:
      "Server Components shift rendering and data fetching to the server, reducing JavaScript sent to browsers and improving security by keeping secrets server-side. Server Actions provide a simple way to handle mutations without explicit API routes.",
    commonPitfalls: [
      "Adding 'use client' too high in the tree; it re-renders the entire subtree as Client Components",
      "Server Actions with no error handling; always wrap in try/catch and return user-friendly errors",
      "Passing non-serializable objects to Client Components; functions, Dates, Maps must be serialized",
      "Forgetting that Server Components can't use hooks; move state to the closest Client Component",
      "Not validating/sanitizing user input in Server Actions; treat them like backend endpoints",
    ],
    examples: [
      {
        title: "Server Actions for Mutations",
        description: "Handle form submissions and mutations securely on the server.",
        code: `'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');

  // Validate
  if (!title || !content) {
    return { error: 'Missing required fields' };
  }

  // Save to database
  const post = await db.post.create({
    data: { title, content },
  });

  // Revalidate the posts page
  revalidatePath('/posts');

  return { success: true, post };
}

// ---

// Client component using the action
'use client';

import { createPost } from './actions';

export default function CreatePostForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createPost(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert('Post created!');
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Create</button>
    </form>
  );
}`,
        language: "typescript",
      },
      {
        title: "Middleware for Edge Logic",
        description: "Run code before requests reach your app.",
        code: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};`,
        language: "typescript",
      },
    ],
  },
};
