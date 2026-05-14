import type { TopicNode } from "@/data/types";

export const testingFundamentals: TopicNode = {
  id: "testing-fundamentals",
  title: "Testing Fundamentals",
  iconName: "CheckCircle2",
  theoryDetail: {
    keyConcepts: [
      "Unit tests: test individual functions/components in isolation",
      "Integration tests: test how multiple units work together",
      "E2E tests: test full user workflows from browser perspective",
      "Testing pyramid: many unit tests, fewer integration, minimal E2E",
      "Test coverage: measure % of code exercised by tests (aim for >80%)",
      "Arrange-Act-Assert (AAA) pattern: setup, execute, verify results",
    ],
    whyItMatters:
      "Tests catch regressions, enable refactoring with confidence, and serve as executable documentation. They're essential for maintaining code quality in teams.",
    commonPitfalls: [
      "Testing implementation details instead of behavior; focus on what users see",
      "Overly specific tests that break when code changes slightly; write brittle tests",
      "Too many E2E tests; expensive to maintain and slow to run",
      "Not mocking external dependencies; tests become flaky and slow",
      "Skipping tests before shipping; technical debt accumulates fast",
    ],
  },
};
