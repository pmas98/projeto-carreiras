"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

interface EducationalTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  hint?: string;
}

export function EducationalTooltip({ isOpen, onClose, title, content, hint }: EducationalTooltipProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
                <Info className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4">
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {content}
            </p>
            
            {hint && (
              <div className="mt-4 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Dica Prática
                </div>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                  {hint}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
