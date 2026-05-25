import { Activity, createElement, memo, type ComponentType } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { TopicNode } from "@/data/types";
import styles from "./Sidebar.module.css";

type LucideIcon = ComponentType<{ className?: string }>;
const sidebarIconMap = Icons as unknown as Record<string, LucideIcon | undefined>;

function SidebarIcon({ name, className }: { name: string; className: string }) {
  const Icon = sidebarIconMap[name];
  if (!Icon) return null;

  return createElement(Icon, { className });
}

type SidebarTreeNodeProps = {
  node: TopicNode;
  depth?: number;
  techId: string;
  activeTopic: string | null;
  onToggle?: (id: string) => void;
  expandedId?: string | null;
};

export const SidebarTreeNode = memo(function SidebarTreeNode({
  node,
  depth = 0,
  techId,
  activeTopic,
  onToggle,
  expandedId,
}: SidebarTreeNodeProps) {
  const isActive = node.id === activeTopic;
  const isExpanded = depth === 0 ? expandedId === node.id : true;
  const hasChildren = Boolean(node.children?.length);

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
      {hasChildren && (
        <Activity mode={isExpanded ? "visible" : "hidden"} name={`sidebar-${node.id}`}>
          <ul className="border-l border-(--border-subtle) ml-2">
            {node.children!.map(child => (
              <SidebarTreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                techId={techId}
                activeTopic={activeTopic}
                expandedId={expandedId}
              />
            ))}
          </ul>
        </Activity>
      )}
    </li>
  );
});
