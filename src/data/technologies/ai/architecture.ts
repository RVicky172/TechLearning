import type { TopicNode } from "@/data/types";

export const aiArchitecture: TopicNode = {
  id: "ai-architecture",
  title: "AI Systems Architecture",
  iconName: "Network",
  theory:
    "AI products need more than model calls. A robust architecture handles routing, caching, fallbacks, and operational boundaries so quality stays stable under real traffic and provider variability.",
  theoryDetail: {
    keyConcepts: [
      "Request routing selects model/provider based on task type, latency target, and policy constraints.",
      "Fallbacks handle transient API failures and degraded model behavior without dropping user requests.",
      "Caching reduces cost and latency at multiple layers: prompt prefix cache, retrieval cache, and final response cache.",
      "Architecture should separate orchestration logic from product logic to keep systems testable.",
    ],
    whyItMatters:
      "Without architecture discipline, AI features become expensive, slow, and brittle. Clear control planes for routing and resilience are what make AI systems production-ready.",
    commonPitfalls: [
      "Hardcoding one model for every task and paying premium cost on simple requests.",
      "No timeout budgets, causing long tail latency and poor UX.",
      "Fallbacks that skip safety checks and accidentally change policy behavior.",
    ],
    examples: [
      {
        title: "Latency-aware model routing",
        description:
          "Route by task complexity and service-level objective to balance quality and cost.",
        code: `type RouteInput = {
  task: "summarize" | "extract" | "reason";
  latencyMsBudget: number;
  needsStrictJson: boolean;
};

function selectRoute(input: RouteInput) {
  if (input.needsStrictJson) {
    return { model: "gpt-4o-mini", temperature: 0, mode: "structured" };
  }

  if (input.task === "reason") {
    return input.latencyMsBudget >= 3000
      ? { model: "o3", temperature: 0.2 }
      : { model: "gpt-4o", temperature: 0.2 };
  }

  return { model: "gpt-4o-mini", temperature: 0.4 };
}`,
        language: "typescript",
      },
    ],
  },
  children: [
    {
      id: "ai-routing-fallbacks",
      title: "Routing and Fallback Models",
      iconName: "GitBranch",
      theory:
        "Production systems route to different models and providers, then fail over safely when error rates or latency exceed thresholds.",
      theoryDetail: {
        keyConcepts: [
          "Primary and secondary providers should use consistent prompt contracts.",
          "Circuit breakers prevent repeated calls to a failing backend.",
          "Fallback paths must preserve safety and output schema guarantees.",
        ],
        whyItMatters:
          "Model APIs are not perfectly reliable. Intelligent failover protects user experience during incidents.",
        commonPitfalls: [
          "Fallbacking only on HTTP errors and ignoring quality regressions.",
          "Changing output schema on fallback and breaking downstream parsers.",
        ],
      },
      link: "https://martinfowler.com/bliki/CircuitBreaker.html",
    },
    {
      id: "ai-caching-patterns",
      title: "Caching and Reuse Strategies",
      iconName: "Database",
      theory:
        "Caching repeated prompts, retrieved context, and deterministic outputs can cut spend dramatically without reducing quality.",
      theoryDetail: {
        keyConcepts: [
          "Semantic cache uses embedding similarity to reuse prior answers for near-duplicate questions.",
          "Deterministic tasks (temperature 0, strict schema) are excellent cache candidates.",
          "Cache keys should include prompt version and policy version to avoid stale behavior.",
        ],
        whyItMatters:
          "High-volume AI features often become cost-prohibitive without cache strategy.",
        commonPitfalls: [
          "Cache hits serving outdated policy logic after prompt changes.",
          "Caching sensitive responses without tenant isolation.",
        ],
      },
      link: "https://redis.io/docs/latest/develop/use/patterns/",
    },
  ],
};
