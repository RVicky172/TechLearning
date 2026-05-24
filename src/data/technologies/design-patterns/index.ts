import type { Technology } from "@/data/types";
import { patternsCreational } from "@/data/technologies/design-patterns/creational";
import { patternsBehavioral } from "@/data/technologies/design-patterns/behavioral";

const designPatterns: Technology = {
  id: "design-patterns",
  name: "Design Patterns",
  description:
    "Creational, structural, and behavioral patterns — Singleton, Builder, Observer, Strategy, and how frameworks implement them.",
  color: "bg-teal-600",
  iconName: "GitBranch",
  deviconClass: "devicon-github-original",
  tree: [patternsCreational, patternsBehavioral],
};

export default designPatterns;
