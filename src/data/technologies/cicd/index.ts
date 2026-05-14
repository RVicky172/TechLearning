import type { Technology } from "@/data/types";
import { cicdFundamentals } from "./fundamentals";
import { cicdGitHubActions } from "./githubActions";

const cicd: Technology = {
  id: "cicd",
  name: "CI/CD",
  description: "Continuous integration and deployment pipelines (GitHub Actions, automated testing, and deployments).",
  color: "bg-blue-600",
  iconName: "Zap",
  deviconClass: "devicon-github-plain colored",
  tree: [
    cicdFundamentals,
    cicdGitHubActions,
  ],
};

export default cicd;
