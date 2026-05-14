# AI Technology Data

This folder contains the learning content for the AI Engineering track. The topics focus on practical LLM application development, including prompts, embeddings, retrieval, agents, APIs, and safety.

## Current Structure

```text
ai/
├── README.md
├── index.ts
├── fundamentals.ts
├── promptEngineering.ts
├── embeddings.ts
├── rag.ts
├── agents.ts
├── apis.ts
├── multimodal.ts
├── evaluation.ts
├── fineTuning.ts
├── architecture.ts
├── llmops.ts
└── safety.ts
```

## Section Inventory

Top-level order in `ai/index.ts`:

1. AI Fundamentals
2. Prompt Engineering
3. Embeddings
4. Retrieval-Augmented Generation
5. Agents
6. AI APIs
7. Multimodal AI
8. Evaluation and Quality
9. Fine-tuning and Specialization
10. AI Systems Architecture
11. LLMOps and Deployment Lifecycle
12. Safety and Responsible AI

## How It Works

- Each file exports one named `TopicNode`.
- `ai/index.ts` assembles the final `Technology` object used by the app.
- Shared curriculum types live in `src/data/types.ts`.

## Maintenance Notes

1. Keep examples practical and product-oriented rather than purely theoretical.
2. Cover model limitations, latency, evaluation, and cost where relevant.
3. Update this README when new AI sections are added or reordered.
