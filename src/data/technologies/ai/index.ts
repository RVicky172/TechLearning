import type { Technology } from "@/data/types";
import { aiFundamentals }      from "@/data/technologies/ai/fundamentals";
import { aiPromptEngineering } from "@/data/technologies/ai/promptEngineering";
import { aiEmbeddings }        from "@/data/technologies/ai/embeddings";
import { aiRag }               from "@/data/technologies/ai/rag";
import { aiAgents }            from "@/data/technologies/ai/agents";
import { aiApis }              from "@/data/technologies/ai/apis";
import { aiMultimodal }        from "@/data/technologies/ai/multimodal";
import { aiEvaluation }        from "@/data/technologies/ai/evaluation";
import { aiFineTuning }        from "@/data/technologies/ai/fineTuning";
import { aiArchitecture }      from "@/data/technologies/ai/architecture";
import { aiLlmops }            from "@/data/technologies/ai/llmops";
import { aiSafety }            from "@/data/technologies/ai/safety";

const ai: Technology = {
  id: "ai",
  name: "AI Engineering",
  description:
    "Core concepts for building AI-powered applications: foundations, prompting, embeddings, RAG, agents, APIs, multimodal UX, evaluation, fine-tuning, architecture, LLMOps, and responsible AI.",
  color: "bg-purple-600",
  iconName: "Sparkles",
  deviconClass: "devicon-pytorch-original colored",
  tree: [
    aiFundamentals,
    aiPromptEngineering,
    aiEmbeddings,
    aiRag,
    aiAgents,
    aiApis,
    aiMultimodal,
    aiEvaluation,
    aiFineTuning,
    aiArchitecture,
    aiLlmops,
    aiSafety,
  ],
};

export default ai;
