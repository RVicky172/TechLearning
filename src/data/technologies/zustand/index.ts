import type { Technology } from "@/data/types";
import { zustandFundamentals } from "@/data/technologies/zustand/fundamentals";
import { zustandPatterns } from "@/data/technologies/zustand/patterns";

const zustand: Technology = {
  id: "zustand",
  name: "Zustand",
  description:
    "Minimal, boilerplate-free React state management — create a store with one call, subscribe to slices, and scale with middleware.",
  color: "bg-amber-600",
  iconName: "Box",
  deviconClass: "devicon-zustand-plain",
  tree: [zustandFundamentals, zustandPatterns],
};

export default zustand;
