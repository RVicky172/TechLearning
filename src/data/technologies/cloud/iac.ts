import type { TopicNode } from "@/data/types";

export const cloudIaC: TopicNode = {
  id: "cloud-iac",
  title: "Infrastructure as Code",
  iconName: "FileCode",
  link: "https://developer.hashicorp.com/terraform/intro",
  theory:
    "Infrastructure as Code (IaC) means defining cloud resources (servers, databases, networks, DNS) in declarative configuration files that are version-controlled, reviewed in PRs, and applied automatically in CI. Terraform is the dominant multi-cloud IaC tool. Pulumi lets you write IaC in TypeScript/Python. AWS CDK is TypeScript-first and generates CloudFormation. The principle is the same: no manually clicking in the console — infrastructure is reproducible, auditable, and rollback-able.",
  theoryDetail: {
    keyConcepts: [
      "Declarative vs imperative: Terraform is declarative — you describe the desired end state; Terraform figures out what to create/update/destroy to reach it",
      "State file: Terraform keeps a state file (`terraform.tfstate`) mapping config to real resources — store it remotely in S3 + DynamoDB lock (never commit it to git; it contains secrets)",
      "Plan before apply: `terraform plan` shows exactly what will change (create/update/destroy) before touching anything — always review the plan in CI before `terraform apply`",
      "Providers: plugins that know how to talk to a cloud API — `hashicorp/aws`, `hashicorp/google`, `hashicorp/azurerm`; providers are versioned and pinned",
      "Modules: reusable Terraform blocks — the Terraform Registry has community modules for common patterns (e.g. `terraform-aws-modules/vpc/aws`)",
      "Workspaces / environments: use separate state files per environment (dev/staging/prod) — either via Terraform workspaces or separate state backend keys",
      "Pulumi: IaC in real programming languages (TypeScript, Python, Go) — you get loops, conditionals, type safety, and test frameworks; state is managed by Pulumi Cloud or self-hosted",
      "AWS CDK: TypeScript constructs that compile to CloudFormation — tight AWS integration, L2/L3 constructs provide sensible defaults; `cdk diff` is equivalent to `terraform plan`",
    ],
    whyItMatters:
      "Manual infrastructure is a liability — it can't be reviewed, can't be rolled back, and can't be reproduced in a new region or account. IaC is now a standard expectation in any DevOps-adjacent role and is increasingly expected of senior fullstack engineers who need to own their deployment story.",
    commonPitfalls: [
      "Storing state locally (`terraform.tfstate` in the repo) — it contains plaintext secrets and causes merge conflicts; always use remote state (S3 + DynamoDB for AWS)",
      "`terraform apply` directly from a developer's machine in production — apply should only run from CI after plan is reviewed and approved",
      "Importing existing manually-created resources into state — `terraform import` gets them under control, but forgetting to import means Terraform tries to create duplicates",
      "Not pinning provider versions — unpinned providers upgrade automatically and can break plans with API changes; always set `required_providers` with a version constraint",
    ],
    examples: [
      {
        title: "Terraform: VPC + ECS Fargate + RDS on AWS",
        description:
          "A minimal but production-shaped Terraform configuration: remote state, VPC with public/private subnets, ECS Fargate service, and RDS PostgreSQL.",
        code: `# ── versions.tf ───────────────────────────────────────────
terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  # Remote state — store in S3, lock with DynamoDB
  backend "s3" {
    bucket         = "my-tfstate-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" { region = "us-east-1" }

# ── VPC (using the community module) ──────────────────────
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name             = "production"
  cidr             = "10.0.0.0/16"
  azs              = ["us-east-1a", "us-east-1b"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets  = ["10.0.10.0/24", "10.0.11.0/24"]
  enable_nat_gateway = true   # allows private subnet → internet (for npm installs etc.)
}

# ── RDS PostgreSQL (private subnet) ───────────────────────
resource "aws_db_instance" "postgres" {
  identifier             = "production-db"
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t4g.medium"
  allocated_storage      = 20
  db_name                = "app"
  username               = "app"
  password               = var.db_password      # injected from CI secret
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  multi_az               = true
  skip_final_snapshot    = false
  deletion_protection    = true
}

resource "aws_db_subnet_group" "main" {
  name       = "production"
  subnet_ids = module.vpc.private_subnets
}

# ── ECS Cluster + Fargate Service ─────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "production"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "my-app"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name  = "app"
    image = "\${var.ecr_image_uri}:\${var.image_tag}"
    portMappings = [{ containerPort = 3000 }]
    environment = [{ name = "NODE_ENV", value = "production" }]
    secrets = [{ name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.db_url.arn }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group  = "/ecs/my-app"
        awslogs-region = "us-east-1"
      }
    }
  }])
}

resource "aws_ecs_service" "app" {
  name            = "my-app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.ecs.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }
}`,
        language: "hcl",
      },
      {
        title: "Pulumi — same infrastructure in TypeScript",
        description:
          "The same AWS setup expressed as TypeScript with Pulumi — you get full type safety, loops, and conditionals.",
        code: `import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";  // higher-level Crosswalk components

// ── VPC with public + private subnets ─────────────────────
const vpc = new awsx.ec2.Vpc("production", {
  numberOfAvailabilityZones: 2,
  natGateways: { strategy: "Single" },
});

// ── RDS PostgreSQL ─────────────────────────────────────────
const dbPassword = new aws.secretsmanager.Secret("db-password");
const db = new aws.rds.Instance("postgres", {
  engine:             "postgres",
  engineVersion:      "16",
  instanceClass:      "db.t4g.medium",
  allocatedStorage:   20,
  dbSubnetGroupName:  new aws.rds.SubnetGroup("main", {
    subnetIds: vpc.privateSubnetIds,
  }).name,
  multiAz:            true,
  deletionProtection: true,
  skipFinalSnapshot:  false,
  password:           dbPassword.arn,  // pulled from Secrets Manager
});

// ── ECS Fargate cluster + service ─────────────────────────
const cluster = new aws.ecs.Cluster("production");

const service = new awsx.ecs.FargateService("my-app", {
  cluster: cluster.arn,
  desiredCount: 2,
  taskDefinitionArgs: {
    container: {
      name:   "app",
      image:  process.env.ECR_IMAGE!,
      cpu:    1024,
      memory: 2048,
      portMappings: [{ containerPort: 3000 }],
    },
  },
});

// ── Outputs ────────────────────────────────────────────────
export const dbEndpoint  = db.endpoint;
export const serviceUrl  = service.loadBalancer?.dnsName;`,
        language: "typescript",
      },
    ],
  },
};
