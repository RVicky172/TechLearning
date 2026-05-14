import type { Technology } from "@/data/types";
import { htmlFundamentals } from "./fundamentals";
import { htmlForms } from "./forms";

const html: Technology = {
  id: "html",
  name: "HTML",
  description: "Semantic HTML, accessibility, forms, and best practices for modern web development.",
  color: "bg-orange-600",
  iconName: "FileCode2",
  deviconClass: "devicon-html5-plain colored",
  tree: [
    htmlFundamentals,
    htmlForms,
  ],
};

export default html;
