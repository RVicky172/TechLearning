import { Activity, useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { technologies, techCategories } from "@/data/technologies";
import { TechnologyIcon } from "@/components/TechnologyIcon";
import styles from "./Sidebar.module.css";

export function TechCategoryList() {
  const techById = useMemo(() => new Map(technologies.map(t => [t.id, t])), []);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const toggle = useCallback((label: string) => {
    startTransition(() => {
      setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
    });
  }, [startTransition]);

  return (
    <div className="space-y-1" aria-busy={isPending}>
      {techCategories.map(category => {
        const isCollapsed = collapsed[category.label] ?? false;
        const techs = category.ids.map(id => techById.get(id)).filter(Boolean);

        if (techs.length === 0) return null;

        return (
          <div key={category.label}>
            <button
              onClick={() => toggle(category.label)}
              className={`${styles.categoryHeader} w-full flex items-center justify-between px-2 py-1.5 text-left`}
            >
              <span className="text-xs font-semibold text-(--text-3) uppercase tracking-wider">
                {category.label}
              </span>
              {isCollapsed
                ? <ChevronRight className="h-3 w-3 text-(--text-3)" />
                : <ChevronDown className="h-3 w-3 text-(--text-3)" />}
            </button>

            <Activity mode={isCollapsed ? "hidden" : "visible"} name={`category-${category.label}`}>
              <ul className="space-y-0.5 text-sm mb-1">
                {techs.map(tech => (
                  <li key={tech!.id}>
                    <Link
                      href={`/tech/${tech!.id}`}
                      className="text-(--text-2) hover:text-(--text-1) flex items-center gap-2 px-2 py-1.5 rounded hover:bg-(--bg-elevated) transition-colors"
                    >
                      <TechnologyIcon technology={tech!} size="sm" />
                      <span className="flex-1">{tech!.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-(--text-3) shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Activity>
          </div>
        );
      })}
    </div>
  );
}
