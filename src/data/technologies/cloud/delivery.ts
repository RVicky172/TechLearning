import type { TopicNode } from "@/data/types";

export const cloudDelivery: TopicNode = {
  id: "cloud-delivery",
  title: "Infrastructure as Code and Delivery",
  iconName: "GitBranch",
  theory:
    "Modern infrastructure should be versioned, reviewable, and reproducible. Delivery pipelines, infrastructure as code, and deployment workflows are how teams move code from commit to reliable cloud production safely.",
  theoryDetail: {
    keyConcepts: [
      "Infrastructure as code tools such as Terraform and Pulumi turn manual console work into auditable, repeatable change sets.",
      "CI validates code; CD governs deployment sequencing, approvals, rollout strategy, and rollback.",
      "Cloud deployments need environment strategy: preview, staging, and production should each serve a distinct verification purpose.",
      "Secrets should come from managed secret stores, not source control or raw environment files committed to the repo.",
    ],
    whyItMatters:
      "Teams that depend on manual cloud setup accumulate drift, hidden risk, and slow onboarding. Strong CI/CD plus clear deployment patterns shorten recovery time, reduce release anxiety, and make environments reproducible.",
    commonPitfalls: [
      "Mixing manual console changes with Terraform state and losing the source of truth.",
      "Building one giant CI pipeline that is hard to debug or rerun incrementally.",
      "Shipping without rollback or progressive delivery options.",
    ],
    examples: [
      {
        title: "Typical CI to CD flow",
        description: "A practical release path from pull request to production deployment.",
        code: `Pull request opened
  -> install dependencies
  -> lint + typecheck + tests
  -> build artifact or container image
  -> deploy preview environment

Merge to main
  -> rebuild signed production artifact
  -> apply infrastructure changes if needed
  -> deploy to staging
  -> run smoke tests
  -> promote with rolling, canary, or blue-green release
  -> monitor error rate and latency
  -> rollback automatically if health checks fail`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "cloud-iac",
      title: "Terraform and Pulumi",
      iconName: "Wrench",
      theory:
        "Learn state, plans, modules, remote backends, and environment boundaries. Infrastructure code should be composed and reviewed with the same discipline as application code.",
      link: "https://developer.hashicorp.com/terraform/intro",
    },
    {
      id: "cloud-cicd",
      title: "CI/CD and Progressive Delivery",
      iconName: "RefreshCw",
      theoryDetail: {
        keyConcepts: [
          "Continuous Integration should verify every change with linting, type checks, tests, and artifact creation.",
          "Continuous Delivery automates release preparation, while Continuous Deployment automatically ships passing changes to production.",
          "Deployment safety patterns include rolling releases, blue-green deployments, canaries, feature flags, and instant rollback.",
        ],
        whyItMatters:
          "A strong pipeline gives fast feedback to developers and predictable releases to users. It also becomes the enforcement point for quality, security scanning, and deployment approvals.",
        commonPitfalls: [
          "Treating CI as only a build step and skipping tests or type checks.",
          "Not caching dependencies or parallelizing jobs, which makes pipelines slow enough that developers avoid them.",
          "Deploying directly to production without a staging check or health-based rollback.",
        ],
        examples: [
          {
            title: "GitHub Actions cloud pipeline",
            description: "A concise workflow that validates code, builds a container image, and deploys after merge.",
            code: `name: Deploy

on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t app:\${{ github.sha }} .
      - run: docker push registry.example.com/app:\${{ github.sha }}
      - run: ./scripts/deploy-staging.sh \${{ github.sha }}
      - run: ./scripts/smoke-test.sh
      - run: ./scripts/promote-production.sh \${{ github.sha }}`,
            language: "yaml",
          },
        ],
      },
      theory:
        "Move past simple build pipelines into previews, canaries, blue-green rollout, feature flags, and automated rollback signals.",
      link: "https://docs.github.com/en/actions",
    },
    {
      id: "cloud-app-deployment",
      title: "Deploying Applications to the Cloud",
      iconName: "Rocket",
      theory:
        "Application deployment is the practical path from a built artifact to a running service on a platform such as Vercel, Cloud Run, ECS, Kubernetes, or a VM. Learn how runtime configuration, networking, health checks, rollout strategy, and rollback fit together.",
      theoryDetail: {
        keyConcepts: [
          "Build once, deploy the same artifact through environments so staging and production differ only by configuration.",
          "Health checks, readiness probes, and graceful shutdown are required for zero-downtime deployment.",
          "Platform choice matters: simple apps often fit Vercel or Cloud Run, while multi-service workloads may need ECS or Kubernetes.",
          "DNS, TLS, environment variables, secret injection, and background job wiring are part of deployment, not post-deploy cleanup.",
        ],
        whyItMatters:
          "Many engineers can write code that runs locally but struggle when the same app needs repeatable staging and production deployment. This topic bridges that gap and makes cloud systems feel concrete.",
        commonPitfalls: [
          "Using different build outputs in staging and production, which hides release risk.",
          "Forgetting database migration sequencing during deployment.",
          "No readiness probe, so traffic hits the app before it can serve requests.",
        ],
        comparisons: [
          {
            title: "Choosing a deployment target",
            summary: "Pick the simplest platform that fits the workload and team maturity.",
            points: [
              "Vercel or Netlify: ideal for frontend and edge-heavy apps",
              "Cloud Run or App Runner: good for containerized web services with low ops burden",
              "ECS or Kubernetes: strong for many services, custom networking, and deeper platform control",
              "Virtual machines: useful when you need full OS control or legacy workload compatibility",
            ],
          },
        ],
      },
      link: "https://cloud.google.com/run/docs/deploying",
    },
  ],
};