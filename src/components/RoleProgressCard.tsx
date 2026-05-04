import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { TaskDef, TaskId } from "@/lib/tasks";

export function RoleProgressCard({
  label,
  path,
  description,
  tasks,
  completedTaskIds,
}: Readonly<{
  label: string;
  path: string;
  description: string;
  tasks: TaskDef[];
  completedTaskIds: Set<TaskId>;
}>) {
  const total = tasks.length;
  const completed = tasks.filter((t) => completedTaskIds.has(t.id)).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const modId = label.toUpperCase().replace(/\s+/g, "_");
  const isActive = completed > 0 && completed < total;
  const isDone = completed === total;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white/50 p-5 backdrop-blur-sm transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/50 hover:dark:border-zinc-600">
      <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-zinc-500 opacity-50">
        MOD_{modId}
      </div>

      <div className="flex items-start justify-between">
        <div className="flex-1 pr-12">
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {label}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Condensed Task Preview */}
        <div className="rounded-lg bg-zinc-50 p-3 font-mono text-[10px] dark:bg-zinc-900/50">
          <div className="mb-2 flex items-center justify-between text-[8px] opacity-50">
            <span>TASK_QUEUE</span>
            <span>{completed}/{total}</span>
          </div>
          <div className="space-y-1.5">
            {tasks.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className={completedTaskIds.has(t.id) ? "text-emerald-500" : "text-zinc-500"}>
                  {completedTaskIds.has(t.id) ? "[✓]" : "[ ]"}
                </span>
                <span className={`truncate ${completedTaskIds.has(t.id) ? "text-zinc-500" : "text-zinc-900 dark:text-zinc-300"}`}>
                  {t.title}
                </span>
              </div>
            ))}
            {tasks.length > 3 && (
              <div className="pl-6 text-[8px] opacity-40">+{tasks.length - 3} MORE_TASKS</div>
            )}
          </div>
        </div>

        <Link
          href={path}
          className={`flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-mono text-[10px] font-bold transition-all ${
            isDone 
              ? "bg-emerald-500 text-white" 
              : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          }`}
        >
          {isDone ? "SESSION_COMPLETE" : "INITIATE_PATH"}
          <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Progress Indicator LED */}
      <div 
        className={`absolute bottom-0 left-0 h-1 transition-all duration-700 ${
          isDone ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-800"
        }`} 
        style={{ width: `${pct}%` }} 
      />
    </div>
  );
}

