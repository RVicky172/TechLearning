import type { TopicNode } from "@/data/types";

export const dockerImages: TopicNode = {
  id: "docker-images",
  title: "Images & Layers",
  iconName: "Layers",
  link: "https://docs.docker.com/build/guide/layers/",
  theory:
    "Every Docker image is a stack of read-only filesystem layers. Each Dockerfile instruction that changes the filesystem (RUN, COPY, ADD) creates a new layer. Docker caches layers keyed by the instruction and its inputs — a cache hit skips re-execution, making incremental builds very fast.",
  theoryDetail: {
    keyConcepts: [
      "Union filesystem: layers are stacked using overlay2; the container gets a writable layer on top of the read-only image layers",
      "Layer caching: Docker hashes each instruction; if the instruction and its inputs haven't changed, Docker reuses the cached layer",
      "Cache invalidation: changing any layer invalidates all layers below it — so put rarely-changing instructions (e.g. package installs) near the top",
      "COPY vs ADD: prefer COPY for local files; ADD adds extra behaviour (auto-extracting .tar.gz, fetching URLs) that can be surprising",
      "Base image selection: node:20-alpine is ~50 MB; node:20 is ~1 GB — choose the smallest image that has what you need",
      "docker image ls --tree shows the layer DAG; docker history <image> lists all layers with their sizes",
    ],
    whyItMatters:
      "Understanding layers is the key to fast CI builds and small production images. A well-ordered Dockerfile can cut build times from minutes to seconds by maximising cache hits, and cut image sizes by 10× by choosing slim base images and cleaning up in the same layer that installs.",
    commonPitfalls: [
      "Copying package.json and source in a single COPY . . — any source change invalidates the npm install layer; always COPY package*.json separately first",
      "Running apt-get install without rm -rf /var/lib/apt/lists/* in the same RUN — the package index gets baked into the layer, adding ~30 MB",
      "Using ADD for local file copies — COPY is explicit and preferred; ADD's tar extraction silently changes behaviour",
      "Building large images unnecessarily — prefer multi-stage builds so dev tools (gcc, TypeScript compiler) are never in the final image",
    ],
    examples: [
      {
        title: "Optimised layer ordering — cache package installs separately",
        description:
          "By copying the lockfile first and running npm ci before COPY . ., the install layer is cached on every build where dependencies haven't changed.",
        code: `# ❌ Bad — every code change re-runs npm ci (slow)
FROM node:20-alpine
WORKDIR /app
COPY . .                  # source change invalidates everything below
RUN npm ci                # runs on EVERY rebuild

# ✅ Good — npm ci is cached until package.json/lock changes
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./   # layer 1: only lockfile
RUN npm ci                               # layer 2: cached until lockfile changes
COPY . .                                 # layer 3: source (invalidates often, but npm ci is already cached)
RUN npm run build                        # layer 4: only re-runs if source changed`,
        language: "dockerfile",
      },
      {
        title: "Inspecting image layers",
        description: "Use docker history and dive to understand what's bloating your images.",
        code: `# Show all layers, their sizes, and the commands that created them
docker history --no-trunc myapp:1.0

# IMAGE          CREATED        CREATED BY                         SIZE
# sha256:abc...  2 minutes ago  CMD ["node" "dist/server.js"]      0B
# sha256:def...  2 minutes ago  EXPOSE 3000                        0B
# sha256:ghi...  2 minutes ago  RUN npm ci --only=production       42.1MB
# sha256:jkl...  3 minutes ago  COPY dist ./dist                   1.8MB
# sha256:mno...  3 minutes ago  USER appuser                       0B

# dive tool — interactive layer explorer (install: brew install dive)
dive myapp:1.0

# Check image size
docker image ls myapp
# REPOSITORY   TAG   IMAGE ID      CREATED      SIZE
# myapp        1.0   abc123def456  2 min ago    87.3MB   ← good, alpine-based`,
        language: "bash",
      },
    ],
  },
};
