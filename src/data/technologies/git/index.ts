import type { Technology } from "@/data/types";
import { gitFundamentals } from "./fundamentals";
import { gitBranching } from "./branching";
import { gitCollaboration } from "./collaboration";

const git: Technology = {
  id: "git",
  name: "Git & Version Control",
  description: "Distributed version control, branching strategies, collaboration, and GitHub workflows.",
  color: "bg-red-600",
  iconName: "GitBranch",
  deviconClass: "devicon-git-plain colored",
  tree: [
    gitFundamentals,
    gitBranching,
    gitCollaboration,
  ],
};

export default git;
