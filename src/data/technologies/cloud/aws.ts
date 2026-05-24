import type { TopicNode } from "@/data/types";

export const cloudAWS: TopicNode = {
  id: "cloud-aws",
  title: "AWS — Core Services & Deployment",
  iconName: "Cloud",
  link: "https://docs.aws.amazon.com/",
  theory:
    "Amazon Web Services (AWS) is the largest cloud provider with 200+ services. For fullstack developers, a practical mental model covers compute (EC2, ECS Fargate, Lambda), storage (S3, RDS, ElastiCache), networking (VPC, CloudFront, Route 53), and identity (IAM). You don't need to know every service — you need to know how to deploy a web app, a container, and a serverless function end-to-end.",
  theoryDetail: {
    keyConcepts: [
      "IAM (Identity and Access Management): roles, policies, and least-privilege access — the security foundation of every AWS account; never use root credentials or long-lived access keys in production",
      "EC2 (Elastic Compute Cloud): virtual machines — use for workloads that need persistent processes, specific runtimes, or GPU access; choose instance types by CPU/memory/network ratio",
      "ECS Fargate: serverless container execution — you push a Docker image, define CPU/memory, and AWS runs it with no servers to manage; cheaper and simpler than EKS for most teams",
      "Lambda: event-driven serverless functions — 15-minute max runtime, 10 GB memory, 512 MB–10 GB ephemeral storage; billed per 100ms; best for async processing, API gateways, scheduled jobs",
      "S3 (Simple Storage Service): object storage — cheap, durable (11 9s), and infinitely scalable; store static assets, user uploads, logs, backups, and Next.js static exports",
      "CloudFront: CDN with 450+ edge locations — distribute S3 assets and API responses globally; integrate with ACM for free TLS certificates",
      "RDS / Aurora: managed relational databases — RDS runs PostgreSQL/MySQL on EC2 instances; Aurora is a re-engineered storage engine with auto-scaling and up to 15 read replicas",
      "ElastiCache: managed Redis or Memcached — avoid network latency to self-hosted Redis; use Redis cluster mode for horizontal scaling",
      "Route 53: DNS and health checks — register domains, set up A/CNAME/ALIAS records, configure weighted routing for blue/green deployments",
      "VPC: virtual private network — public subnets for load balancers, private subnets for application servers and databases; security groups act as stateful firewalls at the instance level",
    ],
    whyItMatters:
      "AWS has ~31% of the cloud market. Most enterprise, fintech, and startup jobs involve AWS. Understanding the core services, how they connect, and how to deploy a production app on AWS is expected for backend and fullstack roles at mid-to-senior level.",
    commonPitfalls: [
      "Exposing RDS or ElastiCache to the public internet — databases must only be in private subnets accessible via the VPC; use Bastion hosts or AWS Session Manager for direct access",
      "Hardcoding AWS credentials in code or .env files committed to git — use IAM roles for EC2/ECS/Lambda; use AWS Secrets Manager for database passwords",
      "Ignoring data transfer costs — traffic between AZs, from CloudFront to S3, and egress to the internet all cost money; understand the billing model before architecting",
      "Single AZ deployments — always deploy across at least two Availability Zones for production workloads; RDS Multi-AZ and ECS across AZs are standard",
    ],
    examples: [
      {
        title: "Deploy a Next.js app on AWS (ECS Fargate + ALB + RDS)",
        description:
          "End-to-end deployment: Dockerise Next.js → push to ECR → run on ECS Fargate → route via Application Load Balancer → connect to RDS PostgreSQL.",
        code: `# ── Step 1: Dockerise Next.js ─────────────────────────────
# Dockerfile (multi-stage — see Docker section for full version)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

# ── Step 2: Push image to Amazon ECR ──────────────────────
aws ecr create-repository --repository-name my-app --region us-east-1

# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS \
    --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t my-app .
docker tag  my-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# ── Step 3: Create ECS task definition (key fields) ───────
# In AWS Console or via CDK/Terraform:
# - Task definition: Fargate, 1 vCPU / 2 GB RAM
# - Container image: ECR URI above
# - Port mappings: 3000 → 3000
# - Environment variables: DATABASE_URL from Secrets Manager
# - Log configuration: awslogs → CloudWatch

# ── Step 4: Create ECS Service with ALB ───────────────────
# - Service: attach to an Application Load Balancer target group
# - ALB listener: HTTPS:443 → forward to target group
# - Certificate: ACM (free TLS cert for your domain)
# - Health check path: /api/health
# - Desired count: 2 (across 2 AZs)
# - Auto-scaling: scale on CPU > 70% or request count

# ── Step 5: RDS PostgreSQL (private subnet) ───────────────
# - Engine: PostgreSQL 16
# - Instance: db.t4g.medium (Graviton2 — good cost/performance)
# - Multi-AZ: enabled for production
# - VPC: same VPC, private subnets only
# - Security group: allow port 5432 from ECS task security group only
# - Password: stored in AWS Secrets Manager; injected into ECS task as env var

# ── Step 6: CloudFront in front of ALB + S3 for assets ────
# - Distribution origin 1: ALB (dynamic — Next.js SSR)
# - Distribution origin 2: S3 bucket (static — _next/static/*)
# - Behaviour: /_next/static/* → S3 (cached, long TTL)
# - Behaviour: everything else → ALB (no cache or short TTL)
# - Route 53: ALIAS record → CloudFront distribution`,
        language: "bash",
      },
    ],
  },
};
