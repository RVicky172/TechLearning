"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import { technologies } from "@/data/technologies";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { TopicNode } from "@/data/types";
function SidebarTreeNode({ node, depth = 0 }: { node: TopicNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li>
      <a
        href={`#${node.id}`}
        onClick={() => hasChildren && setOpen(o => !o)}
        className="w-full text-left flex items-center gap-2 py-1.5 rounded text-sm transition-colors text-neutral-300 hover:text-white hover:bg-neutral-800/60"
        style={{ paddingLeft: `${8 + depth * 14}px`, paddingRight: "8px" }}
      >
        {node.iconName && (() => {
          const Icon = (Icons as any)[node.iconName];
          return Icon ? <Icon className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" /> : null;
        })()}
        <span className="truncate flex-1">{node.title}</span>
        {hasChildren && (
          open
            ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
            : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
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
    <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-64 md:block overflow-y-auto border-r border-neutral-800 bg-[#0a0a0a] py-5 px-2">
      {currentTech ? (
        <div>
          <div className="px-2 mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-3 h-3" /> All Technologies
            </Link>
            <div className="flex items-center gap-2">
              <i className={`${currentTech.deviconClass} text-xl`} />
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">{currentTech.name}</p>
            </div>
          </div>

          <ul className="space-y-0.5">
            <li>
              <Link
                href={`/tech/${currentTech.id}`}
                className="flex items-center px-2 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-neutral-800/60 rounded transition-colors"
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
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-2">TECHNOLOGIES</h4>
            <ul className="space-y-0.5 text-sm">
              {technologies.map(tech => {
                return (
                  <li key={tech.id}>
                    <Link
                      href={`/tech/${tech.id}`}
                      className="text-neutral-300 hover:text-white flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-800/60 transition-colors"
                    >
                      <i className={`${tech.deviconClass} text-lg flex-shrink-0`} />
                      <span className="flex-1">{tech.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-40 flex-shrink-0" />
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