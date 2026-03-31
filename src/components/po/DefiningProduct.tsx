"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import {
  PERSONAS,
  BUSINESS_MODELS,
  MVP_REQUIREMENTS,
  type Persona,
  type BusinessModel,
  type PersonaId,
  type BusinessModelId,
  type PORequirement,
} from "@/lib/po-personas";

// ─── Sticky note rotation map (deterministic, no SSR issues) ─────────────────

const NOTE_ROTATIONS = ["-1.5deg", "1deg", "-0.8deg", "2deg", "-2deg", "1.5deg", "0.5deg", "-1deg"];

type StickyNote = {
  id: string;
  text: string;
  noteColor: string;
  rotation: string;
  source: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PersonaCard({
  persona,
  isSelected,
  onToggle,
}: {
  persona: Persona;
  isSelected: boolean;
  onToggle: (id: PersonaId) => void;
}) {
  return (
    <motion.button
      onClick={() => onToggle(persona.id)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full rounded-2xl border-2 p-4 text-left transition-all ${
        isSelected
          ? "border-transparent ring-2 ring-white/60 shadow-lg shadow-black/30"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
      style={
        isSelected
          ? { background: `linear-gradient(135deg, var(--tw-gradient-stops))` }
          : {}
      }
    >
      {/* Gradient bg when selected */}
      {isSelected && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20 ${persona.gradient}`}
        />
      )}

      <div className="relative flex items-start gap-3">
        <span className="text-2xl leading-none">{persona.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white">{persona.name}</p>
            <span className="text-xs text-slate-400">{persona.age} anos</span>
          </div>
          <p className={`mt-0.5 text-xs font-medium bg-gradient-to-r bg-clip-text text-transparent ${persona.gradient}`}>
            {persona.role}
          </p>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">{persona.tagline}</p>
        </div>
        {isSelected && (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
        )}
      </div>
    </motion.button>
  );
}

function BusinessModelCard({
  model,
  isSelected,
  onToggle,
}: {
  model: BusinessModel;
  isSelected: boolean;
  onToggle: (id: BusinessModelId) => void;
}) {
  return (
    <motion.button
      onClick={() => onToggle(model.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full rounded-xl border-2 p-3 text-left transition-all ${
        isSelected
          ? "border-transparent ring-2 ring-white/50 shadow-md shadow-black/30"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      {isSelected && (
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br opacity-20 ${model.gradient}`}
        />
      )}
      <div className="relative flex items-center gap-2.5">
        <span className="text-xl">{model.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">{model.name}</p>
          <p className="text-xs text-slate-400">{model.tagline}</p>
        </div>
        {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />}
      </div>
    </motion.button>
  );
}

function StickyNoteCard({ note, delay }: { note: StickyNote; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 18, stiffness: 260, delay }}
      style={{ transform: `rotate(${note.rotation})` }}
      className={`relative rounded p-3 shadow-md ${note.noteColor} border`}
    >
      {/* Pin */}
      <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-red-500 shadow-sm ring-1 ring-red-700" />
      <p className="mt-1 text-xs leading-relaxed">{note.text}</p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider opacity-50">
        {note.source}
      </p>
    </motion.div>
  );
}

function RequirementRow({
  req,
  index,
}: {
  req: PORequirement;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12 }}
      className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-white">{req.text}</p>
        <p className="mt-0.5 text-[10px] text-slate-500">Fonte: {req.source}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DefiningProduct() {
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const setPoRequirementDraft = useProgressStore((s) => s.setPoRequirementDraft);
  const existingDraft = useProgressStore((s) => s.poRequirementDraft);
  const isAlreadyDone = useProgressStore((s) =>
    s.completedTasks.includes("po_defining_product")
  );

  const [selectedPersonas, setSelectedPersonas] = useState<Set<PersonaId>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Set<BusinessModelId>>(new Set());
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedRequirements, setExtractedRequirements] = useState<PORequirement[]>(
    existingDraft.length > 0 ? existingDraft : []
  );
  const [taskCompleted, setTaskCompleted] = useState(false);

  const canExtract = selectedPersonas.size > 0 && selectedModels.size > 0;
  const isExtracted = extractedRequirements.length > 0;

  const togglePersona = useCallback((id: PersonaId) => {
    setSelectedPersonas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Remove related notes
        setStickyNotes((notes) =>
          notes.filter((n) => n.source !== PERSONAS.find((p) => p.id === id)?.name)
        );
      } else {
        next.add(id);
        const persona = PERSONAS.find((p) => p.id === id)!;
        // Add sticky notes with staggered delay
        const newNotes: StickyNote[] = persona.notes.map((text, i) => ({
          id: `${id}-note-${i}`,
          text,
          noteColor: persona.noteColor,
          rotation: NOTE_ROTATIONS[(stickyNotes.length + i) % NOTE_ROTATIONS.length],
          source: persona.name,
        }));
        setStickyNotes((n) => [...n, ...newNotes]);
      }
      return next;
    });
  }, [stickyNotes.length]);

  const toggleModel = useCallback((id: BusinessModelId) => {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setStickyNotes((notes) =>
          notes.filter(
            (n) => n.source !== BUSINESS_MODELS.find((m) => m.id === id)?.name
          )
        );
      } else {
        next.add(id);
        const model = BUSINESS_MODELS.find((m) => m.id === id)!;
        const newNotes: StickyNote[] = model.notes.map((text, i) => ({
          id: `${id}-note-${i}`,
          text,
          noteColor: model.noteColor,
          rotation: NOTE_ROTATIONS[(stickyNotes.length + i + 4) % NOTE_ROTATIONS.length],
          source: model.name,
        }));
        setStickyNotes((n) => [...n, ...newNotes]);
      }
      return next;
    });
  }, [stickyNotes.length]);

  const handleExtract = useCallback(() => {
    if (!canExtract) return;
    setIsExtracting(true);
    setTimeout(() => {
      setExtractedRequirements(MVP_REQUIREMENTS);
      setPoRequirementDraft(MVP_REQUIREMENTS);
      setIsExtracting(false);
    }, 1800);
  }, [canExtract, setPoRequirementDraft]);

  const handleComplete = useCallback(() => {
    markTaskComplete("po_defining_product");
    setTaskCompleted(true);
  }, [markTaskComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link
            href="/product-owner"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Hub do PO
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-sm font-semibold text-white">
            📌 Tarefa 2 — Definindo o Produto
          </h1>
          {(taskCompleted || isAlreadyDone) && (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Concluído
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Para quem estamos construindo?</h2>
          <p className="mt-1 text-sm text-slate-400">
            Selecione as personas e um modelo de negócio. O quadro de insights será preenchido com suas principais necessidades. Em seguida, extraia os requisitos do MVP.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* ── Left panel: selection ── */}
          <div className="space-y-6">
            {/* Personas */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Personas de Usuário
                </h3>
              </div>
              <div className="space-y-2">
                {PERSONAS.map((p) => (
                  <PersonaCard
                    key={p.id}
                    persona={p}
                    isSelected={selectedPersonas.has(p.id)}
                    onToggle={togglePersona}
                  />
                ))}
              </div>
            </div>

            {/* Business Models */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Modelo de Negócio
                </h3>
              </div>
              <div className="space-y-2">
                {BUSINESS_MODELS.map((m) => (
                  <BusinessModelCard
                    key={m.id}
                    model={m}
                    isSelected={selectedModels.has(m.id)}
                    onToggle={toggleModel}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel: board + requirements ── */}
          <div className="space-y-6">
            {/* Insights Board (cork board) */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                Quadro de Insights
              </h3>
              <div
                className="relative min-h-[260px] rounded-2xl p-5"
                style={{
                  backgroundColor: "#b8924a",
                  backgroundImage:
                    "radial-gradient(circle at 1.5px 1.5px, rgba(0,0,0,0.12) 1.5px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              >
                {stickyNotes.length === 0 && (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center">
                    <span className="text-3xl opacity-40">📌</span>
                    <p className="text-sm text-amber-900/60">
                      Selecione personas e um modelo de negócio para adicionar notas ao quadro
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  <AnimatePresence>
                    {stickyNotes.map((note, i) => (
                      <StickyNoteCard key={note.id} note={note} delay={i * 0.05} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Extract button */}
            {!isExtracted && (
              <div>
                <motion.button
                  onClick={handleExtract}
                  disabled={!canExtract || isExtracting}
                  whileHover={canExtract && !isExtracting ? { scale: 1.02 } : {}}
                  whileTap={canExtract && !isExtracting ? { scale: 0.98 } : {}}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    canExtract && !isExtracting
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 hover:bg-indigo-500"
                      : "cursor-not-allowed bg-white/5 text-slate-500"
                  }`}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sintetizando requisitos…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {canExtract
                        ? "Extrair Requisitos do MVP"
                        : "Selecione pelo menos 1 persona + 1 modelo para continuar"}
                    </>
                  )}
                </motion.button>
                {!canExtract && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selecione pelo menos uma persona e um modelo de negócio primeiro.
                  </p>
                )}
              </div>
            )}

            {/* Extracted requirements */}
            <AnimatePresence>
              {isExtracted && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">
                      Requisitos do MVP — Sintetizados
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {extractedRequirements.map((req, i) => (
                      <RequirementRow key={req.id} req={req} index={i} />
                    ))}
                  </div>

                  {/* Mentor tip */}
                  <div className="rounded-xl bg-amber-500/10 px-4 py-3 ring-1 ring-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400">
                      💡 Dica do PO
                    </p>
                    <p className="mt-1 text-sm text-amber-200 leading-relaxed">
                      Bons requisitos focam nos resultados para o usuário, não na implementação. Cada um acima descreve <em>o que</em> o usuário precisa — não <em>como</em> construir. Seus engenheiros descobrirão o como.
                    </p>
                  </div>

                  {/* Complete button */}
                  <div className="flex gap-3">
                    {taskCompleted || isAlreadyDone ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Tarefa concluída — siga para a Criação de Tickets
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleComplete}
                        className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Concluir Tarefa
                      </motion.button>
                    )}
                    <Link
                      href="/product-owner/ticket-creation"
                      className="flex items-center gap-2 rounded-full border border-indigo-500/40 px-5 py-2.5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-900/30"
                    >
                      Próximo: Criação de Tickets →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
