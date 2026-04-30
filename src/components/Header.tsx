"use client";

import Link from "next/link";
import { Search, Sun, Moon, Menu, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { SearchModal } from "./SearchModal";
import styles from "./Header.module.css";

export function Header() {
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link href="/" className={styles.logo}>
              <Cpu className="h-5 w-5" />
              <span>TechLearning</span>
            </Link>
          </div>

          <div className={styles.right}>
            <button
              className={styles.searchTrigger}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className={styles.kbd}>Ctrl K</kbd>
            </button>

            <button
              className={styles.iconBtn}
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button className={styles.startBtn}>Start Learning</button>

            <button className={styles.menuBtn}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}