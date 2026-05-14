import type { TopicNode } from "@/data/types";

export const packageManagersAlternatives: TopicNode = {
  id: "pm-alternatives",
  title: "Alternative Package Managers",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Yarn: faster parallel installation, offline mode, workspaces",
      "pnpm: disk space efficient via content-addressable storage, strict dependencies",
      "Bun: ultra-fast runtime with built-in package manager",
      "npm workspace: monorepo support for multiple packages in one repo",
      "Migration: can switch between managers; they all use the same registry",
    ],
    whyItMatters:
      "Different package managers excel at different things. Choosing the right one can improve build times, disk usage, and developer experience.",
  },
};
