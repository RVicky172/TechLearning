import type { TopicNode } from "@/data/types";

const zeroFewShot: TopicNode = {
  id: "ai-zero-few-shot",
  title: "Zero-shot & Few-shot Prompting",
  iconName: "Zap",
  link: "https://www.promptingguide.ai/techniques/fewshot",
  theory:
    "Zero-shot prompting gives the model only an instruction with no examples. Few-shot prompting includes worked examples inside the prompt, which dramatically improves accuracy on complex or domain-specific tasks.",
  theoryDetail: {
    keyConcepts: [
      "Zero-shot: no examples — relies entirely on the model's pre-trained knowledge",
      "Few-shot: 2–8 input→output examples in the prompt that demonstrate the expected pattern",
      "Examples should cover edge cases, not just the happy path",
      "Order matters: the last example has the most influence on the model's output",
      "Few-shot examples add tokens — balance accuracy gain against context cost",
    ],
    whyItMatters:
      "Adding 3–5 carefully chosen examples can match or exceed fine-tuned model performance on structured tasks, at zero training cost. This is the first technique to try before spending on fine-tuning.",
    commonPitfalls: [
      "Using only happy-path examples — the model won't know how to handle edge cases",
      "Inconsistent formatting between examples — the model copies your format precisely",
      "Adding too many examples — beyond 8-10, diminishing returns set in and costs rise",
    ],
    examples: [
      {
        title: "Zero-shot vs few-shot for sentiment analysis",
        description:
          "Few-shot examples guide the model to use your exact output format and handle edge cases.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

// ─── ZERO-SHOT — works but output format varies ───
async function zeroShotSentiment(review: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "Classify the sentiment of the review."
      },
      { role: "user", content: review }
    ],
  });
  return response.choices[0].message.content;
  // Output may be: "Positive", "The sentiment is positive", "positive (4/5)", etc.
}

// ─── FEW-SHOT — consistent, exact output format ───
async function fewShotSentiment(review: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "Classify review sentiment. Reply with exactly one word: positive, negative, or neutral."
      },
      // Example 1
      { role: "user",      content: "The food was absolutely delicious!" },
      { role: "assistant", content: "positive" },
      // Example 2
      { role: "user",      content: "Terrible service, waited 45 minutes." },
      { role: "assistant", content: "negative" },
      // Example 3 — edge case
      { role: "user",      content: "The food was okay, nothing special." },
      { role: "assistant", content: "neutral" },
      // Actual query
      { role: "user",      content: review }
    ],
  });
  return response.choices[0].message.content; // Always exactly: "positive" | "negative" | "neutral"
}`,
        language: "typescript",
        output: `INPUT: "Great burger but the fries were cold."

ZERO-SHOT OUTPUT (varies between runs):
  Run 1: "The sentiment is mixed — positive for the burger, negative for the fries."
  Run 2: "Mixed/Neutral"
  Run 3: "The review has a mixed sentiment."
  → Inconsistent format — hard to parse programmatically

FEW-SHOT OUTPUT (consistent):
  Run 1: "neutral"
  Run 2: "neutral"
  Run 3: "neutral"
  → Always one word — trivially parseable

ACCURACY COMPARISON (on 100 edge-case reviews)
═══════════════════════════════════════════════════
  Zero-shot accuracy:    78%
  Few-shot (3 examples): 91%   ← +13% with just 3 examples
  Few-shot (6 examples): 94%   ← +3% more, worth the token cost
  Fine-tuned model:      96%   ← marginal gain over few-shot

→ Try few-shot BEFORE investing in fine-tuning`,
      },
      {
        title: "Few-shot for structured data extraction",
        description:
          "Use examples to lock in an exact JSON schema output — far more reliable than zero-shot for production extraction pipelines.",
        code: `const EXTRACTION_SYSTEM = \`Extract invoice data. Always return valid JSON matching this schema:
{
  "vendor": string,
  "amount": number,     // in dollars, no currency symbol
  "date": string,       // ISO 8601 format: YYYY-MM-DD
  "line_items": Array<{ description: string; qty: number; unit_price: number }>
}\`;

const FEW_SHOT_MESSAGES = [
  {
    role: "user",
    content: "Invoice from Acme Corp on March 5, 2024. 2x Widget Pro @ $29.99 each. Total: $59.98"
  },
  {
    role: "assistant",
    content: JSON.stringify({
      vendor: "Acme Corp",
      amount: 59.98,
      date: "2024-03-05",
      line_items: [{ description: "Widget Pro", qty: 2, unit_price: 29.99 }]
    }, null, 2)
  },
  {
    role: "user",
    content: "Bill from TechSupplies Ltd, dated 15th Jan 2025. Items: 1x USB-C Hub $45, 3x HDMI Cable $12 ea. Amount due: $81"
  },
  {
    role: "assistant",
    content: JSON.stringify({
      vendor: "TechSupplies Ltd",
      amount: 81,
      date: "2025-01-15",
      line_items: [
        { description: "USB-C Hub", qty: 1, unit_price: 45 },
        { description: "HDMI Cable", qty: 3, unit_price: 12 }
      ]
    }, null, 2)
  },
] as const;`,
        language: "typescript",
        output: `INPUT: "Invoice from CloudHost Inc, Feb 28 2025. Server hosting for Feb: $199/mo. Domain renewal: $14.99. Total owed: $213.99"

OUTPUT:
{
  "vendor": "CloudHost Inc",
  "amount": 213.99,
  "date": "2025-02-28",
  "line_items": [
    { "description": "Server hosting for Feb", "qty": 1, "unit_price": 199 },
    { "description": "Domain renewal", "qty": 1, "unit_price": 14.99 }
  ]
}

Without few-shot examples, zero-shot often:
  ✗ Returns amount as "$213.99" instead of 213.99 (number)
  ✗ Returns date as "February 28, 2025" instead of "2025-02-28"
  ✗ Omits line_items entirely
  ✗ Adds extra fields not in the schema

With two examples: output matches the schema 97% of the time.`,
      },
    ],
  },
};

const chainOfThought: TopicNode = {
  id: "ai-chain-of-thought",
  title: "Chain-of-Thought Prompting",
  iconName: "GitBranch",
  link: "https://www.promptingguide.ai/techniques/cot",
  theory:
    "Chain-of-thought (CoT) prompting asks the model to reason step-by-step before giving a final answer. This dramatically improves performance on multi-step reasoning, math, and logic tasks.",
  theoryDetail: {
    keyConcepts: [
      "\"Think step by step\" — adding this phrase activates CoT reasoning in most instruction-tuned models",
      "Zero-shot CoT: just append 'Let's think step by step' to the prompt",
      "Few-shot CoT: provide examples that include the full reasoning chain, not just the answer",
      "o1 and o3 models have CoT built-in (they reason internally before responding)",
      "CoT increases output token count — factor this into latency and cost estimates",
    ],
    whyItMatters:
      "Without CoT, models on complex multi-step problems skip intermediate reasoning and jump to a plausible-sounding but wrong answer. CoT externalizes the working — errors become visible and correctable.",
    commonPitfalls: [
      "Using CoT on simple tasks — it adds latency and cost without benefit",
      "Accepting the final answer without verifying the reasoning chain — the model can reason correctly but still give a wrong final answer",
      "Not using CoT for agentic tasks — agents making sequential decisions need step-by-step deliberation",
    ],
    examples: [
      {
        title: "Zero-shot CoT — 'think step by step'",
        description: "A single phrase turns off shortcut-taking and forces deliberate reasoning.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

const PROBLEM = \`
A store sells apples for $1.20 each and oranges for $0.85 each.
If Alice buys 7 apples and 4 oranges, and pays with a $20 bill,
how much change does she receive?
\`;

// ─── WITHOUT Chain-of-Thought ───
const withoutCoT = await client.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0,
  messages: [
    { role: "system", content: "You are a math assistant. Give only the final answer." },
    { role: "user", content: PROBLEM }
  ],
});

// ─── WITH Chain-of-Thought ───
const withCoT = await client.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0,
  messages: [
    {
      role: "system",
      content: "You are a math assistant. Think step by step, then give your final answer."
    },
    { role: "user", content: PROBLEM }
  ],
});

console.log("Without CoT:", withoutCoT.choices[0].message.content);
console.log("With CoT:", withCoT.choices[0].message.content);`,
        language: "typescript",
        output: `WITHOUT CHAIN-OF-THOUGHT:
  "Alice receives $8.40 in change."
  ← Often wrong — model skips intermediate steps and estimates

WITH CHAIN-OF-THOUGHT:
  "Let me work through this step by step.

  Step 1: Cost of apples
  7 apples × $1.20 = $8.40

  Step 2: Cost of oranges
  4 oranges × $0.85 = $3.40

  Step 3: Total cost
  $8.40 + $3.40 = $11.80

  Step 4: Change from $20
  $20.00 - $11.80 = $8.20

  Alice receives $8.20 in change."
  ← Correct ✅

ACCURACY ON MATH WORD PROBLEMS (GSM8K benchmark)
═══════════════════════════════════════════════════
  gpt-3.5-turbo without CoT:  57%
  gpt-3.5-turbo with CoT:     80%   ← +23 percentage points
  gpt-4o without CoT:         83%
  gpt-4o with CoT:            95%   ← +12 percentage points`,
      },
    ],
  },
};

const structuredOutput: TopicNode = {
  id: "ai-structured-output",
  title: "Structured Output",
  iconName: "Braces",
  link: "https://platform.openai.com/docs/guides/structured-outputs",
  theory:
    "Structured outputs (JSON mode, response_format with schema) guarantee the model returns valid, schema-conformant JSON. This is essential for production pipelines where the response is parsed by code.",
  theoryDetail: {
    keyConcepts: [
      "response_format: { type: 'json_object' } guarantees valid JSON but not a specific schema",
      "response_format: { type: 'json_schema', ... } guarantees the exact schema (GPT-4o and newer)",
      "Zod + zod-to-json-schema is the standard TypeScript workflow for defining schemas",
      "Structured output uses constrained decoding — the model's sampling is restricted to valid JSON tokens",
      "refusals: the model may still refuse harmful requests even in JSON mode, returning { refusal: '...' }",
    ],
    whyItMatters:
      "Parsing free-text LLM output with regex is fragile. Structured outputs make LLM responses as reliable as calling a typed API — the schema is enforced at the model level, not in your error-prone parsing code.",
    commonPitfalls: [
      "Using response_format: json_object without specifying the schema — the model can return any valid JSON",
      "Not handling refusals — the response object has a 'refusal' field when the model declines to answer",
      "Defining schemas with optional fields that may never be populated — use required fields where possible",
    ],
    examples: [
      {
        title: "Strict JSON schema with Zod",
        description:
          "Define a Zod schema, convert to JSON Schema, and pass it to the API for guaranteed type-safe output.",
        code: `import OpenAI from "openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const client = new OpenAI();

// ─── 1. Define the schema with Zod ───
const ProductSchema = z.object({
  name:        z.string().describe("Product name"),
  price:       z.number().describe("Price in USD"),
  currency:    z.enum(["USD", "EUR", "GBP"]),
  in_stock:    z.boolean(),
  categories:  z.array(z.string()).describe("Product categories"),
  description: z.string().optional(),
});

type Product = z.infer<typeof ProductSchema>;

// ─── 2. Call the API with strict schema ───
async function extractProduct(text: string): Promise<Product> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "product_extraction",
        strict: true,
        schema: zodToJsonSchema(ProductSchema, { target: "openApi3" }),
      },
    },
    messages: [
      { role: "system", content: "Extract product details from the text as JSON." },
      { role: "user",   content: text },
    ],
  });

  const raw = response.choices[0].message;

  // ─── 3. Handle refusals ───
  if (raw.refusal) throw new Error(\`Model refused: \${raw.refusal}\`);

  // ─── 4. Parse & validate with Zod ───
  return ProductSchema.parse(JSON.parse(raw.content!));
}

// Usage
const product = await extractProduct(
  "Nike Air Max 90 sneakers - $129.99 - Available in Men's Shoes, Running. Currently in stock."
);
console.log(product);`,
        language: "typescript",
        output: `EXTRACTED PRODUCT:
{
  "name": "Nike Air Max 90",
  "price": 129.99,
  "currency": "USD",
  "in_stock": true,
  "categories": ["Men's Shoes", "Running"],
  "description": "Nike Air Max 90 sneakers"
}

Type: Product  ← fully typed, Zod-validated

WITHOUT STRUCTURED OUTPUT (free text parsing):
  "The Nike Air Max 90 costs $129.99 and is currently in stock."
  → Manual regex: /\$(\d+\.?\d*)/  ← brittle, breaks on "USD 129.99"
  → Manual parsing: might miss categories, get wrong boolean
  → Crashes in production on unexpected formats

WITH STRUCTURED OUTPUT:
  → JSON guaranteed valid by the model's constrained decoding
  → Zod validates types match your TypeScript interface
  → Handles currency, boolean, arrays — all type-safe
  → Zero regex needed`,
      },
    ],
  },
};

const roleSystems: TopicNode = {
  id: "ai-role-prompting",
  title: "System & Role Prompting",
  iconName: "UserCog",
  link: "https://platform.openai.com/docs/guides/prompt-engineering",
  theory:
    "The system prompt sets the model's persona, constraints, and task context for the entire conversation. It is the most powerful lever you have — a well-crafted system prompt eliminates the need for repetitive instructions in every user message.",
  theoryDetail: {
    keyConcepts: [
      "System prompt is processed first and anchors the model's behavior throughout the conversation",
      "Include: persona, task, output format, constraints, and examples (if needed) in the system prompt",
      "Role prompting ('You are a senior TypeScript engineer') shifts the model's vocabulary and perspective",
      "Be explicit about what NOT to do — models follow positive instructions better than prohibitions, but both help",
      "System prompt injection: a malicious user can attempt to override system instructions via user message",
    ],
    whyItMatters:
      "The system prompt is your contract with the model. A vague system prompt produces variable, unpredictable behavior. A precise one produces consistent, deployable results.",
    commonPitfalls: [
      "Writing system prompts that say what the model IS ('you are helpful') without saying what it should DO",
      "Overloading the system prompt with conflicting instructions — the model balances them rather than following all",
      "Forgetting to version-control system prompts — they are code",
    ],
    examples: [
      {
        title: "Anatomy of an effective system prompt",
        description:
          "A production system prompt covers persona, task, format, constraints, and failure modes.",
        code: `// ✅ Production-quality system prompt
const SYSTEM_PROMPT = \`
# Role
You are a senior TypeScript engineer specializing in Next.js and React.
You have 10 years of experience building scalable web applications.

# Task
Help users debug TypeScript and React code. Explain root causes clearly,
then provide corrected code.

# Output Format
Always structure your response as follows:
1. **Root Cause** — 1-2 sentences explaining WHY the error occurred
2. **Fix** — corrected code in a fenced code block with the language tag
3. **Explanation** — 2-4 bullet points explaining what changed and why

# Constraints
- Never suggest using 'any' type unless it is the only option; explain why if you do
- Always use TypeScript strict mode syntax
- If multiple solutions exist, mention trade-offs but recommend one
- Do not add unsolicited refactors beyond fixing the reported issue

# If You Don't Know
Say "I'm not certain about this" and provide your best reasoning.
Do not hallucinate library APIs.
\`;

// ❌ Weak system prompt — produces inconsistent results
const WEAK_SYSTEM_PROMPT = "You are a helpful coding assistant. Help with TypeScript.";`,
        language: "typescript",
        output: `USER: "Why does this give a type error? const x = [1,2,3]; x.push('hello');"

RESPONSE WITH STRONG SYSTEM PROMPT:
  Root Cause
  TypeScript inferred x's type as number[] from its initializer. Pushing
  a string violates the number[] constraint.

  Fix
  \`\`\`typescript
  const x: (number | string)[] = [1, 2, 3];
  x.push('hello'); // ✅
  \`\`\`
  Or, if you need separate types:
  \`\`\`typescript
  const x = [1, 2, 3] as Array<number | string>;
  \`\`\`

  Explanation
  • TypeScript infers array types from the literal: [1,2,3] → number[]
  • You must widen the type explicitly to allow string values
  • Prefer the explicit annotation form for clarity in production code
  • The second form (as Array<...>) is a type assertion — use only when you
    can't change the declaration site

RESPONSE WITH WEAK SYSTEM PROMPT:
  "Try using type any or just cast it with (x as any).push('hello')."
  → Suggests any, no root cause, no explanation`,
      },
    ],
  },
};

export const aiPromptEngineering: TopicNode = {
  id: "ai-prompt-engineering",
  title: "Prompt Engineering",
  iconName: "MessageSquare",
  link: "https://www.promptingguide.ai/",
  theory:
    "Prompt engineering is the practice of designing model inputs to reliably produce the outputs your application needs. It is the primary skill for building LLM-powered features without fine-tuning.",
  theoryDetail: {
    keyConcepts: [
      "Clarity beats cleverness — specific, unambiguous instructions outperform elaborate prompt tricks",
      "Include context, constraints, output format, and examples in your system prompt",
      "Iterate experimentally — treat prompts as code and version-control them",
      "Measure with evals — gut-feel prompt quality is insufficient for production",
    ],
    whyItMatters:
      "90% of LLM product failures are prompt failures, not model failures. A well-engineered prompt can get GPT-4o-mini to outperform GPT-4o on a specific task at 1/10th the cost.",
    commonPitfalls: [
      "Writing vague prompts then blaming the model — the model reflects your prompt's precision",
      "Not testing prompts on edge cases before deploying",
      "Changing multiple prompt variables at once — isolate changes to understand what works",
    ],
  },
  children: [zeroFewShot, chainOfThought, structuredOutput, roleSystems],
};
