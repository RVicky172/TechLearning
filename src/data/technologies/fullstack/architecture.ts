import type { TopicNode } from "@/data/types";

export const fullstackArchitecture: TopicNode = {
  id: "fullstack-architecture",
  title: "Architecture Patterns",
  iconName: "Boxes",
  theory:
    "Application architecture defines how components are organized and communicate. Microservices decompose a large application into small, independently deployable services; message queues decouple those services so they communicate asynchronously.",
  theoryDetail: {
    keyConcepts: [
      "Monoliths are simple to start with but become harder to scale and deploy as teams grow",
      "Microservices allow independent scaling and deployment but add distributed system complexity",
      "Message queues decouple producers and consumers — services don't need to be online simultaneously",
    ],
    whyItMatters:
      "Architecture choices made early are expensive to reverse later. Frontend developers who understand microservices navigate API boundaries, handle partial failures gracefully, and work effectively with backend teams.",
    commonPitfalls: [
      "Premature microservices — a distributed monolith is harder than either a monolith or true microservices",
      "Synchronous HTTP calls between microservices — a chain of 5 services means 5× the failure probability",
      "Not designing for partial failures — one downstream service being slow shouldn't crash the whole app",
    ],
  },
  children: [
    {
      id: "fullstack-microservices",
      title: "Microservices Architecture",
      iconName: "Grid3X3",
      link: "https://martinfowler.com/articles/microservices.html",
      theory:
        "Microservices split a monolithic application into small, independently deployable services, each owning a bounded domain (user service, order service, notification service). Services communicate over HTTP/gRPC or via message queues.",
      theoryDetail: {
        keyConcepts: [
          "Each service has its own codebase, database, and deployment pipeline",
          "API Gateway: a single entry point that routes requests to the appropriate service",
          "Service discovery: services register their locations dynamically (Consul, Kubernetes DNS)",
          "Circuit breaker pattern: stop calling a failing service to prevent cascading failures",
        ],
        whyItMatters:
          "Microservices let large teams deploy independently and scale individual services under load (scale only the order service during a sale, not the entire app). The trade-off is distributed system complexity: network latency, partial failure handling, and observability.",
        commonPitfalls: [
          "Tight coupling between services — if service A always calls B synchronously, they're still a monolith",
          "Shared databases between services — breaks the bounded context and creates hidden dependencies",
          "Not implementing retries, timeouts, and circuit breakers — network calls always fail eventually",
        ],
        examples: [
          {
            title: "Circuit breaker with opossum",
            description: "Wrapping a downstream HTTP call with a circuit breaker to prevent cascading failures.",
            code: `import CircuitBreaker from 'opossum';

async function callInventoryService(productId: string) {
  const res = await fetch(\`http://inventory-svc/products/\${productId}\`);
  if (!res.ok) throw new Error(\`Inventory service returned \${res.status}\`);
  return res.json();
}

const breaker = new CircuitBreaker(callInventoryService, {
  timeout: 3000,       // fail if takes > 3s
  errorThresholdPercentage: 50,  // open circuit if >50% fail
  resetTimeout: 10000, // try again after 10s
});

breaker.fallback(() => ({ available: true })); // degrade gracefully
breaker.on('open', () => console.warn('Inventory circuit open'));

// Usage
const inventory = await breaker.fire(productId);`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "fullstack-message-queues",
      title: "Message Queues",
      iconName: "MessageSquare",
      link: "https://www.rabbitmq.com/tutorials/tutorial-one-javascript",
      theory:
        "Message queues enable asynchronous communication between services. A producer publishes a message to a queue; one or more consumers process it independently — decoupling the two and smoothing out traffic spikes.",
      theoryDetail: {
        keyConcepts: [
          "Queue: messages wait here until a consumer picks them up (point-to-point delivery)",
          "Topic / Exchange: one message published to multiple consumers (pub/sub fanout)",
          "Dead-letter queue (DLQ): messages that fail processing are moved here for inspection",
          "Popular tools: RabbitMQ, Apache Kafka, AWS SQS/SNS, Redis Streams, BullMQ",
        ],
        whyItMatters:
          "Many user actions (sending emails, resizing images, processing payments) should not block the HTTP response. Offloading them to a queue improves response times and resilience — if a worker crashes, the message waits in the queue until it recovers.",
        commonPitfalls: [
          "Not acknowledging messages — unacked messages are redelivered, causing duplicate processing",
          "Processing non-idempotent operations without deduplication — the same message may be processed twice",
          "Ignoring DLQs — failed messages disappear silently without a dead-letter strategy",
        ],
        examples: [
          {
            title: "BullMQ job queue",
            description: "Offloading email sending to a background worker with BullMQ and Redis.",
            code: `import { Queue, Worker } from 'bullmq';
import { connection } from './redis';

// Producer — add a job from your API handler
const emailQueue = new Queue('emails', { connection });

app.post('/api/register', async (req, res) => {
  const user = await createUser(req.body);
  await emailQueue.add('welcome', { to: user.email, name: user.name });
  res.status(201).json(user); // respond immediately — don't wait for email
});

// Consumer — runs in a separate worker process
const worker = new Worker('emails', async (job) => {
  await sendEmail({
    to: job.data.to,
    subject: 'Welcome!',
    html: \`<p>Hi \${job.data.name}</p>\`,
  });
}, { connection });

worker.on('failed', (job, err) => {
  console.error(\`Email job \${job?.id} failed:\`, err.message);
});`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
