import type { Technology } from "@/data/types";
import { webpackCore } from "@/data/technologies/webpack/core";
import { webpackOptimization } from "@/data/technologies/webpack/optimization";
import { webpackAdvanced } from "@/data/technologies/webpack/advanced";

const webpack: Technology = {
  id: "webpack",
  name: "Webpack",
  description:
    "The module bundler powering most production React apps — loaders, plugins, code splitting, tree shaking, and HMR.",
  color: "bg-sky-500",
  iconName: "Package",
  deviconClass: "devicon-webpack-plain colored",
  tree: [webpackCore, webpackOptimization, webpackAdvanced],
};

export default webpack;
