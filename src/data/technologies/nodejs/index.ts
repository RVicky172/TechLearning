import type { Technology } from "@/data/types";
import { nodeFundamentals } from "@/data/technologies/nodejs/fundamentals";
import { nodeAsync } from "@/data/technologies/nodejs/async";
import { nodeExpress } from "@/data/technologies/nodejs/express";
import { nodeDatabases } from "@/data/technologies/nodejs/databases";
import { nodeSecurity } from "@/data/technologies/nodejs/security";
import { nodeTesting } from "@/data/technologies/nodejs/testing";
import { nodePerformance } from "@/data/technologies/nodejs/performance";
import { nodeInterviewQuestions } from "@/data/technologies/nodejs/interviewQuestions";

const nodejs: Technology = {
  id: "nodejs",
  name: "Node.js",
  description: "Event-driven JavaScript runtime built on Chrome's V8 engine for scalable server-side applications.",
  color: "bg-green-600",
  iconName: "Server",
  deviconClass: "devicon-nodejs-plain colored",
  tree: [
    nodeFundamentals,
    nodeAsync,
    nodeExpress,
    nodeDatabases,
    nodeSecurity,
    nodeTesting,
    nodePerformance,
    nodeInterviewQuestions,
  ],
};

export default nodejs;
