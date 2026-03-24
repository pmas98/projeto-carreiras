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

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {label}
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {description}
          </div>
        </div>
        <Link
          href={path}
          className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-50 hover:dark:bg-zinc-900"
        >
          Continue
        </Link>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300">
          <span>
            Progress: {completed}/{total} ({pct}%)
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {completed === total ? "Complete" : "In progress"}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-50"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {tasks.map((t) => {
          const done = completedTaskIds.has(t.id);
          return (
            <div
              key={t.id}
              className="flex items-start gap-2 rounded-xl border border-transparent px-2 py-1.5"
            >
              <span className="mt-0.5 text-zinc-900 dark:text-zinc-50">
                {done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {t.title}
                </div>
                <div className="truncate text-xs text-zinc-600 dark:text-zinc-300">
                  {t.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

