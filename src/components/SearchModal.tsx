"use client";

import { useEffect, useRef, useState, useCallback, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen } from "lucide-react";
import { technologies } from "@/data/technologies";
import type { TopicNode } from "@/data/types";
import styles from "./SearchModal.module.css";

type SearchResult = {
  id: string;
  type: "technology" | "topic";
  techId: string;
  techName: string;
  title: string;
  description: string;
  href: string;
  deviconClass?: string;
};

function flattenTopics(
  nodes: TopicNode[],
  techId: string,
  techName: string,
  results: SearchResult[] = []
): SearchResult[] {
  for (const node of nodes) {
    results.push({
      id: `${techId}-${node.id}`,
      type: "topic",
      techId,
      techName,
      title: node.title,
      description: node.theory ?? "",
      href: `/tech/${techId}?topic=${node.id}`,
    });
    if (node.children) {
      flattenTopics(node.children, techId, techName, results);
    }
  }
  return results;
}

const allItems: SearchResult[] = [
  ...technologies.map(t => ({
    id: t.id,
    type: "technology" as const,
    techId: t.id,
    techName: t.name,
    title: t.name,
    description: t.description,
    href: `/tech/${t.id}`,
    deviconClass: t.deviconClass,
  })),
  ...technologies.flatMap(t => flattenTopics(t.tree, t.id, t.name)),
];

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Memoised so the keyboard effect dependency stays stable between renders
  const results = useMemo(
    () =>
      searchQuery.trim().length > 0
        ? allItems
            .filter(
              r =>
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 10)
        : [],
    [searchQuery]
  );

  // Since this component unmounts when open=false (see early return below),
  // state resets automatically on each open — no effect-based reset needed.

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected(s => Math.min(s + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected(s => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && results[selected]) {
        navigate(results[selected].href);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results, selected, navigate, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <Search className={styles.searchIcon} />
          <input
            ref={inputRef}
            autoFocus
            className={styles.input}
            placeholder="Search technologies and topics..."
            value={query}
            onChange={e => {
              const nextQuery = e.target.value;
              setQuery(nextQuery);
              setSelected(0);

              // Keep typing responsive while result filtering updates in the background.
              startTransition(() => {
                setSearchQuery(nextQuery);
              });
            }}
          />
          <button className={styles.closeBtn} onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {query.trim().length > 0 && isPending && (
          <div className={styles.pending}>Updating results...</div>
        )}

        {results.length > 0 && (
          <ul className={styles.results}>
            {results.map((r, i) => (
              <li key={r.id}>
                <button
                  className={`${styles.result} ${i === selected ? styles.resultSelected : ""}`}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => navigate(r.href)}
                >
                  <span className={styles.resultIcon}>
                    {r.type === "technology" && r.deviconClass ? (
                      <i className={`${r.deviconClass} text-xl`} />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </span>
                  <span className={styles.resultBody}>
                    <span className={styles.resultTitle}>{r.title}</span>
                    {r.type === "topic" && (
                      <span className={styles.resultMeta}>{r.techName}</span>
                    )}
                    {r.description && (
                      <span className={styles.resultDesc}>{r.description}</span>
                    )}
                  </span>
                  <span className={styles.resultType}>
                    {r.type === "technology" ? "Technology" : "Topic"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length > 0 && !isPending && results.length === 0 && (
          <div className={styles.empty}>
            No results for &quot;{query}&quot;
          </div>
        )}

        {query.trim().length === 0 && (
          <div className={styles.hint}>
            Search across technologies, topics, and concepts
          </div>
        )}
      </div>
    </div>
  );
}
