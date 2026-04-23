"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Lightbulb, ChevronRight, Sparkles } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import {
  DIALOGUE_TREE,
  INITIAL_MOOD,
  type Speaker,
  type DialogueChoice,
  type EndType,
} from "@/lib/po-dialogue";

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  nodeId: string;
  speaker: Speaker;
  text: string;
};

// ─── Mood helpers ─────────────────────────────────────────────────────────────

function getMoodLabel(score: number): string {
  if (score < 20) return "Furioso 😡";
  if (score < 40) return "Frustrado 😤";
  if (score < 55) return "Cético 😒";
  if (score < 70) return "Cauteloso 😐";
  if (score < 85) return "Engajado 😊";
  return "Animado 🤩";
}

function getMoodBarColor(score: number): string {
  if (score < 30) return "bg-red-500";
  if (score < 50) return "bg-orange-500";
  if (score < 70) return "bg-yellow-500";
  if (score < 85) return "bg-green-500";
  return "bg-emerald-400";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MoodGauge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 backdrop-blur">
      <span className="text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap">
        Humor do Stakeholder
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${getMoodBarColor(score)}`}
          animate={{ width: `${score}%` }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
        />
      </div>
      <motion.span
        key={getMoodLabel(score)}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-w-[110px] text-right text-xs font-semibold text-white"
      >
        {getMoodLabel(score)}
      </motion.span>
    </div>
  );
}

function ChatBubble({ message, index }: { message: Message; index: number }) {
  const isStakeholder = message.speaker === "stakeholder";
  const isSystem = message.speaker === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="my-3 flex justify-center"
      >
        <p className="max-w-lg text-center text-sm italic text-slate-400 leading-relaxed">
          {message.text}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isStakeholder ? -24 : 24, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 280, delay: index * 0.04 }}
      className={`flex gap-3 ${isStakeholder ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-lg ${
          isStakeholder
            ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
            : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
        }`}
      >
        {isStakeholder ? "MC" : "PO"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-lg ${
          isStakeholder
            ? "rounded-tl-sm bg-purple-900/70 text-purple-50 ring-1 ring-purple-700/50"
            : "rounded-tr-sm bg-emerald-900/70 text-emerald-50 ring-1 ring-emerald-700/50"
        }`}
      >
        {isStakeholder && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-purple-400">
            Marcus Chen · CEO
          </p>
        )}
        {!isStakeholder && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            Você · Product Owner
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-sm font-bold text-white shadow-lg">
        MC
      </div>
      <div className="flex gap-1.5 rounded-2xl rounded-tl-sm bg-purple-900/70 px-4 py-3 ring-1 ring-purple-700/50">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 rounded-full bg-purple-400"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const CHOICE_LABEL_STYLES = {
  good: {
    badge: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40",
    card: "hover:border-emerald-500/70 hover:bg-emerald-950/40",
    label: "BOA JOGADA",
  },
  risky: {
    badge: "bg-red-500/20 text-red-300 ring-1 ring-red-500/40",
    card: "hover:border-red-500/70 hover:bg-red-950/30",
    label: "ARRISCADO",
  },
  neutral: {
    badge: "bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/40",
    card: "hover:border-slate-400/60 hover:bg-slate-800/60",
    label: "NEUTRO",
  },
};

function ChoicePanel({
  choices,
  onChoice,
}: {
  choices: DialogueChoice[];
  onChoice: (choice: DialogueChoice) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Sua Resposta
      </p>
      <div className="grid gap-2 sm:grid-cols-1">
        {choices.map((choice, i) => {
          const styles = CHOICE_LABEL_STYLES[choice.label];
          return (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChoice(choice)}
              className={`group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition-all ${styles.card}`}
            >
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-white" />
              <div className="flex-1 min-w-0">
                <span
                  className={`mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
                >
                  {styles.label}
                </span>
                <p className="text-sm leading-relaxed text-slate-200">{choice.text}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const END_STYLES: Record<EndType, { ring: string; badge: string; icon: React.ReactNode }> = {
  great: {
    ring: "ring-emerald-500/50",
    badge: "bg-emerald-500/20 text-emerald-300",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  },
  good: {
    ring: "ring-blue-500/50",
    badge: "bg-blue-500/20 text-blue-300",
    icon: <CheckCircle2 className="h-5 w-5 text-blue-400" />,
  },
  medium: {
    ring: "ring-amber-500/50",
    badge: "bg-amber-500/20 text-amber-300",
    icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  },
  bad: {
    ring: "ring-red-500/50",
    badge: "bg-red-500/20 text-red-300",
    icon: <XCircle className="h-5 w-5 text-red-400" />,
  },
};

function EndScreen({
  endType,
  summary,
  onComplete,
  alreadyDone,
}: {
  endType: EndType;
  summary: { scope: string[]; outcome: string; sprintResult: string; reflection: string };
  onComplete: () => void;
  alreadyDone: boolean;
}) {
  const styles = END_STYLES[endType];

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className={`rounded-2xl bg-slate-900/80 p-5 ring-2 backdrop-blur ${styles.ring}`}
    >
      {/* Outcome badge */}
      <div className="flex items-center gap-2">
        {styles.icon}
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles.badge}`}>
          {summary.outcome}
        </span>
      </div>

      {/* Sprint Result */}
      <div className="mt-4 rounded-xl bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          Resultado da Entrega
        </div>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-indigo-200">
          {summary.sprintResult}
        </p>
      </div>

      {/* MVP Scope */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Escopo do MVP Q1 Acordado
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {summary.scope.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Reflection */}
      <div className="mt-4 rounded-xl bg-white/5 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Lightbulb className="h-3.5 w-3.5" />
          Reflexão do PO
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
          {summary.reflection}
        </p>
      </div>

      {/* Action */}
      <div className="mt-4 flex gap-3">
        {alreadyDone ? (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Tarefa já concluída
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500"
          >
            <CheckCircle2 className="h-4 w-4" />
            Concluir Tarefa
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
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StakeholderMeeting() {
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const setPoStakeholderOutcome = useProgressStore((s) => s.setPoStakeholderOutcome);
  const isAlreadyDone = useProgressStore((s) =>
    s.completedTasks.includes("po_stakeholder_meeting")
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [moodScore, setMoodScore] = useState(INITIAL_MOOD);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // State machine: process each node as currentNodeId changes
  useEffect(() => {
    const node = DIALOGUE_TREE[currentNodeId];
    if (!node) return;

    // Add this node's message (deduplicated via functional update — safe in Strict Mode)
    setTimeout(() => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) => m.nodeId === currentNodeId && m.speaker !== "player"
        );
        if (alreadyExists) return prev;

        return [
          ...prev,
          {
            nodeId: currentNodeId,
            speaker: "stakeholder",
            text: node.stakeholderText,
          },
        ];
      });

      if (node.tipText) setActiveTip(node.tipText);
      if (node.isEnd) {
        setIsComplete(true);
      }
    }, 0);

    // Auto-advance nodes without choices (timer re-fires correctly after Strict Mode cleanup)
    if (node.nextId && !node.choices) {
      setTimeout(() => setIsTyping(true), 0);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setCurrentNodeId(node.nextId!);
      }, 1800);
      return () => {
        clearTimeout(timer);
        setIsTyping(false);
      };
    }
  }, [currentNodeId]);

  const handleChoice = useCallback(
    (choice: DialogueChoice) => {
      setActiveTip(null);
      const newMood = Math.max(0, Math.min(100, moodScore + choice.moodDelta));
      setMoodScore(newMood);

      // Add player message immediately
      setMessages((prev) => [
        ...prev,
        {
          id: `player-${choice.id}-${Date.now()}`,
          nodeId: `player-${choice.id}`,
          speaker: "player",
          text: choice.text,
        },
      ]);

      // Small delay before stakeholder responds
      setTimeout(() => {
        setCurrentNodeId(choice.nextId);
      }, 300);
    },
    [moodScore]
  );

  const handleComplete = useCallback(() => {
    const node = DIALOGUE_TREE[currentNodeId];
    markTaskComplete("po_stakeholder_meeting");
    setPoStakeholderOutcome(node.endType ?? "good", moodScore);
    setTaskCompleted(true);
  }, [currentNodeId, moodScore, markTaskComplete, setPoStakeholderOutcome]);

  const currentNode = DIALOGUE_TREE[currentNodeId];
  const currentChoices = currentNode?.choices;
  const endSummary = currentNode?.endSummary;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
          <Link
            href="/product-owner"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Hub do PO
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-sm font-semibold text-white">
            🤝 Tarefa 1 — A Reunião com Stakeholder
          </h1>
          <div className="ml-auto">
            {(taskCompleted || isAlreadyDone) && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Concluído
              </span>
            )}
          </div>
        </div>

        {/* Mood gauge */}
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <MoodGauge score={moodScore} />
        </div>
      </header>

      {/* ── Chat area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatBubble key={msg.id} message={msg} index={i} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* ── Bottom panel ── */}
      <div className="shrink-0 border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4 space-y-3">
          {/* Mentor tip */}
          <AnimatePresence>
            {activeTip && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 px-4 py-3 ring-1 ring-amber-500/30">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <p className="text-sm leading-relaxed text-amber-200">{activeTip}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices or end screen */}
          <AnimatePresence mode="wait">
            {isComplete && endSummary && currentNode.endType ? (
              <EndScreen
                key="end"
                endType={currentNode.endType}
                summary={endSummary}
                onComplete={handleComplete}
                alreadyDone={taskCompleted || isAlreadyDone}
              />
            ) : !isComplete && currentChoices ? (
              <motion.div key="choices">
                <ChoicePanel choices={currentChoices} onChoice={handleChoice} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
