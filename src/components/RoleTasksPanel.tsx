"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Wand2 } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { ROLE_META, TASKS_BY_ROLE, type CareerRole, type TaskId } from "@/lib/tasks";

const PO_TASK_ROUTES: Partial<Record<TaskId, string>> = {
  po_stakeholder_meeting: "/product-owner/stakeholder-meeting",
  po_defining_product: "/product-owner/defining-product",
  po_ticket_creation: "/product-owner/ticket-creation",
};

const PO_TASK_ICONS: Partial<Record<TaskId, string>> = {
  po_stakeholder_meeting: "🤝",
  po_defining_product: "📌",
  po_ticket_creation: "🗂️",
};

export function RoleTasksPanel({ role }: Readonly<{ role: CareerRole }>) {
  const completedTaskIds = useProgressStore((s) => s.completedTasks);
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const doneSet = new Set(completedTaskIds);

  const meta = ROLE_META[role];
  const tasks = TASKS_BY_ROLE[role];
  const doneCount = tasks.filter((t) => doneSet.has(t.id)).length;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Link className="hover:underline" href="/">
              Dashboard
            </Link>
            <span aria-hidden="true">/</span>
            <span>{meta.label}</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {meta.label}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {meta.description}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-right shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            Completed
          </div>
          <div className="mt-0.5 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {doneCount}/{tasks.length}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {tasks.map((t) => {
          const done = doneSet.has(t.id);
          const poRoute = PO_TASK_ROUTES[t.id];
          const poIcon = PO_TASK_ICONS[t.id];

          return (
            <div
              key={t.id}
              className={`rounded-2xl border p-4 transition-colors ${
                done
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-950/40"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {poIcon && (
                    <span className="mt-0.5 text-xl leading-none">{poIcon}</span>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {t.title}
                    </div>
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                      {t.subtitle}
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                {poRoute ? (
                  <>
                    <div>
                      {done
                        ? "Task complete — you can replay it anytime."
                        : "Interactive simulation — animated & visual."}
                    </div>
                    <Link
                      href={poRoute}
                      className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        done
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                          : "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                      }`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      {done ? "Replay" : "Start Task"}
                    </Link>
                  </>
                ) : (
                  <>
                    <div>
                      {done
                        ? "Marked complete (persisted via localStorage)."
                        : "Placeholder for Phase 3/4 implementation."}
                    </div>
                    {!done ? (
                      <button
                        type="button"
                        onClick={() => markTaskComplete(t.id)}
                        className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        Mark complete (demo)
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
        <div className="font-medium text-zinc-900 dark:text-zinc-50">
          Mentor
        </div>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
          {role === "productOwner"
            ? "Each PO task is a fully interactive simulation. The stakeholder meeting is a branching dialogue, the product definition is a sticky-note board, and ticket creation is an animated Kanban."
            : "You'll get role-specific hints while working on each task. For now, this page is a routing + progress skeleton."}
        </p>
      </div>
    </div>
  );
}
