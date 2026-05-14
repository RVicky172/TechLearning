import type { TopicNode } from "@/data/types";

export const nodeTesting: TopicNode = {
  id: "node-testing",
  title: "Testing Node.js Applications",
  iconName: "TestTube",
  theory:
    "Reliable Node.js services require unit tests, integration tests, and end-to-end API tests. Jest is the dominant test runner; Supertest makes HTTP integration testing easy without starting a real server.",
  theoryDetail: {
    keyConcepts: [
      "Unit tests verify a single function in isolation; integration tests verify multiple modules together",
      "Mock external dependencies (databases, HTTP clients) in unit tests for speed and determinism",
      "Supertest wraps your Express app and sends real HTTP requests in process — no port needed",
    ],
    whyItMatters:
      "Tests catch regressions before they reach production, document expected behavior, and give you confidence to refactor. A Node.js API without tests is a liability that grows with every feature.",
    commonPitfalls: [
      "Testing implementation details instead of behavior — tests should break when the API contract changes, not when you rename a variable",
      "Sharing state between tests — each test must set up and tear down its own fixtures",
      "Skipping error path tests — unhappy paths (404, 401, 500) need as much coverage as happy paths",
    ],
    examples: [
      {
        title: "Test command split by layer",
        description:
          "Separate test suites by speed and confidence so CI feedback is faster.",
        code: `{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:ci": "npm run test:unit && npm run test:integration -- --runInBand"
  }
}

// CI strategy
// - run unit tests on every push
// - run integration tests on pull requests
// - run smoke E2E after deploy`,
        language: "json",
      },
    ],
  },
  children: [
    {
      id: "node-jest-unit",
      title: "Unit Testing with Jest",
      iconName: "FlaskConical",
      link: "https://jestjs.io/docs/getting-started",
      theory:
        "Jest is a zero-config test runner with built-in mocking, assertions, and coverage. It's the default choice for Node.js unit and integration tests.",
      theoryDetail: {
        keyConcepts: [
          "describe() groups related tests; it() / test() defines a single test case",
          "expect(value).toBe() for primitives; .toEqual() for deep object equality",
          "jest.fn() creates a mock function; jest.spyOn() wraps an existing method",
        ],
        whyItMatters:
          "Jest's all-in-one design means you don't need to wire up separate assertion, mocking, and coverage libraries. Fast watch mode and parallel execution keep the feedback loop tight during development.",
        commonPitfalls: [
          "Using toBe() for objects — it uses Object.is() (reference equality), not deep equality",
          "Not cleaning up mocks between tests — call jest.clearAllMocks() in afterEach",
          "Leaving timers or open connections after tests causing Jest to hang on exit",
        ],
        examples: [
          {
            title: "Unit test with mocked dependency",
            description: "Test a service function by mocking the database call.",
            code: `// userService.test.js
import { getUser } from './userService';
import { db } from './db';

jest.mock('./db');

describe('getUser', () => {
  it('returns the user when found', async () => {
    db.user.findUnique.mockResolvedValue({ id: '1', name: 'Alice' });

    const user = await getUser('1');

    expect(user).toEqual({ id: '1', name: 'Alice' });
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('throws 404 when user not found', async () => {
    db.user.findUnique.mockResolvedValue(null);

    await expect(getUser('999')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-supertest",
      title: "Integration Testing with Supertest",
      iconName: "Network",
      link: "https://github.com/ladjs/supertest",
      theory:
        "Supertest lets you make HTTP requests to your Express app in tests without starting a real server. It exposes a fluent API for asserting status codes, headers, and JSON bodies.",
      theoryDetail: {
        keyConcepts: [
          "Pass your Express app (not app.listen()) to supertest — it manages the port internally",
          "Chain .expect(200) for status, .expect('Content-Type', /json/) for headers",
          "Use beforeAll/afterAll to connect and disconnect databases around the test suite",
        ],
        whyItMatters:
          "Integration tests verify the full request pipeline — routing, middleware, validation, and response shape — without the overhead and flakiness of a live server and real network.",
        commonPitfalls: [
          "Starting the server with .listen() before passing to supertest — let supertest manage the port",
          "Testing against a shared development database — use a dedicated test database or in-memory SQLite",
          "Not resetting database state between tests causing order-dependent failures",
        ],
        examples: [
          {
            title: "API integration test with Supertest",
            description: "Test an Express route end-to-end.",
            code: `import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';

beforeAll(() => db.$connect());
afterAll(() => db.$disconnect());
afterEach(() => db.user.deleteMany()); // clean up

describe('POST /users', () => {
  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.body).toMatchObject({ name: 'Alice' });
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Bob', email: 'not-an-email' })
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });
});`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-test-patterns",
      title: "Mocking & Test Patterns",
      iconName: "Shuffle",
      link: "https://jestjs.io/docs/mock-functions",
      theory:
        "Good mocking isolates the unit under test. Learn to mock modules, timers, and environment variables so tests are fast, deterministic, and independent of external systems.",
      theoryDetail: {
        keyConcepts: [
          "jest.mock('module') replaces the entire module with auto-mocked stubs",
          "jest.useFakeTimers() controls setTimeout, setInterval, and Date — call jest.useRealTimers() in afterEach",
          "The AAA pattern: Arrange (setup), Act (call the code), Assert (verify expectations)",
        ],
        whyItMatters:
          "Without proper mocking, tests make real network calls and database writes, become slow and brittle, and can corrupt shared environments. Isolation makes tests run in milliseconds.",
        commonPitfalls: [
          "Over-mocking — mocking too many things tests the mocks, not the real behavior",
          "Not restoring mocks after tests contaminating subsequent test cases",
          "Mocking the module you are testing — mock dependencies, not the subject under test",
        ],
        examples: [
          {
            title: "Mocking environment variables",
            description: "Override process.env values safely per test.",
            code: `describe('config validation', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clears module cache so re-import sees new env
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('throws when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    expect(() => require('./config')).toThrow('DATABASE_URL is required');
  });
});`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
