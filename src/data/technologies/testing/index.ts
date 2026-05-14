import type { Technology } from "@/data/types";
import { testingFundamentals } from "./fundamentals";
import { testingJest } from "./jest";
import { testingReactComponents } from "./reactComponents";
import { testingE2E } from "./e2e";

const testing: Technology = {
  id: "testing",
  name: "Testing",
  description: "Unit, integration, and E2E testing strategies and frameworks (Jest, Vitest, Playwright, Cypress).",
  color: "bg-green-600",
  iconName: "CheckCircle2",
  deviconClass: "devicon-jest-plain colored",
  tree: [
    testingFundamentals,
    testingJest,
    testingReactComponents,
    testingE2E,
  ],
};

export default testing;
