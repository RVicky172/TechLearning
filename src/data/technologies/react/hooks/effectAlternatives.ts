import type { TopicNode } from "@/data/types";

export const effectAlternatives: TopicNode = {
  id: "react-you-might-not-need-effect",
  title: "You Might Not Need an Effect",
  iconName: "Lightbulb",
  link: "https://react.dev/learn/you-might-not-need-an-effect",
  theory:
    "Many effects are unnecessary. If logic can run during render (derived data) or in an event handler (user-triggered action), prefer that over useEffect. Reserve effects for synchronizing with external systems.",
  theoryDetail: {
    keyConcepts: [
      "Derived values should be calculated during render, not copied into state",
      "User-triggered operations belong in event handlers, not effects",
      "Effects are for external synchronization: APIs, subscriptions, timers, browser integrations",
      "Reducing effects lowers bug surface area (loops, stale closures, dependency mistakes)",
    ],
    whyItMatters:
      "This is one of the highest-leverage React skills. Teams that minimize unnecessary effects ship fewer bugs and spend less time debugging dependency arrays and synchronization issues.",
    commonPitfalls: [
      "Using useEffect + setState to derive values that could be computed inline",
      "Triggering network calls in effects for actions that should run directly in submit handlers",
      "Suppressing exhaustive-deps warnings instead of fixing data flow",
      "Splitting one concern across multiple effects with hidden coupling",
    ],
    examples: [
      {
        title: "Derived data without effect",
        description: "Compute filtered data in render instead of syncing it via useEffect.",
        code: `function ProductList({ products, term }) {
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(term.toLowerCase())
  );

  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}`,
        language: "jsx",
      },
      {
        title: "Handle action in event handler",
        description: "Submit logic should run in the submit handler, not an effect that watches state.",
        code: `function CheckoutForm() {
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    await fetch('/api/checkout', { method: 'POST' });
    setStatus('done');
  }

  return <form onSubmit={handleSubmit}>...</form>;
}`,
        language: "jsx",
      },
    ],
  },
};
