import type { TopicNode } from "@/data/types";

export const cloudPlatformDeploy: TopicNode = {
  id: "cloud-platform-deploy",
  title: "Deployment Platforms & Strategies",
  iconName: "Rocket",
  link: "https://vercel.com/docs",
  theory:
    "Modern deployment platforms abstract cloud infrastructure so you can deploy from a git push. Vercel, Netlify, Railway, Render, and Fly.io each occupy a different point in the control-vs-convenience spectrum. Knowing how to deploy a Next.js app, a Node.js API, a Docker container, and a database migration on each platform — and when to use which — is practical knowledge that directly speeds up shipping.",
  theoryDetail: {
    keyConcepts: [
      "Vercel: the first-class Next.js host — git-push deploys, automatic preview URLs per PR, Edge Functions, ISR, image optimisation CDN built in; free tier covers most side projects; best for Next.js and static sites",
      "Netlify: strongest for static sites and JAMstack — Netlify Functions (Lambda-based), form handling, branch deploys, split testing; competing with Vercel for Next.js but Vercel has deeper integration",
      "Railway: the easiest platform for fullstack apps with a database — deploy Node.js, Docker, PostgreSQL, Redis, MongoDB from the same dashboard; auto-deploys from GitHub; pricing by resource usage (no cold starts)",
      "Render: Heroku alternative — deploy web services, background workers, cron jobs, databases, and static sites; Docker support; free tier has spin-down (cold starts on inactivity)",
      "Fly.io: deploy Docker containers to VMs close to users — 30+ regions, persistent volumes, private networking between apps; best for latency-sensitive global apps and apps that need persistent storage (SQLite)",
      "Coolify: open-source self-hosted PaaS (Heroku-on-your-VPS) — deploy any Docker app, databases, services on your own VPS; one-click deploy from GitHub; good for cost control at scale",
      "Blue/green deployment: run two identical environments (blue=current, green=new) — route 100% traffic to green after validation, keep blue as instant rollback",
      "Canary deployment: route a small % of traffic (1–5%) to the new version first — observe error rates and latency before full roll-out; supported natively in Vercel (traffic splitting) and AWS (weighted target groups)",
      "Zero-downtime database migrations: always run migrations before deploying new code (expand phase) — old code must still work with the new schema; add columns as nullable first, backfill, switch writes, then make NOT NULL",
    ],
    whyItMatters:
      "Platform choice directly affects developer velocity, incident response time, and infrastructure cost. Understanding the deployment process — not just 'git push and it works' — means you can debug failed deployments, manage environment variables securely, handle database migrations safely, and implement rollback strategies.",
    commonPitfalls: [
      "Running migrations inside the app startup — if two instances start simultaneously they'll both try to migrate; run migrations in a pre-deploy step/release command, not in server startup code",
      "Storing secrets in plain environment variables in the platform dashboard without audit — use the platform's secrets manager or external vault; rotate secrets on team member offboarding",
      "No rollback plan — always know how to roll back before deploying; for code: previous Docker tag or git revert; for migrations: write reversible migrations (add column is safe to roll back; drop column is not)",
      "Deploying directly to production from a local machine — always go through CI (GitHub Actions, GitLab CI) so the build is reproducible and auditable",
    ],
    examples: [
      {
        title: "Deploying a Next.js + Postgres app on Railway",
        description:
          "Railway handles the database, secrets, and web service in one project with auto-deploy from GitHub.",
        code: `# ── railway.toml — project configuration ────────────────────
[build]
builder = "nixpacks"              # auto-detects Node.js

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"

# ── Environment variables set in Railway dashboard ─────────
DATABASE_URL     = \${{ Postgres.DATABASE_URL }}   # Railway template variable
NODE_ENV         = production
NEXTAUTH_SECRET  = <generated-secret>
NEXTAUTH_URL     = https://my-app.up.railway.app

# ── package.json — migration before start ─────────────────
{
  "scripts": {
    "build":  "next build",
    "start":  "node server.js",
    "db:migrate": "prisma migrate deploy"  // run in Railway deploy command
  }
}
# Set Railway "Start command" to:  npm run db:migrate && npm start

# ── Vercel deployment for Next.js ─────────────────────────
# 1. Connect GitHub repo in vercel.com dashboard
# 2. Set environment variables
# 3. Every push to main → production deploy
# 4. Every PR → preview URL (e.g. my-app-git-feat-xyz.vercel.app)

# vercel.json — optional config
{
  "buildCommand": "prisma generate && next build",
  "env": {
    "DATABASE_URL": "@database-url"   // pulls from Vercel secrets
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }]
    }
  ]
}

# ── Fly.io — deploy a Dockerised Node.js API ───────────────
fly launch              # auto-generates fly.toml + Dockerfile

# fly.toml
app      = "my-api"
primary_region = "lhr"   # London

[http_service]
  internal_port       = 3000
  force_https         = true
  auto_stop_machines  = true
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  memory = "512mb"
  cpus   = 1

# Set secrets
fly secrets set DATABASE_URL="postgresql://..."

# Deploy
fly deploy     # builds Docker image on Fly's remote builders and deploys`,
        language: "yaml",
      },
      {
        title: "GitHub Actions CI/CD pipeline for any cloud",
        description:
          "A reusable CI/CD workflow: test → build Docker image → push to registry → deploy.",
        code: `# .github/workflows/deploy.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Build and push Docker image to AWS ECR
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id:     \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - uses: aws-actions/amazon-ecr-login@v2

      - run: |
          docker build -t \$ECR_REGISTRY/my-app:\$GITHUB_SHA .
          docker push    \$ECR_REGISTRY/my-app:\$GITHUB_SHA
        env:
          ECR_REGISTRY: 123456789.dkr.ecr.us-east-1.amazonaws.com

      # Run database migrations before updating the service
      - run: |
          aws ecs run-task \\
            --cluster production \\
            --task-definition my-app-migrate \\
            --network-configuration "..." \\
            --wait-for-completion

      # Update ECS service with new image
      - run: |
          aws ecs update-service \\
            --cluster production \\
            --service my-app \\
            --force-new-deployment`,
        language: "yaml",
      },
    ],
  },
};
