"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GlossaryTooltip({ 
  term, 
  definition, 
  children 
}: { 
  term: string, 
  definition: string, 
  children: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="cursor-help border-b border-dotted border-zinc-400 pb-0.5 transition-colors hover:border-zinc-900 dark:border-zinc-500 dark:hover:border-zinc-100">
        {children}
      </span>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="mb-1 font-mono text-[8px] font-bold uppercase tracking-widest text-zinc-400">
              CONCEITO: {term}
            </div>
            <div className="text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {definition}
            </div>
            <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-white dark:border-t-zinc-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
