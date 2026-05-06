import type { TopicNode } from "@/data/types";

export const reactTestingLibrary: TopicNode = {
  id: "react-testing-library",
  title: "React Testing Library (RTL)",
  iconName: "FlaskConical",
  link: "https://testing-library.com/docs/react-testing-library/intro/",
  theory:
    "React Testing Library (RTL) is the standard testing utility for React components. Its guiding principle: test your components the way users interact with them — by querying the DOM through accessible roles, labels, and text, not by inspecting internal state or implementation details. Combined with Jest (or Vitest), it provides a complete testing solution for unit, integration, and behavior tests.",
  theoryDetail: {
    keyConcepts: [
      "render() mounts a component into a virtual DOM — no browser needed",
      "screen.getByRole(), getByLabelText(), getByText() — query the DOM the way a screen reader or user would",
      "userEvent simulates real user interactions (click, type, tab) more accurately than fireEvent",
      "waitFor() and findBy* queries handle async rendering — loading states, API responses, transitions",
      "Jest/Vitest matchers: toBeInTheDocument(), toHaveTextContent(), toBeDisabled(), toBeVisible()",
      "Mock Service Worker (MSW) intercepts network requests at the service worker level — no mocking fetch directly",
      "Test the behavior contract, not the implementation — if you refactor internals, tests should still pass",
    ],
    whyItMatters:
      "Tests are your safety net for refactoring. RTL's approach of testing user-visible behavior (not internal state or component methods) produces tests that survive code changes. Teams with good RTL coverage can refactor with confidence, catch regressions in CI, and document expected behavior through test descriptions.",
    commonPitfalls: [
      "Using getByTestId as the default query — always prefer getByRole, getByLabelText, getByText first",
      "Testing implementation details (internal state, instance methods, hook return values) — test what the user sees",
      "Not using userEvent.setup() — always create a user instance at the top of the test for realistic event simulation",
      "Wrapping assertions in act() manually — RTL's render and userEvent handle act() automatically",
      "Forgetting to test loading, error, and empty states — not just the happy path",
      "Not cleaning up after tests — RTL auto-cleans after each test, but manual subscriptions and timers need cleanup",
      "Using snapshot tests for everything — they break on every UI change and provide no behavioral guarantee",
    ],
    examples: [
      {
        title: "Query Priority & User-Centric Testing",
        description:
          "RTL queries follow an accessibility-first priority. Use the most accessible query available — it makes your tests AND your app more accessible.",
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Query Priority (best → worst) ──
// 1. getByRole      — accessible role (button, textbox, heading)
// 2. getByLabelText — form fields with <label>
// 3. getByPlaceholderText — when no label exists
// 4. getByText      — visible text content
// 5. getByDisplayValue — current value of form elements
// 6. getByAltText   — images
// 7. getByTitle     — title attribute
// 8. getByTestId    — LAST RESORT — when nothing else works

function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      onSubmit({ email: fd.get('email') as string, password: fd.get('password') as string });
    }}>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" />

      <button type="submit">Sign in</button>
    </form>
  );
}

test('submits login form with user credentials', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  // ✅ getByRole — queries the accessible role
  const emailInput = screen.getByRole('textbox', { name: /email address/i });
  // ✅ getByLabelText — queries by associated label
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });

  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'secure123');
  await user.click(submitButton);

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'secure123',
  });
});`,
        language: "tsx",
      },
      {
        title: "Testing Async Components & API Data",
        description:
          "Use findBy* queries (which wait for elements to appear) and MSW to mock API responses. Never mock fetch directly.",
        code: `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { UserList } from './UserList';

// ── Mock API with MSW ──
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' },
];

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays users after loading', async () => {
  render(<UserList />);

  // Loading state shows first
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // findBy* waits for the element to appear (async)
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();

  // Loading indicator should be gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test('shows error message when API fails', async () => {
  // Override the handler for this test only
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 });
    })
  );

  render(<UserList />);

  expect(await screen.findByText(/error/i)).toBeInTheDocument();
  expect(screen.queryByText('Alice')).not.toBeInTheDocument();
});

test('deletes a user when delete button is clicked', async () => {
  const user = userEvent.setup();

  server.use(
    http.delete('/api/users/:id', () => {
      return HttpResponse.json({ success: true });
    })
  );

  render(<UserList />);

  // Wait for users to load
  await screen.findByText('Alice');

  // Click delete on first user
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  await user.click(deleteButtons[0]);

  // Verify user is removed from the DOM
  await waitFor(() => {
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });
});`,
        language: "tsx",
      },
      {
        title: "Testing Hooks, Context & Redux",
        description:
          "Wrap components in the providers they need. Create a custom render function to avoid repeating boilerplate.",
        code: `import { render, screen, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../store/todosSlice';
import { ThemeProvider } from '../context/ThemeContext';
import { TodoApp } from './TodoApp';
import type { ReactElement } from 'react';

// ── Custom render with all providers ──
function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { todos: todosReducer },
      preloadedState,
    }),
    ...renderOptions
  }: RenderOptions & { preloadedState?: any; store?: any } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

test('adds a todo via the form', async () => {
  const user = userEvent.setup();
  renderWithProviders(<TodoApp />);

  const input = screen.getByRole('textbox');
  const addButton = screen.getByRole('button', { name: /add/i });

  await user.type(input, 'Buy groceries');
  await user.click(addButton);

  expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  expect(input).toHaveValue('');  // Input cleared after submit
});

test('renders with preloaded state', () => {
  renderWithProviders(<TodoApp />, {
    preloadedState: {
      todos: {
        items: [{ id: '1', text: 'Existing todo', completed: false }],
        filter: 'all',
      },
    },
  });

  expect(screen.getByText('Existing todo')).toBeInTheDocument();
});

test('toggles todo completion', async () => {
  const user = userEvent.setup();
  renderWithProviders(<TodoApp />, {
    preloadedState: {
      todos: {
        items: [{ id: '1', text: 'Test task', completed: false }],
        filter: 'all',
      },
    },
  });

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();

  await user.click(checkbox);
  expect(checkbox).toBeChecked();
});`,
        language: "tsx",
      },
      {
        title: "Testing Patterns & Best Practices",
        description:
          "Common patterns: testing accessibility, keyboard navigation, responsive behavior, and what NOT to test.",
        code: `import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Test keyboard navigation ──
test('modal closes on Escape key', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  render(<Modal isOpen={true} onClose={onClose} title="Settings" />);

  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});

// ── Test within a specific container ──
test('each card has its own delete button', () => {
  render(<CardList items={[{ id: 1, name: 'A' }, { id: 2, name: 'B' }]} />);

  const cards = screen.getAllByRole('article');
  const firstCardDelete = within(cards[0]).getByRole('button', { name: /delete/i });
  const secondCardDelete = within(cards[1]).getByRole('button', { name: /delete/i });

  expect(firstCardDelete).toBeInTheDocument();
  expect(secondCardDelete).toBeInTheDocument();
});

// ── Test absence of elements ──
test('admin panel is not visible for regular users', () => {
  render(<Dashboard user={{ role: 'viewer' }} />);

  // queryBy* returns null (not an error) when element doesn't exist
  expect(screen.queryByRole('button', { name: /admin/i })).not.toBeInTheDocument();
});

// ── What NOT to test ──

// ❌ Don't test implementation details
// expect(component.state.isOpen).toBe(true);

// ❌ Don't test library code
// expect(useState).toHaveBeenCalled();

// ❌ Don't use snapshot tests as your only tests
// expect(container).toMatchSnapshot();

// ❌ Don't test styling directly
// expect(element).toHaveStyle('color: red');

// ✅ DO test: user-visible behavior
// ✅ DO test: form submissions and validation
// ✅ DO test: loading, error, empty states
// ✅ DO test: accessibility (roles, labels, keyboard)
// ✅ DO test: conditional rendering based on props/state`,
        language: "tsx",
      },
    ],
  },
};
