import type { TopicNode } from "@/data/types";
import { tsIQEasy } from "./easy";
import { tsIQMedium } from "./medium";
import { tsIQHard } from "./hard";

export const tsInterviewQuestions: TopicNode = {
  id: "ts-interview-questions",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "TypeScript interview questions organized by difficulty. Each tier targets a different experience level — from core fundamentals to advanced type system mastery.",
  theoryDetail: {
    keyConcepts: [
      "Easy: primitives, type inference, optional params, void/never — expected at all levels",
      "Medium: any/unknown, generics, discriminated unions, utility types — junior to mid",
      "Hard: type guards, branding, conditional types, mapped types, variance — senior+",
    ],
    whyItMatters:
      "TypeScript interviews test whether you can model business domains safely and articulate trade-offs — not just use syntax.",
    commonPitfalls: [
      "Using any to silence type errors instead of modeling the data shape correctly",
      "Confusing compile-time type safety with runtime data validation",
      "Over-engineering types with conditional types when a simple union is clearer",
    ],
  },
  children: [tsIQEasy, tsIQMedium, tsIQHard],
};

// Each difficulty tier lives in its own file:
//   easy.ts   → 5 questions: What is TS, primitives, inference, optional params, void/never
//   medium.ts → 6 questions: any/unknown, interface/type, generics, discriminated unions, utility types, overloads
//   hard.ts   → 6 questions: type guards, branding, exhaustive checks, conditional types, mapped types, variance
