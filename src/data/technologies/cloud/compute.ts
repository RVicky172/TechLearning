import type { TopicNode } from "@/data/types";

export const cloudCompute: TopicNode = {
  id: "cloud-compute",
  title: "Compute Models",
  iconName: "Server",
  theory:
    "Modern teams choose between virtual machines, platform-as-a-service, containers, and serverless based on control, startup time, operational overhead, scaling behavior, and cost.",
  theoryDetail: {
    keyConcepts: [
      "VMs give the most control but require the most operations work.",
      "Managed application platforms speed up delivery for straightforward services.",
      "Serverless reduces idle cost and ops overhead for bursty or event-driven workloads.",
      "The best compute model depends on runtime requirements, traffic shape, and team maturity.",
    ],
    whyItMatters:
      "Teams lose time when they adopt a compute model that does not match their product stage. Knowing the tradeoffs helps you ship faster and avoid premature platform complexity.",
    commonPitfalls: [
      "Running stateful workloads on ephemeral compute without externalizing state.",
      "Using serverless for long-running jobs with poor cold-start tolerance.",
      "Choosing Kubernetes before the team has a stable need for it.",
    ],
    comparisons: [
      {
        title: "Common compute choices",
        summary: "Use the simplest model that satisfies the workload and team constraints.",
        points: [
          "VMs: maximum control, higher ops burden",
          "PaaS: fast delivery, limited knobs",
          "Containers: portable packaging, platform work required",
          "Serverless: excellent for event-driven paths, less ideal for always-hot complex services",
        ],
      },
    ],
    examples: [
      {
        title: "Compute model decision matrix",
        description:
          "A pragmatic way to pick compute based on latency, operational burden, and traffic behavior.",
        code: `Use serverless when:
- traffic is bursty or event-driven
- requests are short-lived
- you want scale-to-zero and minimal ops

Use managed containers (Cloud Run/App Runner) when:
- you want container portability without full orchestration overhead
- services are HTTP-based and stateless

Use Kubernetes when:
- you run many services with custom networking or rollout needs
- platform consistency and scheduling control are core requirements

Use VMs when:
- you need full OS/runtime control
- workloads are stateful or legacy and not container-ready`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "cloud-serverless",
      title: "Serverless Functions and Events",
      iconName: "Zap",
      theory:
        "Serverless works well for webhooks, scheduled jobs, APIs with moderate latency needs, queue consumers, and bursty workloads that benefit from scaling to zero.",
      theoryDetail: {
        keyConcepts: [
          "Functions are ephemeral and should remain stateless between invocations.",
          "Cold starts depend on runtime size, memory, and network initialization.",
          "Event sources include HTTP, queues, storage notifications, and schedules.",
        ],
        whyItMatters:
          "Serverless can dramatically cut platform overhead, but only when functions are designed for short, idempotent execution with external state.",
        commonPitfalls: [
          "Keeping DB connections open incorrectly across invocations.",
          "Putting long-running tasks in request-driven functions and hitting timeouts.",
          "Ignoring idempotency and duplicating side effects on retries.",
        ],
        examples: [
          {
            title: "Idempotent webhook function pattern",
            description:
              "Reject duplicate events and keep handler work short and retry-safe.",
            code: `export async function handleWebhook(event) {
  const eventId = event.headers['x-event-id'];
  if (!eventId) return { statusCode: 400, body: 'Missing event id' };

  const alreadyProcessed = await redis.get(\`event:\${eventId}\`);
  if (alreadyProcessed) return { statusCode: 200, body: 'duplicate ignored' };

  await processBusinessEvent(event.body);
  await redis.set(\`event:\${eventId}\`, '1', { EX: 60 * 60 * 24 });
  return { statusCode: 202, body: 'accepted' };
}`,
            language: "javascript",
          },
        ],
      },
      link: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
    },
    {
      id: "cloud-platforms",
      title: "Managed App Platforms",
      iconName: "Rocket",
      theory:
        "Platforms like Vercel, Fly.io, Render, and Cloud Run often deliver the best speed-to-production for small and medium teams before custom platform engineering is justified.",
      theoryDetail: {
        keyConcepts: [
          "Managed platforms handle deployment, certificates, and scaling primitives for you.",
          "You still own app health checks, telemetry, and runtime configuration.",
          "Build and runtime environment differences must be explicit and tested in staging.",
        ],
        whyItMatters:
          "These platforms let teams spend more time shipping product features and less time on infrastructure scaffolding.",
        commonPitfalls: [
          "Assuming platform defaults are production-safe without setting resource limits.",
          "Using mutable runtime file storage for durable data.",
          "Skipping post-deploy smoke checks.",
        ],
        examples: [
          {
            title: "Post-deploy smoke checklist",
            description:
              "A short deployment gate to catch bad releases quickly.",
            code: `1) Verify health endpoint: GET /healthz => 200
2) Validate database connectivity
3) Confirm critical background jobs are running
4) Check p95 latency and 5xx error rate for 10 minutes
5) Roll back automatically if thresholds are exceeded`,
            language: "text",
          },
        ],
      },
      link: "https://cloud.google.com/run/docs/overview/what-is-cloud-run",
    },
  ],
};