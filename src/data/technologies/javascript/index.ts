import type { Technology } from "@/data/types";
import { jsCore } from "@/data/technologies/javascript/core";
import { jsFunctions } from "@/data/technologies/javascript/functions";
import { jsAsync } from "@/data/technologies/javascript/async";
import { jsModern } from "@/data/technologies/javascript/modern";
import { jsDom } from "@/data/technologies/javascript/dom";

const javascript: Technology = {
  id: "javascript",
  name: "JavaScript",
  description:
    "The language of the web — core concepts, async patterns, and modern ES6+ features every developer must know.",
  color: "bg-yellow-500",
  iconName: "Braces",
  deviconClass: "devicon-javascript-plain colored",
  tree: [jsCore, jsFunctions, jsAsync, jsModern, jsDom],
};

export default javascript;
