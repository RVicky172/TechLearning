import type { TopicNode } from "@/data/types";

export const gitBranching: TopicNode = {
  id: "git-branching",
  title: "Branching Strategies",
  iconName: "GitBranch",
  theoryDetail: {
    keyConcepts: [
      "Git Flow: feature/release/hotfix branches off main and develop",
      "GitHub Flow: simple, all features branch from main, deploy to production",
      "Trunk-Based Development: short-lived branches, frequent merges to main",
      "Conventional commits: semantic versioning from commit messages",
      "Protected branches: require PR reviews before merging",
      "Linear history: rebase vs merge decisions affect history structure",
    ],
    whyItMatters:
      "Branching strategy affects code quality, release cycle, and team velocity. Choosing the right one prevents messy Git history and integration conflicts.",
    examples: [
      {
        title: "GitHub Flow Example",
        description: "Simple branching strategy for continuous deployment.",
        code: `# 1. Create feature branch
git checkout -b feature/user-profile

# 2. Make commits
git commit -m "add user profile component"
git commit -m "add profile edit functionality"

# 3. Push and create PR
git push origin feature/user-profile
# Create Pull Request on GitHub

# 4. Get reviewed and merge
# (GitHub UI: Squash and merge or create merge commit)

# 5. Delete branch
git branch -d feature/user-profile
git push origin --delete feature/user-profile

# 6. Deploy main
# (CI/CD automatically deploys after merge)`,
        language: "bash",
      },
    ],
  },
};
