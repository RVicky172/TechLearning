"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import { technologies, techCategories } from "@/data/technologies";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, createElement, type ComponentType, Suspense } from "react";
import type { TopicNode } from "@/data/types";
import { TechnologyIcon } from "@/components/TechnologyIcon";
import styles from "./Sidebar.module.css";

type LucideIcon = ComponentType<{ className?: string }>;
const sidebarIconMap = Icons as unknown as Record<string, LucideIcon | undefined>;
function SidebarIcon({ name, className }: { name: string; className: string }) {
  const Icon = sidebarIconMap[name];
  if (!Icon) return null;
  return createElement(Icon, { className });
}

/** Recursively check if a node or any of its descendants has the given id */
function treeContainsTopic(node: TopicNode, topicId: string): boolean {
  if (node.id === topicId) return true;
  return node.children?.some(child => treeContainsTopic(child, topicId)) ?? false;
}

function SidebarTreeNode({ node, depth = 0, techId, activeTopic, onToggle, expandedId }: { node: TopicNode; depth?: number; techId: string; activeTopic: string | null; onToggle?: (id: string) => void; expandedId?: string | null }) {
  const isActive = node.id === activeTopic;
  const isExpanded = depth === 0 ? expandedId === node.id : true;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li>
      <div
        className={`flex items-center gap-2 rounded transition-colors ${isActive ? styles.treeItemActive : "hover:bg-(--bg-elevated)"} ${styles.treeItem}`}
        data-depth={depth}
      >
        <Link
          href={`/tech/${techId}?topic=${node.id}`}
          onClick={() => {
            if (hasChildren && depth === 0) {
              onToggle?.(node.id);
            }
          }}
          className={`flex-1 flex items-center gap-2 py-1.5 text-sm transition-colors min-w-0 ${isActive ? "text-(--accent-fg) font-medium" : "text-(--text-2) hover:text-(--text-1)"}`}
        >
          {node.iconName && <SidebarIcon name={node.iconName} className="w-3.5 h-3.5 shrink-0 text-(--text-3)" />}
          <span className="truncate">{node.title}</span>
        </Link>
        {hasChildren && (
          <button
            onClick={() => depth === 0 && onToggle?.(node.id)}
            className="shrink-0 p-1 text-(--text-3) hover:text-(--text-1) transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <ul className="border-l border-(--border-subtle) ml-2">
          {node.children!.map(child => (
            <SidebarTreeNode key={child.id} node={child} depth={depth + 1} techId={techId} activeTopic={activeTopic} expandedId={expandedId} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Home-page sidebar: technologies grouped by category with collapsible sections. */
function TechCategoryList() {
  const techById = new Map(technologies.map(t => [t.id, t]));
  // All categories expanded by default
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="space-y-1">
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
            {!isCollapsed && (
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
            )}
          </div>
        );
      })}
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get("topic");
  const techMatch = pathname.match(/^\/tech\/([^/]+)/);
  const currentTechId = techMatch?.[1];
  const currentTech = currentTechId ? technologies.find(t => t.id === currentTechId) : null;
  // Compute initial expandedId from the URL's topic on first render
  const [expandedId, setExpandedId] = useState<string | null>(() => {
    if (!activeTopic || !currentTech) return null;
    const parentNode = currentTech.tree.find(node => treeContainsTopic(node, activeTopic));
    return parentNode?.id ?? null;
  });

  // Auto-expand when activeTopic changes via navigation (React-recommended
  // "adjust state during render" pattern — no useEffect needed)
  const [prevActiveTopic, setPrevActiveTopic] = useState<string | null>(activeTopic);
  if (activeTopic !== prevActiveTopic) {
    setPrevActiveTopic(activeTopic);
    if (activeTopic && currentTech) {
      const parentNode = currentTech.tree.find(node => treeContainsTopic(node, activeTopic));
      if (parentNode) {
        setExpandedId(parentNode.id);
      }
    }
  }

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <aside className="sidebar-scroll fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-(--sidebar-w,16rem) md:block overflow-y-auto border-r border-(--border) bg-(--bg-root) py-5 px-2">
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
              <SidebarTreeNode key={node.id} node={node} depth={0} techId={currentTechId!} activeTopic={activeTopic} onToggle={handleToggle} expandedId={expandedId} />
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