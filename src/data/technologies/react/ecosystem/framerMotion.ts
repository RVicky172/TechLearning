import type { TopicNode } from "@/data/types";

export const framerMotion: TopicNode = {
  id: "react-framer-motion",
  title: "Animations (Framer Motion)",
  iconName: "MonitorPlay",
  link: "https://www.framer.com/motion/",
  theory:
    "Framer Motion is the de facto standard library for declarative animations in React. It simplifies complex CSS transitions, spring physics, layout animations, and gesture-driven interactions into intuitive component props.",
  theoryDetail: {
    keyConcepts: [
      "<motion.div> — A specialized component that accepts animation props like initial, animate, and exit",
      "Spring Physics — By default, animations use springs rather than CSS easing curves, making them feel natural and interruptible",
      "AnimatePresence — enables exit animations when a component is removed from the React tree",
      "Layout Animations — the layout prop automatically animates a component when its size or position in the DOM changes",
      "Variants — pre-defined animation states that can propagate from parent components to children for orchestrated stagger effects",
    ],
    whyItMatters:
      "CSS transitions handle simple hover states well, but completely fail at animating elements entering/leaving the DOM or orchestrating complex sequences. Framer Motion integrates deeply with React's component lifecycle to make these advanced animations declarative and easy to maintain.",
    commonPitfalls: [
      "Forgetting to wrap conditional components in <AnimatePresence> — exit animations won't fire without it",
      "Overusing animations — too much motion makes apps feel slow and overwhelming; keep animations subtle (< 300ms)",
      "Animating expensive properties like width, height, or top — always prefer animating scale and transform for 60fps performance",
      "Not providing unique keys to <motion.div> elements inside <AnimatePresence>",
    ],
    examples: [
      {
        title: "Basic Mount and Hover Animation",
        description: "A simple card that fades in and scales up on hover.",
        language: "tsx",
        code: `import { motion } from "framer-motion";

export function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card"
    >
      <h3>Animated Card</h3>
    </motion.div>
  );
}`,
      },
      {
        title: "Exit Animations with AnimatePresence",
        description: "Animating a modal out of the screen before React removes it from the DOM.",
        language: "tsx",
        code: `import { motion, AnimatePresence } from "framer-motion";

export function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // 1. Starting state
          initial={{ opacity: 0 }}
          // 2. Active state
          animate={{ opacity: 1 }}
          // 3. Unmount state (requires AnimatePresence parent)
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Modal Content</h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`,
      },
      {
        title: "Orchestrating Lists with Variants",
        description: "Staggering the appearance of list items using variants.",
        language: "tsx",
        code: `import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Delays each child by 0.1s
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function List({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map(text => (
        <motion.li key={text} variants={item}>
          {text}
        </motion.li>
      ))}
    </motion.ul>
  );
}`,
      },
      {
        title: "Magic Layout Animations",
        description: "Automatically animating size and position changes when state updates.",
        language: "tsx",
        code: `import { useState } from "react";
import { motion } from "framer-motion";

export function ExpandableCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      layout // This single prop handles all size/position animations!
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        width: expanded ? 400 : 200,
        height: expanded ? 300 : 100
      }}
    >
      <motion.h2 layout>Click to expand</motion.h2>
      {expanded && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          Expanded content appears smoothly!
        </motion.p>
      )}
    </motion.div>
  );
}`,
      }
    ],
  },
};
