import type { TopicNode } from "@/data/types";

export const dockerVolumesNetworking: TopicNode = {
  id: "docker-volumes-networking",
  title: "Volumes & Networking",
  iconName: "Share2",
  link: "https://docs.docker.com/network/",
  theory:
    "Docker volumes provide persistent storage that survives container restarts and deletions. Docker networks allow containers to communicate with each other by service name (DNS), while keeping them isolated from the host and from containers on other networks.",
  theoryDetail: {
    keyConcepts: [
      "Named volume: managed by Docker, stored in /var/lib/docker/volumes — use for persistent data (databases, uploads)",
      "Bind mount: maps a host directory into the container — great for live-reload dev, dangerous in prod (gives write access to host)",
      "tmpfs mount: in-memory filesystem — data lost on container stop; useful for sensitive temp files",
      "Bridge network: default network type — containers on the same bridge network communicate by container name (built-in DNS)",
      "Host network: container shares the host's network stack (--network host) — no port mapping needed but breaks isolation",
      "Service discovery: on a user-defined bridge network, containers resolve each other by service name (e.g. http://db:5432)",
      "Port publishing: -p 8080:3000 maps host port 8080 to container port 3000; -P publishes all exposed ports to random host ports",
    ],
    whyItMatters:
      "Understanding volumes means your database data survives docker compose down. Understanding networks means you can reason about how services talk to each other, why localhost inside a container means the container itself (not the host), and how to debug connectivity issues between services.",
    commonPitfalls: [
      "Assuming localhost inside a container refers to the host machine — inside a container localhost is the container; use the service name or host.docker.internal",
      "Bind-mounting node_modules from the host — host and container may have different OS/arch, causing native module crashes; use an anonymous volume to shadow it",
      "Not backing up named volumes — docker compose down -v silently destroys all named volumes including your database",
      "Publishing ports unnecessarily — exposing db:5432 to the host (0.0.0.0) in production creates a security hole; use expose: instead and only allow inter-service traffic",
    ],
    examples: [
      {
        title: "Volume types — named, bind mount, anonymous, tmpfs",
        description: "When to use each type and the syntax for both CLI and Compose.",
        code: `# ── Named volume (managed by Docker, persists across container lifecycle) ──
docker volume create mydata
docker run -v mydata:/app/data myapp

# ── Bind mount (host directory mounted into container) ──────────────────
# Good for dev: edits on host are immediately reflected in container
docker run -v $(pwd)/src:/app/src myapp

# ── Anonymous volume (container-scoped, auto-named by Docker) ───────────
docker run -v /app/node_modules myapp   # shadows host node_modules

# ── tmpfs mount (memory only, lost on stop) ──────────────────────────────
docker run --tmpfs /tmp myapp

# ─── In compose.yaml ────────────────────────────────────────────────────
services:
  app:
    volumes:
      - postgres_data:/var/lib/postgresql/data   # named volume
      - ./src:/app/src                            # bind mount (dev only)
      - /app/node_modules                         # anonymous volume

volumes:
  postgres_data:           # declares the named volume`,
        language: "yaml",
      },
      {
        title: "Custom networks and inter-service DNS",
        description:
          "On a user-defined bridge network, containers resolve each other by service name. This replaces hardcoded IPs.",
        code: `# compose.yaml — explicit network definition
services:
  api:
    build: .
    networks:
      - backend
    environment:
      # 'db' resolves to the db container's IP on the backend network
      DATABASE_URL: postgres://user:pass@db:5432/mydb
      REDIS_URL: redis://cache:6379

  db:
    image: postgres:16-alpine
    networks:
      - backend      # same network = reachable by name 'db'

  cache:
    image: redis:7-alpine
    networks:
      - backend      # reachable as 'cache'

networks:
  backend:
    driver: bridge   # default, explicit for clarity

# ── Debugging network issues ─────────────────────────────────────────────
# Ping another service by name from inside a container:
docker compose exec api ping db        # should resolve + respond
docker compose exec api wget -qO- http://cache:6379   # test port reach`,
        language: "yaml",
      },
    ],
  },
};
