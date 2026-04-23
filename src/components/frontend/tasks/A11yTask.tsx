"use client";

import { useState } from "react";
import { TaskShell } from "../TaskShell";
import { EducationalTooltip } from "../EducationalTooltip";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { motion } from "framer-motion";
import { Accessibility, ShieldCheck, UserCheck } from "lucide-react";

export function A11yTask() {
  const [code, setCode] = useState('<div onClick={closeModal}>\n  <img src="close.png" />\n</div>\n\n<div className="text-gray-200 bg-gray-100">\n  Texto ilegível\n</div>');
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{title: string, content: string, hint?: string} | null>(null);

  // Validation: Check for button tag, aria-label, and better contrast class
  const { isComplete } = useTaskValidation({
    taskId: "frontend_a11y",
    currentState: code,
    validate: (c) => 
      c.includes("<button") && 
      c.includes("aria-label") && 
      c.includes("text-zinc-900") // Simulation of better contrast class
  });

  const definitions = {
    semantics: {
      title: "Semântica HTML",
      content: "Usar a tag correta (como <button> em vez de <div>) é fundamental. Os leitores de tela sabem que um <button> é clicável e pode receber foco via teclado automaticamente.",
      hint: "Troque a <div> externa por uma tag <button>."
    },
    aria: {
      title: "ARIA Labels",
      content: "Quando um botão contém apenas um ícone e nenhum texto, o leitor de tela não sabe o que ele faz. O 'aria-label' fornece uma descrição textual invisível para o robô.",
      hint: "Adicione aria-label='Fechar modal' ao seu botão."
    },
    contrast: {
      title: "Contraste de Cores",
      content: "Para que o conteúdo seja acessível, deve haver uma diferença clara entre a cor do texto e a cor do fundo. Cores muito claras em fundos claros são impossíveis de ler para muitas pessoas.",
      hint: "Troque 'text-gray-200' por uma cor mais escura, como 'text-zinc-900'."
    }
  };

  return (
    <TaskShell 
      title="O Pesadelo do Leitor de Tela" 
      subtitle="Corrija a semântica e a acessibilidade deste dashboard."
      onHelpClick={() => setHelpOpen(true)}
    >
      <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
        {/* Code Editor */}
        <div className="w-full lg:w-[450px] border-r border-zinc-200 bg-zinc-950 p-0 flex flex-col dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editor de HTML</span>
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 space-y-4">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Erros de Acessibilidade</h4>
            <div className="space-y-2">
              <button onClick={() => setActiveTooltip(definitions.semantics)} className="w-full text-left px-3 py-2 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-xs hover:bg-red-900/30 transition">Elemento clicável não é um botão</button>
              <button onClick={() => setActiveTooltip(definitions.aria)} className="w-full text-left px-3 py-2 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-xs hover:bg-red-900/30 transition">Botão de ícone sem descrição</button>
              <button onClick={() => setActiveTooltip(definitions.contrast)} className="w-full text-left px-3 py-2 rounded-lg bg-orange-900/20 border border-orange-900/50 text-orange-400 text-xs hover:bg-orange-900/30 transition">Contraste de texto insuficiente</button>
            </div>
          </div>
        </div>

        {/* Robot View Area */}
        <div className="flex-1 bg-zinc-100 p-8 dark:bg-zinc-900/50 flex flex-col relative">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Accessibility size={18} />
              Simulador de Leitor de Tela (Visão do Robô)
            </h3>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual View */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Visão do Usuário</span>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 min-h-[300px]">
                <div className="flex justify-between items-start mb-8">
                  <h4 className="font-bold">Meu Dashboard</h4>
                  <div className={`p-2 rounded cursor-pointer ${code.includes("<button") ? "ring-2 ring-blue-500" : ""}`}>
                    <div className="w-4 h-4 bg-zinc-900 dark:bg-zinc-50 rounded-sm relative">
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white">X</div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${code.includes("text-zinc-900") ? "bg-zinc-100 text-zinc-900" : "bg-zinc-50 text-zinc-200"}`}>
                  <p className="text-sm font-medium">Este é um aviso importante que todos devem ler com clareza.</p>
                </div>
              </div>
            </div>

            {/* Accessibility Tree View */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">O que o Robô ouve</span>
              <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 font-mono text-xs text-green-500 min-h-[300px] space-y-4">
                <div>&gt; Carregando página...</div>
                <div className="text-zinc-500 italic">// Árvore de Acessibilidade:</div>
                <div className="pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white">- Heading:</span> "Meu Dashboard"
                  </div>
                  
                  <div className="flex items-center gap-2 border border-red-500/30 p-2 rounded bg-red-500/5">
                    <span className="text-white">- {code.includes("<button") ? "Button" : "Generic (Div)"}:</span> 
                    {code.includes("aria-label") ? '"Fechar modal"' : <span className="text-red-500 animate-pulse underline">"Sem nome/descrição"</span>}
                  </div>

                  <div className="flex items-center gap-2 border border-orange-500/30 p-2 rounded bg-orange-500/5">
                    <span className="text-white">- Text Content:</span>
                    {code.includes("text-zinc-900") ? '"Este é um aviso..."' : <span className="text-orange-500 animate-pulse underline">"Contraste muito baixo - Pular leitura"</span>}
                  </div>
                </div>
              </div>
            </div>
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
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                >
                  <ShieldCheck size={32} />
                </motion.div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Acessibilidade 10/10!</h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">Agora qualquer pessoa, usando qualquer tecnologia, pode navegar no seu app.</p>
                <button 
                  onClick={() => window.location.href = "/"}
                  className="mt-6 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  Voltar ao Dashboard
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
        title="O robô está confuso!"
        content="Olhe para o painel da direita. Ele mostra exatamente o que um leitor de tela detecta. Os itens em vermelho e laranja precisam ser corrigidos no código."
        hint="O objetivo é: usar a tag <button>, adicionar um aria-label e mudar a cor para text-zinc-900."
      />
    </TaskShell>
  );
}
