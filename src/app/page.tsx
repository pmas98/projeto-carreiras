"use client";

import { useMemo } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { ROLE_META, TASKS_BY_ROLE } from "@/lib/tasks";
import { RoleProgressCard } from "@/components/RoleProgressCard";

export default function Dashboard() {
  const completedTasks = useProgressStore((s) => s.completedTasks);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const completedTaskIds = useMemo(() => new Set(completedTasks), [completedTasks]);

  const totalCompleted = completedTasks.length;
  const totalTasks = Object.values(TASKS_BY_ROLE).reduce(
    (acc, tasks) => acc + tasks.length,
    0
  );

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Day in the Life of Tech
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Pick a career path and progress through role-specific tasks.
              Everything is client-side and persists via local storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              Progress: {totalCompleted}/{totalTasks}
            </div>
            <button
              type="button"
              onClick={resetProgress}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Reset
            </button>
          </div>
        </header>

        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              Object.keys(ROLE_META) as Array<keyof typeof ROLE_META>
            ).map((role) => {
              const meta = ROLE_META[role];
              const tasks = TASKS_BY_ROLE[role];
              return (
                <RoleProgressCard
                  key={role}
                  label={meta.label}
                  path={meta.path}
                  description={meta.description}
                  tasks={tasks}
                  completedTaskIds={completedTaskIds}
                />
              );
            })}
          </div>
        </section>

        <footer className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
          Phase 1 + 2 are wired: routing skeleton + Zustand + localStorage
          persistence. Role tasks will be implemented next.
        </footer>
      </div>
    </div>
  );
}
