import type { TopicNode } from "@/data/types";

export const cloudServerless: TopicNode = {
  id: "cloud-serverless",
  title: "Serverless & Edge Functions",
  iconName: "Zap",
  link: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
  theory:
    "Serverless means running code without managing servers — the platform provisions capacity on demand and bills per invocation. There are two distinct tiers: regional serverless (AWS Lambda, Google Cloud Functions, Azure Functions) which runs full Node.js in an isolated container, and edge serverless (Cloudflare Workers, Vercel Edge Functions) which runs a restricted V8 isolate at every CDN PoP with sub-millisecond cold starts but no Node.js APIs.",
  theoryDetail: {
    keyConcepts: [
      "AWS Lambda: runs up to 15 minutes, up to 10 GB RAM, 512 MB–10 GB ephemeral /tmp — triggered by API Gateway, SQS, S3 events, EventBridge cron; billed per 100ms rounded up",
      "Cold start: a Lambda function that hasn't received traffic recently is 'cold' — the container must be initialised before the handler runs (50–500ms for Node.js); mitigate with Provisioned Concurrency (always-warm) or SnapStart",
      "Lambda layers: shared code and dependencies packaged separately from your function code — reduces deployment size and enables sharing across functions",
      "Lambda@Edge: run Lambda at CloudFront edge nodes — limited to 1 MB code, 5s timeout; use for auth checks, A/B testing, request rewriting at the CDN layer",
      "Cloudflare Workers: JS/TS V8 isolate running at 300+ edge locations — starts in < 1ms (no container cold start); 128 MB memory limit; no Node.js built-ins (use Workers-specific APIs); access KV, R2, D1, Durable Objects",
      "Vercel Edge Functions: built on Cloudflare Workers runtime — export a middleware or edge route; same constraints (no Node.js); ideal for auth redirects, geo-routing, request rewrites in Next.js",
      "Event-driven patterns: Lambda is ideal for async processing — resize images on S3 upload (S3 → Lambda), send emails on order placed (SQS → Lambda), run daily reports (EventBridge → Lambda)",
      "Function URL vs API Gateway: Lambda Function URLs are simpler (no API Gateway cost, direct HTTPS endpoint); API Gateway adds rate limiting, auth, request validation, and usage plans",
    ],
    whyItMatters:
      "Serverless eliminates idle server cost — a Lambda that runs 1 million times/month costs ~$0.20 vs a $20/month EC2 instance running idle. It scales automatically to any concurrency. Edge functions reduce global latency for auth and personalisation. These are now default patterns in modern fullstack architectures.",
    commonPitfalls: [
      "Cold starts blocking user-facing APIs — use Provisioned Concurrency for latency-sensitive endpoints, or move to edge functions where cold starts don't exist",
      "Treating Lambda as a monolith — large deployment packages slow cold starts; keep functions small and focused; use Lambda Layers for shared dependencies",
      "Missing concurrency limits — Lambda scales to thousands of concurrent executions by default; if your database only accepts 100 connections, Lambda will overwhelm it; use connection pooling via RDS Proxy",
      "Cloudflare Workers with Node.js APIs — Workers don't have Node's `fs`, `crypto`, `path` etc.; use the Web Crypto API and Workers-specific APIs; check compatibility with `wrangler dev`",
    ],
    examples: [
      {
        title: "AWS Lambda handler + API Gateway event (TypeScript)",
        description:
          "A typed Lambda handler for an HTTP event via API Gateway — including error handling, structured logging, and warm-start optimisation.",
        code: `import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// ── Initialise SDK clients OUTSIDE the handler ─────────────
// They are reused across warm invocations (same container)
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = event.pathParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "userId is required" }),
    };
  }

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: process.env.USERS_TABLE!,
        Key: { pk: \`USER#\${userId}\` },
      }),
    );

    if (!result.Item) {
      return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.Item),
    };
  } catch (err) {
    console.error("DynamoDB error", { userId, err });
    return { statusCode: 500, body: JSON.stringify({ error: "Internal error" }) };
  }
};`,
        language: "typescript",
      },
      {
        title: "Cloudflare Worker — JWT auth middleware + KV cache",
        description:
          "A Cloudflare Worker that verifies a JWT and caches the response in Workers KV — fully runs at the edge with no cold start.",
        code: `// wrangler.toml
// name = "auth-worker"
// compatibility_date = "2024-01-01"
// [[kv_namespaces]]
// binding = "CACHE"
// id = "abc123"

export interface Env {
  CACHE: KVNamespace;
  JWT_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Check KV cache first
    const cached = await env.CACHE.get(url.pathname);
    if (cached) {
      return new Response(cached, {
        headers: { "Content-Type": "application/json", "X-Cache": "HIT" },
      });
    }

    // Verify JWT from Authorization header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return new Response("Unauthorized", { status: 401 });

    const valid = await verifyJwt(token, env.JWT_SECRET);
    if (!valid) return new Response("Forbidden", { status: 403 });

    // Fetch from origin
    const origin = await fetch(\`https://api.example.com\${url.pathname}\`);
    const body = await origin.text();

    // Cache for 60 seconds
    await env.CACHE.put(url.pathname, body, { expirationTtl: 60 });

    return new Response(body, {
      headers: { "Content-Type": "application/json", "X-Cache": "MISS" },
    });
  },
} satisfies ExportedHandler<Env>;

async function verifyJwt(token: string, secret: string): Promise<boolean> {
  // Workers use the Web Crypto API — no Node.js crypto module
  const [headerB64, payloadB64, sigB64] = token.split(".");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["verify"],
  );
  const sig = Uint8Array.from(atob(sigB64.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
  const data = new TextEncoder().encode(\`\${headerB64}.\${payloadB64}\`);
  return crypto.subtle.verify("HMAC", key, sig, data);
}`,
        language: "typescript",
      },
    ],
  },
};
