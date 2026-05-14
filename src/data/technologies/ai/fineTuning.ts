import type { TopicNode } from "@/data/types";

export const aiFineTuning: TopicNode = {
  id: "ai-fine-tuning",
  title: "Fine-tuning and Specialization",
  iconName: "SlidersHorizontal",
  theory:
    "Fine-tuning adapts a base model to your target style, schema, or task distribution using curated examples. It is best for consistent output behavior, not for injecting frequently changing facts.",
  theoryDetail: {
    keyConcepts: [
      "Use prompting and RAG first; fine-tune when behavior consistency is still insufficient.",
      "Training data quality matters more than raw quantity.",
      "Fine-tuning is excellent for formatting discipline and domain tone control.",
      "Knowledge that changes often should stay in retrieval layers, not model weights.",
    ],
    whyItMatters:
      "Specialized products often need strict output schemas and brand-consistent responses. Fine-tuning can reduce prompt complexity and improve stability in these scenarios.",
    commonPitfalls: [
      "Fine-tuning to solve missing knowledge that should be handled by RAG.",
      "Training on noisy or inconsistent labels and learning bad behavior.",
      "Skipping holdout evaluation and deploying based only on training loss.",
    ],
    examples: [
      {
        title: "When to fine-tune decision guide",
        description:
          "A practical decision path used by teams before launching a fine-tuning project.",
        code: `Question 1: Is the problem primarily factual freshness?
- Yes -> use RAG/index updates, not fine-tuning.

Question 2: Do outputs fail schema/style consistency after prompt + few-shot?
- Yes -> candidate for fine-tuning.

Question 3: Do you have 500+ high-quality labeled examples?
- No -> collect data first.

Question 4: Can you measure improvement with offline+online evals?
- No -> build eval harness before training.

If all checks pass -> run fine-tuning pilot and canary rollout.`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "ai-finetune-datasets",
      title: "Dataset Design and Curation",
      iconName: "Files",
      theory:
        "A good fine-tuning dataset is diverse, policy-aligned, and balanced across normal and edge-case requests.",
      theoryDetail: {
        keyConcepts: [
          "Include failure cases from production logs, not just ideal examples.",
          "Normalize output formatting before training to avoid style drift.",
          "Hold out a representative validation split for unbiased evaluation.",
        ],
        whyItMatters:
          "Dataset curation determines model behavior directly, so weak data leads to weak fine-tuned models regardless of training budget.",
        commonPitfalls: [
          "Leaking validation data into training examples.",
          "Underrepresenting difficult edge cases.",
        ],
      },
      link: "https://platform.openai.com/docs/guides/fine-tuning",
    },
    {
      id: "ai-distillation",
      title: "Distillation and Cost Optimization",
      iconName: "Coins",
      theory:
        "Distillation transfers behavior from a stronger teacher model to a cheaper student model so you can preserve quality while reducing inference cost.",
      theoryDetail: {
        keyConcepts: [
          "Teacher-generated traces can bootstrap large synthetic datasets quickly.",
          "Student models should be validated on real user tasks, not only synthetic prompts.",
          "Distillation is often paired with routing: easy tasks to student, hard tasks to teacher.",
        ],
        whyItMatters:
          "At scale, small quality tradeoffs can unlock major savings in latency and spend.",
        commonPitfalls: [
          "Trusting synthetic labels without human spot checks.",
          "Using one student model for all tasks despite clear domain differences.",
        ],
      },
      link: "https://www.deeplearning.ai/the-batch/model-distillation/",
    },
  ],
};
