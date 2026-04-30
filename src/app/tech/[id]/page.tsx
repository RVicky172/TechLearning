"use client";

import { motion } from "framer-motion";
import { technologies } from "@/data/technologies";
import type { TopicNode } from "@/data/types";
import { use, createElement, type ComponentType } from "react";
import * as Icons from "lucide-react";
import { ExternalLink, CheckCircle, ChevronRight, BookOpen } from "lucide-react";

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

export default function TechPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tech = technologies.find(t => t.id === resolvedParams.id);

  if (!tech) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-neutral-400">Technology not found.</h1>
      </div>
    );
  }

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
          <p className="text-neutral-400 text-sm leading-relaxed mb-5">
            Follow this structured learning path step by step. Each section builds on the last — track your progress topic by topic and explore curated resources.
          </p>
          <a
            href={`#${tech.tree[0]?.id}`}
            className="inline-flex items-center text-sm font-medium text-(--accent-fg) hover:text-(--accent-fg) opacity-90 hover:opacity-100 transition-opacity"
          >
            Start learning <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Decorative code block */}
        <div className="shrink-0 bg-(--bg-code) rounded-xl border border-(--border) p-5 font-mono text-xs w-full md:w-60 shadow-2xl">
          <div className="text-(--text-3) text-[10px] uppercase tracking-wider mb-3">learning-path.ts</div>
          <div className="space-y-2 text-(--text-2)">
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
            <motion.a
              key={node.id}
              href={`#${node.id}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.14 + i * 0.07 }}
              className="group block bg-(--bg-surface) border border-(--border) hover:border-(--border-hover) rounded-xl p-6 transition-all duration-200 hover:bg-(--bg-elevated)"
            >
              <div className="mb-3">
                <DynamicIcon name={node.iconName} fallback={BookOpen} className="w-5 h-5 text-(--text-3) group-hover:text-(--accent-fg) transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-(--text-1) mb-2 group-hover:text-(--text-1) transition-colors">
                {node.title}
              </h3>
              {node.theory && (
                <p className="text-(--text-3) text-xs leading-relaxed line-clamp-3">{node.theory}</p>
              )}
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Detailed topic sections */}
      <div className="space-y-20">
        {tech.tree.map((node) => (
          <TopicSection key={node.id} node={node} />
        ))}
      </div>

    </main>
  );
}

function TopicSection({ node }: { node: TopicNode }) {
  return (
    <motion.section
      id={node.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Section header */}
      <div className="mb-7 pb-5 border-b border-(--border)">
        <div className="flex items-center gap-3 mb-2">
          <DynamicIcon name={node.iconName} className="w-5 h-5 text-(--accent-fg)" />
          <h2 className="text-2xl font-bold text-(--text-1)">{node.title}</h2>
        </div>
        {node.theory && (
          <p className="text-(--text-2) text-sm leading-relaxed max-w-2xl">{node.theory}</p>
        )}
        {node.link && (
          <a
            href={node.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-(--accent-fg) hover:text-(--accent-fg) mt-3 opacity-80 hover:opacity-100 transition-opacity"
          >
            View resource <ExternalLink className="w-3 h-3 ml-1.5" />
          </a>
        )}
        {node.theoryDetail && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {node.theoryDetail.keyConcepts && node.theoryDetail.keyConcepts.length > 0 && (
              <div className="bg-(--accent-subtle) border border-(--accent-subtle) rounded-xl p-5 md:p-6">
                <h4 className="text-xs font-semibold text-(--accent-fg) uppercase tracking-wider mb-4">Key Concepts</h4>
                <ul className="space-y-3">
                  {node.theoryDetail.keyConcepts.map((c, i) => (
                    <li key={i} className="text-sm text-(--text-2) flex items-start gap-2 leading-relaxed">
                      <span className="text-(--accent-fg) mt-1 shrink-0">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {node.theoryDetail.whyItMatters && (
              <div className="bg-(--success-subtle) border border-(--success-subtle) rounded-xl p-5 md:p-6">
                <h4 className="text-xs font-semibold text-(--success) uppercase tracking-wider mb-4">Why it Matters</h4>
                <p className="text-sm text-(--text-2) leading-relaxed">{node.theoryDetail.whyItMatters}</p>
              </div>
            )}
            {node.theoryDetail.commonPitfalls && node.theoryDetail.commonPitfalls.length > 0 && (
              <div className="bg-(--warning-subtle) border border-(--warning-subtle) rounded-xl p-5 md:p-6">
                <h4 className="text-xs font-semibold text-(--warning) uppercase tracking-wider mb-4">Common Pitfalls</h4>
                <ul className="space-y-3">
                  {node.theoryDetail.commonPitfalls.map((p, i) => (
                    <li key={i} className="text-sm text-(--text-2) flex items-start gap-2 leading-relaxed">
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

      {/* Child cards — single column, full-width, spacious */}
      {node.children && node.children.length > 0 && (
        <div className="space-y-5">
          {node.children.map((child, ci) => (
            <motion.div
              key={child.id}
              id={child.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.07 }}
              className="bg-(--bg-surface) border border-(--border) hover:border-(--border-hover) rounded-xl p-7 md:p-8 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <DynamicIcon name={child.iconName} className="w-5 h-5 text-(--text-3) shrink-0" />
                <h4 className="text-base font-semibold text-(--text-1)">
                  {child.title}
                </h4>
                {child.completed && <CheckCircle className="w-4 h-4 text-(--success) shrink-0" />}
              </div>
              {child.theory && (
                <p className="text-(--text-2) text-sm leading-relaxed mb-5">{child.theory}</p>
              )}
              {(child.theoryDetail?.keyConcepts || child.theoryDetail?.commonPitfalls) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  {child.theoryDetail?.keyConcepts && child.theoryDetail.keyConcepts.length > 0 && (
                    <div className="bg-(--accent-subtle) border border-(--accent-subtle) rounded-lg p-4">
                      <span className="text-xs font-semibold text-(--accent-fg) uppercase tracking-wider">Key Concepts</span>
                      <ul className="mt-3 space-y-2.5">
                        {child.theoryDetail.keyConcepts.map((c, i) => (
                          <li key={i} className="text-sm text-(--text-2) flex items-start gap-2 leading-relaxed">
                            <span className="text-(--accent-fg) mt-1 shrink-0">•</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {child.theoryDetail?.commonPitfalls && child.theoryDetail.commonPitfalls.length > 0 && (
                    <div className="bg-(--warning-subtle) border border-(--warning-subtle) rounded-lg p-4">
                      <span className="text-xs font-semibold text-(--warning) uppercase tracking-wider">Common Pitfalls</span>
                      <ul className="mt-3 space-y-2.5">
                        {child.theoryDetail.commonPitfalls.map((p, i) => (
                          <li key={i} className="text-sm text-(--text-2) flex items-start gap-2 leading-relaxed">
                            <span className="text-(--warning) mt-1 shrink-0">⚠</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {child.link && (
                <a
                  href={child.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-(--accent-fg) hover:text-(--accent-fg) opacity-80 hover:opacity-100 transition-opacity"
                >
                  Study material <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
