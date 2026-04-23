"use client";

import { useState } from "react";
import { TaskShell } from "../TaskShell";
import { EducationalTooltip } from "../EducationalTooltip";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

export function FramerTask() {
  const [code, setCode] = useState('<motion.div\n  initial={{ opacity: 0 }}\n  animate={{ opacity: 1 }}\n>\n  {/* Conteúdo */}\n</motion.div>');
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{title: string, content: string, hint?: string} | null>(null);

  // Validation: Check if specific props are present in the code string
  const { isComplete } = useTaskValidation({
    taskId: "frontend_framer",
    currentState: code,
    validate: (c) => 
      c.includes("whileHover") && 
      c.includes("scale") && 
      c.includes("staggerChildren") &&
      c.includes("transition")
  });

  const definitions = {
    stagger: {
      title: "O que é Stagger?",
      content: "Stagger (escalonamento) cria um atraso incremental entre as animações de vários elementos filhos. Isso faz com que eles apareçam um após o outro, criando um efeito de cascata elegante.",
      hint: "Adicione 'transition={{ staggerChildren: 0.1 }}' ao container pai."
    },
    whileHover: {
      title: "O que é whileHover?",
      content: "É uma propriedade do Framer Motion que define como o elemento deve se comportar quando o mouse está sobre ele.",
      hint: "Tente adicionar 'whileHover={{ scale: 1.05 }}' aos botões para dar feedback de clique."
    },
    layout: {
      title: "Animação de Layout",
      content: "Ao adicionar a propriedade 'layout', o Framer Motion anima automaticamente as mudanças de posição e tamanho do elemento quando o estado muda.",
      hint: "Use 'layout' para que o formulário cresça suavemente se novos campos aparecerem."
    }
  };

  return (
    <TaskShell 
      title="Micro-interações" 
      subtitle="Transforme o formulário estático em uma experiência premium."
      onHelpClick={() => setHelpOpen(true)}
    >
      <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 space-y-4">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Conceitos Sugeridos</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveTooltip(definitions.stagger)} className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] hover:text-zinc-200 transition">staggerChildren</button>
              <button onClick={() => setActiveTooltip(definitions.whileHover)} className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] hover:text-zinc-200 transition">whileHover</button>
              <button onClick={() => setActiveTooltip(definitions.layout)} className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] hover:text-zinc-200 transition">layout</button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-zinc-50 p-8 dark:bg-black flex items-center justify-center relative">
          <div className="w-full max-w-md">
            <motion.div 
              layout
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden p-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: code.includes("staggerChildren") ? 0.1 : 0 }}
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
                  whileHover={code.includes("whileHover") ? { scale: 1.05 } : {}}
                  transition={code.includes("transition") ? { type: "spring", stiffness: 400, damping: 10 } : {}}
                  className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  Enviar Mensagem
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Success Overlay */}
          {isComplete && (
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

      {/* Tooltips */}
      <EducationalTooltip 
        isOpen={activeTooltip !== null}
        onClose={() => setActiveTooltip(null)}
        title={activeTooltip?.title || ""}
        content={activeTooltip?.content || ""}
        hint={activeTooltip?.hint}
      />

      <EducationalTooltip 
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Como dar polimento?"
        content="O Framer Motion permite que você adicione animações apenas adicionando propriedades ao código. No seu editor, tente adicionar as palavras-chave mágicas como 'whileHover', 'scale' e 'staggerChildren'."
        hint="O objetivo é incluir: whileHover, scale, staggerChildren e transition no seu código."
      />
    </TaskShell>
  );
}
