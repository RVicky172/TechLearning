import type { Technology } from "@/data/types";
import { packageManagersFundamentals } from "./fundamentals";
import { packageManagersAlternatives } from "./alternatives";

const packageManagers: Technology = {
  id: "packageManagers",
  name: "Package Managers",
  description: "npm, Yarn, pnpm, and Bun—manage dependencies, versions, and monorepos.",
  color: "bg-red-500",
  iconName: "Package",
  deviconClass: "devicon-npm-original-wordmark colored",
  tree: [
    packageManagersFundamentals,
    packageManagersAlternatives,
  ],
};

export default packageManagers;
