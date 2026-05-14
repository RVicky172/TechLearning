import type { TopicNode } from "@/data/types";

export const cloudReliability: TopicNode = {
  id: "cloud-reliability",
  title: "Reliability, Security, and Cost",
  iconName: "ShieldCheck",
  theory:
    "The current industry bar is not just deploying software, but running it responsibly. That means observability, incident handling, security controls, and cost awareness built into the platform from the start.",
  theoryDetail: {
    keyConcepts: [
      "Logs, metrics, traces, and alerts each answer different operational questions.",
      "SLOs help teams decide what reliability target matters and what should page someone.",
      "Least privilege, secret rotation, patching, and auditability are baseline cloud security skills.",
      "Cloud cost optimization starts with architecture choices, not only finance dashboards.",
    ],
    whyItMatters:
      "Cloud bills and incidents compound quickly. Engineers who can reason about observability, blast radius, and cost-to-serve are far more effective in modern production teams.",
    commonPitfalls: [
      "Collecting logs but not defining alerts tied to user-impacting symptoms.",
      "Giving wide IAM permissions because the least-privilege policy took longer to write.",
      "Autoscaling every service without understanding whether the bottleneck is actually the database or a downstream dependency.",
    ],
    examples: [
      {
        title: "SLO and alert policy baseline",
        description:
          "A practical reliability target and paging rule tied to user impact.",
        code: `Service: public API
SLO: 99.9% successful requests over 30 days
Error budget: 43m 49s of failure per month

Paging alerts:
- page if 5xx rate > 2% for 5 minutes
- page if p95 latency > 800ms for 10 minutes
- ticket (non-page) if CPU > 75% for 30 minutes`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "cloud-observability",
      title: "Observability and Incident Response",
      iconName: "Activity",
      theory:
        "Instrumentation, dashboards, alerting, runbooks, and postmortems turn production systems from opaque to manageable.",
      theoryDetail: {
        keyConcepts: [
          "Logs answer what happened, metrics answer how much, traces answer where latency originates.",
          "Alerts should target symptoms of user pain, not just infrastructure internals.",
          "Every sev-incident needs a runbook and blameless postmortem with action items.",
        ],
        whyItMatters:
          "Without observability discipline, teams detect incidents late and recover slowly.",
        commonPitfalls: [
          "Creating alert noise from low-signal thresholds.",
          "Missing ownership metadata in dashboards and runbooks.",
          "Writing postmortems that capture timeline but no preventive actions.",
        ],
        examples: [
          {
            title: "Incident timeline template",
            description:
              "A lightweight structure to capture detection, mitigation, and prevention clearly.",
            code: `10:02 UTC - Alert fired (5xx > 2%)
10:05 UTC - Incident commander assigned
10:11 UTC - Rollback started
10:15 UTC - Error rate normalized
10:40 UTC - Root cause identified (bad cache key change)
Action items:
- add integration test for cache key schema
- add canary check for elevated 5xx before full rollout`,
            language: "text",
          },
        ],
      },
      link: "https://opentelemetry.io/docs/",
    },
    {
      id: "cloud-security-cost",
      title: "Cloud Security and FinOps",
      iconName: "Wallet",
      theory:
        "Understand IAM, network segmentation, secret handling, encryption, and the major cost levers across compute, storage, and data transfer.",
      theoryDetail: {
        keyConcepts: [
          "IAM policies should grant least privilege at role and resource scope.",
          "FinOps requires visibility by service, environment, and team ownership.",
          "Data transfer and storage lifecycle policies are major cost drivers.",
        ],
        whyItMatters:
          "Security gaps and cloud waste both scale with usage, so prevention has compounding returns.",
        commonPitfalls: [
          "Using wildcard permissions in production IAM policies.",
          "No budget alarms, so regressions are discovered at invoice time.",
          "Keeping infrequently used logs and snapshots on expensive storage tiers.",
        ],
        examples: [
          {
            title: "Monthly cloud cost review checklist",
            description:
              "A simple operating rhythm for controlling spend without hurting reliability.",
            code: `1) Rank top 10 services by spend
2) Compare month-over-month change and deployment timeline
3) Right-size overprovisioned compute
4) Apply storage lifecycle transitions
5) Remove idle resources older than 14 days
6) Set/adjust budgets and anomaly alerts`,
            language: "text",
          },
        ],
      },
      link: "https://wellarchitectedlabs.com/finops/",
    },
  ],
};