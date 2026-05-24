import type { Technology } from "@/data/types";
import { viteFundamentals } from "@/data/technologies/vite/fundamentals";
import { viteConfiguration } from "@/data/technologies/vite/configuration";
import { vitePlugins } from "@/data/technologies/vite/plugins";

const vite: Technology = {
  id: "vite",
  name: "Vite",
  description:
    "Lightning-fast build tool powered by native ESM in dev and Rollup in production — the modern Webpack alternative.",
  color: "bg-purple-500",
  iconName: "Zap",
  deviconClass: "devicon-vitejs-plain colored",
  tree: [viteFundamentals, viteConfiguration, vitePlugins],
};

export default vite;
