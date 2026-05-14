import type { TopicNode } from "@/data/types";

export const packageManagersFundamentals: TopicNode = {
  id: "pm-fundamentals",
  title: "Package Manager Fundamentals",
  iconName: "Package",
  theoryDetail: {
    keyConcepts: [
      "npm: default Node.js package manager, comes with Node",
      "Lockfiles: package-lock.json ensures reproducible installations",
      "package.json: declares dependencies, scripts, and metadata",
      "Semantic Versioning (semver): MAJOR.MINOR.PATCH version scheme",
      "Version ranges: ^1.2.3 (compatible), ~1.2.3 (patch only), 1.2.3 (exact)",
      "node_modules: flattened dependency tree (npm3+)",
    ],
    whyItMatters:
      "Package managers handle thousands of dependencies safely. Understanding versioning prevents unexpected breaking changes and security vulnerabilities.",
    commonPitfalls: [
      "Committing node_modules to Git; always use .gitignore",
      "Loose version ranges causing inconsistent builds; commit lockfiles",
      "Not updating dependencies; security patches get missed",
      "Conflicting peer dependencies; npm peer dependency warnings indicate problems",
    ],
    examples: [
      {
        title: "package.json Structure",
        description: "Define project metadata, dependencies, and scripts.",
        code: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A fullstack web app",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "prisma": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}`,
        language: "json",
      },
    ],
  },
};
