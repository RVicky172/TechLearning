import type { TopicNode } from "@/data/types";

export const stateStrategy: TopicNode = {
  id: "react-state-management-strategy",
  title: "State Management Strategy",
  iconName: "Map",
  link: "https://react.dev/learn/managing-state",
  theory:
    "Not all state is the same. Efficient React architecture comes from classifying state first: local UI state, shared client state, server state, and URL state. Choose tools based on ownership and lifetime, not popularity.",
  theoryDetail: {
    keyConcepts: [
      "Local UI state (component-only) usually belongs in useState/useReducer",
      "Shared client state (across distant components) can use Context or a state library",
      "Server state (API data) should use dedicated caching tools like TanStack Query",
      "URL state (filters, pagination, tabs) belongs in search params/router for shareable links",
    ],
    whyItMatters:
      "A clear state strategy prevents duplicate sources of truth, unnecessary re-renders, and synchronization bugs. Senior teams decide state location deliberately to keep features predictable and maintainable.",
    commonPitfalls: [
      "Storing server data in local component state and rebuilding caching manually",
      "Putting temporary UI state into global stores without need",
      "Keeping URL-driven filters only in memory, breaking deep links and refresh behavior",
      "Mirroring props into state without a lifecycle reason",
    ],
    examples: [
      {
        title: "State placement by concern",
        description: "Use the right storage location for each type of state.",
        code: `// Local UI state
const [isModalOpen, setModalOpen] = useState(false);

// URL state (shareable)
const searchParams = useSearchParams();
const page = Number(searchParams.get('page') ?? 1);

// Server state
const { data: users } = useQuery({
  queryKey: ['users', page],
  queryFn: () => fetchUsers(page),
});`,
        language: "tsx",
      },
    ],
  },
};
