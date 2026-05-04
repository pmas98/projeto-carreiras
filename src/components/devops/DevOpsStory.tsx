"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, ArrowRight, ShieldAlert } from "lucide-react";
import { TelemetryGraph } from "./TelemetryGraph";
import { GuidedTerminal } from "./GuidedTerminal";
import { GlossaryTooltip } from "./GlossaryTooltip";
import { useProgressStore } from "@/store/useProgressStore";

type StoryStage = 'calm' | 'alert' | 'investigating' | 'resolved';

export function DevOpsStory() {
  const [stage, setStage] = useState<StoryStage>('calm');
  const [health, setHealth] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Connection established.",
    "[SYSTEM] Monitoring Node_04... Status: OK.",
  ]);
  
  const completeTask = useProgressStore(s => s.completeTask);

  // Initial calm state leads to alert
  useEffect(() => {
    if (stage === 'calm') {
      const timer = setTimeout(() => {
        setStage('alert');
        setHealth(8.4);
        setLogs(prev => [
          ...prev, 
          " ",
          "!!! CRITICAL ALERT: NODE_04 UNRESPONSIVE !!!",
          "[ALERT] Latency spiked to 12000ms",
          "[ALERT] HTTP_503 service unavailable",
          " "
        ]);
        // Simulate pager notification sound/vibration feeling
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleCommand = useCallback((cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === "help") {
      setLogs(prev => [
        ...prev, 
        "> help", 
        "AVAILABLE_COMMANDS:",
        "  check-status - Run diagnostic on Node_04",
        "  purge-logs   - Clear temporary system logs",
        "  help         - Show this menu"
      ]);
      return;
    }

    if (command === "check-status") {
      setLogs(prev => [
        ...prev, 
        "> check-status", 
        "Running diagnostics...",
        "[OK] Network connectivity",
        "[OK] Memory usage (14.2/32GB)",
        "[CRITICAL] Storage capacity reached: 99.9% full",
        "[ERROR] Cannot write to /var/log/system.log",
        "Hint: Use 'purge-logs' to free up space."
      ]);
      if (stage === 'alert') setStage('investigating');
      return;
    }

    if (command === "purge-logs") {
      if (stage === 'investigating' || stage === 'alert') {
        setLogs(prev => [
          ...prev, 
          "> purge-logs", 
          "Identifying temporary log files...",
          "Purging /var/log/tmp/*.log (14.2 GB)...",
          "[■■■■■■■■■■] 100%",
          "Success: Storage cleared. Free space: 45%.",
          "Restarting services..."
        ]);
        
        // Short delay for "restart" feel
        setTimeout(() => {
          setHealth(100);
          setStage('resolved');
          setLogs(prev => [...prev, "[SYSTEM] All services operational.", "Node_04 status: HEALTHY."]);
          completeTask("devops_investigation_resolution");
        }, 1500);
      } else {
        setLogs(prev => [...prev, "> purge-logs", "Error: Storage is already healthy."]);
      }
      return;
    }

    // Default for unknown commands
    setLogs(prev => [...prev, `> ${cmd}`, `Command '${cmd}' not recognized. Type 'help' for options.`]);
  }, [stage, completeTask]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Top Section: Health Monitor */}
      <section>
        <TelemetryGraph health={health} />
      </section>

      {/* Middle Section: Alerts & Instructions */}
      <section className="relative min-h-[100px]">
        <AnimatePresence mode="wait">
          {stage === 'calm' && (
            <motion.div 
              key="calm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-600 dark:text-emerald-400"
            >
              <Info size={18} />
              <div className="text-xs font-medium font-mono">
                SISTEMA_OPERACIONAL: Monitorando tráfego em tempo real...
              </div>
            </motion.div>
          )}

          {stage === 'alert' && (
            <motion.div 
              key="alert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col gap-4 rounded-xl border border-red-500 bg-red-500/10 p-5 text-red-600 dark:text-red-400"
            >
              <div className="flex items-center gap-3 font-bold font-mono text-sm">
                <AlertTriangle className="animate-pulse" size={20} />
                ALERTA_CRÍTICO: INCIDENTE_DETECTADO
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                O site parou de responder! Os usuários não conseguem acessar a plataforma. 
                Use o <GlossaryTooltip term="Terminal" definition="Uma forma de falar diretamente com o computador usando comandos de texto.">terminal</GlossaryTooltip> abaixo para investigar a causa.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <ArrowRight size={12} />
                Tente digitar <code className="rounded bg-red-500/20 px-1.5 py-0.5">check-status</code> no terminal
              </div>
            </motion.div>
          )}

          {stage === 'investigating' && (
            <motion.div 
              key="investigating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4 rounded-xl border border-blue-500/50 bg-blue-500/5 p-5 text-blue-600 dark:text-blue-400"
            >
              <div className="flex items-center gap-3 font-bold font-mono text-sm">
                <ShieldAlert size={20} />
                DIAGNÓSTICO: DISCO_CHEIO
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                O <GlossaryTooltip term="Servidor" definition="Um computador potente que 'serve' seu site para o mundo.">servidor</GlossaryTooltip> ficou sem espaço! 
                Quando o disco enche, o sistema não consegue mais salvar <GlossaryTooltip term="Logs" definition="O 'diário' do sistema, onde ele registra tudo o que acontece.">logs</GlossaryTooltip> nem processar requisições. 
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <ArrowRight size={12} />
                Execute <code className="rounded bg-blue-500/20 px-1.5 py-0.5">purge-logs</code> para liberar espaço
              </div>
            </motion.div>
          )}

          {stage === 'resolved' && (
            <motion.div 
              key="resolved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4 rounded-xl border border-emerald-500 bg-emerald-500/10 p-6 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <div className="flex items-center gap-3 font-bold font-mono text-base">
                <CheckCircle2 size={24} />
                INCIDENTE_RESOLVIDO
              </div>
              <div className="space-y-3">
                <p className="text-xs opacity-90 leading-relaxed">
                  Excelente trabalho! Você identificou e resolveu o problema em tempo recorde. 
                  Isso é o que um engenheiro <GlossaryTooltip term="DevOps" definition="A ponte entre criar o software e garantir que ele funcione bem para todos.">DevOps</GlossaryTooltip> faz: mantém a infraestrutura saudável e automatiza soluções.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[9px] font-bold border border-emerald-500/30">LOG_ROTATION_LEARNED</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[9px] font-bold border border-emerald-500/30">TRIAGE_MASTER</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom Section: Terminal */}
      <section>
        <GuidedTerminal onCommand={handleCommand} output={logs} />
      </section>

      {/* Contextual Glossary (Educational) */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 opacity-60 hover:opacity-100 transition-opacity">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-500 mb-2">Conceito: Servidor</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            É como um computador potente que "serve" o seu site para o mundo. Se o disco dele enche, ele para de funcionar, igual ao seu celular.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-500 mb-2">Conceito: Logs</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            São registros de tudo que acontece no sistema. Às vezes eles crescem demais e precisam ser "limpos" ou "rotacionados".
          </p>
        </div>
      </footer>
    </div>
  );
}
