import type { TopicNode } from "@/data/types";

export const monitoringMetrics: TopicNode = {
  id: "monitoring-metrics",
  title: "Metrics & Tracing",
  iconName: "BarChart2",
  link: "https://opentelemetry.io/docs/",
  theory:
    "Metrics give you aggregated numeric insight into system health over time (request rates, error rates, latency percentiles). Distributed tracing gives you request-level visibility across service boundaries. OpenTelemetry is the vendor-neutral standard for instrumenting both — it integrates with Prometheus, Jaeger, Datadog, and other backends.",
  theoryDetail: {
    keyConcepts: [
      "Prometheus: pull-based time-series metrics database — scrapes /metrics endpoints at a configured interval; pairs with Grafana for visualisation",
      "Counter: monotonically increasing metric — total_requests_count, errors_total; only reset on restart",
      "Gauge: metric that can go up or down — active_connections, queue_depth, memory_used_bytes",
      "Histogram: samples observations and counts them in configurable buckets — ideal for request duration; use to compute p50/p95/p99 latency",
      "OpenTelemetry (OTel): CNCF standard for traces, metrics, and logs — instrument once, export to any backend via the OTel Collector",
      "Span: a single named, timed operation in a trace — spans have a start/end time, status, attributes, and can have child spans",
      "Trace context propagation: the W3C traceparent HTTP header carries the trace ID across service boundaries — every service in the chain adds its own span",
      "Sampling: recording every trace at high throughput is expensive — head sampling (decide at trace start) vs tail sampling (decide after trace completes)",
    ],
    whyItMatters:
      "Metrics-based alerting is how on-call engineers know something is wrong before users report it. Traces are how you diagnose which of 20 microservices is causing a latency spike. Both are required for operating production systems at any meaningful scale.",
    commonPitfalls: [
      "Measuring latency with averages — averages hide tail latency; always track p95 and p99; a p99 of 10s means 1% of users wait 10 seconds",
      "High-cardinality label values in Prometheus — never use user IDs or request IDs as metric labels; each unique label combination creates a new time series",
      "Not propagating trace context — if one service doesn't forward the traceparent header, the trace is split; instrument all HTTP clients (axios, fetch) to propagate automatically",
    ],
    examples: [
      {
        title: "OpenTelemetry auto-instrumentation + custom spans in Node.js",
        description:
          "OTel SDK setup with auto-instrumentation for HTTP and Express, plus a custom span for a database call.",
        code: `// ── instrumentation.ts — must be loaded FIRST (before app code) ─
// package: @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "api-service",
  }),
  traceExporter: new OTLPTraceExporter({
    url: "http://otel-collector:4318/v1/traces",  // OTel Collector endpoint
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false },  // too noisy
    }),
  ],
});

sdk.start();
process.on("SIGTERM", () => sdk.shutdown());

// ── api.ts — custom span around a database operation ──────
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("api-service", "1.0.0");

async function getUserWithOrders(userId: string) {
  // Creates a child span under the active HTTP request span
  return tracer.startActiveSpan("db.getUserWithOrders", async (span) => {
    span.setAttributes({
      "db.system":    "postgresql",
      "db.operation": "SELECT",
      "user.id":      userId,
    });
    try {
      const result = await db.query(
        "SELECT u.*, json_agg(o.*) AS orders FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.id = $1 GROUP BY u.id",
        [userId],
      );
      span.setStatus({ code: SpanStatusCode.OK });
      return result.rows[0];
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) });
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();  // always end the span
    }
  });
}`,
        language: "typescript",
      },
    ],
  },
};
