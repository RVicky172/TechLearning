import type { TopicNode } from "@/data/types";

export const lifecycleMethods: TopicNode = {
  id: "react-lifecycle-methods",
  title: "Lifecycle Methods (Class Components)",
  iconName: "Clock3",
  link: "https://react.dev/reference/react/Component",
  theory:
    "Class components use lifecycle methods to run logic at specific phases: mounting, updating, and unmounting. In modern React, function components with hooks are preferred, and most lifecycle behavior maps to useEffect/useLayoutEffect.",
  theoryDetail: {
    keyConcepts: [
      "Mounting phase: constructor -> render -> componentDidMount",
      "Updating phase: static getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate",
      "Unmounting phase: componentWillUnmount for cleanup (timers, subscriptions, listeners)",
      "Legacy unsafe lifecycle methods (componentWillMount/componentWillReceiveProps/componentWillUpdate) are deprecated and should be avoided",
    ],
    whyItMatters:
      "Many production codebases still contain class components. Understanding lifecycle methods helps you maintain legacy React code, debug render/update issues, and correctly migrate old components to modern hook-based patterns.",
    commonPitfalls: [
      "Calling setState unconditionally in componentDidUpdate, causing infinite re-render loops",
      "Forgetting cleanup in componentWillUnmount, leading to memory leaks or state updates on unmounted components",
      "Putting side effects in render(), which must remain pure",
      "Using derived state when a value can be computed directly from props/state",
    ],
    examples: [
      {
        title: "Class Lifecycle: mount, update, unmount",
        description: "A class component using the core lifecycle methods safely.",
        code: `import React from 'react';

class Clock extends React.Component {
  state = { now: new Date() };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ now: new Date() });
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timezone !== this.props.timezone) {
      console.log('Timezone changed');
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <p>{this.state.now.toLocaleTimeString()}</p>;
  }
}`,
        language: "jsx",
      },
      {
        title: "Hook Equivalent",
        description: "Most lifecycle logic in function components is modeled with useEffect.",
        code: `import { useEffect, useState } from 'react';

function Clock({ timezone }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer); // unmount cleanup
  }, []);

  useEffect(() => {
    console.log('Timezone changed');
  }, [timezone]); // update when timezone changes

  return <p>{now.toLocaleTimeString()}</p>;
}`,
        language: "jsx",
      },
    ],
  },
};