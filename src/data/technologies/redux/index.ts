import type { Technology } from "@/data/types";
import { reduxFundamentals } from "./fundamentals";
import { reduxToolkit } from "./reduxToolkit";
import { reduxReactIntegration } from "./reactRedux";
import { reduxMiddleware } from "./middleware";
import { reduxPatterns } from "./patterns";

const redux: Technology = {
  id: "redux",
  name: "Redux",
  description:
    "Predictable state container for JavaScript apps — centralises state, enables time-travel debugging, and scales to complex UIs.",
  color: "bg-purple-600",
  iconName: "Store",
  deviconClass: "devicon-redux-original colored",
  tree: [
    reduxFundamentals,
    reduxToolkit,
    reduxReactIntegration,
    reduxMiddleware,
    reduxPatterns,
  ],
};

export default redux;
