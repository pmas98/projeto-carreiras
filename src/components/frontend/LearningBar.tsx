import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lightbulb, ArrowRight, Code } from "lucide-react";

interface LearningBarProps {
  stepTitle: string;
  description: string;
  explanation: string;
  targetSnippet: string;
  isComplete: boolean;
  onNext: () => void;
  showNext: boolean;
  onLearnMore?: () => void;
}

export function LearningBar({ 
  stepTitle, 
  description, 
  explanation, 
  targetSnippet, 
  isComplete, 
  onNext,
  showNext,
  onLearnMore
}: LearningBarProps) {
  return (
    <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={stepTitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Objetivo Atual</span>
                {isComplete && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={14} className="text-green-500" /></motion.span>}
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{stepTitle}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
            </div>

            <div className="flex-1 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Code size={12} className="text-zinc-400" />
                <span className="text-[10px] font-medium text-zinc-400 uppercase">O que escrever</span>
              </div>
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">{targetSnippet}</code>
            </div>

            <div className="flex-1 space-y-1 hidden lg:block">
              <div className="flex items-center gap-2">
                <Lightbulb size={12} className="text-yellow-500" />
                <span className="text-[10px] font-medium text-zinc-400 uppercase">Por que?</span>
              </div>
              <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400 leading-relaxed">
                &quot;{explanation}&quot;
              </p>
              {onLearnMore && (
                <button 
                  onClick={onLearnMore}
                  className="text-[10px] text-blue-500 hover:underline font-medium"
                >
                  Saiba mais sobre isso
                </button>
              )}
            </div>

            {showNext && isComplete && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onNext}
                className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                Próximo Passo
                <ArrowRight size={14} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
