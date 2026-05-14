import type { TopicNode } from "@/data/types";

export const aiEvaluation: TopicNode = {
  id: "ai-evaluation",
  title: "Evaluation and Quality",
  iconName: "CheckCircle2",
  theory:
    "You cannot improve AI systems without measurement. Evaluation turns subjective impressions into repeatable metrics for correctness, safety, latency, and cost.",
  theoryDetail: {
    keyConcepts: [
      "Offline evals run against fixed datasets to compare prompts, models, and retrieval settings.",
      "Online evals track production behavior using user feedback and outcome metrics.",
      "Judge-model evals are useful but should be calibrated against human-reviewed samples.",
      "A robust eval suite includes task quality, safety compliance, latency, and unit cost.",
    ],
    whyItMatters:
      "Teams that skip evals ship regressions quietly. A disciplined evaluation loop makes AI releases predictable and gives confidence when changing prompts, retrievers, or model providers.",
    commonPitfalls: [
      "Relying on one aggregate score and missing critical failure modes.",
      "Evaluating only happy-path prompts without adversarial or edge-case inputs.",
      "Improving benchmark scores while harming real user outcomes.",
    ],
    examples: [
      {
        title: "Minimal eval scorecard",
        description:
          "Track quality, safety, latency, and cost together before promoting a prompt/model change.",
        code: `Release candidate: prompt-v12 + model-x

Offline set (n=500):
- Exactness: 86.4% (target >= 85%)
- Citation correctness: 93.1% (target >= 92%)
- Refusal compliance: 99.2% (target >= 99%)

Shadow traffic (24h):
- p95 latency: 1.4s (target <= 1.6s)
- Avg cost per answer: $0.0018 (target <= $0.0020)
- Escalation rate: 3.9% (target <= 5.0%)

Decision: promote to 25% canary`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "ai-offline-evals",
      title: "Offline Evals",
      iconName: "ClipboardCheck",
      theory:
        "Offline evaluation uses versioned datasets and deterministic scoring rules to compare system changes before deployment.",
      theoryDetail: {
        keyConcepts: [
          "Keep datasets versioned and tagged by use case.",
          "Separate regression suites by feature area to isolate failures quickly.",
          "Use pairwise comparisons when absolute scoring is noisy.",
        ],
        whyItMatters:
          "Offline evals catch regressions early and reduce risk before production rollout.",
        commonPitfalls: [
          "Dataset drift where test prompts no longer match live usage.",
          "Hand-tuned prompts overfitting to a small eval set.",
        ],
      },
      link: "https://platform.openai.com/docs/guides/evals",
    },
    {
      id: "ai-online-evals",
      title: "Online Evals and Guardrails",
      iconName: "Activity",
      theory:
        "Online evaluation measures real production behavior with canaries, feedback loops, and automatic rollback thresholds.",
      theoryDetail: {
        keyConcepts: [
          "Canary rollouts expose a subset of traffic to new variants safely.",
          "Guardrail metrics should include refusal quality, policy violations, and fallback frequency.",
          "Alert thresholds should map to user impact, not just model-side metrics.",
        ],
        whyItMatters:
          "Real users interact differently than test sets, so online evals are required for trustworthy releases.",
        commonPitfalls: [
          "Shipping to 100% traffic without staged rollout.",
          "No auto-rollback criteria when quality drops suddenly.",
        ],
      },
      link: "https://www.anthropic.com/research/evaluating-language-models",
    },
  ],
};
