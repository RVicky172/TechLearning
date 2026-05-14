import type { TopicNode } from "@/data/types";

export const aiLlmops: TopicNode = {
  id: "ai-llmops",
  title: "LLMOps and Deployment Lifecycle",
  iconName: "Settings2",
  theory:
    "LLMOps is the operational discipline for shipping and maintaining AI systems. It covers versioning, release strategy, monitoring, rollback, and feedback loops that keep model quality stable over time.",
  theoryDetail: {
    keyConcepts: [
      "Treat prompts, eval datasets, and routing policies as versioned artifacts.",
      "Use staged rollout: local eval, shadow traffic, canary, then full deploy.",
      "Monitor both technical and user-facing metrics: latency, cost, safety rate, and task success.",
      "Automated rollback criteria should be defined before release.",
    ],
    whyItMatters:
      "AI behavior changes with model updates, data drift, and prompt edits. LLMOps prevents silent regressions and makes releases auditable and reversible.",
    commonPitfalls: [
      "Shipping prompt changes directly to 100 percent traffic without canary checks.",
      "Tracking only model latency while ignoring answer correctness and policy adherence.",
      "No incident runbook for model/provider outages.",
    ],
    examples: [
      {
        title: "AI release pipeline",
        description:
          "A practical promotion flow from evaluation to production with rollback guardrails.",
        code: `Release v1.18
1) Offline eval suite passes:
   - quality >= 87%
   - refusal compliance >= 99%
2) Shadow 10% production prompts (no user impact)
3) Canary at 5% live traffic for 2 hours
4) Promote to 50% if all SLOs pass
5) Promote to 100%

Auto-rollback triggers:
- p95 latency > 2.0s for 10 min
- policy violation rate > 0.5%
- task success drops by > 4 points`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "ai-observability",
      title: "Observability and Incident Response",
      iconName: "Activity",
      theory:
        "AI observability requires structured traces for prompts, retrieved context, tool calls, and final outputs so teams can debug failures quickly.",
      theoryDetail: {
        keyConcepts: [
          "Log prompt version, model, latency, token usage, and safety decisions per request.",
          "Store sampled request-response traces for quality audits and root-cause analysis.",
          "Build incident playbooks for provider outages and quality regressions.",
        ],
        whyItMatters:
          "When AI features fail, root cause can be in retrieval, prompt logic, provider behavior, or policy filters. Observability is the only way to localize failures quickly.",
        commonPitfalls: [
          "Logging raw sensitive user content without redaction controls.",
          "No correlation IDs linking frontend events to model calls.",
        ],
      },
      link: "https://opentelemetry.io/docs/",
    },
    {
      id: "ai-feedback-flywheels",
      title: "Feedback Loops and Data Flywheels",
      iconName: "RotateCw",
      theory:
        "Continuous improvement comes from capturing user feedback, mining failure traces, and feeding curated examples back into prompts, eval sets, and fine-tuning datasets.",
      theoryDetail: {
        keyConcepts: [
          "Collect explicit feedback (thumbs up/down) and implicit feedback (retries, abandon rate).",
          "Cluster failure cases to prioritize high-frequency, high-impact regressions.",
          "Promote corrected cases into regression eval suites before retraining or reprompting.",
        ],
        whyItMatters:
          "Well-run AI teams improve quality every week because user interactions become training signal, not just support burden.",
        commonPitfalls: [
          "Trusting raw user labels without quality checks.",
          "Improving one benchmark while regressions accumulate in other use cases.",
        ],
      },
      link: "https://platform.openai.com/docs/guides/evals",
    },
  ],
};
