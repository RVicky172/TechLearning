import type { TopicNode } from "@/data/types";

const tokenization: TopicNode = {
  id: "ai-tokenization",
  title: "Tokenization",
  iconName: "Scissors",
  link: "https://platform.openai.com/tokenizer",
  theory:
    "LLMs don't read characters or words — they read tokens. A token is roughly 4 characters of English text. Understanding tokenization is essential for managing context limits and API costs.",
  theoryDetail: {
    keyConcepts: [
      "1 token ≈ 4 characters in English; non-English text and code typically use more tokens per word",
      "GPT-4 uses the cl100k_base tokenizer (100k vocabulary); different models use different tokenizers",
      "Special tokens like <|endoftext|> are part of the vocabulary and signal boundaries to the model",
      "Token count = prompt tokens + completion tokens; both are billed and count toward the context limit",
      "Whitespace, punctuation, and rare words are often split into multiple tokens",
    ],
    whyItMatters:
      "Context limits and costs are measured in tokens, not words. Knowing how text tokenizes helps you optimize prompts, estimate costs before making API calls, and avoid hitting limits silently.",
    commonPitfalls: [
      "Assuming 1 word = 1 token — common English words like 'understand' can be 1 token, but 'tokenization' can be 2-3",
      "Not accounting for system prompt + conversation history tokens when calculating remaining space",
      "Using verbose variable names in code you send to the LLM — they tokenize to many more tokens than short names",
    ],
    examples: [
      {
        title: "How text tokenizes",
        description:
          "The same semantic meaning can use very different token counts depending on phrasing and language.",
        code: `// Using the 'tiktoken' library (same tokenizer OpenAI uses)
import { encoding_for_model } from "tiktoken";

const enc = encoding_for_model("gpt-4");

const examples = [
  "Hello world",
  "Hello, world!",
  "Tokenization is fascinating",
  "Привет мир",           // Russian "Hello world"
  "function getUserById", // code identifier
];

for (const text of examples) {
  const tokens = enc.encode(text);
  console.log(\`"\${text}" → \${tokens.length} tokens\`);
  console.log(\`  Token IDs: [\${Array.from(tokens).join(", ")}]\`);
}

enc.free();`,
        language: "typescript",
        output: `TOKENIZATION RESULTS
═══════════════════════════════════════════════════
"Hello world"              → 2 tokens
  Token IDs: [9906, 1917]

"Hello, world!"            → 4 tokens
  Token IDs: [9906, 11, 1917, 0]
  ↑ comma, space, and ! each become separate tokens

"Tokenization is fascinating" → 5 tokens
  Token IDs: [6295, 2065, 374, 23387, 287]
  ↑ "Tokenization" splits into 2 tokens: "Token" + "ization"

"Привет мир" (Russian)     → 6 tokens
  ↑ Cyrillic chars encode to far more tokens than English

"function getUserById"     → 5 tokens
  ↑ camelCase identifiers split into: "function", " get", "User", "By", "Id"

COST COMPARISON (gpt-4o at $2.50 per 1M input tokens)
═══════════════════════════════════════════════════
  1,000-token prompt  →  $0.0025
  10,000-token prompt →  $0.025
  100-page PDF (≈75k tokens) → $0.19 per API call`,
      },
      {
        title: "Counting tokens before an API call",
        description:
          "Always count tokens before sending to avoid hitting context limits mid-conversation.",
        code: `import { encoding_for_model } from "tiktoken";
import OpenAI from "openai";

const MODEL = "gpt-4o";
const MAX_CONTEXT = 128_000; // gpt-4o context window
const RESERVE_FOR_COMPLETION = 2_000;
const MAX_PROMPT_TOKENS = MAX_CONTEXT - RESERVE_FOR_COMPLETION;

function countTokens(messages: OpenAI.ChatCompletionMessageParam[]): number {
  const enc = encoding_for_model(MODEL);
  let total = 3; // every reply is primed with <|start|>assistant<|message|>

  for (const msg of messages) {
    total += 4; // every message adds overhead tokens
    total += enc.encode(msg.role).length;
    total += enc.encode(msg.content as string).length;
  }

  enc.free();
  return total;
}

function trimToFit(
  messages: OpenAI.ChatCompletionMessageParam[]
): OpenAI.ChatCompletionMessageParam[] {
  // Always keep system message (index 0)
  const system = messages[0];
  let history = messages.slice(1);

  while (countTokens([system, ...history]) > MAX_PROMPT_TOKENS) {
    history = history.slice(2); // drop oldest user+assistant pair
  }

  return [system, ...history];
}`,
        language: "typescript",
        output: `CONTEXT WINDOW MANAGEMENT
═══════════════════════════════════════════════════
  gpt-4o context window:    128,000 tokens
  Reserved for completion:   -2,000 tokens
  Available for prompt:     126,000 tokens

  Conversation grows over time:
  Turn 1:  system(300) + user(50)             =    350 tokens  ✅
  Turn 5:  system(300) + 8 messages(1,200)    =  1,500 tokens  ✅
  Turn 50: system(300) + 98 messages(18,000)  = 18,300 tokens  ✅
  Turn 500: system(300) + 998 msgs(185,000)   = 185,300 tokens ❌ OVER LIMIT

  trimToFit() drops oldest pairs until it fits:
  → drops Turn 1 user+assistant (oldest)
  → re-counts → still over → drop Turn 2
  → continues until within 126,000 tokens
  → LLM sees recent context; old history is lost`,
      },
    ],
  },
};

const contextWindows: TopicNode = {
  id: "ai-context-windows",
  title: "Context Windows",
  iconName: "LayoutList",
  link: "https://help.openai.com/en/articles/7127966-what-is-the-difference-between-the-gpt-4-models",
  theory:
    "A context window is the total number of tokens a model can see at once — including the system prompt, conversation history, retrieved documents, and the response it generates. Everything outside the window is invisible to the model.",
  theoryDetail: {
    keyConcepts: [
      "Context = system prompt + conversation history + retrieved docs + completion (all share the same limit)",
      "Models have no memory — they re-read the entire context on every API call",
      "Larger context windows cost more: processing 128k tokens costs far more than processing 1k tokens",
      "Lost-in-the-middle: research shows models perform better on information at the start and end of context",
      "Context caching (Anthropic, Google) lets you pre-fill a fixed prefix once and re-use it cheaply",
    ],
    whyItMatters:
      "Context window management directly affects cost, latency, and answer quality. Stuffing too much irrelevant context degrades answers. Too little means the model lacks information to answer correctly.",
    commonPitfalls: [
      "Sending the entire conversation history forever — costs grow quadratically and old turns pollute answers",
      "Including large irrelevant documents in context — the model's attention is diluted across noise",
      "Forgetting that the model's own response also consumes context — a 1000-token reply reduces available prompt space",
    ],
    examples: [
      {
        title: "Context window sizes across popular models",
        description: "Know your model's limits before designing your system.",
        code: `// Model context windows (as of 2025-2026)
const models = [
  { name: "gpt-4o",              context: 128_000,   output: 16_384 },
  { name: "gpt-4o-mini",         context: 128_000,   output: 16_384 },
  { name: "o1",                  context: 200_000,   output: 100_000 },
  { name: "claude-3-5-sonnet",   context: 200_000,   output: 8_096 },
  { name: "claude-3-5-haiku",    context: 200_000,   output: 8_096 },
  { name: "gemini-1.5-pro",      context: 1_000_000, output: 8_192 },
  { name: "gemini-2.0-flash",    context: 1_000_000, output: 8_192 },
  { name: "llama-3.1-70b",       context: 128_000,   output: 4_096 },
];

// What fits in different context sizes?
function estimateCapacity(tokens: number) {
  return {
    shortEmails:      Math.floor(tokens / 200),
    blogPosts:        Math.floor(tokens / 1_500),
    novelPages:       Math.floor(tokens / 450),
    codeFiles:        Math.floor(tokens / 2_000),
  };
}`,
        language: "typescript",
        output: `CONTEXT WINDOW CAPACITIES
═══════════════════════════════════════════════════

  Model               Context     Approx what fits
  ──────────────────────────────────────────────────
  gpt-4o              128k tok    ~300 pages of text
  gpt-4o-mini         128k tok    ~300 pages (cheaper)
  claude-3-5-sonnet   200k tok    ~450 pages of text
  o1                  200k tok    ~450 pages + big output
  gemini-1.5-pro       1M tok    ~2,250 pages of text!
  gemini-2.0-flash     1M tok    ~2,250 pages (faster)

  128,000 TOKENS CAN HOLD:
  ╔══════════════════════════════╗
  ║  640 short emails            ║
  ║   85 blog posts              ║
  ║   64 code files              ║
  ║  284 novel pages             ║
  ╚══════════════════════════════╝

LOST-IN-THE-MIDDLE PHENOMENON
═══════════════════════════════════════════════════
  Accuracy when answer is at different positions in 128k context:

  Position   Start  ████████████████████  95%
  Position   End    ███████████████████   92%
  Position   Middle ██████████            58%  ← drops significantly

  → Put the most important documents FIRST or LAST in context`,
      },
    ],
  },
};

const temperature: TopicNode = {
  id: "ai-temperature",
  title: "Temperature & Sampling",
  iconName: "Thermometer",
  link: "https://platform.openai.com/docs/api-reference/chat/create#chat-create-temperature",
  theory:
    "Temperature controls randomness in token selection. Low temperature (near 0) makes outputs predictable and deterministic. High temperature (near 2) makes outputs creative but potentially incoherent.",
  theoryDetail: {
    keyConcepts: [
      "Temperature scales the probability distribution over the vocabulary before sampling",
      "temperature: 0 → always picks the highest-probability next token (greedy decoding) — nearly deterministic",
      "top_p (nucleus sampling) — alternative to temperature; only sample from the top P% of probability mass",
      "frequency_penalty penalises tokens that have already appeared, reducing repetition",
      "presence_penalty encourages the model to introduce new topics",
    ],
    whyItMatters:
      "Using temperature 1.0 for JSON extraction causes format errors. Using temperature 0 for creative writing produces boring output. Matching temperature to the task type is a fundamental model configuration skill.",
    commonPitfalls: [
      "Using high temperature for structured tasks like JSON generation — causes malformed output",
      "Setting both temperature and top_p — OpenAI recommends changing only one at a time",
      "Expecting temperature: 0 to be fully deterministic — models can still produce slight variations due to floating-point operations",
    ],
    examples: [
      {
        title: "Temperature presets per task type",
        description:
          "Match temperature to the task: lower for precision tasks, higher for creative tasks.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

// ─── Extraction / structured tasks → temperature: 0 ───
async function extractEntities(text: string) {
  return client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,    // deterministic — same input, same JSON every time
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Extract entities as JSON: {people: [], places: [], orgs: []}" },
      { role: "user", content: text },
    ],
  });
}

// ─── Q&A / factual → temperature: 0.2 ───
async function answerQuestion(question: string) {
  return client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,  // slight variation but stays factual
    messages: [
      { role: "system", content: "Answer factually and concisely." },
      { role: "user", content: question },
    ],
  });
}

// ─── Creative writing → temperature: 0.9 ───
async function writePoem(theme: string) {
  return client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.9,  // high creativity — varies significantly between runs
    messages: [
      { role: "system", content: "You are a creative poet." },
      { role: "user", content: \`Write a short poem about: \${theme}\` },
    ],
  });
}`,
        language: "typescript",
        output: `TEMPERATURE EFFECT ON THE SAME PROMPT: "Describe a sunset"
═══════════════════════════════════════════════════

  temperature: 0.0 (run 1):
  "The sun sets below the horizon, painting the sky in orange and red."
  temperature: 0.0 (run 2):
  "The sun sets below the horizon, painting the sky in orange and red."
  → Identical — greedy decoding always picks the top token

  temperature: 0.7 (run 1):
  "Golden light spills across the clouds as the day fades into dusk."
  temperature: 0.7 (run 2):
  "The horizon blazes with amber and crimson as evening claims the sky."
  → Different each time, but both coherent

  temperature: 1.5 (run 1):
  "Chromatic dissolving light cascades the membrane of tomorrow!"
  temperature: 1.5 (run 2):
  "Purple fire erupts beyond the glowing fabric of worldly ocean mist."
  → Creative but borderline incoherent

TASK → TEMPERATURE CHEAT SHEET
═══════════════════════════════════════════════════
  JSON extraction / classification  →  0.0
  Code generation                   →  0.0 – 0.2
  Q&A / summarization               →  0.2 – 0.4
  Chatbot / conversation            →  0.6 – 0.8
  Creative writing / brainstorming  →  0.8 – 1.0
  Highly experimental / poetry      →  1.0 – 1.5`,
      },
    ],
  },
};

export const aiFundamentals: TopicNode = {
  id: "ai-fundamentals",
  title: "LLM Fundamentals",
  iconName: "Brain",
  link: "https://jalammar.github.io/illustrated-transformer/",
  theory:
    "Large Language Models (LLMs) are transformer-based neural networks trained to predict the next token in a sequence. Understanding tokens, context windows, and sampling parameters is the foundation for building reliable AI features.",
  theoryDetail: {
    keyConcepts: [
      "LLMs are next-token predictors — they generate text one token at a time using probability distributions",
      "Transformers use self-attention to relate every token to every other token in the context",
      "Training is done on vast internet-scale text with a self-supervised objective (predict the masked token)",
      "RLHF (Reinforcement Learning from Human Feedback) aligns raw models to be helpful, harmless, and honest",
      "Emergent capabilities (reasoning, code, translation) arise from scale — they were not explicitly programmed",
    ],
    whyItMatters:
      "You can use LLMs without understanding transformers, but you cannot debug hallucinations, context overflow errors, or unpredictable outputs without understanding the fundamentals.",
    commonPitfalls: [
      "Treating LLMs as databases — they don't store facts reliably; use RAG for factual retrieval",
      "Ignoring token limits — exceeding the context window silently truncates input",
      "Assuming the model 'understands' — it predicts probable continuations, not necessarily true ones",
    ],
  },
  children: [tokenization, contextWindows, temperature],
};
