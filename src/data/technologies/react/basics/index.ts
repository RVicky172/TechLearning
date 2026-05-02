import type { TopicNode } from "@/data/types";
import { components } from "./components";
import { props } from "./props";
import { state } from "./state";
import { events } from "./events";
import { conditionalRendering } from "./conditionalRendering";
import { listsAndKeys } from "./listsAndKeys";
import { forms } from "./forms";
import { propsDrilling } from "./propsDrilling";
import { lifecycleMethods } from "./lifecycleMethods";
import { virtualDom } from "./virtualDom";
import { diffing } from "./diffing";
import { renderPipeline } from "./renderPipeline";
import { hydration } from "./hydration";

export const reactBasics: TopicNode = {
  id: "react-basics",
  title: "Basics of React",
  iconName: "BookOpen",
  theory:
    "React is a JavaScript library for building user interfaces using reusable components and a declarative programming model. It uses a virtual DOM to efficiently update the real DOM, and enforces unidirectional data flow from parents to children for predictability and easier debugging.",
  theoryDetail: {
    keyConcepts: [
      "React apps are trees of composable function components that manage their own state and side effects",
      "The virtual DOM creates an in-memory representation of the UI, diffs changes, and batches DOM updates for performance",
      "Unidirectional data flow: props flow down, events bubble up — this makes the data source always clear",
      "React re-renders when state changes, but only updates the parts of the DOM that actually changed",
    ],
    whyItMatters:
      "React's component model enables teams to scale from a single button to enterprise apps with hundreds of developers. The predictable data flow makes bugs easier to trace, the virtual DOM keeps apps fast, and the component abstraction lets you build larger systems from smaller, testable pieces.",
    commonPitfalls: [
      "Building large, monolithic components instead of breaking them into smaller, focused pieces",
      "Mutating state directly (e.g., array.push()) instead of returning new values, breaking React's change detection",
      "Ignoring React DevTools — they're essential for understanding component hierarchies and performance",
      "Over-engineering components with unnecessary layers of abstraction before the pattern is clear",
    ],
    examples: [
      {
        title: "Simple Function Component",
        description: "The most basic React component — a function that returns JSX.",
        code: `function Welcome() {
  return <h1>Hello, React!</h1>;
}

export default Welcome;`,
        language: "jsx",
      },
      {
        title: "Component Hierarchy",
        description: "Composing multiple components to build a larger UI.",
        code: `function Profile() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Header() {
  return <header>My Profile</header>;
}

function Content() {
  return <main>User information here</main>;
}

function Footer() {
  return <footer>© 2025</footer>;
}`,
        language: "jsx",
      },
    ],
  },
  children: [
    components,
    props,
    state,
    virtualDom,
    diffing,
    renderPipeline,
    hydration,
    events,
    conditionalRendering,
    listsAndKeys,
    forms,
    propsDrilling,
    lifecycleMethods,
  ],
};
