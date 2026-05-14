import type { TopicNode } from "@/data/types";

export const cloudContainers: TopicNode = {
  id: "cloud-containers",
  title: "Containers and Orchestration",
  iconName: "Container",
  theory:
    "Containers package an application with its runtime dependencies, making deployment more repeatable. Orchestration platforms like Kubernetes manage scheduling, scaling, networking, rollout strategy, and recovery across many containers.",
  theoryDetail: {
    keyConcepts: [
      "A good container image is small, reproducible, and does not bake in secrets.",
      "Kubernetes adds value when you truly need multi-service scheduling, rollout control, and platform consistency.",
      "Pods, services, ingress, deployments, config maps, and secrets are the minimum useful Kubernetes vocabulary.",
    ],
    whyItMatters:
      "Even if you do not run Kubernetes daily, you will work with container images, registries, and deployment pipelines. This is now baseline operational literacy for backend and platform-oriented engineers.",
    commonPitfalls: [
      "Using a root container image and carrying unnecessary packages into production.",
      "Moving to Kubernetes before the deployment workflow or service boundaries are stable.",
      "Treating Kubernetes as a silver bullet instead of a complex operating model.",
    ],
    examples: [
      {
        title: "Lean Node.js container image",
        description: "Use multi-stage builds and production-only dependencies.",
        code: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
CMD ["npm", "start"]`,
        language: "dockerfile",
      },
    ],
  },
  children: [
    {
      id: "cloud-docker",
      title: "Docker and Image Design",
      iconName: "Package",
      theory:
        "Learn image layers, multi-stage builds, registry workflows, health checks, and how to keep runtime images minimal and secure.",
      theoryDetail: {
        keyConcepts: [
          "Layer caching makes Dockerfiles fast when dependency layers are stable.",
          "Multi-stage builds keep toolchains out of runtime images.",
          "Images should run as non-root and expose only required ports.",
        ],
        whyItMatters:
          "Image design affects cold-start speed, security posture, and deployment reliability in every environment.",
        commonPitfalls: [
          "Copying the entire repository before installing dependencies, which breaks cache efficiency.",
          "Shipping development tools in production image layers.",
          "Skipping vulnerability scanning in CI.",
        ],
        examples: [
          {
            title: "Cache-friendly Dockerfile ordering",
            description:
              "Copy manifest files first so dependency install can be reused across code-only changes.",
            code: `# Better cache usage
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Application code comes after dependency layer
COPY src ./src
COPY dist ./dist`,
            language: "dockerfile",
          },
        ],
      },
      link: "https://docs.docker.com/get-started/overview/",
    },
    {
      id: "cloud-kubernetes",
      title: "Kubernetes Essentials",
      iconName: "Boxes",
      theory:
        "Focus on deployments, services, ingress, autoscaling, rollout strategy, and configuration management before touching advanced operators or custom controllers.",
      theoryDetail: {
        keyConcepts: [
          "Deployments define desired state and rollout behavior for stateless workloads.",
          "Services provide stable networking for pods that are constantly rescheduled.",
          "Readiness and liveness probes protect availability during startup and runtime failures.",
        ],
        whyItMatters:
          "Kubernetes becomes manageable when teams master the small set of primitives used in daily production operations.",
        commonPitfalls: [
          "No resource requests/limits, causing noisy-neighbor instability.",
          "Routing traffic to pods before readiness passes.",
          "Treating cluster defaults as secure without namespace and RBAC policy.",
        ],
        examples: [
          {
            title: "Minimal deployment with health probes",
            description:
              "A production-friendly baseline for a stateless web service.",
            code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: registry.example.com/web:1.0.0
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /healthz
              port: 3000
          livenessProbe:
            httpGet:
              path: /livez
              port: 3000`,
            language: "yaml",
          },
        ],
      },
      link: "https://kubernetes.io/docs/concepts/overview/",
    },
  ],
};