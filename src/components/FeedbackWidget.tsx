"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, CheckCircle2 } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { captureEvent } from "@/lib/posthog";
import { TASKS_BY_ROLE, type CareerRole } from "@/lib/tasks";

const ROLE_LABELS: Record<string, { label: string; icon: string }> = {
  productOwner: { label: "Product Owner", icon: "🤝" },
  devOps: { label: "DevOps", icon: "🚀" },
  frontend: { label: "Desenvolvimento Frontend", icon: "✨" },
  backend: { label: "Desenvolvimento Backend", icon: "🔌" },
};

const TASK_ROLE_MAP: Record<string, string> = {
  po_stakeholder_meeting: "productOwner",
  po_defining_product: "productOwner",
  po_ticket_creation: "productOwner",
  devops_incident_response: "devOps",
  devops_deployment_pipeline: "devOps",
  devops_infrastructure_scaling: "devOps",
  frontend_inspector: "frontend",
  frontend_framer: "frontend",
  frontend_a11y: "frontend",
  backend_api_client: "backend",
  backend_auth: "backend",
  backend_data_fetching: "backend",
};

export function FeedbackWidget() {
  const completedTasks = useProgressStore((s) => s.completedTasks);
  const hasHydrated = useProgressStore((s) => s.hasHydrated);
  
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastTask, setLastTask] = useState<string | null>(null);
  
  const completedCountRef = useRef<number>(0);

  // Sync completion count once store is hydrated to avoid false positives on mount
  useEffect(() => {
    if (hasHydrated) {
      completedCountRef.current = useProgressStore.getState().completedTasks.length;
    }
  }, [hasHydrated]);

  // Listen to completedTasks changes to show feedback widget
  useEffect(() => {
    if (!hasHydrated) return;
    if (typeof window === "undefined") return;

    // If the completed count increased, the user completed a task!
    if (completedTasks.length > completedCountRef.current) {
      const activeTask = completedTasks[completedTasks.length - 1];
      const role = activeTask ? (TASK_ROLE_MAP[activeTask] as CareerRole) : null;

      if (role) {
        const roleTasks = TASKS_BY_ROLE[role];
        const isAllDone = roleTasks.every((t) => completedTasks.includes(t.id));

        if (isAllDone) {
          // Check if user already submitted or dismissed the feedback for this specific role
          const alreadySubmitted = localStorage.getItem(`ditltech.feedback_submitted_${role}`) === "true";
          const alreadyDismissed = localStorage.getItem(`ditltech.feedback_dismissed_${role}`) === "true";

          if (!alreadySubmitted && !alreadyDismissed) {
            // Delay popup slightly for a better feel (e.g., 1.5 seconds after completing)
            const timer = setTimeout(() => {
              // Reset form state for this new role feedback asynchronously
              setRating(null);
              setHoverRating(null);
              setComment("");
              setSubmitted(false);

              setLastTask(activeTask);
              setShow(true);
            }, 1500);

            completedCountRef.current = completedTasks.length;
            return () => clearTimeout(timer);
          }
        }
      }

      completedCountRef.current = completedTasks.length;
    } else {
      // Keep in sync in case of resets/other changes
      completedCountRef.current = completedTasks.length;
    }
  }, [completedTasks, hasHydrated]);

  const role = lastTask ? TASK_ROLE_MAP[lastTask] : null;
  const sectionMeta = role ? ROLE_LABELS[role] : { label: "Tecnologia", icon: "🎉" };

  const handleDismiss = () => {
    setShow(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("ditltech.feedback_dismissed", "true");
      if (role) {
        localStorage.setItem(`ditltech.feedback_dismissed_${role}`, "true");
      }
    }
    // Track dismissal in PostHog
    captureEvent("feedback_dismissed", {
      last_completed_task: lastTask,
      last_completed_task_role: role,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRating = rating !== null ? rating : 0;

    // Capture feedback submitted event in PostHog
    captureEvent("feedback_submitted", {
      rating: finalRating,
      comment: comment.trim(),
      last_completed_task: lastTask,
      last_completed_task_role: role,
      role: role,
    });

    setSubmitted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("ditltech.feedback_submitted", "true");
      if (role) {
        localStorage.setItem(`ditltech.feedback_submitted_${role}`, "true");
      }
    }

    // Auto-close success message after 3 seconds
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="fixed bottom-6 right-6 z-50 w-[340px] overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-50"
        >
          {/* Close button */}
          {!submitted && (
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
              aria-label="Dispensar"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="feedback-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl mt-0.5">{sectionMeta.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm tracking-tight leading-snug">
                      Desafio de {sectionMeta.label} concluído!
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Como foi sua experiência com esta atividade? Dê uma nota de 0 a 5 estrelas.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Star Rating Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = hoverRating !== null ? star <= hoverRating : star <= (rating ?? 0);
                        return (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => setRating(rating === star ? null : star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
                            className={`p-0.5 transition-colors duration-150 ${
                              filled
                                ? "text-amber-400 dark:text-amber-300"
                                : "text-zinc-300 dark:text-zinc-700"
                            }`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <span className="font-mono text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {rating !== null ? `${rating} / 5` : "0 / 5"}
                    </span>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-1">
                    <label htmlFor="feedback-comment" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Comentário (opcional)
                    </label>
                    <textarea
                      id="feedback-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="O que você mais gostou ou o que podemos melhorar?"
                      rows={2}
                      className="w-full resize-none rounded-lg border border-zinc-200 bg-white/50 px-3 py-2 text-xs placeholder-zinc-400 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 dark:border-zinc-800 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-50"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 text-white py-2 text-xs font-semibold transition hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Enviar Feedback</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="feedback-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="mt-3 font-semibold text-sm">Feedback enviado!</h4>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-4">
                  Muito obrigado por contribuir!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
