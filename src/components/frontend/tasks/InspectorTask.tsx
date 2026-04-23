"use client";

import { useState } from "react";
import { TaskShell } from "../TaskShell";
import { EducationalTooltip } from "../EducationalTooltip";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const TARGET_VALUES = {
  padding: 32,
  gap: 16,
  borderRadius: 12,
  borderWidth: 4,
  fontSize: 24,
  boxShadow: 20, // intensity for mapping
};

export function InspectorTask() {
  const [values, setValues] = useState({
    padding: 16,
    gap: 8,
    borderRadius: 0,
    borderWidth: 1,
    fontSize: 16,
    boxShadow: 0,
  });
  
  const [showMockup, setShowMockup] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{title: string, content: string, hint?: string} | null>(null);

  const { isComplete } = useTaskValidation({
    taskId: "frontend_inspector",
    currentState: values,
    validate: (s) => 
      s.padding === TARGET_VALUES.padding && 
      s.gap === TARGET_VALUES.gap && 
      s.borderRadius === TARGET_VALUES.borderRadius &&
      s.borderWidth === TARGET_VALUES.borderWidth &&
      s.fontSize === TARGET_VALUES.fontSize &&
      s.boxShadow === TARGET_VALUES.boxShadow
  });

  const definitions = {
    padding: {
      title: "O que é Padding?",
      content: "O Padding é o espaço interno de um elemento. Ele cria uma 'almofada' entre o conteúdo (como um texto) e a borda do componente.",
      hint: "O mockup parece ter um respiro maior. Tente aumentar o padding para 32px."
    },
    gap: {
      title: "O que é Gap?",
      content: "O Gap define o espaçamento entre os elementos filhos de um container (como botões em uma lista).",
      hint: "Os botões estão muito próximos. O valor ideal no design é 16px."
    },
    borderRadius: {
      title: "O que é Border Radius?",
      content: "O Border Radius arredonda os cantos de um elemento. Cantos mais arredondados costumam passar uma sensação mais amigável e moderna.",
      hint: "O design usa cantos levemente arredondados. Experimente o valor 12px."
    },
    borderWidth: {
      title: "O que é Border Width?",
      content: "Define a espessura da borda do elemento. Bordas mais grossas podem ser usadas para dar ênfase ou um estilo mais 'cartunesco'.",
      hint: "O mockup tem uma borda bem visível. Tente 4px."
    },
    fontSize: {
      title: "O que é Font Size?",
      content: "Controla o tamanho do texto. É fundamental para criar hierarquia visual, destacando o que é mais importante.",
      hint: "O título no design é maior e mais imponente. Experimente 24px."
    },
    boxShadow: {
      title: "O que é Box Shadow?",
      content: "A sombra cria uma ilusão de profundidade, fazendo o elemento parecer 'flutuar' acima da página.",
      hint: "O componente original parece ter profundidade. Tente ajustar para 20px."
    }
  };

  return (
    <TaskShell 
      title="Inspetor de Design" 
      subtitle="Ajuste os valores para alinhar o componente ao mockup."
      onHelpClick={() => setHelpOpen(true)}
    >
      <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
        {/* Controls Sidebar */}
        <div className="w-full lg:w-80 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 overflow-y-auto">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-6 uppercase tracking-wider">Propriedades CSS</h3>
          
          <div className="space-y-8">
            {/* Padding Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Padding</label>
                <span className="text-[10px] font-mono text-zinc-400">{values.padding}px</span>
              </div>
              <input 
                type="range" min="0" max="64" step="4"
                value={values.padding}
                onChange={(e) => setValues({...values, padding: Number(e.target.value)})}
                className="w-full accent-zinc-900 dark:accent-zinc-50"
              />
              <button 
                onClick={() => setActiveTooltip(definitions.padding)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                O que é isso?
              </button>
            </div>

            {/* Gap Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Gap</label>
                <span className="text-[10px] font-mono text-zinc-400">{values.gap}px</span>
              </div>
              <input 
                type="range" min="0" max="32" step="4"
                value={values.gap}
                onChange={(e) => setValues({...values, gap: Number(e.target.value)})}
                className="w-full accent-zinc-900 dark:accent-zinc-50"
              />
              <button 
                onClick={() => setActiveTooltip(definitions.gap)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                O que é isso?
              </button>
            </div>

            {/* Border Radius Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Border Radius</label>
                <span className="text-[10px] font-mono text-zinc-400">{values.borderRadius}px</span>
              </div>
              <input 
                type="range" min="0" max="24" step="2"
                value={values.borderRadius}
                onChange={(e) => setValues({...values, borderRadius: Number(e.target.value)})}
                className="w-full accent-zinc-900 dark:accent-zinc-50"
              />
              <button 
                onClick={() => setActiveTooltip(definitions.borderRadius)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                O que é isso?
              </button>
            </div>

            {/* Border Width Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Border Width</label>
                <span className="text-[10px] font-mono text-zinc-400">{values.borderWidth}px</span>
              </div>
              <input 
                type="range" min="0" max="10" step="1"
                value={values.borderWidth}
                onChange={(e) => setValues({...values, borderWidth: Number(e.target.value)})}
                className="w-full accent-zinc-900 dark:accent-zinc-50"
              />
              <button 
                onClick={() => setActiveTooltip(definitions.borderWidth)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                O que é isso?
              </button>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Font Size</label>
                <span className="text-[10px] font-mono text-zinc-400">{values.fontSize}px</span>
              </div>
              <input 
                type="range" min="12" max="32" step="2"
                value={values.fontSize}
                onChange={(e) => setValues({...values, fontSize: Number(e.target.value)})}
                className="w-full accent-zinc-900 dark:accent-zinc-50"
              />
              <button 
                onClick={() => setActiveTooltip(definitions.fontSize)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                O que é isso?
              </button>
            </div>

            {/* Box Shadow Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Sombra (Depth)</label>
                <span className="text-[10px] font-mono text-zinc-400">{values.boxShadow}px</span>
              </div>
              <input 
                type="range" min="0" max="40" step="4"
                value={values.boxShadow}
                onChange={(e) => setValues({...values, boxShadow: Number(e.target.value)})}
                className="w-full accent-zinc-900 dark:accent-zinc-50"
              />
              <button 
                onClick={() => setActiveTooltip(definitions.boxShadow)}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                O que é isso?
              </button>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <button
              onClick={() => setShowMockup(!showMockup)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                showMockup 
                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-50 dark:text-black dark:border-zinc-50" 
                : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              }`}
            >
              {showMockup ? <EyeOff size={16} /> : <Eye size={16} />}
              {showMockup ? "Esconder Mockup" : "Mostrar Mockup"}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative flex flex-1 items-center justify-center bg-zinc-100 p-8 dark:bg-zinc-900/50 overflow-hidden">
          {/* The Component */}
          <div 
            style={{ 
              padding: `${values.padding}px`,
              borderRadius: `${values.borderRadius}px`,
              gap: `${values.gap}px`,
              borderWidth: `${values.borderWidth}px`,
              boxShadow: `0 ${values.boxShadow}px ${values.boxShadow * 2}px rgba(0,0,0,0.1)`
            }}
            className="relative z-10 flex flex-col bg-white transition-all duration-300 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
          >
            <div className="h-12 w-12 rounded-full bg-zinc-900 dark:bg-zinc-50 mb-2" />
            <div style={{ fontSize: `${values.fontSize}px` }} className="font-bold text-zinc-900 dark:text-zinc-50 mb-1 leading-tight">Título de Exemplo</div>
            <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-900 rounded mb-4" />
            
            <div className="flex gap-[inherit]">
              <div className="h-10 w-24 bg-zinc-900 dark:bg-zinc-50 rounded-[inherit]" />
              <div className="h-10 w-24 border border-zinc-200 dark:border-zinc-800 rounded-[inherit]" />
            </div>
          </div>

          {/* The Mockup Overlay */}
          <div 
            style={{ 
              opacity: showMockup ? 0.3 : 0,
              padding: `${TARGET_VALUES.padding}px`,
              borderRadius: `${TARGET_VALUES.borderRadius}px`,
              gap: `${TARGET_VALUES.gap}px`,
              borderWidth: `${TARGET_VALUES.borderWidth}px`,
              boxShadow: `0 ${TARGET_VALUES.boxShadow}px ${TARGET_VALUES.boxShadow * 2}px rgba(0,0,0,0.1)`
            }}
            className="absolute z-20 pointer-events-none flex flex-col bg-blue-500 shadow-none transition-all duration-300 border-blue-900"
          >
            <div className="h-12 w-12 rounded-full bg-blue-900 mb-2" />
            <div style={{ fontSize: `${TARGET_VALUES.fontSize}px` }} className="font-bold text-blue-900 mb-1 leading-tight">Título de Exemplo</div>
            <div className="h-3 w-32 bg-blue-900 rounded mb-4" />
            <div className="flex gap-[inherit]">
              <div className="h-10 w-24 bg-blue-900 rounded-[inherit]" />
              <div className="h-10 w-24 border border-blue-900 rounded-[inherit]" />
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
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white"
                >
                  <Eye size={32} />
                </motion.div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Perfeito!</h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">Você alinhou o componente com o design.</p>
                <button 
                  onClick={() => window.location.href = "/frontend/frontend_framer"}
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
        title="Dica Geral"
        content="Use o botão 'Mostrar Mockup' para ver o design original por baixo do seu. O objetivo é fazer com que as formas azuis (mockup) e as formas escuras (seu componente) se encaixem perfeitamente."
        hint="Tente ajustar o Padding primeiro, depois o Gap e por último o Border Radius."
      />
    </TaskShell>
  );
}
