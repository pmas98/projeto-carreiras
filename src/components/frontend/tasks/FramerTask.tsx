"use client";

import { useState } from "react";
import { TaskShell } from "../TaskShell";
import { LearningBar } from "../LearningBar";
import { GuidedTutorialOverlay } from "@/components/tutorial/GuidedTutorialOverlay";
import { useGuidedTutorial } from "@/hooks/useGuidedTutorial";
import { useTutorialProgress, TutorialStep } from "@/hooks/useTutorialProgress";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { useProgressStore } from "@/store/useProgressStore";
import { motion } from "framer-motion";
import { Sparkles, Play, HelpCircle, RotateCcw } from "lucide-react";
import { EducationalTooltip } from "../EducationalTooltip";

const FRAMER_DEFINITIONS = {
  hover: {
    title: "O que é whileHover?",
    content: "A propriedade whileHover define o estado do componente quando o mouse está sobre ele. É fundamental para o feedback visual imediato, essencial em interfaces premium.",
    hint: "Combine com 'scale' para dar a sensação de que o botão está vindo ao encontro do usuário."
  },
  spring: {
    title: "Transições do Tipo Spring",
    content: "Diferente de animações lineares, o 'spring' usa física real (mola). Isso evita movimentos robóticos, criando uma sensação muito mais natural e fluida.",
    hint: "O Framer Motion usa valores padrão de rigidez e amortecimento que já dão um toque profissional."
  },
  stagger: {
    title: "O que é staggerChildren?",
    content: "O staggerChildren cria um atraso automático entre os elementos filhos. Em vez de todos aparecerem de uma vez, eles surgem em cascata, guiando o olhar do usuário.",
    hint: "Valores entre 0.05 e 0.15 costumam ser o 'ponto ideal' para esse efeito."
  },
  pro: {
    title: "Dica de Pro",
    content: "Além do 'spring', você pode usar 'tween' para animações lineares ou 'inertia' para efeitos de arrasto.",
    hint: "Tente adicionar 'stiffness: 100, damping: 10' para uma mola mais 'solta'."
  }
};

const FRAMER_STEPS: TutorialStep[] = [
  {
    id: "hover",
    title: "Interação de Hover",
    description: "Faça o botão reagir ao mouse.",
    explanation: "O 'whileHover' fornece feedback imediato, indicando que o elemento é interativo.",
    targetSnippet: "whileHover={{ scale: 1.05 }}",
    hint: "Adicione 'whileHover={{ scale: 1.05 }}' à tag <motion.button>.",
    validate: (code) => code.includes("whileHover") && code.includes("scale")
  },
  {
    id: "spring",
    title: "Física de Mola",
    description: "Deixe a animação mais natural.",
    explanation: "Animações do tipo 'spring' (mola) simulam o mundo real, evitando movimentos mecânicos e lineares.",
    targetSnippet: "transition={{ type: 'spring' }}",
    hint: "Adicione 'transition={{ type: 'spring' }}' ao botão.",
    validate: (code) => code.includes("transition") && code.includes("spring")
  },
  {
    id: "stagger",
    title: "Efeito Cascata",
    description: "Anime os campos em sequência.",
    explanation: "O 'staggerChildren' cria um atraso entre os filhos, guiando o olhar do usuário suavemente.",
    targetSnippet: "transition={{ staggerChildren: 0.1 }}",
    hint: "Adicione 'staggerChildren: 0.1' dentro da propriedade transition do container pai.",
    validate: (code) => {
      const transitions = code.match(/transition=\{\{([^}]*)\}\}/g) || [];
      const hasStagger = code.includes("staggerChildren");
      const hasDuplicates = transitions.length > 2; // Parent + Button
      return hasStagger && !hasDuplicates;
    }
  }
];

const INITIAL_CODE = '<motion.div\n  animate={{ opacity: 1 }}\n  transition={{ }}\n>\n  <motion.button \n    whileHover={{ }}\n  >\n    Enviar Mensagem\n  </motion.button>\n</motion.div>';

export function FramerTask() {
  const [code, setCode] = useState(INITIAL_CODE);
  const tutorial = useGuidedTutorial("frontend_framer");
  
  // Extraction helpers for live preview
  const extractValue = (pattern: RegExp, defaultValue: string) => {
    const match = code.match(pattern);
    return match ? match[1] : defaultValue;
  };

  const buttonText = extractValue(/<motion\.button[^>]*>([\s\S]*?)<\/motion\.button>/, "Enviar Mensagem").trim();
  const hoverScale = parseFloat(extractValue(/scale:\s*([\d.]+)/, "1"));
  const staggerValue = parseFloat(extractValue(/staggerChildren:\s*([\d.]+)/, "0"));
  const isSpring = code.includes("type: 'spring'") || code.includes('type: "spring"');

  const hoverProps = code.includes("whileHover") ? { scale: hoverScale } : {};
  const transitionProps = isSpring ? { type: "spring", stiffness: 400, damping: 10 } : {};
  
  // Basic Syntax checking
  const errors = [];
  const openTags = (code.match(/<motion\.[a-z]+/g) || []).length;
  const closeTags = (code.match(/<\/motion\.[a-z]+>/g) || []).length;
  if (openTags > closeTags) errors.push("Você esqueceu de fechar uma tag </motion...>");
  if ((code.match(/\{\{/g) || []).length !== (code.match(/\}\}/g) || []).length) {
    errors.push("Chaves {{ }} desalinhadas.");
  }
  
  const transitions = code.match(/transition=\{\{/g) || [];
  if (transitions.length > 2) {
    errors.push("Cuidado: você tem propriedades 'transition' duplicadas no mesmo elemento!");
  }

  const [activeTooltip, setActiveTooltip] = useState<{title: string, content: string, hint?: string} | null>(null);

  const { 
    currentStep, 
    isStepComplete, 
    isLastStep, 
    goToNextStep,
    reset: resetProgress
  } = useTutorialProgress(FRAMER_STEPS, code);

  const resetTask = useProgressStore((s) => s.resetTask);
  const { isComplete: isTaskCompleteStore } = useTaskValidation({
    taskId: "frontend_framer",
    currentState: code,
    validate: () => isLastStep && isStepComplete && errors.length === 0,
    successDelay: 1500 // 1.5s delay to let the user see the stagger effect
  });

  const handleReset = () => {
    setCode(INITIAL_CODE);
    resetProgress();
    resetTask("frontend_framer");
  };

  const isTaskComplete = isTaskCompleteStore;

  return (
    <TaskShell 
      title="Micro-interações" 
      subtitle="Transforme o formulário estático em uma experiência premium."
      onReplayTutorial={tutorial.start}
    >
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Code Editor */}
          <div className="w-full lg:w-[450px] border-r border-zinc-200 bg-zinc-950 p-0 flex flex-col dark:border-zinc-800">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editor de Código</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTooltip({
                    title: "Guia de Micro-interações",
                    content: "Neste editor, você está usando o Framer Motion. Você pode animar quase qualquer propriedade CSS de forma declarativa.",
                    hint: "Tente mudar os valores numéricos no editor e veja o que acontece no preview à direita!"
                  })}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <HelpCircle size={14} />
                </button>
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>
            </div>
            <textarea
              data-tutorial="frontend-framer-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
            {errors.length > 0 && (
              <div className="bg-red-500/10 border-t border-red-500/20 p-4">
                {errors.map((err, i) => (
                  <div key={i} className="text-xs text-red-400 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-red-400" />
                    {err}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div
            data-tutorial="frontend-framer-preview"
            className="flex-1 bg-zinc-50 p-8 dark:bg-black flex items-center justify-center relative"
          >
            <div className="w-full max-w-md">
              <motion.div 
                layout
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden p-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    staggerChildren: staggerValue,
                    delayChildren: 0.2
                  }}
                  className="space-y-6"
                >
                  <motion.h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Fale Conosco</motion.h2>
                  
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-1.5"
                      >
                        <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
                        <div className="h-10 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl" />
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={hoverProps}
                    transition={transitionProps}
                    className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Play size={16} fill="currentColor" />
                    {buttonText}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Success Overlay */}
            {isTaskComplete && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
              >
                <div className="text-center">
                  <motion.div 
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                  >
                    <Sparkles size={32} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Uau, que fluido!</h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">Suas micro-interações deram o toque premium que faltava.</p>
                  
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <RotateCcw size={16} />
                      Repetir
                    </button>
                    <button 
                      onClick={() => window.location.href = "/frontend/frontend_a11y"}
                      className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                    >
                      Próxima Tarefa
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Learning Bar */}
        {!isTaskComplete && (
          <LearningBar 
            stepTitle={currentStep.title}
            description={currentStep.description}
            explanation={currentStep.explanation}
            targetSnippet={currentStep.targetSnippet}
            isComplete={isStepComplete}
            onNext={goToNextStep}
            showNext={!isLastStep}
            onLearnMore={() => {
              const def = FRAMER_DEFINITIONS[currentStep.id as keyof typeof FRAMER_DEFINITIONS];
              if (def) setActiveTooltip(def);
            }}
          />
        )}

        <EducationalTooltip 
          isOpen={activeTooltip !== null}
          onClose={() => setActiveTooltip(null)}
          title={activeTooltip?.title || ""}
          content={activeTooltip?.content || ""}
          hint={activeTooltip?.hint}
        />
      </div>
      <GuidedTutorialOverlay tutorial={tutorial} />
    </TaskShell>
  );
}
