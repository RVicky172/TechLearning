"use client";

import Link from "next/link";
import { Search, Download, Sun, Menu, Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-[#0f111a]">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-blue-500" />
            <span className="font-semibold text-lg text-white">TechLearning</span>
          </Link>

        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-neutral-400 w-64 hover:border-neutral-500 transition-colors cursor-pointer">
            <Search className="w-4 h-4 mr-2" />
            <span>Search</span>
            <span className="ml-auto text-xs border border-neutral-700 px-1.5 rounded text-neutral-500">Ctrl+K</span>
          </div>
          <button className="text-neutral-400 hover:text-white hidden md:block">
            <Sun className="w-5 h-5" />
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors hidden md:block">
            Start Learning
          </button>
          <button className="md:hidden text-neutral-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}