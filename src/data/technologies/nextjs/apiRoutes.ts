import type { TopicNode } from "@/data/types";

export const nextjsApiRoutes: TopicNode = {
  id: "nextjs-api-routes",
  title: "API Routes & Route Handlers",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Route Handlers (App Router) replace API Routes (Pages Router) as the modern API layer",
      "Create handlers with app/api/[...path]/route.ts exporting GET, POST, PUT, DELETE, PATCH methods",
      "Handlers receive NextRequest and return NextResponse with full HTTP control",
      "Middleware can run before Route Handlers for auth, logging, and validation",
      "Server Actions are preferred over Route Handlers for simple mutations from forms",
      "Edge Middleware runs globally; Route Handlers are regional unless using edge runtime",
    ],
    whyItMatters:
      "Route Handlers provide a clean way to build REST APIs within Next.js. They're useful for third-party webhooks, mobile app backends, and when you need explicit HTTP control that Server Actions don't provide.",
    commonPitfalls: [
      "Using Route Handlers for mutations when Server Actions would be simpler and more secure",
      "Not validating request method; Route Handlers don't auto-reject unsupported methods",
      "Forgetting CORS headers for cross-origin requests",
      "Storing secrets in Route Handlers that run client-side; keep secrets in Server Components or Server Actions",
      "Not handling stream bodies properly; large payloads need buffering logic",
    ],
    examples: [
      {
        title: "Basic Route Handler",
        description: "Create a simple REST endpoint.",
        code: `// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const posts = await db.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const post = await db.post.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}

// ---

// app/api/posts/[id]/route.ts - Dynamic route handler
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}`,
        language: "typescript",
      },
      {
        title: "Webhook Handler",
        description: "Handle third-party webhooks (e.g., Stripe, GitHub).",
        code: `// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await db.payment.create({
        data: { stripeId: event.data.object.id, status: 'completed' },
      });
      break;
  }

  return NextResponse.json({ received: true });
}`,
        language: "typescript",
      },
    ],
  },
};
