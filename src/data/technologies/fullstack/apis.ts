import type { TopicNode } from "@/data/types";

export const fullstackApis: TopicNode = {
  id: "fullstack-apis",
  title: "APIs (REST & GraphQL)",
  iconName: "Plug",
  theory:
    "APIs (Application Programming Interfaces) define how frontends communicate with backends. REST is the dominant architectural style for web APIs; GraphQL is a query language that gives clients precise control over the data they receive.",
  theoryDetail: {
    keyConcepts: [
      "REST uses HTTP methods and resource URLs to perform CRUD operations",
      "GraphQL exposes a single endpoint and lets clients specify exactly what data they need",
      "API versioning strategies: URL path (/v1/), header (Accept-Version), or query param",
    ],
    whyItMatters:
      "Frontend developers spend most of their time consuming APIs. Understanding REST conventions and GraphQL queries helps you design better integrations, debug failures faster, and communicate clearly with backend teams.",
    commonPitfalls: [
      "Over-fetching with REST (receiving unused fields) or under-fetching (requiring multiple round trips)",
      "Not handling API errors distinctly — network failures, 4xx, and 5xx need different UX responses",
      "Ignoring rate limits and not implementing exponential back-off on retries",
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
  ],
};
