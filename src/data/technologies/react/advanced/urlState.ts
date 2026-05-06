import type { TopicNode } from "@/data/types";

export const urlState: TopicNode = {
  id: "react-url-state",
  title: "URL State Management",
  iconName: "Link",
  link: "https://nextjs.org/docs/app/api-reference/functions/use-search-params",
  theory:
    "The URL is a global state store that every React developer underuses. Filters, search queries, active tabs, sort orders, and pagination should live in the URL — not in useState. URL state is shareable (copy the URL, share the exact view), survives page refresh, supports the browser back/forward buttons, and enables deep linking. Senior developers default to URL state for anything that represents 'where the user is' in the app.",
  theoryDetail: {
    keyConcepts: [
      "useSearchParams() reads the current URL search params (?page=2&sort=price) — works in both Next.js and React Router",
      "useRouter().push() or router.replace() updates the URL without a page reload",
      "router.replace() vs router.push(): replace doesn't create a new browser history entry (better for filter changes)",
      "URL state is automatically serialized/deserialized as strings — parse numbers and booleans explicitly",
      "URL state is shared across all components that read the same param — no prop drilling needed",
    ],
    whyItMatters:
      "When state lives in useState, refreshing the page resets it. If a user on page 5 of search results for 'react hooks' refreshes, they land back on page 1. This breaks a fundamental web expectation. URL state is the standard for data tables, product filters, admin dashboards — any paginated or filterable content. It's also critical for SEO and analytics.",
    commonPitfalls: [
      "Storing everything in URL — modal open/closed, hover states, and animation states should stay in useState",
      "Forgetting to parse: searchParams.get('page') returns a string '2', not the number 2 — always parseInt()",
      "Using router.push() for filter changes — creates a new history entry for every filter, making the Back button unusable. Use router.replace()",
      "Not providing defaults: if the URL has no 'sort' param, fallback to a sensible default rather than rendering undefined",
      "Using client-side search params for SEO-critical content — prefer server-side params in Next.js Server Components for search-indexed pages",
    ],
    examples: [
      {
        title: "Product Filter with URL State",
        description:
          "A full e-commerce filter: search, category, sort, and page — all in the URL. Refreshing the page preserves the exact view. Sharing the URL gives someone the same filtered results.",
        code: `'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// Custom hook to manage all filter state through URL
function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from URL — always provide a default
  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const sort = (searchParams.get('sort') ?? 'relevance') as 'relevance' | 'price' | 'rating';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  // Update one param while preserving others
  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page to 1 when any filter changes
    if (key !== 'page') params.set('page', '1');

    // replace — don't pollute browser history for filter changes
    router.replace(\`?\${params.toString()}\`, { scroll: false });
  }, [router, searchParams]);

  return { search, category, sort, page, updateFilter };
}

// ── Component ──
function ProductFilters() {
  const { search, category, sort, page, updateFilter } = useProductFilters();

  return (
    <div>
      <input
        value={search}
        onChange={e => updateFilter('q', e.target.value)}
        placeholder="Search products..."
      />

      <select value={category} onChange={e => updateFilter('category', e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select value={sort} onChange={e => updateFilter('sort', e.target.value)}>
        <option value="relevance">Most Relevant</option>
        <option value="price">Price: Low to High</option>
        <option value="rating">Highest Rated</option>
      </select>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => updateFilter('page', String(page - 1))}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => updateFilter('page', String(page + 1))}>
          Next
        </button>
      </div>

      {/* Share this URL and recipients see the exact same filtered view */}
      <small>URL: /products?q={search}&category={category}&sort={sort}&page={page}</small>
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "Tab Navigation in URL",
        description:
          "Active tabs should live in the URL so users can share links to specific tabs and the Back button works as expected.",
        code: `'use client';
import { useRouter, useSearchParams } from 'next/navigation';

type Tab = 'overview' | 'activity' | 'settings' | 'billing';

function UserDashboard({ userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') ?? 'overview') as Tab;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' },
  ];

  const switchTab = (tab: Tab) => {
    // replace: switching tabs shouldn't spam browser history
    router.replace(\`/users/\${userId}?tab=\${tab}\`);
  };

  return (
    <div>
      <nav role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => switchTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section role="tabpanel">
        {activeTab === 'overview' && <OverviewPanel userId={userId} />}
        {activeTab === 'activity' && <ActivityPanel userId={userId} />}
        {activeTab === 'settings' && <SettingsPanel userId={userId} />}
        {activeTab === 'billing' && <BillingPanel userId={userId} />}
      </section>
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "When NOT to Use URL State",
        description:
          "URL state is not appropriate for everything. Use this mental model to decide.",
        code: `// ✅ SHOULD be in URL — sharable, survives refresh, back button works
const searchQuery = searchParams.get('q');
const page = parseInt(searchParams.get('page') ?? '1');
const activeTab = searchParams.get('tab') ?? 'overview';
const sortOrder = searchParams.get('sort') ?? 'date';
const selectedFilters = searchParams.getAll('filter'); // multiple values

// ❌ SHOULD NOT be in URL — ephemeral, UI-only, not shareable
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isHovered, setIsHovered] = useState(false);
const [formValues, setFormValues] = useState({ name: '', email: '' });
const [animationState, setAnimationState] = useState('idle');

// The mental model:
// Ask "Would another user want to see the same thing if I sent them this URL?"
// If yes → URL state
// If no → component state`,
        language: "tsx",
      },
    ],
  },
};
