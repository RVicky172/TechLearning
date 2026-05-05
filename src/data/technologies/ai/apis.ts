import type { TopicNode } from "@/data/types";

const openaiApi: TopicNode = {
  id: "ai-openai-api",
  title: "OpenAI API",
  iconName: "Sparkles",
  link: "https://platform.openai.com/docs/api-reference",
  theory:
    "The OpenAI API exposes chat completions, embeddings, images, speech, and fine-tuning. The chat completions endpoint is the core primitive — all higher-level patterns (RAG, agents, structured output) are built on top of it.",
  theoryDetail: {
    keyConcepts: [
      "Chat Completions: the primary endpoint — takes messages array, returns completion message",
      "Models: gpt-4o (flagship), gpt-4o-mini (cheap/fast), o1/o3 (reasoning), text-embedding-3-small (embeddings)",
      "Usage object in response: tracks prompt_tokens + completion_tokens for cost calculation",
      "Rate limits: Tier 1 default is low; increase by adding billing. Retry with exponential backoff on 429",
      "Organization/Project API keys: scope keys to projects to limit blast radius of a leaked key",
    ],
    whyItMatters:
      "The OpenAI API is the de-facto standard. Its patterns (message roles, tool_calls, structured output) have been adopted by Anthropic, Google, and Mistral — learning one means you know them all.",
    commonPitfalls: [
      "Hardcoding API keys in source code — use environment variables and never commit keys to git",
      "Not implementing retry logic — 429 rate limit errors are expected; exponential backoff is required",
      "Using the same API key across all environments — use separate project keys for dev/staging/prod",
    ],
    examples: [
      {
        title: "Production-ready API client with retry",
        description:
          "A typed wrapper with exponential backoff, token tracking, and proper error handling.",
        code: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // never hardcode
  maxRetries: 3,    // built-in retry with exponential backoff
  timeout: 30_000,  // 30 second timeout
});

interface CompletionOptions {
  model?:       string;
  temperature?: number;
  maxTokens?:   number;
  systemPrompt: string;
  userMessage:  string;
}

interface CompletionResult {
  content:       string;
  promptTokens:  number;
  outputTokens:  number;
  costUsd:       number;
}

// Pricing per 1M tokens (as of 2025)
const PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o":      { input: 2.50, output: 10.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60  },
};

async function complete(opts: CompletionOptions): Promise<CompletionResult> {
  const model = opts.model ?? "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    temperature:  opts.temperature ?? 0.7,
    max_tokens:   opts.maxTokens ?? 1024,
    messages: [
      { role: "system", content: opts.systemPrompt },
      { role: "user",   content: opts.userMessage  },
    ],
  });

  const usage = response.usage!;
  const prices = PRICING[model] ?? { input: 0, output: 0 };
  const costUsd =
    (usage.prompt_tokens     / 1_000_000) * prices.input +
    (usage.completion_tokens / 1_000_000) * prices.output;

  return {
    content:      response.choices[0].message.content!,
    promptTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
    costUsd,
  };
}

// Usage
const result = await complete({
  systemPrompt: "You are a concise technical writer.",
  userMessage:  "Explain TypeScript generics in one paragraph.",
});

console.log(result.content);
console.log(\`Tokens: \${result.promptTokens} in / \${result.outputTokens} out\`);
console.log(\`Cost: $\${result.costUsd.toFixed(6)}\`);`,
        language: "typescript",
        output: `OUTPUT:
"TypeScript generics allow you to write functions, classes, and interfaces
that work with any type while preserving full type safety. Instead of using
'any', you parameterize the type with a placeholder like T, which TypeScript
resolves to a concrete type at the call site."

Tokens: 47 in / 63 out
Cost: $0.000045

RETRY BEHAVIOR (built-in with maxRetries: 3):
═══════════════════════════════════════════════════
  Attempt 1 → 429 Too Many Requests
  Wait 1s   → Attempt 2 → 429
  Wait 2s   → Attempt 3 → 200 OK ✅

  If all 3 retries fail → throws APIError with status 429

COST AT SCALE (gpt-4o-mini):
═══════════════════════════════════════════════════
  1,000 calls (avg 200 tokens)   →  ~$0.08
  100,000 calls (avg 200 tokens) →  ~$7.50
  1M calls (avg 200 tokens)      →  ~$75`,
      },
    ],
  },
};

const streaming: TopicNode = {
  id: "ai-streaming",
  title: "Streaming Responses",
  iconName: "Radio",
  link: "https://platform.openai.com/docs/api-reference/streaming",
  theory:
    "Streaming returns tokens as they are generated instead of waiting for the full response. This reduces perceived latency from seconds to milliseconds — the user sees text appearing word-by-word like a typewriter.",
  theoryDetail: {
    keyConcepts: [
      "stream: true returns a ReadableStream of Server-Sent Events (SSE)",
      "Each event contains a delta — the new token(s) since the last event",
      "Finish reason signals completion: stop (normal), length (max tokens), tool_calls",
      "In Next.js App Router: return a StreamingTextResponse using the Vercel AI SDK or raw Response with ReadableStream",
      "Token usage is not included in streaming chunks by default; request stream_options: { include_usage: true }",
    ],
    whyItMatters:
      "Without streaming, a 500-token response at 50 tokens/sec makes the user wait 10 seconds staring at a spinner. With streaming, they see the first word in ~200ms. Streaming is non-negotiable for chat UIs.",
    commonPitfalls: [
      "Not handling stream errors — network drops mid-stream are common; show partial content + retry option",
      "Buffering the entire stream before rendering — defeats the purpose; render delta by delta",
      "Forgetting tool_calls in streaming — tool call JSON arrives in fragments; you must accumulate it before parsing",
    ],
    examples: [
      {
        title: "Streaming in Next.js App Router",
        description: "A streaming API route that pipes OpenAI output directly to the client.",
        code: `// app/api/chat/route.ts
import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI();

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  };

  // Create a streaming completion
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    stream_options: { include_usage: true },
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...messages,
    ],
  });

  // Pipe the SSE stream directly to the HTTP response
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          controller.enqueue(new TextEncoder().encode(delta));
        }
        // Last chunk has usage stats
        if (chunk.usage) {
          console.log("Usage:", chunk.usage);
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type":  "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// ─── Client component consuming the stream ───
// app/components/Chat.tsx
async function sendMessage(content: string) {
  const response = await fetch("/api/chat", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ messages: [{ role: "user", content }] }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    setOutput(text); // update UI with each new chunk
  }
}`,
        language: "typescript",
        output: `STREAMING TIMELINE (for a 200-token response at 50 tok/s)
═══════════════════════════════════════════════════

  Without streaming:
  0ms  → user sends message
  4000ms → entire response arrives → UI updates once
  User stares at spinner for 4 seconds

  With streaming:
  0ms   → user sends message
  200ms → "TypeScript" appears
  240ms → "TypeScript generics" appears
  280ms → "TypeScript generics allow" appears
  ...   → words appear continuously
  4000ms → response completes
  User reads while the model is still writing ✅

SERVER-SENT EVENTS (raw format):
═══════════════════════════════════════════════════
  data: {"choices":[{"delta":{"content":"Type"},"finish_reason":null}]}
  data: {"choices":[{"delta":{"content":"Script"},"finish_reason":null}]}
  data: {"choices":[{"delta":{"content":" generics"},"finish_reason":null}]}
  data: {"choices":[{"delta":{},"finish_reason":"stop"}]}
  data: [DONE]

Each delta is typically 1-4 tokens.
You accumulate deltas to build the full string.`,
      },
    ],
  },
};

const vercelAiSdk: TopicNode = {
  id: "ai-vercel-sdk",
  title: "Vercel AI SDK",
  iconName: "TriangleAlert",
  link: "https://sdk.vercel.ai/docs",
  theory:
    "The Vercel AI SDK provides React hooks (useChat, useCompletion), streaming utilities, and a unified provider interface that works with OpenAI, Anthropic, Google, and any other provider — swappable without changing UI code.",
  theoryDetail: {
    keyConcepts: [
      "useChat hook: manages message state, loading state, and streaming — all wired up with one hook",
      "streamText: server-side helper that creates a streaming response compatible with useChat",
      "generateObject: generates and validates structured data (like Zod-typed objects) in one call",
      "Provider abstraction: switch from openai() to anthropic() or google() by changing one import",
      "AI SDK Core vs AI SDK UI: Core is framework-agnostic; UI provides React/Svelte/Vue hooks",
    ],
    whyItMatters:
      "Building streaming chat UIs from scratch requires managing streams, partial JSON parsing, error states, and abort signals. The AI SDK handles all of this — a full streaming chat UI in ~30 lines of code.",
    commonPitfalls: [
      "Calling the OpenAI SDK directly inside a Next.js Server Component instead of using streamText — loses streaming",
      "Not using the provider abstraction — hardcoding OpenAI prevents easy model switching",
      "Forgetting maxSteps for tool-calling agents — without it, the agent stops after the first tool call",
    ],
    examples: [
      {
        title: "Full streaming chat with useChat",
        description: "A complete streaming chat UI in a Next.js App Router project using the Vercel AI SDK.",
        code: `// ─── API Route: app/api/chat/route.ts ───
import { openai }      from "@ai-sdk/openai";
import { streamText }  from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = streamText({
    model:    openai("gpt-4o-mini"),
    system:   "You are a concise and helpful coding assistant.",
    messages,
    maxSteps: 5, // allow up to 5 tool call iterations
  });

  return result.toDataStreamResponse();
}

// ─── Client: app/components/Chat.tsx ───
"use client";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
    onError: (err) => console.error("Chat error:", err),
  });

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={\`p-3 rounded-lg \${msg.role === "user"
              ? "bg-[var(--color-primary)] text-white ml-auto max-w-xs"
              : "bg-[var(--bg-surface)] border border-[var(--border)]"
            }\`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="text-[var(--text-3)] animate-pulse">Thinking...</div>}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="flex-1 border border-[var(--border)] rounded-lg px-4 py-2"
        />
        {isLoading
          ? <button type="button" onClick={stop}>Stop</button>
          : <button type="submit">Send</button>
        }
      </form>
    </div>
  );
}`,
        language: "typescript",
        output: `WHAT useChat HANDLES AUTOMATICALLY:
═══════════════════════════════════════════════════
  ✅  Maintains messages array (user + assistant turns)
  ✅  Streams assistant response token by token
  ✅  Updates UI on each delta (no manual ReadableStream handling)
  ✅  isLoading state — true while streaming
  ✅  input / handleInputChange — controlled input management
  ✅  handleSubmit — sends POST to /api/chat, clears input
  ✅  stop() — aborts the current stream mid-generation
  ✅  Error handling via onError callback
  ✅  Optimistic UI — user message appears instantly

LINES OF CODE COMPARISON:
═══════════════════════════════════════════════════
  Manual streaming chat implementation:
  → API route:        ~60 lines (ReadableStream, SSE parsing)
  → Client hook:      ~80 lines (reader, decoder, state, abort)
  → Error handling:   ~30 lines
  Total:              ~170 lines

  With Vercel AI SDK:
  → API route:        ~10 lines (streamText + toDataStreamResponse)
  → Client:           ~40 lines (useChat hook)
  Total:              ~50 lines  (70% less code)

PROVIDER SWITCHING (zero UI changes):
  openai("gpt-4o-mini")           → OpenAI
  anthropic("claude-3-5-haiku")   → Anthropic
  google("gemini-2.0-flash")      → Google
  Only import changes — useChat stays identical`,
      },
    ],
  },
};

export const aiApis: TopicNode = {
  id: "ai-apis",
  title: "AI APIs & SDKs",
  iconName: "Plug",
  link: "https://platform.openai.com/docs",
  theory:
    "Building AI features requires integrating with model provider APIs. The OpenAI API is the industry standard; the Vercel AI SDK abstracts over multiple providers and provides React hooks for streaming UIs.",
  theoryDetail: {
    keyConcepts: [
      "openai npm package: official TypeScript SDK with auto-retry and timeout",
      "Vercel AI SDK: unified interface for OpenAI, Anthropic, Google + React streaming hooks",
      "Streaming is required for chat UIs — non-streaming responses feel slow and unresponsive",
    ],
    whyItMatters:
      "Choosing the right SDK determines how much boilerplate you write. The Vercel AI SDK is now the standard for Next.js AI apps — it handles streaming, provider abstraction, and React integration out of the box.",
    commonPitfalls: [
      "Calling LLM APIs directly from the browser — exposes your API key; always proxy through a server route",
      "Not setting a timeout — a hung LLM request will block the user forever",
    ],
  },
  children: [openaiApi, streaming, vercelAiSdk],
};
