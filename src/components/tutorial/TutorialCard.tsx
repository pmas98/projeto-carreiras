"use client";

import { useId } from "react";

type TutorialCardProps = {
  stepNumber: number;
  totalSteps: number;
  actionLabel: string;
  instruction: string;
  why: string;
  hint?: string;
  showMissingTargetHint?: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSkip: () => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  headingId?: string;
  descriptionId?: string;
};

export function TutorialCard({
  stepNumber,
  totalSteps,
  actionLabel,
  instruction,
  why,
  hint,
  showMissingTargetHint = false,
  isFirstStep,
  isLastStep,
  onSkip,
  onBack,
  onNext,
  onFinish,
  headingId,
  descriptionId,
}: TutorialCardProps) {
  const fallbackId = useId();
  const resolvedHeadingId = headingId ?? `${fallbackId}-heading`;
  const resolvedDescriptionId = descriptionId ?? `${fallbackId}-description`;

  return (
    <section className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      <header className="mb-4 space-y-2">
        <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Passo {stepNumber} de {totalSteps}
        </span>
        <h3 id={resolvedHeadingId} className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {actionLabel}
        </h3>
      </header>

      <div id={resolvedDescriptionId} className="space-y-3">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Instrucao
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{instruction}</p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Por que isso importa
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{why}</p>
        </div>

        {hint ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">{hint}</p>
          </div>
        ) : null}

        {showMissingTargetHint ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              Nao encontramos o elemento destacado nesta etapa. Voce pode continuar normalmente pelo guia.
            </p>
          </div>
        ) : null}
      </div>

      <footer className="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSkip}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
        >
          Pular
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isFirstStep}
            onClick={onBack}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-45 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={isLastStep ? onFinish : onNext}
            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isLastStep ? "Concluir" : "Proximo"}
          </button>
        </div>
      </footer>
    </section>
  );
}
