"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { technologies } from "@/data/technologies";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState, useTransition } from "react";
import { TechnologyIcon } from "@/components/TechnologyIcon";
import { SidebarTreeNode } from "@/components/SidebarTreeNode";
import { TechCategoryList } from "@/components/TechCategoryList";
import { buildTopicParentMap } from "@/components/sidebarUtils";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get("topic");
  const techMatch = pathname.match(/^\/tech\/([^/]+)/);
  const currentTechId = techMatch?.[1];
  const currentTech = useMemo(
    () => (currentTechId ? technologies.find(t => t.id === currentTechId) : null),
    [currentTechId],
  );
  const topicParentMap = useMemo(
    () => (currentTech ? buildTopicParentMap(currentTech.tree) : new Map<string, string>()),
    [currentTech],
  );
  const activeParentId = activeTopic ? topicParentMap.get(activeTopic) ?? null : null;

  const [manualExpandedId, setManualExpandedId] = useState<string | null | undefined>(() => {
    return activeParentId;
  });
  const [manualTopic, setManualTopic] = useState<string | null>(activeTopic);
  const [isPending, startTransition] = useTransition();

  if (activeTopic !== manualTopic) {
    setManualTopic(activeTopic);
    setManualExpandedId(undefined);
  }

  const expandedId = manualExpandedId ?? activeParentId;

  const handleToggle = useCallback((id: string) => {
    startTransition(() => {
      setManualExpandedId(prev => {
        const baseExpandedId = prev ?? activeParentId;
        return baseExpandedId === id ? null : id;
      });
    });
  }, [activeParentId, startTransition]);

  return (
    <aside aria-busy={isPending} className="sidebar-scroll fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-(--sidebar-w,16rem) md:block overflow-y-auto border-r border-(--border) bg-(--bg-root) py-5 px-2">
      {currentTech ? (
        <div>
          <div className="px-2 mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-(--text-3) hover:text-(--text-2) transition-colors mb-4"
            >
              <ArrowLeft className="w-3 h-3" /> All Technologies
            </Link>
            <div className="flex items-center gap-2">
              <TechnologyIcon technology={currentTech} size="sm" />
              <p className="text-xs font-semibold text-(--text-2) uppercase tracking-wider">{currentTech.name}</p>
            </div>
          </div>

          <ul className="space-y-0.5">
            <li>
              <Link
                href={`/tech/${currentTech.id}`}
                className="flex items-center px-2 py-1.5 text-sm text-(--accent-fg) hover:text-(--accent-fg) hover:bg-(--bg-elevated) rounded transition-colors"
              >
                Overview
              </Link>
            </li>
            {currentTech.tree.map(node => (
              <SidebarTreeNode
                key={node.id}
                node={node}
                depth={0}
                techId={currentTechId!}
                activeTopic={activeTopic}
                onToggle={handleToggle}
                expandedId={expandedId}
              />
            ))}
          </ul>
        </div>
      ) : (
        <TechCategoryList />
      )}
    </aside>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<aside className="sidebar-scroll fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-(--sidebar-w,16rem) md:block overflow-y-auto border-r border-(--border) bg-(--bg-root) py-5 px-2" />}>
      <SidebarContent />
    </Suspense>
  );
}