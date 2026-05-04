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
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-led" />
                SYSTEM: ONLINE // v1.0.4
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                CAREER ARCHITECT
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1 font-mono text-[10px]">
                <span className="text-zinc-500">TELEMETRY_SYNC</span>
                <div className="flex gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-zinc-400">TASKS</span>
                    <span className="text-sm font-semibold">{totalCompleted}/{totalTasks}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex flex-col items-end text-emerald-500">
                    <span className="opacity-70">UPLOADING</span>
                    <span className="text-sm font-semibold">
                      {totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={resetProgress}
                className="group relative overflow-hidden rounded-md border border-zinc-200 bg-white px-4 py-2 font-mono text-[10px] font-medium transition-all hover:border-red-500/50 hover:text-red-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="relative z-10">[INITIALIZE_RESET]</span>
                <div className="absolute inset-0 z-0 bg-red-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </div>
          
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            <div 
              className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0}%` }}
            />
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan" />
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
          As Fases 1 + 2 estão conectadas: estrutura de roteamento + Zustand + persistência no localStorage. 
          As tarefas das funções serão implementadas em breve.
        </footer>
      </div>
    </div>
  );
}
