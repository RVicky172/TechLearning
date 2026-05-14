import type { TopicNode } from "@/data/types";

export const cicdFundamentals: TopicNode = {
  id: "cicd-fundamentals",
  title: "CI/CD Fundamentals",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Continuous Integration (CI): automatically test every commit",
      "Continuous Delivery (CD): automatically build and prepare for release",
      "Continuous Deployment: automatically deploy to production",
      "Pipelines: series of automated steps triggered by events (push, PR, tag)",
      "Jobs and steps: atomic units of work (test, build, deploy)",
      "Status checks: block PRs if tests fail",
    ],
    whyItMatters:
      "CI/CD catches bugs early and automates tedious tasks. It enables frequent deployments with confidence and reduces manual errors.",
    commonPitfalls: [
      "Slow pipelines: optimize test suite and cache dependencies",
      "Flaky tests: tests that pass/fail randomly waste time and trust",
      "No rollback strategy: unable to revert bad deployments quickly",
      "Secrets exposed in logs: filter sensitive data from output",
      "Skipping tests to ship faster: creates more work down the line",
    ],
  },
};
