"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import { technologies } from "@/data/technologies";
import { usePathname } from "next/navigation";
import { useState, createElement, type ComponentType } from "react";
import type { TopicNode } from "@/data/types";
import styles from "./Sidebar.module.css";

type LucideIcon = ComponentType<{ className?: string }>;
const sidebarIconMap = Icons as unknown as Record<string, LucideIcon | undefined>;
function SidebarIcon({ name, className }: { name: string; className: string }) {
  const Icon = sidebarIconMap[name];
  if (!Icon) return null;
  return createElement(Icon, { className });
}
function SidebarTreeNode({ node, depth = 0 }: { node: TopicNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li>
      <a
        href={`#${node.id}`}
        onClick={() => hasChildren && setOpen(o => !o)}
        className={`w-full text-left flex items-center gap-2 py-1.5 rounded text-sm transition-colors text-(--text-2) hover:text-(--text-1) hover:bg-(--bg-elevated) ${styles.treeItem}`}
        data-depth={depth}
      >
        {node.iconName && <SidebarIcon name={node.iconName} className="w-3.5 h-3.5 shrink-0 text-(--text-3)" />}
        <span className="truncate flex-1">{node.title}</span>
        {hasChildren && (
          open
            ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-(--text-3)" />
            : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-(--text-3)" />
        )}
      </a>
      {hasChildren && open && (
        <ul>
          {node.children!.map(child => (
            <SidebarTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const techMatch = pathname.match(/^\/tech\/([^/]+)/);
  const currentTechId = techMatch?.[1];
  const currentTech = currentTechId ? technologies.find(t => t.id === currentTechId) : null;

  return (
    <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-64 md:block overflow-y-auto border-r border-(--border) bg-(--bg-root) py-5 px-2">
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
              <i className={`${currentTech.deviconClass} text-xl`} />
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
              <SidebarTreeNode key={node.id} node={node} depth={0} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-(--text-3) uppercase tracking-wider mb-2 px-2">TECHNOLOGIES</h4>
            <ul className="space-y-0.5 text-sm">
              {technologies.map(tech => {
                return (
                  <li key={tech.id}>
                    <Link
                      href={`/tech/${tech.id}`}
                      className="text-(--text-2) hover:text-(--text-1) flex items-center gap-2 px-2 py-1.5 rounded hover:bg-(--bg-elevated) transition-colors"
                    >
                      <i className={`${tech.deviconClass} text-lg shrink-0`} />
                      <span className="flex-1">{tech.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-(--text-3) shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}