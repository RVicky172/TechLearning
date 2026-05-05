import type { Technology } from "@/data/types";
import { cssFundamentals } from "./fundamentals";
import { cssLayout } from "./layout";
import { cssResponsive } from "./responsive";
import { cssVisual } from "./visual";
import { cssAnimations } from "./animations";
import { cssInterviewQuestions } from "./interviewQuestions";

const css: Technology = {
  id: "css",
  name: "CSS",
  description: "The styling language of the web — control layout, typography, color, and animation for every browser.",
  color: "bg-blue-400",
  iconName: "Paintbrush",
  deviconClass: "devicon-css3-plain colored",
  tree: [
    cssFundamentals,
    cssLayout,
    cssResponsive,
    cssVisual,
    cssAnimations,
    cssInterviewQuestions,
  ],
};

export default css;
