import type { TopicNode } from "@/data/types";

export const testing: TopicNode = {
  id: "react-testing-behavior",
  title: "Testing React Behavior",
  iconName: "TestTube2",
  link: "https://testing-library.com/docs/react-testing-library/intro/",
  theory:
    "Test user-visible behavior, not implementation details. React Testing Library encourages assertions based on what users can see and do, making tests more resilient to refactors.",
  theoryDetail: {
    keyConcepts: [
      "Prefer queries by role/label/text to mirror real accessibility and user flows",
      "Test state transitions through interactions (click, type, submit), not internal state",
      "Use async queries and waits for loading states, network-driven UI, and deferred updates",
      "Mock boundaries (API/time/router), not React internals",
    ],
    whyItMatters:
      "Reliable tests speed up development. Teams can refactor with confidence when tests validate behavior contracts instead of brittle implementation details.",
    commonPitfalls: [
      "Asserting implementation details like component instance methods or internal state",
      "Using test IDs for everything instead of semantic queries",
      "Skipping loading/error/empty state tests",
      "Not resetting mocks between tests, causing order-dependent failures",
    ],
    examples: [
      {
        title: "User-centric test with React Testing Library",
        description: "Assert behavior through roles and visible output.",
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

test('increments count when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole('button', { name: /increment/i }));

  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});`,
        language: "tsx",
      },
    ],
  },
};
