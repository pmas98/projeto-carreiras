"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskShell } from "../TaskShell";
import { LearningBar } from "../LearningBar";
import { GuidedTutorialOverlay } from "@/components/tutorial/GuidedTutorialOverlay";
import { useGuidedTutorial } from "@/hooks/useGuidedTutorial";
import { useTutorialProgress, TutorialStep } from "@/hooks/useTutorialProgress";
import { useTaskValidation } from "@/hooks/useTaskValidation";
import { useProgressStore } from "@/store/useProgressStore";
import { motion } from "framer-motion";
import { Accessibility, ShieldCheck, RotateCcw, AlertTriangle } from "lucide-react";

interface TagError {
  message: string;
  line?: number;
}

// Robust HTML/JSX tag balancer for beginners
function checkTagBalance(code: string): TagError[] {
  const errors: TagError[] = [];
  const tagRegex = /<(\/?)([a-zA-Z0-9]+)([^>]*?)(\/?)>/g;
  let match;
  
  const getLineNumber = (index: number) => {
    return code.substring(0, index).split("\n").length;
  };
  
  const stack: { name: string; line: number }[] = [];
  
  while ((match = tagRegex.exec(code)) !== null) {
    const isClosing = match[1] === "/";
    const tagName = match[2].toLowerCase();
    const isSelfClosing = match[4] === "/" || ["img", "input", "br", "hr", "meta", "link"].includes(tagName);
    const line = getLineNumber(match.index);
    
    if (isSelfClosing) {
      if (isClosing) {
        errors.push({
          message: `A tag '<${tagName} />' é auto-fechada. Você não deve usar uma tag de fechamento '</${tagName}>'.`,
          line
        });
      }
      continue;
    }
    
    if (isClosing) {
      if (stack.length === 0) {
        errors.push({
          message: `Você tentou fechar '</${tagName}>' na linha ${line}, mas nenhuma tag correspondente foi aberta.`,
          line
        });
      } else {
        const lastOpen = stack.pop();
        if (lastOpen && lastOpen.name !== tagName) {
          errors.push({
            message: `Erro na linha ${line}: tentou fechar '</${tagName}>', mas a última tag que você abriu (na linha ${lastOpen.line}) foi '<${lastOpen.name}>'.`,
            line
          });
        }
      }
    } else {
      stack.push({ name: tagName, line });
    }
  }
  
  while (stack.length > 0) {
    const unclosed = stack.pop();
    if (unclosed) {
      errors.push({
        message: `A tag '<${unclosed.name}>' aberta na linha ${unclosed.line} não foi fechada. Escreva '</${unclosed.name}>' para fechá-la.`,
        line: unclosed.line
      });
    }
  }
  
  return errors;
}

// Web Audio API retro synthesizer for premium sound effects
const playSound = (type: "step" | "success") => {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (type === "step") {
      // Clean sweet chime sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1046.50, now); // C6
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "success") {
      // Beautiful rising arpeggio for final completion
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};

const A11Y_STEPS: TutorialStep[] = [
  {
    id: "semantics",
    title: "Semântica Correta",
    description: "Substitua a tag <div> externa por um <button>.",
    explanation: "Botões são focáveis via teclado e anunciados corretamente por leitores de tela.",
    targetSnippet: "<button onClick={closeModal}>\n...\n</button>",
    hint: "Troque a tag <div> externa por <button> e o fechamento </div> correspondente por </button>.",
    validate: (code) => {
      const syntaxErrors = checkTagBalance(code);
      return code.includes("<button") && code.includes("</button>") && !code.includes("<div onClick={closeModal}>") && syntaxErrors.length === 0;
    }
  },
  {
    id: "aria",
    title: "Rótulo Acessível",
    description: "Adicione uma descrição para o ícone.",
    explanation: "Ícones sozinhos são mudos para robôs. O aria-label dá voz a eles.",
    targetSnippet: "aria-label=\"Fechar modal\"",
    hint: "Adicione aria-label=\"Fechar modal\" ao seu botão.",
    validate: (code) => code.includes("aria-label")
  },
  {
    id: "contrast",
    title: "Contraste Visual",
    description: "Aumente o contraste do texto.",
    explanation: "Cores com baixo contraste impedem a leitura para pessoas com baixa visão.",
    targetSnippet: "text-zinc-900",
    hint: "Troque 'text-gray-200' por 'text-zinc-900'.",
    validate: (code) => code.includes("text-zinc-900")
  },
  {
    id: "exploration",
    title: "Vá além!",
    description: "Tente adicionar outros atributos.",
    explanation: "Atributos como role='button' ou tabIndex={0} podem ajudar em casos específicos.",
    targetSnippet: "role='button'",
    hint: "Experimente adicionar role='alert' na div de texto.",
    validate: (code) => code.includes("role=") || code.includes("tabIndex=") || code.includes("aria-")
  }
];

const INITIAL_CODE = '<div onClick={closeModal}>\n  <img src="close.png" />\n</div>\n\n<div className="text-gray-200 bg-gray-100">\n  Texto ilegível\n</div>';

export function A11yTask() {
  const [code, setCode] = useState(INITIAL_CODE);
  const tutorial = useGuidedTutorial("frontend_a11y");
  
  const { 
    currentStep, 
    isStepComplete, 
    isLastStep, 
    goToNextStep,
    reset: resetProgress
  } = useTutorialProgress(A11Y_STEPS, code);

  // Syntax and Semantic analysis
  const syntaxErrors = checkTagBalance(code);
  
  const customErrors = [];
  if ((code.match(/aria-label=/g) || []).length > 1) {
    customErrors.push({ message: "Cuidado: você definiu múltiplos aria-labels no mesmo elemento!" });
  }

  const errors = [...syntaxErrors, ...customErrors];

  // Sound triggers
  const [lastStepId, setLastStepId] = useState("");
  useEffect(() => {
    if (isStepComplete && currentStep && currentStep.id !== lastStepId) {
      setLastStepId(currentStep.id);
      playSound("step");
    }
  }, [isStepComplete, currentStep, lastStepId]);

  const resetTask = useProgressStore((s) => s.resetTask);
  const router = useRouter();
  const { isComplete: isTaskCompleteStore } = useTaskValidation({
    taskId: "frontend_a11y",
    currentState: code,
    validate: () => isLastStep && isStepComplete && errors.length === 0,
    successDelay: 1000
  });

  const isTaskComplete = isTaskCompleteStore;

  useEffect(() => {
    if (isTaskComplete) {
      playSound("success");
    }
  }, [isTaskComplete]);

  const handleReset = () => {
    setCode(INITIAL_CODE);
    resetProgress();
    resetTask("frontend_a11y");
    setLastStepId("");
  };

  // Gamified Accessibility Score Calculation
  const calculateScore = () => {
    let score = 20; // Base score
    if (code.includes("<button") && code.includes("</button>")) score += 25;
    if (code.includes("aria-label")) score += 25;
    if (code.includes("text-zinc-900")) score += 30;
    if (errors.length > 0) score = Math.max(10, score - 15);
    return score;
  };

  const score = calculateScore();
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score < 50) return "stroke-red-500";
    if (score < 75) return "stroke-amber-500";
    return "stroke-green-500";
  };

  const getScoreTextColor = () => {
    if (score < 50) return "text-red-600 dark:text-red-400";
    if (score < 75) return "text-amber-750 dark:text-amber-400";
    return "text-green-700 dark:text-green-400";
  };

  const getScoreLabel = () => {
    if (score < 50) return "Acessibilidade Crítica";
    if (score < 75) return "Acessibilidade Regular";
    if (score < 100) return "Acessibilidade Ótima";
    return "Acessibilidade Perfeita! 10/10";
  };

  // Helper to extract aria-label dynamically for visual rendering
  const getAriaLabel = () => {
    const match = code.match(/aria-label=["']([^"']+)["']/);
    return match ? match[1] : null;
  };

  const lines = code.split("\n");

  return (
    <TaskShell 
      title="O Pesadelo do Leitor de Tela" 
      subtitle="Corrija a semântica e a acessibilidade deste dashboard."
      onReplayTutorial={tutorial.start}
    >
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          
          {/* Code Editor */}
          <div className="w-full lg:w-[480px] border-r border-zinc-200 bg-zinc-950 p-0 flex flex-col dark:border-zinc-800">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Editor de HTML / React</span>
            </div>
            
            {/* Visual Editor Layout with Line Numbers */}
            <div className="flex-1 flex font-mono text-sm leading-relaxed relative overflow-hidden bg-zinc-950">
              <div className="select-none text-zinc-700 bg-zinc-900/10 text-right pr-3 pl-4 py-6 border-r border-zinc-900/60 flex flex-col items-end min-w-[3.5rem] font-mono text-xs">
                {lines.map((_, index) => (
                  <span key={index} className="h-6 flex items-center">{index + 1}</span>
                ))}
              </div>
              <textarea
                data-tutorial="frontend-a11y-editor"
                aria-label="Editor de código HTML"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full bg-transparent p-6 py-6 pl-4 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-6 h-full overflow-y-auto"
                style={{ lineHeight: "24px" }}
                spellCheck={false}
              />
            </div>

            {/* Diagnostic Panel / Real-time Health Checks */}
            <div className="border-t border-zinc-900 bg-zinc-900/40 p-4 space-y-3">
              <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-50 uppercase tracking-widest mb-1">
                Diagnóstico de Acessibilidade
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {/* Rule 1: Tag Balance */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${syntaxErrors.length === 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`} />
                    <span className="text-zinc-400">Estrutura de Tags</span>
                  </div>
                  <span className={syntaxErrors.length === 0 ? "text-green-400 font-medium" : "text-red-400 font-semibold"}>
                    {syntaxErrors.length === 0 ? "OK" : "Erro"}
                  </span>
                </div>

                {/* Rule 2: Semantics */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${code.includes("<button") && code.includes("</button>") ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-700"}`} />
                    <span className="text-zinc-400">Elemento Modal</span>
                  </div>
                  <span className={code.includes("<button") && code.includes("</button>") ? "text-green-400 font-medium" : "text-zinc-600"}>
                    {code.includes("<button") && code.includes("</button>") ? "Correto" : "Falta"}
                  </span>
                </div>

                {/* Rule 3: Description */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${code.includes("aria-label") ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-700"}`} />
                    <span className="text-zinc-400">Filtro de Leitor</span>
                  </div>
                  <span className={code.includes("aria-label") ? "text-green-400 font-medium" : "text-zinc-600"}>
                    {code.includes("aria-label") ? "Correto" : "Falta"}
                  </span>
                </div>

                {/* Rule 4: Color Contrast */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 border border-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${code.includes("text-zinc-900") ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-700"}`} />
                    <span className="text-zinc-400">Contraste de Cor</span>
                  </div>
                  <span className={code.includes("text-zinc-900") ? "text-green-400 font-medium" : "text-zinc-600"}>
                    {code.includes("text-zinc-900") ? "Correto" : "Falta"}
                  </span>
                </div>
              </div>
              
              {errors.length > 0 && (
                <div className="bg-red-950/20 border border-red-900/50 p-3 rounded-lg space-y-2 max-h-[120px] overflow-y-auto mt-2">
                  {errors.map((err, i) => (
                    <div key={i} className="text-xs text-red-400 flex items-start gap-2">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-red-400" />
                      <span>{err.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Robot View Area */}
          <div className="flex-1 bg-zinc-100 p-8 dark:bg-zinc-900/30 flex flex-col relative overflow-y-auto">
            
            {/* Gamified Score Panel */}
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className="stroke-zinc-150 dark:stroke-zinc-800 fill-none"
                    strokeWidth="5"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className={`fill-none transition-all duration-500 ${getScoreColor()}`}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute text-xs font-bold ${getScoreTextColor()}`}>
                  {score}%
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{getScoreLabel()}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Pontuação global de conformidade</p>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Accessibility size={18} className="text-blue-500" />
                Simulador de Leitor de Tela (Visão do Robô)
              </h3>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[300px]">
              
              {/* User View Card */}
              <div className="space-y-4" aria-hidden="true">
                <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-widest">Visão do Usuário</span>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 min-h-[300px] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-8">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Meu Dashboard</h4>
                    <div className={`p-2 rounded transition-all duration-300 ${code.includes("<button") ? "ring-2 ring-blue-500" : ""}`}>
                      <div className="w-6 h-6 bg-zinc-900 dark:bg-zinc-100 rounded flex items-center justify-center cursor-pointer hover:opacity-85 transition">
                        <span className="text-xs font-bold text-white dark:text-zinc-900">X</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl transition-all duration-300 ${code.includes("text-zinc-900") ? "bg-zinc-100 text-zinc-900" : "bg-zinc-50 text-zinc-300/40"}`}>
                    <p className="text-xs font-medium">Este é um aviso importante que todos devem ler com clareza.</p>
                  </div>
                </div>
              </div>

              {/* Accessibility Tree View (The Robot) */}
              <div className="space-y-4" aria-hidden="true">
                <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-widest">O que o Robô ouve</span>
                <div
                  data-tutorial="frontend-a11y-tree"
                  className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 font-mono text-xs min-h-[300px] space-y-4"
                  style={{ color: "#4ade80" }} // Bulletproof contrast high-brightness green
                >
                  <div style={{ color: "#4ade80" }}>&gt; Carregando página...</div>
                  <div style={{ color: "#a1a1aa" }} className="italic">Árvore de Acessibilidade:</div>
                  <div className="pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white">- Heading:</span> &quot;Meu Dashboard&quot;
                    </div>
                    
                    <div className="flex items-center gap-2 border p-2 rounded transition-all duration-300" style={{ borderColor: code.includes("<button") ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)", backgroundColor: code.includes("<button") ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.05)" }}>
                      <span className="text-white">- {code.includes("<button") ? "Button" : "Generic (Div)"}:</span> 
                      {getAriaLabel() ? (
                        <span style={{ color: "#4ade80" }} className="font-semibold">&quot;{getAriaLabel()}&quot;</span>
                      ) : (
                        <span style={{ color: "#f87171" }} className="underline font-semibold">&quot;Sem nome/descrição&quot;</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 border p-2 rounded transition-all duration-300" style={{ borderColor: code.includes("text-zinc-900") ? "rgba(74,222,128,0.3)" : "rgba(251,146,60,0.3)", backgroundColor: code.includes("text-zinc-900") ? "rgba(74,222,128,0.05)" : "rgba(251,146,60,0.05)" }}>
                      <span className="text-white">- Text Content:</span>
                      {code.includes("text-zinc-900") ? (
                        <span style={{ color: "#4ade80" }}>&quot;Este é um aviso...&quot;</span>
                      ) : (
                        <span style={{ color: "#fb923c" }} className="underline font-semibold">&quot;Contraste muito baixo - Pular leitura&quot;</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Overlay */}
            {isTaskComplete && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-sm">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40">
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Acessibilidade Perfeita!</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Você corrigiu todos os problemas e tornou o modal utilizável para todos!</p>
                  
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 w-full sm:w-auto justify-center"
                    >
                      <RotateCcw size={16} />
                      Repetir
                    </button>
                    <button 
                      onClick={() => router.push("/")}
                      className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 w-full sm:w-auto justify-center"
                    >
                      Voltar ao Painel
                    </button>
                  </div>
                </div>
              </div>
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
