import type { TopicNode } from "@/data/types";

export const testingReactComponents: TopicNode = {
  id: "testing-react",
  title: "React Component Testing",
  iconName: "FileCode2",
  theoryDetail: {
    keyConcepts: [
      "React Testing Library: query by user behavior, not implementation",
      "Avoid testing internal state; test what users see",
      "user-event: simulate realistic user interactions (type, click, submit forms)",
      "Queries: getBy* (throws if not found), queryBy* (returns null), findBy* (async)",
      "Testing async operations: waitFor() for state updates and API calls",
      "Accessibility testing: render() includes a11y checks if configured",
    ],
    whyItMatters:
      "Testing React components correctly prevents regressions and catches UI bugs early. Testing behavior (not implementation) makes refactoring safe.",
    examples: [
      {
        title: "Component Test with User Interactions",
        description: "Test component behavior from user perspective.",
        code: `// Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('should increment count on button click', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole('button', { name: /increment/i });
    await user.click(button);

    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });

  it('should render initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText(/count: 5/i)).toBeInTheDocument();
  });
});`,
        language: "typescript",
      },
      {
        title: "Testing Async Operations",
        description: "Wait for async state updates.",
        code: `// UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should display user after loading', async () => {
    render(<UserProfile userId="1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
  });

  it('should display error on fetch failure', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});`,
        language: "typescript",
      },
    ],
  },
};
