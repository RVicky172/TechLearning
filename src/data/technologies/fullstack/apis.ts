import type { TopicNode } from "@/data/types";

export const fullstackApis: TopicNode = {
  id: "fullstack-apis",
  title: "APIs and Communication Patterns",
  iconName: "Plug",
  theory:
    "APIs (Application Programming Interfaces) define how frontends, backends, and services communicate. In the market today, teams use several API styles and communication patterns depending on the product: REST, GraphQL, RPC, gRPC, WebSockets, Server-Sent Events, and Webhooks all solve different integration problems.",
  theoryDetail: {
    keyConcepts: [
      "REST uses HTTP methods and resource URLs for predictable CRUD-style APIs",
      "GraphQL exposes a typed schema and lets clients request exactly the fields they need",
      "RPC and gRPC model operations as procedures or commands rather than resources",
      "WebSockets and Server-Sent Events support realtime or streaming updates",
      "Webhooks are server-to-server event callbacks triggered when something happens",
      "API versioning strategies include URL paths (/v1), headers, or contract/schema evolution depending on the style",
    ],
    whyItMatters:
      "Engineers rarely work with only one API style. A frontend may consume REST and GraphQL, a backend may expose webhooks, and internal services may use gRPC. Understanding the differences helps you choose the right communication model and debug integrations faster.",
    commonPitfalls: [
      "Treating all API types as interchangeable instead of choosing based on product requirements",
      "Using advanced protocols because they are trendy rather than because the system benefits from them",
      "Not handling API errors distinctly — network failures, 4xx, 5xx, timeouts, and retries need different behavior",
      "Ignoring rate limits, retries, idempotency, and authentication differences across API styles",
    ],
    comparisons: [
      {
        title: "REST vs GraphQL vs RPC/gRPC",
        summary: "Different styles solve different problems rather than replacing each other universally.",
        points: [
          "REST is easy to debug, cache-friendly, and widely understood across teams.",
          "GraphQL is useful when clients need flexible, nested data shapes without many round trips.",
          "RPC and gRPC are useful when workflows are action-oriented or when internal service contracts need strong performance and typing.",
        ],
      },
      {
        title: "Realtime vs event-driven integrations",
        summary: "Persistent connections and asynchronous callbacks are not the same thing.",
        points: [
          "WebSockets keep a two-way connection open for bidirectional communication.",
          "Server-Sent Events keep a simpler one-way stream open from server to client.",
          "Webhooks send callbacks after events occur and do not require a persistent connection.",
        ],
      },
    ],
    examples: [
      {
        title: "Frontend API error handling matrix",
        description:
          "Treat API failures by category so user experience stays predictable.",
        code: `401/403 (auth): redirect to login or show permission error
404 (missing data): show empty state with recovery action
409 (conflict): prompt user to refresh/retry with latest version
422 (validation): highlight invalid fields inline
429 (rate limit): back off and retry with jitter
5xx (server): show fallback UI and retry option`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "fullstack-rest",
      title: "REST APIs",
      iconName: "ArrowLeftRight",
      link: "https://restfulapi.net/",
      theory:
        "REST (Representational State Transfer) is an architectural style that uses HTTP methods, status codes, and resource-based URLs to build stateless, scalable web services.",
      theoryDetail: {
        keyConcepts: [
          "Resources are nouns in the URL: /users, /users/42, /users/42/posts",
          "HTTP methods map to CRUD: GET=read, POST=create, PUT/PATCH=update, DELETE=remove",
          "Statelessness: every request must include all information needed — no server-side session",
          "HATEOAS: responses include links to related actions, though most APIs skip this in practice",
        ],
        whyItMatters:
          "REST is the de facto standard for public and internal web APIs. Following REST conventions makes APIs intuitive, predictable, and easy to consume with standard HTTP clients.",
        commonPitfalls: [
          "Using verbs in URLs (/getUser) instead of nouns (/users/:id) with the correct HTTP method",
          "Returning 200 for all responses and encoding success/failure in the body instead of using status codes",
          "Not paginating list endpoints — returning thousands of records in one response",
        ],
        examples: [
          {
            title: "RESTful resource design",
            description: "Conventional URL patterns and HTTP methods for a users resource.",
            code: `GET    /users          → list users (paginated)
POST   /users          → create a new user
GET    /users/:id      → get a specific user
PUT    /users/:id      → replace the entire user
PATCH  /users/:id      → partially update the user
DELETE /users/:id      → delete the user

# Nested resources
GET    /users/:id/posts   → list posts by user
POST   /users/:id/posts   → create a post for user

# Query parameters for filtering/sorting
GET    /users?role=admin&sort=createdAt&order=desc&page=2&limit=20`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "fullstack-graphql",
      title: "GraphQL",
      iconName: "GitMerge",
      link: "https://graphql.org/learn/",
      theory:
        "GraphQL is a query language for APIs developed by Meta. Clients send a typed query describing exactly the fields they need, and the server responds with precisely that shape — no more, no less.",
      theoryDetail: {
        keyConcepts: [
          "Single endpoint (usually /graphql) for all operations: queries (read), mutations (write), subscriptions (real-time)",
          "Schema Definition Language (SDL) defines types, queries, and mutations — serves as a contract",
          "Resolvers are functions on the server that return data for each field in the schema",
          "Fragments and aliases allow reusing field selections and renaming fields in responses",
        ],
        whyItMatters:
          "GraphQL eliminates over-fetching and under-fetching. Mobile clients can request minimal payloads; dashboards can request complex nested data in one round trip. The typed schema acts as living documentation.",
        commonPitfalls: [
          "N+1 query problem — a list query triggers one DB query per item; use DataLoader to batch",
          "Exposing the full schema publicly without authorization checks on sensitive fields",
          "Not implementing query complexity limits — a nested query can exhaust server resources",
        ],
        examples: [
          {
            title: "GraphQL query and mutation",
            description: "Requesting only needed fields and creating a resource with a mutation.",
            code: `# Query — fetch only the fields you need
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts(first: 5) {
      title
      publishedAt
    }
  }
}

# Mutation — create a new post
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    author {
      name
    }
  }
}

# Variables
{
  "input": { "title": "Hello GraphQL", "authorId": "42" }
}`,
            language: "graphql",
          },
        ],
      },
    },
    {
      id: "fullstack-rpc",
      title: "RPC and tRPC",
      iconName: "Workflow",
      theory:
        "RPC means Remote Procedure Call. Instead of modeling everything as resources, RPC-style APIs model commands or operations such as sendOtp, calculateShipping, or completeCheckout.",
      theoryDetail: {
        keyConcepts: [
          "RPC endpoints are action-oriented rather than resource-oriented.",
          "tRPC is a TypeScript-first RPC approach that gives end-to-end type safety between frontend and backend.",
          "RPC is often a better fit when workflows are command-heavy and REST resource semantics feel forced.",
        ],
        whyItMatters:
          "Many real product flows are action-driven, not CRUD-driven. RPC can feel simpler and more natural for multi-step business actions, especially in internal applications.",
        commonPitfalls: [
          "Turning every endpoint into a custom action and losing the benefits of standard HTTP semantics.",
          "Over-coupling frontend and backend contracts too tightly.",
          "Using RPC externally without clear documentation or versioning discipline.",
        ],
        examples: [
          {
            title: "Action-oriented endpoints",
            description: "A workflow API often looks more natural as commands than as pure resource CRUD.",
            code: `POST /api/auth/send-otp
POST /api/payments/charge
POST /api/orders/:id/cancel`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "fullstack-grpc",
      title: "gRPC",
      iconName: "Cable",
      theory:
        "gRPC is a high-performance RPC framework that uses Protocol Buffers and HTTP/2. It is widely used in internal microservice systems where strong contracts and efficient communication matter more than browser-native simplicity.",
      theoryDetail: {
        keyConcepts: [
          "Schemas are defined in .proto files and code can be generated for many languages.",
          "gRPC supports unary requests as well as client, server, and bidirectional streaming.",
          "It is especially strong for internal service-to-service communication.",
        ],
        whyItMatters:
          "Even if your public API is REST, your internal platform may still use gRPC. Understanding it helps when working with backend platforms and distributed systems.",
        commonPitfalls: [
          "Assuming gRPC is automatically the best fit for browser-facing APIs.",
          "Underestimating debugging and tooling differences compared with JSON over HTTP.",
          "Ignoring schema evolution concerns across many services.",
        ],
        examples: [
          {
            title: "gRPC service contract",
            description: "The protocol is strongly schema-first and built around generated contracts.",
            code: `service UserService {
  rpc GetUser (GetUserRequest) returns (UserResponse);
  rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
}`,
            language: "proto",
          },
        ],
      },
    },
    {
      id: "fullstack-realtime-apis",
      title: "WebSockets and SSE",
      iconName: "Radio",
      theory:
        "Some product features need live updates instead of standard request-response communication. WebSockets provide a full duplex connection, while Server-Sent Events provide a server-to-client stream over HTTP.",
      theoryDetail: {
        keyConcepts: [
          "WebSockets support bidirectional realtime communication.",
          "SSE is simpler when only the server needs to push updates to the client.",
          "Polling is often simpler than both for low-frequency updates, so use realtime channels only when necessary.",
        ],
        whyItMatters:
          "Notifications, live dashboards, chat, collaborative editing, and streaming progress updates all depend on choosing the right realtime delivery model.",
        commonPitfalls: [
          "Using WebSockets when simpler polling or SSE would be easier to operate.",
          "Ignoring reconnect behavior and connection cleanup.",
          "Forgetting that scaling realtime systems often needs shared state or pub/sub infrastructure.",
        ],
        examples: [
          {
            title: "SSE endpoint shape",
            description: "SSE is often a practical middle ground for browser streaming updates.",
            code: `GET /api/stream
Content-Type: text/event-stream

data: {"status":"processing"}

data: {"status":"completed"}`,
            language: "text",
          },
        ],
      },
    },
    {
      id: "fullstack-webhooks",
      title: "Webhooks",
      iconName: "Webhook",
      theory:
        "Webhooks are outbound HTTP callbacks that notify another system when an event happens. Stripe, GitHub, Slack, and many SaaS products rely on them for asynchronous integrations.",
      theoryDetail: {
        keyConcepts: [
          "Webhooks are push-based event notifications between servers.",
          "Consumers must verify signatures, handle retries, and make processing idempotent.",
          "Webhook receivers usually acknowledge quickly and process heavy work asynchronously.",
        ],
        whyItMatters:
          "Modern integrations depend heavily on webhook workflows. Payments, CI/CD, CRM, ecommerce, and messaging platforms all use them.",
        commonPitfalls: [
          "Trusting webhook payloads without signature verification.",
          "Doing long-running work before returning a 200 response.",
          "Not making handlers idempotent, so retries create duplicate side effects.",
        ],
        examples: [
          {
            title: "Webhook receiver responsibilities",
            description: "Receiving a webhook is not just defining a POST route; it requires safe event processing.",
            code: `1. Verify provider signature
2. Parse event safely
3. Ignore duplicate event ids
4. Queue background work if needed
5. Return 200 quickly`,
            language: "text",
          },
        ],
      },
    },
    {
      id: "fullstack-apis-express-reference",
      title: "Building APIs with Express.js",
      iconName: "ServerCog",
      link: "https://expressjs.com/",
      theory:
        "Express.js is one of the most common Node.js frameworks for implementing REST APIs, middleware pipelines, authentication, validation, and webhook receivers. Use the Express.js section in this project for implementation-focused backend examples.",
      theoryDetail: {
        keyConcepts: [
          "Express is a practical reference implementation for many HTTP API patterns taught here.",
          "It is especially useful for learning middleware, routing, CORS, auth, validation, and production API structure.",
          "You can study API concepts here first, then jump to the Express.js technology track for concrete code patterns.",
        ],
      },
    },
  ],
};
