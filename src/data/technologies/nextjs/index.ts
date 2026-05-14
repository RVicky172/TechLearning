import type { Technology } from "@/data/types";
import { nextjsFundamentals } from "./fundamentals";
import { nextjsRouting } from "./routing";
import { nextjsDataFetching } from "./dataFetching";
import { nextjsServerComponents } from "./serverComponents";
import { nextjsApiRoutes } from "./apiRoutes";
import { nextjsPerformance } from "./performance";
import { nextjsDeployment } from "./deployment";
import { nextjsEcosystem } from "./ecosystem";

const nextjs: Technology = {
  id: "nextjs",
  name: "Next.js",
  description: "React metaframework for production with built-in SSR, SSG, routing, and performance optimizations.",
  color: "bg-gray-800",
  iconName: "Zap",
  deviconClass: "devicon-nextjs-plain colored",
  tree: [
    nextjsFundamentals,
    nextjsRouting,
    nextjsDataFetching,
    nextjsServerComponents,
    nextjsApiRoutes,
    nextjsPerformance,
    nextjsDeployment,
    nextjsEcosystem,
  ],
};

export default nextjs;
