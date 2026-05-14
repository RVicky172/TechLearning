import type { TopicNode } from "@/data/types";

export const cicdGitHubActions: TopicNode = {
  id: "cicd-github-actions",
  title: "GitHub Actions",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Workflows: YAML files in .github/workflows/ that define automation",
      "Triggers: push, pull_request, schedule, workflow_dispatch (manual)",
      "Jobs: parallel or sequential units of work",
      "Steps: individual commands or pre-built actions",
      "Actions: reusable tasks (checkout, setup Node, deploy)",
      "Secrets: encrypted environment variables for API keys and tokens",
    ],
    whyItMatters:
      "GitHub Actions is native GitHub automation—no external services needed. It's free for public repos and includes generous minutes for private repos.",
    examples: [
      {
        title: "Basic Test Workflow",
        description: "Run tests on every push.",
        code: `# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`,
        language: "yaml",
      },
      {
        title: "Deploy Workflow",
        description: "Build and deploy on release.",
        code: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}`,
        language: "yaml",
      },
    ],
  },
};
