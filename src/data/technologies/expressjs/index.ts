import type { Technology } from "@/data/types";
import { expressFundamentals } from "@/data/technologies/expressjs/fundamentals";
import { expressMiddleware } from "@/data/technologies/expressjs/middleware";
import { expressRouting } from "@/data/technologies/expressjs/routing";
import { expressAsyncBehavior } from "@/data/technologies/expressjs/asyncBehavior";
import { expressInterviewQuestions } from "@/data/technologies/expressjs/interviewQuestions";

const expressjs: Technology = {
  id: "expressjs",
  name: "Express.js",
  description: "Fast, unopinionated, minimalist web framework for Node.js. The industry standard for building REST APIs.",
  color: "bg-gray-800",
  iconName: "ServerCog",
  deviconClass: "devicon-express-original",
  tree: [
    expressFundamentals,
    expressMiddleware,
    expressRouting,
    expressAsyncBehavior,
    expressInterviewQuestions,
  ],
};

export default expressjs;
