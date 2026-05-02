import type { TopicNode } from "@/data/types";

export const fullstackDevOps: TopicNode = {
  id: "fullstack-devops",
  title: "DevOps & Deployment",
  iconName: "Rocket",
  theory:
    "DevOps practices automate the path from code commit to production. CI/CD pipelines build, test, and deploy automatically; containerization ensures consistent environments; monitoring and logging provide visibility into production health.",
  theoryDetail: {
    keyConcepts: [
      "CI (Continuous Integration) runs automated tests on every commit to catch regressions early",
      "CD (Continuous Delivery/Deployment) automates releases so code reaches production quickly and safely",
      "Containers package code with its dependencies so it runs identically in dev, staging, and production",
    ],
    whyItMatters:
      "Frontend developers ship features, not just code. Understanding CI/CD pipelines, Docker images, and monitoring tools makes you able to diagnose failures, speed up deployments, and ensure your features work reliably in production.",
    commonPitfalls: [
      "Not running tests in CI — catching bugs on localhost but missing them in the shared environment",
      "Building Docker images with development dependencies — production images should be lean",
      "Deploying without monitoring — you learn about production failures from user reports instead of alerts",
    ],
  },
  children: [
    {
      id: "fullstack-cicd",
      title: "CI/CD Pipelines",
      iconName: "GitBranch",
      link: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions",
      theory:
        "CI/CD (Continuous Integration / Continuous Deployment) automates building, testing, and deploying code. Every commit triggers a pipeline that catches bugs before they reach users.",
      theoryDetail: {
        keyConcepts: [
          "CI: on every push — install deps → lint → type-check → run tests → build artifact",
          "CD: on merge to main — deploy to staging, run smoke tests, promote to production",
          "Environments: development → staging (production-like) → production",
          "Tools: GitHub Actions, GitLab CI, CircleCI, Jenkins, Vercel (automatic deployments)",
        ],
        whyItMatters:
          "Manual deployments are slow and error-prone. CI/CD pipelines enforce quality gates (tests must pass) and reduce the time between writing code and users receiving it from days to minutes.",
        commonPitfalls: [
          "Skipping test or lint steps to speed up pipelines — you'll pay for it in production bugs",
          "Hardcoding secrets in pipeline config — use environment secrets / secret managers",
          "Not caching node_modules or build outputs — pipelines that take 15+ minutes slow team velocity",
        ],
        examples: [
          {
            title: "GitHub Actions CI workflow",
            description: "A workflow that runs tests and builds on every pull request.",
            code: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      - run: npm run build`,
            language: "yaml",
          },
        ],
      },
    },
    {
      id: "fullstack-containers",
      title: "Containerization (Docker & Kubernetes)",
      iconName: "Container",
      link: "https://docs.docker.com/get-started/",
      theory:
        "Docker packages an application and its dependencies into a container — a lightweight, isolated, portable runtime. Kubernetes orchestrates many containers across a cluster: scheduling, scaling, self-healing, and rolling updates.",
      theoryDetail: {
        keyConcepts: [
          "Docker image: immutable snapshot of the app + OS layer — built from a Dockerfile",
          "Docker container: a running instance of an image, isolated with its own network and filesystem",
          "Kubernetes Pod: the smallest deployable unit — wraps one or more containers",
          "Kubernetes Deployment: declares desired replicas; the control plane reconciles to match reality",
          "Kubernetes Service: stable DNS name + load balancing in front of a set of Pods",
        ],
        whyItMatters:
          "Containers eliminate 'works on my machine' — the same image runs in dev, CI, and production. Kubernetes automates the operational overhead of managing dozens of containerized services at scale.",
        commonPitfalls: [
          "Running the app as root inside the container — use a non-root USER in the Dockerfile",
          "Not using multi-stage builds — shipping dev dependencies bloats production images by 10×",
          "Storing mutable data inside the container filesystem — it's lost when the container restarts; use volumes",
        ],
        examples: [
          {
            title: "Multi-stage Dockerfile",
            description: "Production-ready Dockerfile for a Node.js app using multi-stage build.",
            code: `# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — production image
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]`,
            language: "dockerfile",
          },
        ],
      },
    },
    {
      id: "fullstack-monitoring",
      title: "Monitoring & Logging",
      iconName: "Activity",
      link: "https://opentelemetry.io/docs/",
      theory:
        "Monitoring tracks metrics (error rate, latency, CPU) to alert when something goes wrong. Logging records structured events so you can reconstruct what happened. Distributed tracing follows a request across multiple services.",
      theoryDetail: {
        keyConcepts: [
          "The three pillars of observability: metrics (what is happening), logs (what happened), traces (where time was spent)",
          "Structured logs (JSON) are machine-readable and searchable in log aggregation tools",
          "SLI / SLO: define measurable targets (99.9% uptime, p99 < 200 ms) and alert when breached",
          "Tools: Prometheus + Grafana (metrics), Datadog, Sentry (errors), OpenTelemetry (tracing)",
        ],
        whyItMatters:
          "Without monitoring, you discover production outages from user complaints. With it, you get paged before most users notice. Good logging turns a 4-hour debug session into a 10-minute log search.",
        commonPitfalls: [
          "Logging sensitive data (passwords, tokens, PII) — scrub before writing to logs",
          "Not setting log levels — debug logging in production floods the system and costs money",
          "Alert fatigue: too many noisy alerts means the on-call team ignores them; alert on symptoms not causes",
        ],
        examples: [
          {
            title: "Structured logging with Pino",
            description: "JSON structured logging pattern for a Node.js API.",
            code: `import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', 'body.password'], // scrub sensitive fields
});

// In an Express middleware
app.use((req, res, next) => {
  req.log = logger.child({ requestId: crypto.randomUUID() });
  req.log.info({ method: req.method, url: req.url }, 'incoming request');
  next();
});

// In a route handler
app.post('/api/orders', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    req.log.info({ orderId: order.id }, 'order created');
    res.status(201).json(order);
  } catch (err) {
    req.log.error({ err }, 'order creation failed');
    res.status(500).json({ error: 'Internal server error' });
  }
});`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
