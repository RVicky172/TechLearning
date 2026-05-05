import type { TopicNode } from "@/data/types";

const toolCalling: TopicNode = {
  id: "ai-tool-calling",
  title: "Tool / Function Calling",
  iconName: "Wrench",
  link: "https://platform.openai.com/docs/guides/function-calling",
  theory:
    "Tool calling lets the LLM decide when to invoke an external function and what arguments to pass. The model never calls the function itself — it generates a JSON tool call, and your code executes it and returns the result.",
  theoryDetail: {
    keyConcepts: [
      "You define tools as JSON schemas; the model selects which tool to call based on the user's intent",
      "tool_choice: 'auto' — model decides; 'required' — must call a tool; { name: 'fn' } — force specific tool",
      "Parallel tool calls: the model can call multiple tools in one turn when tasks are independent",
      "The model sees tool results by appending a 'tool' role message and continuing the conversation",
      "Tool calls are not always correct — validate inputs and handle errors gracefully before executing",
    ],
    whyItMatters:
      "Tool calling transforms an LLM from a text generator into an agent that can take real actions: search the web, query databases, send emails, call APIs. It is the primitive that makes agentic AI possible.",
    commonPitfalls: [
      "Trusting tool call arguments without validation — the model can pass unexpected values; validate with Zod",
      "Defining too many tools — models get confused with 20+ tools; group related actions or use agents",
      "Not returning tool results to the model — the conversation must continue with the tool result for the model to generate a final response",
    ],
    examples: [
      {
        title: "Tool calling: weather + calendar lookup",
        description:
          "The model receives two tools, selects the right one, and you execute it and return the result.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

// ─── 1. Define tools (JSON schemas) ───
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather for a city. Returns temperature and conditions.",
      parameters: {
        type: "object",
        properties: {
          city:    { type: "string",  description: "City name, e.g. 'London'" },
          units:   { type: "string",  enum: ["celsius", "fahrenheit"], default: "celsius" },
        },
        required: ["city"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "get_calendar_events",
      description: "Get the user's calendar events for a specific date.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
        },
        required: ["date"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

// ─── 2. Simulated function implementations ───
function get_weather(city: string, units = "celsius") {
  return { city, temperature: 18, units, conditions: "Partly cloudy" };
}

function get_calendar_events(date: string) {
  return { date, events: [{ time: "10:00", title: "Team standup" }, { time: "14:00", title: "Product review" }] };
}

// ─── 3. Agentic loop ───
async function runAgent(userMessage: string) {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "user", content: userMessage }
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      tools,
      tool_choice: "auto",
      messages,
    });

    const { finish_reason, message } = response.choices[0];
    messages.push(message);

    if (finish_reason === "stop") {
      return message.content; // Final answer — no more tool calls
    }

    if (finish_reason === "tool_calls") {
      // Execute each tool call and append results
      for (const call of message.tool_calls!) {
        const args = JSON.parse(call.function.arguments);
        let result: unknown;

        if (call.function.name === "get_weather") {
          result = get_weather(args.city, args.units);
        } else if (call.function.name === "get_calendar_events") {
          result = get_calendar_events(args.date);
        }

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    }
  }
}

const answer = await runAgent("What's the weather in Paris today and what meetings do I have on 2025-06-15?");
console.log(answer);`,
        language: "typescript",
        output: `USER: "What's the weather in Paris today and what meetings do I have on 2025-06-15?"

TURN 1 — Model response (finish_reason: "tool_calls"):
  Calls TWO tools in parallel:
  ┌─ tool_call 1 ──────────────────────────────────────┐
  │  name: "get_weather"                                │
  │  arguments: {"city": "Paris", "units": "celsius"}   │
  └─────────────────────────────────────────────────────┘
  ┌─ tool_call 2 ──────────────────────────────────────┐
  │  name: "get_calendar_events"                        │
  │  arguments: {"date": "2025-06-15"}                  │
  └─────────────────────────────────────────────────────┘

YOUR CODE executes both functions:
  get_weather("Paris") → { temperature: 18, conditions: "Partly cloudy" }
  get_calendar_events("2025-06-15") → { events: [{10:00 standup}, {14:00 review}] }

Results appended as "tool" role messages.

TURN 2 — Model response (finish_reason: "stop"):
  "The weather in Paris today is 18°C and partly cloudy. 🌤️
   On June 15th, you have two meetings:
   • 10:00 AM — Team standup
   • 2:00 PM — Product review"

NOTE: Model NEVER called the function directly.
It produced JSON, YOUR code executed it, you returned the result.`,
      },
    ],
  },
};

const reactPattern: TopicNode = {
  id: "ai-react-pattern",
  title: "ReAct Pattern",
  iconName: "RefreshCw",
  link: "https://arxiv.org/abs/2210.03629",
  theory:
    "ReAct (Reasoning + Acting) is a prompting pattern where the model interleaves thoughts, actions (tool calls), and observations (tool results) in a structured loop until it reaches a final answer.",
  theoryDetail: {
    keyConcepts: [
      "Thought: model reasons about what to do next",
      "Action: model calls a tool",
      "Observation: tool result is returned to the model",
      "Loop repeats until the model generates a final Answer",
      "Modern function-calling APIs implement ReAct implicitly — each tool_calls turn IS the Thought+Action",
    ],
    whyItMatters:
      "ReAct externalizes the model's reasoning process, making it debuggable. Each step is inspectable: you can see why the model chose an action and catch faulty reasoning before it produces a wrong final answer.",
    commonPitfalls: [
      "Infinite loops — the model can keep calling tools without converging; always set a max_iterations limit",
      "Not logging intermediate steps — without logs, debugging agent failures is nearly impossible",
      "Giving agents too much autonomy over destructive actions — require human confirmation for irreversible actions",
    ],
    examples: [
      {
        title: "ReAct loop with max iterations guard",
        description:
          "A robust agentic loop with iteration limit, logging, and error handling.",
        code: `import OpenAI from "openai";

const client = new OpenAI();

interface AgentStep {
  type: "thought" | "action" | "observation" | "answer";
  content: string;
}

async function reactAgent(
  userQuery: string,
  tools: OpenAI.Chat.Completions.ChatCompletionTool[],
  executeTool: (name: string, args: Record<string, unknown>) => Promise<unknown>,
  maxIterations = 10
): Promise<{ answer: string; steps: AgentStep[] }> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "Think step by step. Use tools when needed. Stop when you have a final answer.",
    },
    { role: "user", content: userQuery },
  ];

  const steps: AgentStep[] = [];

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      tools,
      tool_choice: "auto",
      messages,
    });

    const { finish_reason, message } = response.choices[0];
    messages.push(message);

    if (finish_reason === "stop") {
      steps.push({ type: "answer", content: message.content! });
      return { answer: message.content!, steps };
    }

    if (finish_reason === "tool_calls") {
      for (const call of message.tool_calls!) {
        const args = JSON.parse(call.function.arguments) as Record<string, unknown>;

        steps.push({ type: "action", content: \`\${call.function.name}(\${JSON.stringify(args)})\` });

        let result: unknown;
        try {
          result = await executeTool(call.function.name, args);
        } catch (err) {
          result = { error: String(err) }; // surface errors to model
        }

        steps.push({ type: "observation", content: JSON.stringify(result) });

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    }
  }

  throw new Error(\`Agent exceeded \${maxIterations} iterations without finishing\`);
}`,
        language: "typescript",
        output: `QUERY: "Search for the current TypeScript version and summarize its new features"

ITERATION 1:
  Action:      search_web("TypeScript latest version 2025")
  Observation: {"results": [{"title": "TypeScript 5.8 Released", "snippet": "..."}]}

ITERATION 2:
  Action:      fetch_page("https://devblogs.microsoft.com/typescript/typescript-5-8/")
  Observation: {"content": "TypeScript 5.8 introduces..."}

ITERATION 3:
  finish_reason: "stop"
  Answer: "TypeScript 5.8 is the latest release (March 2025). Key new features:
   • Improved type narrowing for conditional types
   • Faster declaration emit
   • --erasableSyntaxOnly flag for node compatibility
   ..."

STEPS LOG:
  [action]      search_web({"query": "TypeScript latest version 2025"})
  [observation] {"results": [...]}
  [action]      fetch_page({"url": "..."})
  [observation] {"content": "..."}
  [answer]      "TypeScript 5.8 is the latest..."

MAX ITERATIONS GUARD:
  Without guard: model calls search_web → gets result → searches again
  → loop forever if model keeps refining the query
  With guard: throws after 10 iterations → caught + fallback message shown`,
      },
    ],
  },
};

export const aiAgents: TopicNode = {
  id: "ai-agents",
  title: "AI Agents & Tool Use",
  iconName: "Bot",
  link: "https://lilianweng.github.io/posts/2023-06-23-agent/",
  theory:
    "AI agents combine LLMs with tools (functions the model can call) and a loop that runs until a task is complete. The model plans, acts, observes results, and replans — turning a chat interface into an autonomous problem-solver.",
  theoryDetail: {
    keyConcepts: [
      "Tool calling: model generates JSON → your code executes the function → result returned to model",
      "ReAct loop: Reason → Act → Observe → repeat until done",
      "Planning: decomposing a complex goal into ordered subtasks before acting",
      "Memory: agents maintain state across steps via the message history and external storage",
    ],
    whyItMatters:
      "Agents make LLMs genuinely useful for multi-step tasks: 'research and write a report', 'find and book a flight', 'debug and fix this codebase'. Single-shot prompts can't do this; agents can.",
    commonPitfalls: [
      "Giving agents unrestricted tool access — scope tool permissions as narrowly as possible",
      "No iteration limit — malformed tool calls can send an agent into an infinite loop",
      "Not logging agent steps — debugging production agent failures requires full step traces",
    ],
  },
  children: [toolCalling, reactPattern],
};
