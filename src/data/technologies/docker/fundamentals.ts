import type { TopicNode } from "@/data/types";

export const dockerFundamentals: TopicNode = {
  id: "docker-fundamentals",
  title: "Docker Fundamentals",
  iconName: "Container",
  link: "https://docs.docker.com/get-started/",
  theory:
    "Docker is a containerisation platform that packages an application and its dependencies into a portable, isolated unit called a container. Containers share the host OS kernel — making them lightweight and milliseconds to start — while guaranteeing a consistent runtime environment from a developer laptop all the way to production.",
  theoryDetail: {
    keyConcepts: [
      "Container: an isolated process with its own filesystem, network, and process namespace — shares the host kernel, not a full OS",
      "Image: a read-only, layered blueprint for a container built from a Dockerfile; layers are cached and shared across images",
      "Dockerfile: a declarative script (FROM, RUN, COPY, CMD…) that describes exactly how an image is assembled",
      "Registry: a store for images — Docker Hub is the public default; AWS ECR, GHCR, and GCR are popular private options",
      "Docker Engine: the background daemon (dockerd) that manages images, containers, volumes, and networks via the Docker CLI",
      "Container vs VM: containers share the OS kernel (~ms startup, MBs of overhead); VMs have a full guest OS (~seconds startup, GBs of overhead)",
    ],
    whyItMatters:
      "Docker is foundational to modern software delivery. Every major cloud platform and CI/CD pipeline runs containers. Knowing Docker lets you write reproducible dev environments, build portable production artefacts, and understand the building blocks of Kubernetes and serverless runtimes.",
    commonPitfalls: [
      "Running as root inside the container — always add a USER directive to switch to a non-root user before CMD",
      "Enormous image sizes — each RUN layer is cached separately; chain commands with && and clean up (rm -rf /var/cache) in the same RUN to avoid bloat",
      "Missing .dockerignore — without it COPY . . ships node_modules, .git, .env, and secrets into the image",
      "Using the :latest tag in production — makes deployments non-deterministic; always pin a digest or explicit version tag",
      "Storing secrets in ENV or ARG in a Dockerfile — they appear in image history; use runtime env vars or a secrets manager instead",
    ],
    examples: [
      {
        title: "Production-ready Node.js Dockerfile with multi-stage build",
        description:
          "Multi-stage builds keep the final image small by discarding build-time tools. Only the compiled output and production node_modules are copied into the slim runtime stage.",
        code: `# ── Stage 1: Install ALL deps (including devDependencies) ─
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build          # outputs compiled JS to /app/dist

# ── Stage 3: Lean runtime image ───────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Security: run as non-root
RUN addgroup --system appgroup && \\
    adduser  --system --ingroup appgroup appuser

# Only copy production artefacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm ci --only=production   # re-install prod deps only

USER appuser
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]`,
        language: "dockerfile",
      },
      {
        title: "Essential Docker CLI commands",
        description: "The 10 commands you'll use every day as a fullstack developer.",
        code: `# ── Build & run ───────────────────────────────────────────
docker build -t myapp:1.0 .          # build image from Dockerfile in cwd
docker build --no-cache -t myapp .   # force full rebuild (ignore layer cache)
docker run -d -p 3000:3000 --name api myapp:1.0   # run detached, map ports
docker run --rm -it myapp:1.0 sh     # interactive shell, auto-remove on exit

# ── Inspect running containers ────────────────────────────
docker ps                            # list running containers
docker ps -a                         # include stopped containers
docker logs -f api                   # stream logs (like tail -f)
docker exec -it api sh               # shell into a running container
docker inspect api                   # full JSON metadata

# ── Lifecycle ─────────────────────────────────────────────
docker stop api                      # graceful SIGTERM → SIGKILL after 10s
docker rm api                        # remove stopped container
docker rmi myapp:1.0                 # remove image

# ── Registry ──────────────────────────────────────────────
docker tag myapp:1.0 ghcr.io/org/myapp:1.0
docker push ghcr.io/org/myapp:1.0
docker pull ghcr.io/org/myapp:1.0

# ── Housekeeping ──────────────────────────────────────────
docker system prune -af              # remove all unused images, containers, networks`,
        language: "bash",
      },
    ],
  },
};
