import type { Technology } from "@/data/types";
import { environmentFundamentals } from "./fundamentals";

const environment: Technology = {
  id: "environment",
  name: "Environment & Configuration",
  description: "Environment variables, secrets management, and configuration across dev/staging/production.",
  color: "bg-purple-600",
  iconName: "Settings",
  deviconClass: "devicon-bash-plain colored",
  tree: [environmentFundamentals],
};

export default environment;
