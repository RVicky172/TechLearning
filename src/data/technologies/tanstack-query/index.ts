import type { Technology } from "@/data/types";
import { tanstackFundamentals } from "@/data/technologies/tanstack-query/fundamentals";
import { tanstackMutations } from "@/data/technologies/tanstack-query/mutations";
import { tanstackAdvanced } from "@/data/technologies/tanstack-query/advanced";

const tanstackQuery: Technology = {
  id: "tanstack-query",
  name: "TanStack Query",
  description:
    "Async state management for React — server-state caching, background sync, mutations, and infinite scroll.",
  color: "bg-orange-500",
  iconName: "RefreshCw",
  deviconClass: "devicon-reactquery-plain colored",
  tree: [tanstackFundamentals, tanstackMutations, tanstackAdvanced],
};

export default tanstackQuery;
