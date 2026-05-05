"use client";

import { motion } from "framer-motion";
import { technologies } from "@/data/technologies";
import type { TopicNode, Technology } from "@/data/types";
import { use, createElement, Suspense, type ComponentType } from "react";
import * as Icons from "lucide-react";
import { ExternalLink, CheckCircle, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CodeBlock } from "@/components/CodeBlock";
import dynamic from "next/dynamic";

const HookDemoRenderer = dynamic(
  () => import("@/components/react-hooks/HookDemoRenderer").then(m => m.HookDemoRenderer),
  { ssr: false }
);

type LucideIcon = ComponentType<{ className?: string }>;
const iconMap = Icons as unknown as Record<string, LucideIcon | undefined>;
function getIcon(name: string | undefined): LucideIcon | null {
  return name ? (iconMap[name] ?? null) : null;
}

function DynamicIcon({
  name,
  fallback: Fallback,
  className,
}: {
  name?: string;
  fallback?: LucideIcon;
  className: string;
}) {
  const Icon = getIcon(name) ?? Fallback;
  if (!Icon) return null;
  return createElement(Icon, { className });
}

function findTopic(nodes: TopicNode[], id: string): TopicNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findTopic(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export default function TechPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tech = technologies.find(t => t.id === resolvedParams.id);

  if (!tech) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-(--text-3)">Technology not found.</h1>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <TechPageContent tech={tech} />
    </Suspense>
  );
}

function TechPageContent({ tech }: { tech: Technology }) {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const selectedTopic = topicId ? findTopic(tech.tree, topicId) : null;

  if (selectedTopic) {
    return (
      <main className="min-h-screen px-6 py-12 md:px-12 lg:px-20 max-w-6xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center gap-2 text-sm"
        >
          <Link
            href={`/tech/${tech.id}`}
            className="text-(--text-3) hover:text-(--text-1) transition-colors"
          >
            {tech.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-(--text-3)" />
          <span className="text-(--text-1) font-medium">{selectedTopic.title}</span>
        </motion.div>
        <TopicSection node={selectedTopic} techId={tech.id} />
      </main>
    );
  }

  // ── Overview ─────────────────────────────────────────────────
  return (
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-20 max-w-6xl">

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-3">
          <i className={`${tech.deviconClass} text-5xl md:text-6xl`} />
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-1) tracking-tight">
            {tech.name} documentation
          </h1>
        </div>
        <p className="text-lg text-(--text-2) leading-relaxed max-w-2xl">{tech.description}</p>
      </motion.div>

      {/* Hero banner — "Get started" style */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mb-12 rounded-xl bg-(--bg-surface) border border-(--border) p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="z-10 max-w-lg">
          <h2 className="text-2xl font-bold text-(--text-1) mb-3">
            Get started with {tech.name}
          </h2>
          <p className="text-(--text-2) text-sm leading-relaxed mb-5">
            Follow this structured learning path step by step. Each section builds on the last — track your progress topic by topic and explore curated resources.
          </p>
          <Link
            href={`/tech/${tech.id}?topic=${tech.tree[0]?.id}`}
            className="inline-flex items-center text-sm font-medium text-(--accent-fg) opacity-90 hover:opacity-100 transition-opacity"
          >
            Start learning <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Decorative code block */}
        <div className="shrink-0 bg-(--bg-code) rounded-xl border border-(--border) p-5 font-mono text-xs w-full md:w-60 shadow-2xl">
          <div className="text-(--text-3) text-[10px] uppercase tracking-wider mb-3">learning-path.ts</div>
          <div className="space-y-2 text-(--text-code)">
            <div><span className="text-(--accent-fg)">const</span> path = <span className="text-green-400">&quot;{tech.name}&quot;</span>;</div>
            <div><span className="text-(--accent-fg)">await</span> <span className="text-yellow-300">learn</span>(path);</div>
            <div className="text-emerald-400">{"// ✓ Mastery unlocked"}</div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-(--accent-subtle) blur-[100px] rounded-full pointer-events-none" />
      </motion.div>

      {/* "What do you want to learn?" grid */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.14 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-(--text-1) tracking-tight mb-6">What do you want to learn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tech.tree.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.14 + i * 0.07 }}
            >
              <Link
                href={`/tech/${tech.id}?topic=${node.id}`}
                className="group block bg-(--bg-surface) border border-(--border) hover:border-(--border-hover) rounded-xl p-6 transition-all duration-200 hover:bg-(--bg-elevated) h-full"
              >
                <div className="mb-3">
                  <DynamicIcon name={node.iconName} fallback={BookOpen} className="w-5 h-5 text-(--text-3) group-hover:text-(--accent-fg) transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-(--text-1) mb-2">
                  {node.title}
                </h3>
                {node.theory && (
                  <p className="text-(--text-3) text-xs leading-relaxed line-clamp-3">{node.theory}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </main>
  );
}

function TopicSection({ node, techId }: { node: TopicNode; techId: string }) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <motion.section
      id={node.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-7 pb-5 border-b border-(--border)">
        <div className="flex items-center gap-3 mb-2">
          <DynamicIcon name={node.iconName} className="w-5 h-5 text-(--accent-fg)" />
          <h2 className="text-2xl font-bold text-(--text-1)">{node.title}</h2>
        </div>
        {node.theory && (
          <p className="text-(--text-2) text-sm leading-relaxed max-w-2xl">{node.theory}</p>
        )}
        {/* External link — only for leaf topics (no children) */}
        {!hasChildren && node.link && (
          <a
            href={node.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-(--accent-fg) mt-3 opacity-80 hover:opacity-100 transition-opacity"
          >
            View resource <ExternalLink className="w-3 h-3 ml-1.5" />
          </a>
        )}
        {node.theoryDetail && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {node.theoryDetail.keyConcepts && node.theoryDetail.keyConcepts.length > 0 && (
              <div className="min-w-0 bg-(--accent-subtle) border border-(--accent-subtle) rounded-xl p-5 md:p-6">
                <h4 className="text-xs font-semibold text-(--accent-fg) uppercase tracking-wider mb-4">Key Concepts</h4>
                <ul className="space-y-3">
                  {node.theoryDetail.keyConcepts.map((c, i) => (
                    <li key={i} className="min-w-0 text-sm text-(--text-2) flex items-start gap-2 leading-relaxed">
                      <span className="text-(--accent-fg) mt-1 shrink-0">•</span>
                      <span className="min-w-0 flex-1 wrap-anywhere whitespace-normal">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {node.theoryDetail.whyItMatters && (
              <div className="min-w-0 bg-(--success-subtle) border border-(--success-subtle) rounded-xl p-5 md:p-6">
                <h4 className="text-xs font-semibold text-(--success) uppercase tracking-wider mb-4">Why it Matters</h4>
                <p className="text-sm text-(--text-2) leading-relaxed wrap-anywhere">{node.theoryDetail.whyItMatters}</p>
              </div>
            )}
            {node.theoryDetail.commonPitfalls && node.theoryDetail.commonPitfalls.length > 0 && (
              <div className="min-w-0 bg-(--warning-subtle) border border-(--warning-subtle) rounded-xl p-5 md:p-6">
                <h4 className="text-xs font-semibold text-(--warning) uppercase tracking-wider mb-4">Common Pitfalls</h4>
                <ul className="space-y-3">
                  {node.theoryDetail.commonPitfalls.map((p, i) => (
                    <li key={i} className="text-sm text-(--text-2) flex items-start gap-2 leading-relaxed wrap-anywhere">
                      <span className="text-(--warning) mt-1 shrink-0">⚠</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Children — clickable summary cards (section view) */}
      {hasChildren && (
        <div className="space-y-4">
          {node.children!.map((child, ci) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: ci * 0.07 }}
            >
              <Link
                href={`/tech/${techId}?topic=${child.id}`}
                className="group flex items-start gap-4 bg-(--bg-surface) border border-(--border) hover:border-(--border-hover) rounded-xl p-6 md:p-7 transition-colors"
              >
                <div className="shrink-0 mt-0.5">
                  <DynamicIcon name={child.iconName} className="w-5 h-5 text-(--text-3) group-hover:text-(--accent-fg) transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-base font-semibold text-(--text-1)">{child.title}</h4>
                    {child.completed && <CheckCircle className="w-4 h-4 text-(--success) shrink-0" />}
                  </div>
                  {child.theory && (
                    <p className="text-(--text-2) text-sm leading-relaxed line-clamp-2">{child.theory}</p>
                  )}
                </div>
                <ChevronRight className="shrink-0 w-4 h-4 text-(--text-3) group-hover:text-(--accent-fg) transition-colors mt-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Examples — only for leaf topics (no children) */}
      {!hasChildren && node.theoryDetail?.examples && node.theoryDetail.examples.length > 0 && (
        <div className="mt-8 space-y-5">
          <h3 className="text-lg font-semibold text-(--text-1)">Examples</h3>
          {node.theoryDetail.examples.map((example, i) => (
            <div key={i} className="bg-(--bg-surface) border border-(--border) rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-(--border)">
                <h4 className="text-sm font-semibold text-(--text-1)">{example.title}</h4>
                {example.description && (
                  <p className="text-xs text-(--text-2) mt-1 leading-relaxed">{example.description}</p>
                )}
              </div>
              <CodeBlock code={example.code} language={example.language} />
            </div>
          ))}
        </div>
      )}

      {!hasChildren && techId === "react" && node.demoComponentKey && (
        <HookDemoRenderer demoKey={node.demoComponentKey} />
      )}
    </motion.section>
  );
}
