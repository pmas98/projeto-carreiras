"use client";

import { useState } from "react";
import { TaskShell } from "../TaskShell";
import { LearningBar } from "../LearningBar";
import { GuidedTutorialOverlay } from "@/components/tutorial/GuidedTutorialOverlay";
import { useGuidedTutorial } from "@/hooks/useGuidedTutorial";
import { useTutorialProgress, TutorialStep } from "@/hooks/useTutorialProgress";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

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
    validate: (code) => code.includes("staggerChildren")
  }
];

export function FramerTask() {
  const [code, setCode] = useState('<motion.div\n  animate={{ opacity: 1 }}\n  transition={{ }}\n>\n  <motion.button \n    whileHover={{ }}\n  >\n    Enviar\n  </motion.button>\n</motion.div>');
  const tutorial = useGuidedTutorial("frontend_framer");
  
  const { 
    currentStep, 
    isStepComplete, 
    isLastStep, 
    goToNextStep
  } = useTutorialProgress(FRAMER_STEPS, code);

  const isTaskComplete = isLastStep && isStepComplete;

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
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
            </div>
            <textarea
              data-tutorial="frontend-framer-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
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
                    staggerChildren: code.includes("staggerChildren") ? 0.1 : 0,
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
                    whileHover={code.includes("whileHover") && code.includes("scale") ? { scale: 1.05 } : {}}
                    transition={code.includes("transition") && code.includes("spring") ? { type: "spring", stiffness: 400, damping: 10 } : {}}
                    className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Play size={16} fill="currentColor" />
                    Enviar Mensagem
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
                  <button 
                    onClick={() => window.location.href = "/frontend/frontend_a11y"}
                    className="mt-6 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                  >
                    Próxima Tarefa
                  </button>
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
          />
        )}
      </div>
      <GuidedTutorialOverlay tutorial={tutorial} />
    </TaskShell>
  );
}
