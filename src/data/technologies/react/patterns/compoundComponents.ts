import type { TopicNode } from "@/data/types";

export const compoundComponents: TopicNode = {
  id: "react-compound-components",
  title: "Compound Components",
  iconName: "Puzzle",
  demoComponentKey: "compoundComponents",
  theory:
    "Compound Components is a pattern where multiple components work together to form a cohesive UI unit. Instead of passing massive configuration objects through props, you expose individual building blocks (like `<Tabs.List>` and `<Tabs.Panel>`) that share state implicitly using React Context. This gives consumers maximum flexibility over rendering and layout.",
  theoryDetail: {
    keyConcepts: [
      "Inversion of control: The consumer decides the markup and ordering, while the components handle the logic",
      "Implicit state sharing: Child components read state from Context without the user manually wiring them up",
      "Namespace export: Grouping related components under a single object (e.g., Select, Select.Option) makes the API clear",
      "Prevents 'prop drilling': Instead of <Select options={opts} customRender={...} />, just map over <Select.Option>",
    ],
    whyItMatters:
      "As components grow (like Selects, Accordions, or Menus), passing all configurations via props creates an unmaintainable 'prop soup'. Compound components fix this by separating the logic (managed by the parent) from the visual layout (controlled by the consumer), which is how headless UI libraries like Radix and Headless UI work.",
    commonPitfalls: [
      "Forgetting to memoize Context values — this causes unnecessary re-renders for every child component",
      "Not throwing descriptive errors when child components are rendered outside their parent Context provider",
      "Over-engineering simple components — don't use this pattern for a simple Button; use it for complex, multi-part interactive widgets",
      "Making components too rigid by assuming a specific DOM structure inside the parent",
    ],
    examples: [
      {
        title: "The Problem: Prop Soup (Anti-pattern)",
        description:
          "Without compound components, you end up passing layout and configuration entirely through props, making the component rigid.",
        code: `// ❌ Rigid and hard to customize
<Accordion
  items={[
    { title: 'Item 1', content: 'Content 1' },
    { title: 'Item 2', content: 'Content 2' }
  ]}
  iconPosition="right"
  customIcon={<PlusIcon />}
  showBorders={true}
  className="my-accordion"
  onItemClick={...}
/>`,
        language: "tsx",
      },
      {
        title: "The Solution: Compound Components",
        description:
          "The same Accordion using compound components. The user has full control over the layout and structure.",
        code: `// ✅ Flexible, semantic, and easy to read
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <span>Item 1</span>
      <PlusIcon />
    </Accordion.Header>
    <Accordion.Panel>
      <p>Content 1</p>
    </Accordion.Panel>
  </Accordion.Item>
  
  <Accordion.Item value="item-2">
    <Accordion.Header>Item 2</Accordion.Header>
    <Accordion.Panel>Content 2</Accordion.Panel>
  </Accordion.Item>
</Accordion>`,
        language: "tsx",
      },
      {
        title: "Implementing a Tabs Component",
        description:
          "Using React Context to share state implicitly between Tabs, Tabs.List, and Tabs.Panel.",
        code: `import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Create Context
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Custom hook with safety check
function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be rendered within <Tabs>');
  return context;
}

// 2. Parent Component (Provider)
function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  // Memoize value to prevent unnecessary re-renders
  const value = { activeTab, setActiveTab };

  return (
    <TabsContext.Provider value={value}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
}

// 3. Child Components
function TabsList({ children }: { children: ReactNode }) {
  return <div className="tabs-list flex gap-2 border-b">{children}</div>;
}

function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={\`px-4 py-2 \${isActive ? 'border-b-2 border-blue-500 font-bold' : ''}\`}
    >
      {children}
    </button>
  );
}

function TabsPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return <div className="tabs-panel p-4">{children}</div>;
}

// 4. Attach children to parent namespace
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panel = TabsPanel;

export { Tabs };`,
        language: "tsx",
      },
    ],
  },
};
