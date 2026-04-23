"use client";

import Link from "next/link";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TaskShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onHelpClick?: () => void;
}

export function TaskShell({ title, subtitle, children, onHelpClick }: TaskShellProps) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex items-center gap-4">
          <Link
            href="/frontend"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onHelpClick}
            className="flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Ajuda
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
