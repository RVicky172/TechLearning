import type { TopicNode } from "@/data/types";

export const testingJest: TopicNode = {
  id: "testing-jest",
  title: "Jest Testing Framework",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Jest: zero-config test runner popular for JavaScript and React",
      "Matchers: expect().toBe(), toEqual(), toHaveBeenCalled(), etc.",
      "Mocks: jest.mock(), jest.fn() for isolating dependencies",
      "Snapshots: capture output and detect unintended changes",
      "Setup/teardown: beforeEach(), afterEach() for test isolation",
      "Watch mode: re-run tests on file changes during development",
    ],
    whyItMatters:
      "Jest's zero-config setup and powerful mocking tools make it the de facto standard for React testing. It's fast and scales well.",
    examples: [
      {
        title: "Jest Unit Test",
        description: "Test a function with mocks and assertions.",
        code: `// calculator.test.ts
import { add, subtract } from './calculator';

describe('Calculator', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-2, 3)).toBe(1);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });
  });
});`,
        language: "typescript",
      },
      {
        title: "Mocking Dependencies",
        description: "Isolate code by mocking external calls.",
        code: `// userService.test.ts
import { getUser } from './userService';
import * as db from './database';

jest.mock('./database');

describe('userService', () => {
  it('should fetch user from database', async () => {
    (db.query as jest.Mock).mockResolvedValue({ id: 1, name: 'John' });

    const user = await getUser(1);

    expect(user).toEqual({ id: 1, name: 'John' });
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = 1');
  });
});`,
        language: "typescript",
      },
    ],
  },
};
