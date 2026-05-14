import type { TopicNode } from "@/data/types";

export const gitFundamentals: TopicNode = {
  id: "git-fundamentals",
  title: "Git Fundamentals",
  iconName: "GitBranch",
  theoryDetail: {
    keyConcepts: [
      "Git is a distributed version control system; every clone is a full repository",
      "Commits are snapshots; git log shows history of changes",
      "Branches are lightweight pointers to commits; switching branches is fast",
      "Staging area (index) prepares changes before committing",
      "Three Git areas: working directory, staging, and .git (repository)",
      "HEAD pointer marks current branch and commit",
    ],
    whyItMatters:
      "Git is the foundation of modern collaboration. Understanding it deeply prevents destructive mistakes and enables efficient teamwork.",
    commonPitfalls: [
      "Large binary files in repo; use .gitignore and Git LFS for media",
      "Committing secrets (API keys, tokens); always use .env and .gitignore",
      "Not pulling before pushing; causes rejection and merge conflicts",
      "Unclear commit messages; write present-tense, descriptive messages",
      "Committing too much at once; smaller commits are easier to review and revert",
    ],
    examples: [
      {
        title: "Basic Git Workflow",
        description: "Create, stage, commit, and push changes.",
        code: `# Check status
git status

# Create new branch
git checkout -b feature/user-auth

# Make changes
echo "new code" > src/auth.ts

# Stage changes
git add src/auth.ts

# Commit with message
git commit -m "feat: add user authentication logic"

# Push to remote
git push origin feature/user-auth

# Merge to main (via PR in GitHub)
git checkout main
git pull origin main
git merge feature/user-auth
git push origin main`,
        language: "bash",
      },
    ],
  },
};
