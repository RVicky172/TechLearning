"use client";

import { motion } from "framer-motion";
import { technologies } from "@/data/technologies";
import type { TopicNode } from "@/data/types";
import { use } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ExternalLink, CheckCircle, ChevronRight, BookOpen } from "lucide-react";

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
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-16 max-w-5xl">

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-3">
          <i className={`${tech.deviconClass} text-5xl md:text-6xl`} />
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {tech.name} documentation
          </h1>
        </div>
        <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl">{tech.description}</p>
      </motion.div>

      {/* Hero banner — "Get started" style */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mb-12 rounded-xl bg-[#0f111a] border border-neutral-800 p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="z-10 max-w-lg">
          <h2 className="text-2xl font-bold text-white mb-3">
            Get started with {tech.name}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-5">
            Follow this structured learning path step by step. Each section builds on the last — track your progress topic by topic and explore curated resources.
          </p>
          <a
            href={`#${tech.tree[0]?.id}`}
            className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Start learning <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Decorative code block */}
        <div className="flex-shrink-0 bg-[#1e1e1e] rounded-xl border border-neutral-700 p-5 font-mono text-xs w-full md:w-60 shadow-2xl">
          <div className="text-neutral-600 text-[10px] uppercase tracking-wider mb-3">learning-path.ts</div>
          <div className="space-y-2 text-neutral-300">
            <div><span className="text-blue-400">const</span> path = <span className="text-green-400">"{tech.name}"</span>;</div>
            <div><span className="text-blue-400">await</span> <span className="text-yellow-300">learn</span>(path);</div>
            <div className="text-emerald-400">{"// ✓ Mastery unlocked"}</div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>

      {/* "What do you want to learn?" grid */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.14 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">What do you want to learn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tech.tree.map((node, i) => (
            <motion.a
              key={node.id}
              href={`#${node.id}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.14 + i * 0.07 }}
              className="group block bg-[#0f111a] border border-neutral-800 hover:border-neutral-600 rounded-xl p-6 transition-all duration-200 hover:bg-[#1a1c23]"
            >
              <div className="mb-3">
                {(() => { const Icon = node.iconName ? (Icons as any)[node.iconName] : BookOpen; return <Icon className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors" />; })()}
              </div>
              <h3 className="text-sm font-semibold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                {node.title}
              </h3>
              {node.theory && (
                <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3">{node.theory}</p>
              )}
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Detailed topic sections */}
      <div className="space-y-20">
        {tech.tree.map((node, i) => (
          <TopicSection key={node.id} node={node} index={i} />
        ))}
      </div>

    </main>
  );
}

function TopicSection({ node, index }: { node: TopicNode; index: number }) {
  return (
    <motion.section
      id={node.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Section header */}
      <div className="mb-7 pb-5 border-b border-neutral-800">
        <div className="flex items-center gap-3 mb-2">
          {(() => { const Icon = node.iconName ? (Icons as any)[node.iconName] : null; return Icon ? <Icon className="w-5 h-5 text-blue-400" /> : null; })()}
          <h2 className="text-2xl font-bold text-white">{node.title}</h2>
        </div>
        {node.theory && (
          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">{node.theory}</p>
        )}
        {node.link && (
          <a
            href={node.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 mt-3 transition-colors"
          >
            View resource <ExternalLink className="w-3 h-3 ml-1.5" />
          </a>
        )}
      </div>

      {/* Child cards — 2-column grid, VS Code docs style */}
      {node.children && node.children.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {node.children.map((child, ci) => (
            <motion.div
              key={child.id}
              id={child.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.07 }}
              className="bg-[#0f111a] border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 transition-colors"
            >
              <h4 className="text-sm font-semibold text-neutral-100 mb-2 flex items-center gap-2">
                {(() => { const Icon = child.iconName ? (Icons as any)[child.iconName] : null; return Icon ? <Icon className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" /> : null; })()}
                {child.title}
                {child.completed && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
              </h4>
              {child.theory && (
                <p className="text-neutral-400 text-xs leading-relaxed mb-3">{child.theory}</p>
              )}
              {child.link && (
                <a
                  href={child.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Study material <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
