"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Wand2 } from "lucide-react";
import { GuidedTutorialOverlay } from "@/components/tutorial/GuidedTutorialOverlay";
import { useGuidedTutorial } from "@/hooks/useGuidedTutorial";
import { useProgressStore } from "@/store/useProgressStore";
import { ROLE_META, TASKS_BY_ROLE, type CareerRole, type TaskId } from "@/lib/tasks";

const TASK_ROUTES: Partial<Record<TaskId, string>> = {
  po_stakeholder_meeting: "/product-owner/stakeholder-meeting",
  po_defining_product: "/product-owner/defining-product",
  po_ticket_creation: "/product-owner/ticket-creation",
  frontend_inspector: "/frontend/frontend_inspector",
  frontend_framer: "/frontend/frontend_framer",
  frontend_a11y: "/frontend/frontend_a11y",
};

const TASK_ICONS: Partial<Record<TaskId, string>> = {
  po_stakeholder_meeting: "🤝",
  po_defining_product: "📌",
  po_ticket_creation: "🗂️",
  frontend_inspector: "🔍",
  frontend_framer: "✨",
  frontend_a11y: "♿",
};

const TUTORIAL_TARGETS_BY_TASK: Partial<
  Record<TaskId, { primary: string; secondary: string }>
> = {
  devops_outage: {
    primary: "devops-alert-card",
    secondary: "devops-ack-button",
  },
  devops_terminal: {
    primary: "devops-terminal-input",
    secondary: "devops-terminal-run",
  },
  devops_investigation_resolution: {
    primary: "devops-logs-panel",
    secondary: "devops-resolution-actions",
  },
  backend_api_client: {
    primary: "backend-api-request-builder",
    secondary: "backend-api-send",
  },
  backend_auth: {
    primary: "backend-auth-payload",
    secondary: "backend-auth-token",
  },
  backend_data_fetching: {
    primary: "backend-fetch-auth-header",
    secondary: "backend-fetch-filters",
  },
};

export function RoleTasksPanel({ role }: Readonly<{ role: CareerRole }>) {
  const completedTaskIds = useProgressStore((s) => s.completedTasks);
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const markTutorialSeen = useProgressStore((s) => s.markTutorialSeen);
  const doneSet = useMemo(() => new Set(completedTaskIds), [completedTaskIds]);

  const meta = ROLE_META[role];
  const tasks = TASKS_BY_ROLE[role];
  const doneCount = tasks.filter((t) => doneSet.has(t.id)).length;
  const shouldUseCardTutorials = role === "devOps" || role === "backend";

  const defaultSelectedTaskId = useMemo(() => {
    if (!shouldUseCardTutorials || tasks.length === 0) return "";
    const firstPending = tasks.find((task) => !doneSet.has(task.id));
    return (firstPending ?? tasks[0]).id;
  }, [doneSet, shouldUseCardTutorials, tasks]);

  const [selectedTaskId, setSelectedTaskId] = useState<TaskId | "">("");
  const [pendingReplayTaskId, setPendingReplayTaskId] = useState<TaskId | "">("");
  const activeTaskId = shouldUseCardTutorials
    ? selectedTaskId || defaultSelectedTaskId
    : "";
  // DevOps/Backend tutorials stay panel-level until dedicated task pages are available.
  const tutorial = useGuidedTutorial(activeTaskId);

  useEffect(() => {
    if (!pendingReplayTaskId || activeTaskId !== pendingReplayTaskId) return;
    const replayTimeoutId = window.setTimeout(() => {
      tutorial.start();
      setPendingReplayTaskId("");
    }, 0);
    return () => {
      window.clearTimeout(replayTimeoutId);
    };
  }, [activeTaskId, pendingReplayTaskId, tutorial]);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Link className="hover:underline" href="/">
              Painel
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
            Concluído
          </div>
          <div className="mt-0.5 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {doneCount}/{tasks.length}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {tasks.map((t) => {
          const done = doneSet.has(t.id);
          const poRoute = TASK_ROUTES[t.id];
          const poIcon = TASK_ICONS[t.id];

          return (
            <div
              key={t.id}
              data-tutorial={
                shouldUseCardTutorials ? TUTORIAL_TARGETS_BY_TASK[t.id]?.primary : undefined
              }
              onClick={() => {
                if (shouldUseCardTutorials) {
                  setSelectedTaskId(t.id);
                }
              }}
              className={`rounded-2xl border p-4 transition-colors ${
                done
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-950/40"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              } ${shouldUseCardTutorials ? "cursor-pointer" : ""}`}
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
                        ? "Tarefa concluída — você pode repeti-la a qualquer momento."
                        : "Simulação interativa — animada e visual."}
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
                      {done ? "Repetir" : "Iniciar Tarefa"}
                    </Link>
                  </>
                ) : (
                  <>
                    <div>
                      {done
                        ? "Marcado como concluído (persistido no localStorage)."
                        : "Espaço reservado para implementação das Fases 3/4."}
                    </div>
                    {!done ? (
                      <button
                        type="button"
                        onClick={() => markTaskComplete(t.id)}
                        className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        Marcar como concluído (demo)
                      </button>
                    ) : null}
                    {shouldUseCardTutorials ? (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          data-tutorial={TUTORIAL_TARGETS_BY_TASK[t.id]?.secondary}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (activeTaskId === t.id) {
                              tutorial.start();
                              return;
                            }
                            setPendingReplayTaskId(t.id);
                            setSelectedTaskId(t.id);
                          }}
                          className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800 transition hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                        >
                          Mostrar tutorial
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            markTutorialSeen(t.id);
                            if (activeTaskId === t.id) {
                              tutorial.close();
                            }
                          }}
                          className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        >
                          Pular tutorial
                        </button>
                      </div>
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
          {role === "productOwner" || role === "frontend"
            ? `Cada tarefa de ${meta.label} é uma simulação totalmente interativa. No Frontend, você ajustará layouts, animações e acessibilidade com feedback em tempo real.`
            : "Você receberá dicas específicas da função enquanto trabalha em cada tarefa. Por enquanto, esta página é uma estrutura de roteamento e progresso."}
        </p>
      </div>
      {shouldUseCardTutorials ? <GuidedTutorialOverlay tutorial={tutorial} /> : null}
    </div>
  );
}
