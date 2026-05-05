import type { Technology } from "@/data/types";
import { aiFundamentals }      from "@/data/technologies/ai/fundamentals";
import { aiPromptEngineering } from "@/data/technologies/ai/promptEngineering";
import { aiEmbeddings }        from "@/data/technologies/ai/embeddings";
import { aiRag }               from "@/data/technologies/ai/rag";
import { aiAgents }            from "@/data/technologies/ai/agents";
import { aiApis }              from "@/data/technologies/ai/apis";
import { aiSafety }            from "@/data/technologies/ai/safety";

const ai: Technology = {
  id: "ai",
  name: "AI Engineering",
  description:
    "Core concepts for building AI-powered applications: LLM fundamentals, prompt engineering, embeddings, RAG, agents, and responsible AI.",
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
    aiSafety,
  ],
};

export default ai;
