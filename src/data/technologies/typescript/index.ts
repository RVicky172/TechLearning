import type { Technology } from "@/data/types";
import { tsSetup } from "./setup";
import { tsBuildTools } from "./buildTools";
import { tsFileTypes } from "./fileTypes";
import { tsFundamentals } from "./fundamentals";
import { tsAdvanced } from "./advanced";
import { tsFunctions } from "./functions";
import { tsClasses } from "./classes";
import { tsEnumsAndLiterals } from "./enumsAndLiterals";
import { tsModulesAndConfig } from "./modulesAndConfig";
import { tsInPractice } from "./inPractice";
import { tsInterviewQuestions } from "./interviewQuestions";

const typescript: Technology = {
  id: "typescript",
  name: "TypeScript",
  description: "Strongly typed superset of JavaScript that catches bugs at compile time and improves IDE support.",
  color: "bg-blue-700",
  iconName: "FileCode2",
  deviconClass: "devicon-typescript-plain colored",
  tree: [
    tsSetup,
    tsBuildTools,
    tsFileTypes,
    tsFundamentals,
    tsAdvanced,
    tsFunctions,
    tsClasses,
    tsEnumsAndLiterals,
    tsModulesAndConfig,
    tsInPractice,
    tsInterviewQuestions,
  ],
};

export default typescript;

// Each section lives in its own file for easy maintenance:
//   setup.ts                          -> ts-setup: Install, tsconfig baseline, runners, VS Code
//   buildTools.ts                     -> ts-build-tools: tsc, esbuild, Vite, Webpack, tsup, SWC
//   fileTypes.ts                      -> ts-file-types: .ts/.tsx, .d.ts, .mts/.cts, ambient, JSON
//   fundamentals.ts                   -> ts-basics: Basic Types, Interfaces, Narrowing, keyof/typeof, satisfies, Assertions
//   advanced.ts                       -> ts-advanced: Generics, Utility Types, Conditional/Mapped, Branding, Advanced Generics, Exhaustive Checks, Variance
//   functions.ts                      -> ts-functions: Signatures, Overloads, Async/Promise, Higher-Order Functions
//   classes.ts                        -> ts-classes: Basics, Access Modifiers, Abstract Classes
//   enumsAndLiterals.ts               -> ts-enums-literals: Enums, Literal/Union Types, Template Literal Types
//   modulesAndConfig.ts               -> ts-modules-config: tsconfig, ES Modules, Declaration Files, Project References
//   inPractice.ts                     -> ts-in-practice: React, Zod Validation, Error Handling, API Design
//   interviewQuestions/index.ts       -> ts-interview-questions (assembler)
//   interviewQuestions/easy.ts        -> 5 easy questions: What is TS, primitives, inference, optional, void/never
//   interviewQuestions/medium.ts      -> 6 medium questions: any/unknown, interface/type, generics, discriminated unions, utility types, overloads
//   interviewQuestions/hard.ts        -> 6 hard questions: type guards, branding, exhaustive, conditional, mapped, variance
