import type { TopicNode } from "@/data/types";

export const dockerCompose: TopicNode = {
  id: "docker-compose",
  title: "Docker Compose",
  iconName: "Network",
  link: "https://docs.docker.com/compose/",
  theory:
    "Docker Compose lets you define and run multi-container applications from a single YAML file. Instead of running long docker run commands with flags, you describe your entire stack — web server, API, database, cache — declaratively and spin it all up with one command.",
  theoryDetail: {
    keyConcepts: [
      "docker-compose.yml / compose.yaml: the descriptor file — defines services, networks, and volumes",
      "Service: a container configuration; maps to a docker run command with all its flags expressed as YAML keys",
      "depends_on: controls startup order; add condition: service_healthy with a healthcheck for true readiness gating",
      "Named volumes: data written to a volume persists across container restarts — essential for databases",
      "Environment variables: use env_file: .env.local to inject secrets without hardcoding them in the YAML",
      "Profiles: tag services with profiles: [dev] and activate with --profile dev to conditionally include services",
      "docker compose up -d --build: rebuild images and start all services detached (background)",
    ],
    whyItMatters:
      "Compose is the standard tool for local fullstack development. A single compose.yaml lets any team member spin up the entire application stack — API, database, Redis, mock services — with one command. It also serves as runnable documentation of how all the pieces connect.",
    commonPitfalls: [
      "Relying solely on depends_on without a healthcheck — depends_on waits for the container to start, not for the service inside it to be ready (Postgres takes several seconds to accept connections)",
      "Using the same compose file for production — production needs secrets managers, restart policies, resource limits, and no bind mounts",
      "Bind-mounting the entire project directory in production-like environments — changes bypass the image build process, causing 'works locally, broken in CI' bugs",
      "Not setting restart: unless-stopped for persistent services — after a host reboot, containers won't auto-start",
    ],
    examples: [
      {
        title: "Full-stack compose.yaml — Next.js + Postgres + Redis",
        description:
          "A realistic development compose file with health checks, named volumes, and env file injection.",
        code: `# compose.yaml  (Compose v2 — no 'version:' key needed)
services:
  # ── Next.js Application ───────────────────────────────
  web:
    build:
      context: .
      target: runner          # multi-stage target
    ports:
      - "3000:3000"
    env_file:
      - .env.local            # DATABASE_URL, REDIS_URL, etc.
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app                # live reload in dev — remove for prod
      - /app/node_modules     # anonymous volume prevents host node_modules overwrite
    restart: unless-stopped

  # ── Postgres ──────────────────────────────────────────
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret      # fine for local dev; use secrets in prod
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"                  # expose for local DB clients (TablePlus, etc.)
    volumes:
      - postgres_data:/var/lib/postgresql/data   # persist data across restarts
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 10

  # ── Redis ─────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:`,
        language: "yaml",
      },
      {
        title: "Essential Compose CLI commands",
        description: "Day-to-day Compose commands every developer should know.",
        code: `# Start all services (rebuild if Dockerfile changed)
docker compose up -d --build

# View aggregated logs (follow mode)
docker compose logs -f
docker compose logs -f web          # only web service

# Stop without removing containers/volumes
docker compose stop

# Stop AND remove containers + default network
docker compose down

# Remove everything including named volumes (destructive!)
docker compose down -v

# Run a one-off command in a service container
docker compose exec web sh          # interactive shell
docker compose exec db psql -U appuser appdb   # psql session

# Scale a service (useful for load-testing)
docker compose up -d --scale web=3

# Check status
docker compose ps`,
        language: "bash",
      },
    ],
  },
};
