import type { Technology } from "@/data/types";
import { tailwindFundamentals } from "@/data/technologies/tailwind/fundamentals";
import { tailwindLayout } from "@/data/technologies/tailwind/layout";
import { tailwindCustomization } from "@/data/technologies/tailwind/customization";
import { tailwindAdvanced } from "@/data/technologies/tailwind/advanced";

const tailwind: Technology = {
  id: "tailwind",
  name: "Tailwind CSS",
  description:
    "Utility-first CSS framework — compose styles directly in markup with responsive, dark-mode, and state variants.",
  color: "bg-cyan-500",
  iconName: "Palette",
  deviconClass: "devicon-tailwindcss-original colored",
  tree: [tailwindFundamentals, tailwindLayout, tailwindCustomization, tailwindAdvanced],
};

export default tailwind;
