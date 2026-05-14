import type { TopicNode } from "@/data/types";

export const aiMultimodal: TopicNode = {
  id: "ai-multimodal",
  title: "Multimodal AI (Text, Image, Audio)",
  iconName: "Image",
  theory:
    "Modern AI systems are no longer text-only. Multimodal models can ingest and generate across text, images, and audio, which unlocks product workflows like document understanding, visual QA, and voice assistants.",
  theoryDetail: {
    keyConcepts: [
      "A single multimodal model can reason across mixed inputs, such as screenshot + question + constraints.",
      "Vision tasks usually require preprocessing (resize, crop, OCR fallback) to improve reliability.",
      "Voice experiences combine streaming speech-to-text, LLM reasoning, and text-to-speech for low-latency loops.",
      "Multimodal systems should degrade gracefully when one modality is missing or low quality.",
    ],
    whyItMatters:
      "Most real product surfaces are visual and conversational. Teams that can combine modalities build assistants that are significantly more useful than plain chat interfaces.",
    commonPitfalls: [
      "Sending high-resolution images unnecessarily, which increases cost and latency.",
      "Assuming extracted OCR text is always correct without confidence checks.",
      "Designing voice flows without interruption handling, barge-in support, or retry prompts.",
    ],
    examples: [
      {
        title: "Multimodal support ticket triage",
        description:
          "A single request includes screenshot evidence plus user text to classify issue severity.",
        code: `POST /api/triage
Body:
{
  "message": "Checkout button does nothing after update",
  "screenshotUrl": "https://cdn.example.com/bug-123.png",
  "metadata": {
    "browser": "Chrome 136",
    "plan": "pro"
  }
}

Model output:
{
  "severity": "high",
  "category": "frontend-regression",
  "summary": "Primary CTA appears disabled due to CSS overlay",
  "nextAction": "rollback latest checkout bundle and run smoke tests"
}`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "ai-vision-understanding",
      title: "Vision Understanding",
      iconName: "ScanEye",
      theory:
        "Vision models can extract UI states, parse diagrams, classify product images, and answer questions grounded in visual evidence.",
      theoryDetail: {
        keyConcepts: [
          "Use explicit instructions about expected output schema to keep extraction stable.",
          "Crop to regions of interest when only part of an image is relevant.",
          "For compliance workflows, store source image references with model outputs.",
        ],
        whyItMatters:
          "Vision understanding removes manual review bottlenecks in operations, support, and document-heavy workflows.",
        commonPitfalls: [
          "Treating low-confidence extraction as truth.",
          "Not redacting sensitive visual content before inference.",
        ],
      },
      link: "https://platform.openai.com/docs/guides/images",
    },
    {
      id: "ai-voice-realtime",
      title: "Realtime Voice Interfaces",
      iconName: "Mic",
      theory:
        "Realtime voice assistants require sub-second streaming, interruption handling, and clear turn-taking so conversations feel natural.",
      theoryDetail: {
        keyConcepts: [
          "End-to-end latency target for conversational quality is typically under 800ms per turn.",
          "Voice agents need explicit interruption logic so users can correct the assistant mid-response.",
          "Session memory should be summarized periodically to keep context bounded.",
        ],
        whyItMatters:
          "Voice UX quality is dominated by timing and recovery behavior, not just answer accuracy.",
        commonPitfalls: [
          "Buffering full utterances before inference when streaming partials is possible.",
          "No fallback when speech recognition confidence is low.",
        ],
      },
      link: "https://platform.openai.com/docs/guides/realtime",
    },
  ],
};
