"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { technologies } from "@/data/technologies";
import * as Icons from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-20 max-w-6xl">
      {/* Hero Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14 rounded-2xl bg-(--bg-surface) border border-(--border) p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
      >
        <div className="z-10 max-w-lg mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-(--text-1)">
            Get started with learning trees
          </h1>
          <p className="text-(--text-2) text-lg mb-6 leading-relaxed">
            Hand off tasks to autonomous learning paths that iterate until you master a domain. Work locally, at your own pace, and track your progress without leaving this site.
          </p>
          <a href="#" className="text-(--accent-fg) hover:text-(--accent-fg) font-medium inline-flex items-center opacity-90 hover:opacity-100">
            Get started <Icons.ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Decorative Graphic to mimic the "Agents" UI */}
        <div className="relative z-10 w-full md:w-auto bg-(--bg-code) p-4 rounded-xl border border-(--border) shadow-2xl shrink-0">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-2 mb-2">
            <span className="text-xs text-(--text-3) flex items-center"><Icons.Terminal className="w-3 h-3 mr-2"/> Setup.tsx</span>
          </div>
          <div className="text-sm text-(--text-2) font-mono space-y-2">
             <div><span className="text-(--accent-fg)">const</span> path = <span className="text-green-400">&quot;Mastery&quot;</span>;</div>
             <div><span className="text-(--accent-fg)">await</span> ai.teach(path);</div>
          </div>
        </div>

        {/* Background gentle gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-(--accent-subtle) blur-[100px] rounded-full pointer-events-none" />
      </motion.div>

      {/* Grid section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-(--text-1) tracking-tight">What do you want to learn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, i) => {
            return (
              <Link href={`/tech/${tech.id}`} key={tech.id} className="block group h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-(--bg-surface) rounded-xl p-6 border border-(--border) transition-all duration-300 hover:border-(--border-hover) hover:bg-(--bg-elevated) h-full flex flex-col"
                >
                  <div className="mb-4">
                    <i className={`${tech.deviconClass} text-4xl`} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--text-1) mb-2">{tech.name}</h3>
                  <p className="text-(--text-2) text-sm leading-relaxed">
                    {tech.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
      
    </main>
  );
}
