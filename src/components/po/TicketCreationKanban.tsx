"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Expand,
  Minimize2,
} from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { INITIAL_TICKETS, type KanbanCard, type KanbanColumn } from "@/lib/po-tickets";

// ─── Column config ────────────────────────────────────────────────────────────

type ColumnDef = {
  id: KanbanColumn;
  label: string;
  color: string;
  headerBg: string;
  cardBorder: string;
  cardBg: string;
  badge: string;
};

const COLUMNS: ColumnDef[] = [
  {
    id: "backlog",
    label: "Backlog",
    color: "text-slate-400",
    headerBg: "bg-slate-700/60",
    cardBorder: "border-l-slate-500",
    cardBg: "bg-slate-800/80",
    badge: "bg-slate-600 text-slate-200",
  },
  {
    id: "inProgress",
    label: "Em Execução",
    color: "text-blue-400",
    headerBg: "bg-blue-900/50",
    cardBorder: "border-l-blue-500",
    cardBg: "bg-blue-950/60",
    badge: "bg-blue-700 text-blue-100",
  },
  {
    id: "review",
    label: "Revisão",
    color: "text-amber-400",
    headerBg: "bg-amber-900/40",
    cardBorder: "border-l-amber-500",
    cardBg: "bg-amber-950/50",
    badge: "bg-amber-700 text-amber-100",
  },
  {
    id: "done",
    label: "Concluído",
    color: "text-emerald-400",
    headerBg: "bg-emerald-900/40",
    cardBorder: "border-l-emerald-500",
    cardBg: "bg-emerald-950/50",
    badge: "bg-emerald-700 text-emerald-100",
  },
];

const COLUMN_ORDER: KanbanColumn[] = ["backlog", "inProgress", "review", "done"];

const POINTS_COLOR: Record<number, string> = {
  1: "bg-green-500/20 text-green-300",
  2: "bg-green-500/20 text-green-300",
  3: "bg-blue-500/20 text-blue-300",
  5: "bg-amber-500/20 text-amber-300",
  8: "bg-red-500/20 text-red-300",
  13: "bg-red-500/20 text-red-300",
};

// ─── Card component ───────────────────────────────────────────────────────────

function KanbanCardView({
  card,
  colDef,
  onMove,
}: {
  card: KanbanCard;
  colDef: ColumnDef;
  onMove: (id: string, direction: "left" | "right") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colIndex = COLUMN_ORDER.indexOf(card.column);
  const canMoveLeft = colIndex > 0;
  const canMoveRight = colIndex < COLUMN_ORDER.length - 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className={`rounded-xl border-l-4 p-3 shadow-md ${colDef.cardBg} ${colDef.cardBorder}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold leading-snug text-white">{card.title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              POINTS_COLOR[card.storyPoints] ?? "bg-slate-600 text-slate-200"
            }`}
          >
            {card.storyPoints}pts
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded p-0.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
            title={expanded ? "Recolher" : "Expandir"}
          >
            {expanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Expand className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* User story (always visible, truncated) */}
      <p
        className={`mt-1.5 text-xs leading-relaxed text-slate-400 ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {card.userStory}
      </p>

      {/* Acceptance criteria (expanded only) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Critérios de Aceite
              </p>
              {card.acceptanceCriteria.map((ac, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <p className="text-xs text-slate-300 leading-relaxed">{ac}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Move buttons */}
      {card.column !== "done" && (
        <div className="mt-3 flex justify-between gap-2 border-t border-white/10 pt-2">
          <button
            onClick={() => onMove(card.id, "left")}
            disabled={!canMoveLeft}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition ${
              canMoveLeft
                ? "text-slate-400 hover:bg-white/10 hover:text-white"
                : "cursor-not-allowed text-slate-700"
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Voltar
          </button>
          <button
            onClick={() => onMove(card.id, "right")}
            disabled={!canMoveRight}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
              canMoveRight
                ? "text-white hover:bg-white/10"
                : "cursor-not-allowed text-slate-700"
            }`}
          >
            {colIndex === COLUMN_ORDER.length - 2 ? "Concluir ✓" : "Mover →"}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Done checkmark */}
      {card.column === "done" && (
        <div className="mt-2 flex items-center gap-1.5 border-t border-emerald-800/50 pt-2 text-xs text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Enviado para a sprint
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TicketCreationKanban() {
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const setPoTicketState = useProgressStore((s) => s.setPoTicketState);
  const storedTickets = useProgressStore((s) => s.poTicketState);
  const isAlreadyDone = useProgressStore((s) =>
    s.completedTasks.includes("po_ticket_creation")
  );

  // Use stored tickets if available, else use defaults
  const [cards, setCards] = useState<KanbanCard[]>(() =>
    storedTickets.length > 0 ? storedTickets : INITIAL_TICKETS
  );
  const [taskCompleted, setTaskCompleted] = useState(false);

  const doneCount = cards.filter((c) => c.column === "done").length;
  const totalCount = cards.length;
  const allDone = doneCount === totalCount;

  // Persist ticket state whenever it changes
  useEffect(() => {
    setPoTicketState(cards);
  }, [cards, setPoTicketState]);

  const moveCard = useCallback((id: string, direction: "left" | "right") => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card;
        const currentIndex = COLUMN_ORDER.indexOf(card.column);
        const nextIndex =
          direction === "right"
            ? Math.min(currentIndex + 1, COLUMN_ORDER.length - 1)
            : Math.max(currentIndex - 1, 0);
        return { ...card, column: COLUMN_ORDER[nextIndex] };
      })
    );
  }, []);

  const handleComplete = useCallback(() => {
    markTaskComplete("po_ticket_creation");
    setTaskCompleted(true);
  }, [markTaskComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link
            href="/product-owner"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Hub do PO
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-sm font-semibold text-white">
            🗂️ Tarefa 3 — Criação de Tickets
          </h1>

          {/* Progress bar */}
          <div className="ml-4 flex items-center gap-3">
            <div className="relative h-2 w-32 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                animate={{ width: `${(doneCount / totalCount) * 100}%` }}
                transition={{ type: "spring", damping: 25 }}
              />
            </div>
            <span className="text-xs font-medium text-slate-400">
              {doneCount}/{totalCount} concluídos
            </span>
          </div>

          {(taskCompleted || isAlreadyDone) && (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Concluído
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Mentor tip panel */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-500/10 px-5 py-4 ring-1 ring-amber-500/20">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              O que faz um ótimo ticket?
            </p>
            <p className="mt-1 text-sm text-amber-200/80 leading-relaxed">
              Cada ticket precisa de uma <strong>história de usuário</strong> clara ("Como um [usuário], eu posso [ação] para que [resultado]")
              e <strong>critérios de aceite</strong> mensuráveis. Mova cada ticket através de
              Backlog → Em Execução → Revisão → Concluído clicando nos botões de seta. Expanda um cartão para ver sua história completa e critérios de aceite.
            </p>
          </div>
        </div>

        {/* Kanban board */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {COLUMNS.map((colDef) => {
            const colCards = cards.filter((c) => c.column === colDef.id);
            return (
              <div key={colDef.id} className="flex flex-col gap-3">
                {/* Column header */}
                <div
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${colDef.headerBg}`}
                >
                  <span className={`text-sm font-bold ${colDef.color}`}>
                    {colDef.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${colDef.badge}`}
                  >
                    {colCards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex min-h-[120px] flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {colCards.map((card) => (
                      <KanbanCardView
                        key={card.id}
                        card={card}
                        colDef={colDef}
                        onMove={moveCard}
                      />
                    ))}
                  </AnimatePresence>

                  {colCards.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 rounded-xl border-2 border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-600"
                    >
                      {colDef.id === "done" ? "Mova os cartões para cá para concluir" : "Vazio"}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion zone */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 22 }}
              className="mt-8 rounded-2xl bg-emerald-900/30 p-6 ring-2 ring-emerald-500/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="font-bold text-emerald-300">
                    Todos os {totalCount} tickets foram concluídos!
                  </p>
                  <p className="mt-0.5 text-sm text-emerald-400/80">
                    O backlog da sprint está pronto. Sua equipe de engenharia tem tudo o que precisa para começar a construir o Carreiras.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white/5 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  💡 Reflexão do PO
                </p>
                <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                  Ótimo trabalho mantendo suas histórias centradas no usuário e seus critérios de aceite mensuráveis. No mundo real, você facilitaria uma sessão de planejamento de sprint para estimar cada ticket de forma colaborativa com sua equipe de engenharia. Pontos de história representam complexidade e risco, não tempo.
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                {taskCompleted || isAlreadyDone ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Tarefa concluída — trilha de PO finalizada!
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/50 transition hover:bg-emerald-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Task
                  </motion.button>
                )}
                <Link
                  href="/product-owner"
                  className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Voltar ao Hub do PO
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
