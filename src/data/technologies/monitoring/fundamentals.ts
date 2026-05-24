import type { TopicNode } from "@/data/types";

export const monitoringFundamentals: TopicNode = {
  id: "monitoring-fundamentals",
  title: "Observability Pillars",
  iconName: "Activity",
  link: "https://opentelemetry.io/docs/concepts/observability-primer/",
  theory:
    "Observability is the ability to understand what is happening inside a system from its external outputs. The three pillars are logs (what happened), metrics (how much / how fast), and traces (how a request flowed through the system). Modern distributed systems need all three — any one pillar alone is insufficient to diagnose production issues.",
  theoryDetail: {
    keyConcepts: [
      "Logs: time-stamped records of discrete events — use structured JSON logs (not plain text) so they can be queried; include correlation IDs to connect related log lines",
      "Metrics: numeric measurements aggregated over time — counters (always increase), gauges (can go up or down), histograms (measure distribution, e.g. response time percentiles)",
      "Traces: end-to-end record of a request's path through distributed services — each unit of work is a Span, and Spans are grouped into a Trace",
      "SLO (Service Level Objective): a target reliability metric — e.g. 99.9% of requests succeed in < 500ms over a 30-day window",
      "SLI (Service Level Indicator): the actual measurement used to track an SLO — e.g. ratio of successful requests",
      "Error budget: 100% minus the SLO — if your SLO is 99.9%, your error budget is 0.1% (about 43 minutes of downtime per month)",
      "RED method: Rate (requests/s), Errors (error rate), Duration (latency percentiles) — three metrics that cover most services",
      "USE method: Utilisation, Saturation, Errors — useful for infrastructure (CPU, memory, disk, network)",
    ],
    whyItMatters:
      "Without observability you are debugging in the dark. Every production incident is resolved faster — and more confidently — with structured logs, dashboards, and traces. Adding observability from day one is dramatically cheaper than adding it after an incident. Senior engineers are expected to design observable systems.",
    commonPitfalls: [
      "Logging PII or secrets — always scrub emails, passwords, tokens, credit card numbers from logs before they are written",
      "Using console.log in production — unstructured logs cannot be queried efficiently; use a structured logger like Pino or Winston with JSON output",
      "Too many metrics — high-cardinality labels (e.g. userId per metric) cause memory explosions in Prometheus; keep label values bounded",
      "No alerting on SLO breaches — metrics without alerts are decoration; set up alerting on error rate > SLO threshold and p99 latency",
    ],
    examples: [
      {
        title: "Structured logging with Pino + request correlation ID",
        description:
          "Production-ready structured logging with Pino and per-request correlation IDs using AsyncLocalStorage.",
        code: `// ── logger.ts ─────────────────────────────────────────────
import pino from "pino";
import { AsyncLocalStorage } from "async_hooks";

// Correlation ID storage — survives across async boundaries
export const requestContext = new AsyncLocalStorage<{ correlationId: string }>();

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  // JSON in production, pretty-print in development
  transport: process.env.NODE_ENV !== "production"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
  // Merge correlation ID into every log line automatically
  mixin() {
    return requestContext.getStore() ?? {};
  },
});

// ── middleware.ts — attach correlation ID to every request ─
import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

export function correlationMiddleware(
  req: Request, res: Response, next: NextFunction,
) {
  const correlationId =
    (req.headers["x-correlation-id"] as string) ?? randomUUID();

  res.setHeader("x-correlation-id", correlationId);

  requestContext.run({ correlationId }, () => {
    logger.info({ method: req.method, url: req.url }, "request started");
    next();
  });
}

// Any logger call inside a request now automatically includes correlationId:
// {"level":"info","correlationId":"abc-123","method":"GET","url":"/api/users"}`,
        language: "typescript",
      },
    ],
  },
};
