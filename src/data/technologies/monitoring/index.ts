import type { Technology } from "@/data/types";
import { monitoringFundamentals } from "@/data/technologies/monitoring/fundamentals";
import { monitoringMetrics } from "@/data/technologies/monitoring/metrics";

const monitoring: Technology = {
  id: "monitoring",
  name: "Monitoring",
  description:
    "Observability with logs, metrics, and traces — Pino, Prometheus, OpenTelemetry, and structured alerting for production systems.",
  color: "bg-blue-700",
  iconName: "Activity",
  deviconClass: "devicon-grafana-original colored",
  tree: [monitoringFundamentals, monitoringMetrics],
};

export default monitoring;
