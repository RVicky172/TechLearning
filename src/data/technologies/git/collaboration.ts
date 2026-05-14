import type { TopicNode } from "@/data/types";

export const gitCollaboration: TopicNode = {
  id: "git-collaboration",
  title: "Collaboration & Pull Requests",
  iconName: "Users",
  theoryDetail: {
    keyConcepts: [
      "Pull Requests (PRs): propose changes, discuss, and review before merging",
      "Code review: at least one approval before merging protects main",
      "Commit squashing: combine multiple commits into one for clean history",
      "Rebase: replay commits on top of another branch for linear history",
      "Merge conflicts: manually resolve when same lines change in different branches",
      "GitHub/GitLab: issues, project boards, and automation enhance collaboration",
    ],
    whyItMatters:
      "PRs and code reviews catch bugs, share knowledge, and prevent bad code from reaching production. Good collaboration practices scale teams.",
    examples: [
      {
        title: "Resolving Merge Conflicts",
        description: "Fix conflicts when branches change same file.",
        code: `# Conflict markers in file:
# <<<<<<< HEAD
# const color = 'blue';
# =======
# const color = 'red';
# >>>>>>> feature/color-change

# Edit file to choose correct version:
const color = 'blue'; // Keep our version

# Stage resolved file
git add src/style.ts

# Complete merge
git commit -m "merge: resolve color conflict"`,
        language: "bash",
      },
    ],
  },
};
